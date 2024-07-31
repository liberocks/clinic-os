import { requireCustomerAuthentication } from "@medusajs/medusa";
import type { MiddlewaresConfig } from "@medusajs/medusa";

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/store/assignment",
      middlewares: [requireCustomerAuthentication()],
    },
    {
      matcher: "/store/assignment/*",
      middlewares: [requireCustomerAuthentication()],
    },
  ],
};
