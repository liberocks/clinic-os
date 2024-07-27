import { dataSource } from "@medusajs/medusa/dist/loaders/database";

import { AnamnesisForm } from "../models/anamnesis-form";

const AnamnessForm = dataSource.getRepository(AnamnesisForm);

export default AnamnessForm;
