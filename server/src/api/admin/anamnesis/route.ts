import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    message: "[GET] Hello world!",
  });
};

export const POST = (req: MedusaRequest, res: MedusaResponse) => {};

export const PUT = (req: MedusaRequest, res: MedusaResponse) => {};

export const DELETE = (req: MedusaRequest, res: MedusaResponse) => {};
