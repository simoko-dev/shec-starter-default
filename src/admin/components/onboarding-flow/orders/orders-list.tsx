import React from "react";
import Button from "../../shared/button";
import { useAdminProduct } from "@simoko/shec-react";
import { useAdminCreateDraftOrder } from "@simoko/shec-react";
import { useAdminShippingOptions } from "@simoko/shec-react";
import { useAdminRegions } from "@simoko/shec-react";
import { useShec } from "@simoko/shec-react";
import { StepContentProps } from "../../../widgets/onboarding-flow/onboarding-flow";

const OrdersList = ({ onNext, isComplete, data }: StepContentProps) => {
  const { product } = useAdminProduct(data.product_id);
  const { mutateAsync: createDraftOrder, isLoading } =
    useAdminCreateDraftOrder();
  const { client } = useShec();

  const { regions } = useAdminRegions();
  const { shipping_options } = useAdminShippingOptions();

  const createOrder = async () => {
    const variant = product.variants[0] ?? null;
    try {
      const { draft_order } = await createDraftOrder({
        email: "customer@simoko.com",
        items: [
          variant
            ? {
                quantity: 1,
                variant_id: variant.id,
              }
            : {
                quantity: 1,
                title: product.title,
                unit_price: 50,
              },
        ],
        shipping_methods: [
          {
            option_id: shipping_options[0].id,
          },
        ],
        region_id: regions[0].id,
      });

      const { order } = await client.admin.draftOrders.markPaid(draft_order.id);

      onNext(order);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div className="py-4">
        <p>
          With a Product created, we can now place an Order. Click the button
          below to create a sample order.
        </p>
      </div>
      <div className="flex gap-2">
        {!isComplete && (
          <Button
            variant="primary"
            size="small"
            onClick={() => createOrder()}
            loading={isLoading}
          >
            Create a sample order
          </Button>
        )}
      </div>
    </>
  );
};

export default OrdersList;
