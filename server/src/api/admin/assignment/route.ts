import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { z } from "zod";

import { CreateAnamnesisAssignmentSchema } from "../../../schema/anamnesis";
import type AnamnesisService from "../../../services/anamnesis";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

    const validatedBody = CreateAnamnesisAssignmentSchema.parse(req.body);

    const formId = validatedBody.formId;

    const submissionIds = await anamnesisService.createFormAssignment(formId, validatedBody.emails);

    if (!submissionIds) {
      return res.status(404).json({ error: "Anamnesis form or emails not found" });
    }

    return res.status(201).json({ submissionIds });
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
