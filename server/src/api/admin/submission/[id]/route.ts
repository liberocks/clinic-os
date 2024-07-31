import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { z } from "zod";

import { GetEntitiesQuerySchema, IdSchema } from "../../../../schema/generic";
import type AnamnesisService from "../../../../services/anamnesis";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

    const validatedParams = IdSchema.parse(req.params);
    const validatedQuery = GetEntitiesQuerySchema.parse(req.query);

    const id = validatedParams.id;

    const paginatedResponses = await anamnesisService.getFormResponses(id, validatedQuery);

    return res.status(200).json(paginatedResponses);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    console.log(error);

    // Handle other errors
    return res.status(500).json({ error: "Internal server error" });
  }
};
