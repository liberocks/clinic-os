import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { z } from "zod";

import { UpdateAnamnesisFormSchema } from "../../../../schema/anamnesis";
import { IdSchema } from "../../../../schema/generic";
import type AnamnesisService from "../../../../services/anamnesis";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
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

// It should be a PUT/PATCH endpoint, but MedusaJs doesn't support it.
// Thus the workaround is using POST.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

    const validatedParams = IdSchema.parse(req.params);
    const validatedBody = UpdateAnamnesisFormSchema.parse(req.body);
    const id = validatedParams.id;

    const formId = await anamnesisService.updateForm(id, validatedBody);

    if (!formId) {
      return res.status(404).json({ error: "Anamnesis form not found" });
    }

    return res.status(200).json({ formId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const anamnesisService: AnamnesisService = req.scope.resolve("anamnesisService");

    const validatedParams = IdSchema.parse(req.params);
    const id = validatedParams.id;

    const formId = await anamnesisService.deleteForm(id);

    if (!formId) {
      return res.status(404).json({ error: "Anamnesis form not found" });
    }

    return res.status(200).json({ formId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return res.status(400).json({ errors: error.errors });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal server error" });
  }
}
