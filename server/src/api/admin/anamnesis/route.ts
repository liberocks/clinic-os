import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { z } from "zod";

import { CreateAnamnesisFormSchema } from "../../../schema/anamnesis";
import { GetEntitiesQuerySchema, IdsSchema } from "../../../schema/generic";
import type AnamnesisService from "../../../services/anamnesis";

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

    const validatedQuery = GetEntitiesQuerySchema.parse(req.query);

    const paginatedForms = anamnesisService.getForms(validatedQuery);

    return res.json(paginatedForms);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

    const validatedBody = CreateAnamnesisFormSchema.parse(req.body);

    const formId = await anamnesisService.createForm(validatedBody);

    return res.status(201).json({ formId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const DELETE = (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

    const validatedBody = IdsSchema.parse(req.body);
    const ids = validatedBody.ids;

    const formIds = anamnesisService.deleteForms(ids);

    if (!formIds) {
      return res.status(404).json({ error: "Anamnesis forms not found" });
    }

    return res.status(200).json({ formIds });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal server error" });
  }
};
