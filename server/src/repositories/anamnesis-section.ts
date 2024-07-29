import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { AnamnesisSectionModel } from "../models/anamnesis-section";

const AnamnesisSectionRepository = dataSource.getRepository(AnamnesisSectionModel);

export default AnamnesisSectionRepository;
