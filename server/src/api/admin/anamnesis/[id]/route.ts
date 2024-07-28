import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export function GET(req: MedusaRequest, res: MedusaResponse) {
  const id = req.params.id;

  // do something with the ID.
}
