import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { z } from "zod";

import { CreateAnamnesisResponseSchema } from "../../../schema/anamnesis";
import { GetEntitiesQueryWithStatusSchema, IdSchema } from "../../../schema/generic";
import type AnamnesisService from "../../../services/anamnesis";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const customerId = req.user.customer_id;

    if (!customerId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

    const validatedQuery = GetEntitiesQueryWithStatusSchema.parse(req.query);
    const { status, ...query } = validatedQuery;

    const paginatedFormAssignments = await anamnesisService.getFormAssignments(customerId, status, query);

    return res.status(200).json(paginatedFormAssignments);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const customerId = req.user.customer_id;

    if (!customerId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

    const validatedBody = CreateAnamnesisResponseSchema.parse(req.body);
    const validatedParams = IdSchema.parse(req.params);

    const formId = validatedParams.id;

    const submissionId = await anamnesisService.createFormResponse(customerId, formId, validatedBody);

    return res.status(201).json({ formId: submissionId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal server error" });
  }
};
