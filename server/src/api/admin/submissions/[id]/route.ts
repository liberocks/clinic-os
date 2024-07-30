import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { GetEntitiesQuerySchema } from "../../../../schema/generic";
import type AnamnesisService from "../../../../services/anamnesis";

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

  const validatedQuery = GetEntitiesQuerySchema.parse(req.query);
};
