import { TransactionBaseService } from "@medusajs/medusa";
import { Lifetime } from "awilix";
import type { EntityManager } from "typeorm";
import { v7 as uuidv7 } from "uuid";

import type { AnamnesisFormDto, CreateAnamnesisFormDto } from "../dto/anamnesis";
import type { AnamnesisFormModel } from "../models/anamnesis-form";
import type AnamnesisFormRepository from "../repositories/anamnesis-form";
import type AnamnesisQuestionRepository from "../repositories/anamnesis-question";
import type AnamnesisResponseRepository from "../repositories/anamnesis-response";
import type AnamnesisSectionRepository from "../repositories/anamnesis-section";

type InjectedDependencies = {
  manager: EntityManager;

  anamnesisFormRepository: typeof AnamnesisFormRepository;
  anamnesisSectionRepository: typeof AnamnesisSectionRepository;
  anamnesisQuestionRepository: typeof AnamnesisQuestionRepository;
  anamnesisResponseRepository: typeof AnamnesisResponseRepository;
};

export class AnamnesisService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;

  protected anamnesisFormRepository_: typeof AnamnesisFormRepository;
  protected anamnesisSectionRepository_: typeof AnamnesisSectionRepository;
  protected anamnesisQuestionRepository_: typeof AnamnesisQuestionRepository;
  protected anamnesisResponseRepository_: typeof AnamnesisResponseRepository;

  constructor({
    anamnesisFormRepository,
    anamnesisSectionRepository,
    anamnesisQuestionRepository,
    anamnesisResponseRepository,
  }: InjectedDependencies) {
    super(arguments[0]);

    this.anamnesisFormRepository_ = anamnesisFormRepository;
    this.anamnesisSectionRepository_ = anamnesisSectionRepository;
    this.anamnesisQuestionRepository_ = anamnesisQuestionRepository;
    this.anamnesisResponseRepository_ = anamnesisResponseRepository;
  }
  async createForm(data: CreateAnamnesisFormDto): Promise<string> {
    return await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisFormRepository = transactionManager.withRepository(this.anamnesisFormRepository_);
      const anamnesisSectionRepository = transactionManager.withRepository(this.anamnesisSectionRepository_);
      const anamnesisQuestionRepository = transactionManager.withRepository(this.anamnesisQuestionRepository_);

      // Prepare form payload
      const formPayload: AnamnesisFormDto = {
        id: uuidv7(),
        title: data.title,
        description: data.description,
        sections: [],
      };

      // Prepare sections and questions payload
      if (data.sections) {
        formPayload.sections = data.sections?.map((section, index) => {
          const section_id = uuidv7();
          return {
            id: section_id,
            form_id: formPayload.id,
            title: section.title,
            description: section.description,
            order: index,
            questions: (section.questions || []).map((question) => {
              return {
                id: uuidv7(),
                section_id: section_id,
                question_text: question.question_text,
                question_type: question.question_type,
                order: question.order,
                options: question.options.map((option) => {
                  return {
                    label: option.label,
                    value: option.value,
                  };
                }),
              };
            }),
          };
        });
      }

      // Create form
      await anamnesisFormRepository.insert(formPayload);

      let promises: Promise<unknown>[] = [];

      // Create sections
      promises = [];
      for (const section of formPayload.sections) {
        promises.push(anamnesisSectionRepository.insert(section));
      }

      await Promise.all(promises);

      // Create questions
      promises = [];
      for (const section of formPayload.sections) {
        for (const question of section.questions) {
          promises.push(anamnesisQuestionRepository.insert(question));
        }
      }
      await Promise.all(promises);

      return formPayload.id;
    });
  }

  async getForm(
    id: string,
    options?: { populateSection?: boolean; populateResponse?: boolean },
  ): Promise<AnamnesisFormModel | null> {
    const relations: string[] = [];

    if (options?.populateSection) {
      relations.push("sections", "sections.questions");
    }

    if (options?.populateResponse) {
      relations.push("responses");
    }

    return await this.anamnesisFormRepository_.findOne({ where: { id }, relations });
  }

  async update(id: string, data: Partial<AnamnesisFormModel>): Promise<AnamnesisFormModel> {
    return await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisFormRepository = transactionManager.withRepository(this.anamnesisFormRepository_);
      await anamnesisFormRepository.update({ id }, data);
      return await anamnesisFormRepository.findOne({ where: { id } });
    });
  }
}
export default AnamnesisService;
