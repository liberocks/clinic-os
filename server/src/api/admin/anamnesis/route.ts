import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import type { EntityManager } from "typeorm";
import { z } from "zod";

import { CreateAnamnesisFormSchema } from "../../../schema/anamnesis";
import type AnamnesisService from "../../../services/anamnesis";

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    message: "[GET] Hello world!",
  });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");
    const manager: EntityManager = req.scope.resolve("manager");

    const validatedBody = CreateAnamnesisFormSchema.parse(req.body);

    const formId = await manager.transaction(async (transactionManager) => {
      return await anamnesisService.withTransaction(transactionManager).createForm(validatedBody);
    });

    res.status(201).json({ formId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const PUT = (req: MedusaRequest, res: MedusaResponse) => {};

export const DELETE = (req: MedusaRequest, res: MedusaResponse) => {};
