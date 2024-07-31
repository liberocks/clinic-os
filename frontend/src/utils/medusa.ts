import Medusa from "@medusajs/medusa-js";
import Cookies from "js-cookie";

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000";

if (import.meta.env.VITE_APP_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = import.meta.env.VITE_APP_MEDUSA_BACKEND_URL;
}

export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
});

export const getMedusaHeaders = (tags: string[] = []) => {
  const headers = {
    next: { tags },
  } as Record<string, {}>;

  const token = Cookies.get("_medusa_jwt");

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return headers;
};

export async function getCustomer() {
  return medusaClient.customers
    .retrieve()
    .then(({ customer }) => customer)
    .catch((err) => null);
}
