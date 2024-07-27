import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { AnamnesisResponse } from "../models/anamnesis-response";

const AnamnessResponse = dataSource.getRepository(AnamnesisResponse);

export default AnamnessResponse;
