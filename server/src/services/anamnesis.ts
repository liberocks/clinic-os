import { TransactionBaseService } from "@medusajs/medusa";
import { Lifetime } from "awilix";
import type { EntityManager, FindOptionsSelect } from "typeorm";
import { v7 as uuidv7 } from "uuid";

import type { AnamnesisFormDto, CreateAnamnesisFormDto, UpdateAnamnesisFormDto } from "../dto/anamnesis";
import type { AnamnesisFormModel } from "../models/anamnesis-form";
import type AnamnesisAssignmentRepository from "../repositories/anamnesis-assignment";
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
  anamnesisAssignmentRepository: typeof AnamnesisAssignmentRepository;
};

export class AnamnesisService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;

  protected anamnesisFormRepository_: typeof AnamnesisFormRepository;
  protected anamnesisSectionRepository_: typeof AnamnesisSectionRepository;
  protected anamnesisQuestionRepository_: typeof AnamnesisQuestionRepository;
  protected anamnesisResponseRepository_: typeof AnamnesisResponseRepository;
  protected anamnesisAssignmentRepository_: typeof AnamnesisAssignmentRepository;

  constructor({
    anamnesisFormRepository,
    anamnesisSectionRepository,
    anamnesisQuestionRepository,
    anamnesisResponseRepository,
    anamnesisAssignmentRepository,
  }: InjectedDependencies) {
    super(arguments[0]);

    this.anamnesisFormRepository_ = anamnesisFormRepository;
    this.anamnesisSectionRepository_ = anamnesisSectionRepository;
    this.anamnesisQuestionRepository_ = anamnesisQuestionRepository;
    this.anamnesisResponseRepository_ = anamnesisResponseRepository;
    this.anamnesisAssignmentRepository_ = anamnesisAssignmentRepository;
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
    const select: FindOptionsSelect<AnamnesisFormModel> = {
      id: true,
      title: true,
      description: true,
      created_at: true,
      updated_at: true,
    };

    if (options?.populateSection) {
      relations.push("sections", "sections.questions");
      select.sections = {
        id: true,
        form_id: true,
        title: true,
        description: true,
        order: true,
        questions: {
          id: true,
          section_id: true,
          question_text: true,
          question_type: true,
          options: true,
        },
      };
    }

    if (options?.populateResponse) {
      relations.push("responses");
      select.responses = {
        id: true,
        customer_id: true,
        order_id: true,
        responses: true,
        created_at: true,
      };
    }

    return await this.anamnesisFormRepository_.findOne({ where: { id }, relations, select });
  }

  async updateForm(id: string, data: UpdateAnamnesisFormDto): Promise<string> {
    await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisFormRepository = transactionManager.withRepository(this.anamnesisFormRepository_);
      const anamnesisSectionRepository = transactionManager.withRepository(this.anamnesisSectionRepository_);
      const anamnesisQuestionRepository = transactionManager.withRepository(this.anamnesisQuestionRepository_);

      const form = await this.getForm(id, { populateSection: true });

      if (!form) {
        throw new Error(`Anamnesis form with id ${id} not found`);
      }

      // Find missing sections ids
      const sectionIds = form.sections.map((section) => section.id);
      const incomingSectionIds = data.sections.map((section) => section.id);
      const missingSectionIds = sectionIds.filter((id) => !incomingSectionIds.includes(id));
      const remaningSectionIds = sectionIds.filter((id) => incomingSectionIds.includes(id));
      const newSectionIds = incomingSectionIds.filter((id) => !remaningSectionIds.includes(id));

      // Find missing question ids
      const questionIds = form.sections.flatMap((section) => section.questions.map((question) => question.id));
      const incomingQuestionIds = data.sections.flatMap((section) => section.questions.map((question) => question.id));
      const missingQuestionIds = questionIds.filter((id) => !incomingQuestionIds.includes(id));
      const remaningQuestionIds = questionIds.filter((id) => incomingQuestionIds.includes(id));
      const newQuestionIds = incomingQuestionIds.filter((id) => !remaningQuestionIds.includes(id));

      let promises: Promise<unknown>[] = [];

      // Delete missing questions
      promises = [];
      for (const id of missingQuestionIds) {
        promises.push(anamnesisQuestionRepository.delete(id));
      }
      await Promise.all(promises);

      // Delete missing sections
      promises = [];
      for (const id of missingSectionIds) {
        promises.push(anamnesisSectionRepository.delete(id));
      }
      await Promise.all(promises);

      // Create new sections
      promises = [];
      for (const section of data.sections.filter((section) => newSectionIds.includes(section.id))) {
        promises.push(
          anamnesisSectionRepository.insert({
            id: section.id,
            form_id: id,
            title: section.title,
            description: section.description,
            order: section.order,
          }),
        );
      }
      await Promise.all(promises);

      // Create new questions
      promises = [];
      for (const section of data.sections) {
        for (const question of section.questions.filter((question) => newQuestionIds.includes(question.id))) {
          promises.push(
            anamnesisQuestionRepository.insert({
              id: question.id,
              section_id: section.id,
              question_text: question.question_text,
              question_type: question.question_type,
              order: question.order,
              options: question.options.map((option) => {
                return {
                  label: option.label,
                  value: option.value,
                };
              }),
            }),
          );
        }
      }
      await Promise.all(promises);

      // Update existing sections
      promises = [];
      for (const section of data.sections.filter((section) => remaningSectionIds.includes(section.id))) {
        promises.push(
          anamnesisSectionRepository.update(section.id, {
            form_id: id,
            title: section.title,
            description: section.description,
            order: section.order,
            updated_at: new Date(),
          }),
        );
      }
      await Promise.all(promises);

      // Update existing questions
      promises = [];
      for (const section of data.sections) {
        for (const question of section.questions.filter((question) => remaningQuestionIds.includes(question.id))) {
          promises.push(
            anamnesisQuestionRepository.update(question.id, {
              section_id: section.id,
              question_text: question.question_text,
              question_type: question.question_type,
              order: question.order,
              options: question.options.map((option) => {
                return {
                  label: option.label,
                  value: option.value,
                };
              }),
              updated_at: new Date(),
            }),
          );
        }
      }

      // Update form
      await anamnesisFormRepository.update(id, {
        title: data.title,
        description: data.description,
        updated_at: new Date(),
      });
    });

    return id;
  }
}
export default AnamnesisService;
