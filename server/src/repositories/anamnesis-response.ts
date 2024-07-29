import { dataSource } from "@medusajs/medusa/dist/loaders/database";

import { AnamnesisResponseModel } from "../models/anamnesis-response";

const AnamnesisResponseRepository = dataSource.getRepository(AnamnesisResponseModel);

export default AnamnesisResponseRepository;
