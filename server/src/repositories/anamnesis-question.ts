import { dataSource } from "@medusajs/medusa/dist/loaders/database";

import { AnamnesisQuestionModel } from "../models/anamnesis-question";

const AnamnesisQuestionRepository = dataSource.getRepository(AnamnesisQuestionModel);

export default AnamnesisQuestionRepository;
