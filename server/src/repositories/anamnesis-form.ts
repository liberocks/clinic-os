import { dataSource } from "@medusajs/medusa/dist/loaders/database";

import { AnamnesisFormModel } from "../models/anamnesis-form";

const AnamnesisFormRepository = dataSource.getRepository(AnamnesisFormModel);

export default AnamnesisFormRepository;
