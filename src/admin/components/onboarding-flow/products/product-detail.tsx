import React from "react";
import { useAdminPublishableApiKeys } from "@simoko/shec-react";
import Button from "../../shared/button";
import CodeSnippets from "../../shared/code-snippets";
import { StepContentProps } from "../../../widgets/onboarding-flow/onboarding-flow";

const ProductDetail = ({ onNext, isComplete, data }: StepContentProps) => {
  const { publishable_api_keys: keys, isLoading } = useAdminPublishableApiKeys({
    offset: 0,
    limit: 1,
  });
  const api_key = keys?.[0]?.id || "pk_01H0PY648BTMEJR34ZDATXZTD9";
  return (
    <div>
      <p>On this page, you can view your product's details and edit them.</p>
      <p>
        You can preview your product using Shec's Store APIs. You can copy any
        of the following code snippets to try it out.
      </p>
      <div className="pt-4">
        {!isLoading && (
          <CodeSnippets
            snippets={[
              {
                label: "cURL",
                language: "markdown",
                code: `curl -H 'x-publishable-key: ${api_key}' 'http://localhost:9000/store/products/${data?.product_id}'`,
              },
              {
                label: "Shec JS Client",
                language: "jsx",
                code: `// Install the JS Client in your storefront project: @simoko/shec-js\n\nimport Shec from "@simoko/shec-js"\n\nconst shec = new Shec({ publishableApiKey: "${api_key}"})\nconst product = await shec.products.retrieve("${data?.product_id}")\nconsole.log(product.id)`,
              },
              {
                label: "Shec React",
                language: "tsx",
                code: `// Install the React SDK and required dependencies in your storefront project:\n// @simoko/shec-react @tanstack/react-query @simoko/shec\n\nimport { useProduct } from "@simoko/shec-react"\n\nconst { product } = useProduct("${data?.product_id}")\nconsole.log(product.id)`,
              },
            ]}
          />
        )}
      </div>
      <div className="flex mt-base gap-2">
        <a
          href={`http://localhost:9000/store/products/${data?.product_id}`}
          target="_blank"
        >
          <Button variant="secondary" size="small">
            Open preview in browser
          </Button>
        </a>
        {!isComplete && (
          <Button variant="primary" size="small" onClick={() => onNext()}>
            Next step
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
