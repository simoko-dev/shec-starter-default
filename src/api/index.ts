import { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { authenticate, ConfigModule } from "@simoko/shec";
import { getConfigFile } from "shec-core-utils";
import { attachStoreRoutes } from "./routes/store";
import { attachAdminRoutes } from "./routes/admin";

export default (rootDirectory: string): Router | Router[] => {
  // Read currently-loaded shec config
  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "shec-config"
  );
  const { projectConfig } = configModule;

  // Set up our CORS options objects, based on config
  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  };

  const adminCorsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  };

  // Set up express router
  const router = Router();

  // Set up root routes for store and admin endpoints, with appropriate CORS settings
  router.use("/store", cors(storeCorsOptions), bodyParser.json());
  router.use("/admin", cors(adminCorsOptions), bodyParser.json());

  // Add authentication to all admin routes *except* auth and account invite ones
  router.use(
    /\/admin\/((?!auth)(?!invites)(?!users\/reset-password)(?!users\/password-token).*)/,
    authenticate()
  );

  // Set up routers for store and admin endpoints
  const storeRouter = Router();
  const adminRouter = Router();

  // Attach these routers to the root routes
  router.use("/store", storeRouter);
  router.use("/admin", adminRouter);

  // Attach custom routes to these routers
  attachStoreRoutes(storeRouter);
  attachAdminRoutes(adminRouter);

  return router;
};
