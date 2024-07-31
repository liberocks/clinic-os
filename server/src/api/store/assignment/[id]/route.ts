import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { z } from "zod";

import { IdSchema } from "../../../../schema/generic";
import type AnamnesisService from "../../../../services/anamnesis";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const customerId = req.user.customer_id;

    if (!customerId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

    const validatedParams = IdSchema.parse(req.params);
    const id = validatedParams.id;

    const anamnesisForm = await anamnesisService.getForm(id);

    if (!anamnesisForm) {
      return res.status(404).json({ error: "Anamnesis form not found" });
    }

    return res.status(200).json(anamnesisForm);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal server error" });
  }
}
