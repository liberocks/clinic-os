import { dataSource } from "@medusajs/medusa/dist/loaders/database";

import { AnamnesisAssignmentModel } from "../models/anamnesis-assignment";

const AnamnesisAssignmentRepository = dataSource.getRepository(AnamnesisAssignmentModel);

export default AnamnesisAssignmentRepository;
