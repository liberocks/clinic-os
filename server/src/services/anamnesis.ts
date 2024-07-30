import { TransactionBaseService } from "@medusajs/medusa";
import type CustomerRepository from "@medusajs/medusa/dist/repositories/customer";
import { Lifetime } from "awilix";
import { type EntityManager, type FindOptionsSelect, In } from "typeorm";
import { v7 as uuidv7 } from "uuid";

import type {
  AnamnesisFormDto,
  AnamnesisFormResultDto,
  AnamnesisResponseResultDto,
  CreateAnamnesisFormDto,
  CreateAnamnesisResponseDto,
  UpdateAnamnesisFormDto,
} from "../dto/anamnesis";
import type { GetEntitiesQuery, PaginatedResult } from "../dto/generic";
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
  customerRepository: typeof CustomerRepository;
};

export class AnamnesisService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;

  protected anamnesisFormRepository_: typeof AnamnesisFormRepository;
  protected anamnesisSectionRepository_: typeof AnamnesisSectionRepository;
  protected anamnesisQuestionRepository_: typeof AnamnesisQuestionRepository;
  protected anamnesisResponseRepository_: typeof AnamnesisResponseRepository;
  protected anamnesisAssignmentRepository_: typeof AnamnesisAssignmentRepository;
  protected customerRepository: typeof CustomerRepository;

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

      const promises: Promise<unknown>[] = [];

      // Create form
      promises.push(anamnesisFormRepository.insert(formPayload));

      // Create sections
      for (const section of formPayload.sections) {
        promises.push(anamnesisSectionRepository.insert(section));
      }

      // Create questions
      for (const section of formPayload.sections) {
        for (const question of section.questions) {
          promises.push(anamnesisQuestionRepository.insert(question));
        }
      }

      await Promise.all(promises);

      return formPayload.id;
    });
  }

  async deleteForm(id: string): Promise<string | null> {
    await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisFormRepository = transactionManager.withRepository(this.anamnesisFormRepository_);
      const anamnesisSectionRepository = transactionManager.withRepository(this.anamnesisSectionRepository_);
      const anamnesisQuestionRepository = transactionManager.withRepository(this.anamnesisQuestionRepository_);

      const form = await this.getForm(id);

      if (!form) return null;

      const promises: Promise<unknown>[] = [];

      // Delete form
      promises.push(anamnesisFormRepository.delete(id));

      // Delete sections
      for (const section of form.sections) {
        promises.push(anamnesisSectionRepository.delete(section.id));
      }

      // Delete questions
      for (const section of form.sections) {
        for (const question of section.questions) {
          promises.push(anamnesisQuestionRepository.delete(question.id));
        }
      }

      await Promise.all(promises);
    });

    return id;
  }

  async deleteForms(formIds: string[]): Promise<string[] | null> {
    await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisFormRepository = transactionManager.withRepository(this.anamnesisFormRepository_);
      const anamnesisSectionRepository = transactionManager.withRepository(this.anamnesisSectionRepository_);
      const anamnesisQuestionRepository = transactionManager.withRepository(this.anamnesisQuestionRepository_);

      const forms = await this.anamnesisFormRepository_.findBy({ id: In(formIds) });

      if (!forms.length || forms.length !== formIds.length) return null;

      const promises: Promise<unknown>[] = [];

      // Delete questions
      for (const form of forms) {
        for (const section of form.sections) {
          for (const question of section.questions) {
            promises.push(anamnesisQuestionRepository.delete(question.id));
          }
        }
      }

      // Delete sections
      for (const form of forms) {
        for (const section of form.sections) {
          promises.push(anamnesisSectionRepository.delete(section.id));
        }
      }

      // Delete forms
      for (const form of forms) {
        promises.push(anamnesisFormRepository.delete(form.id));
      }

      await Promise.all(promises);
    });

    return formIds;
  }

  async getForm(id: string): Promise<AnamnesisFormResultDto | null> {
    const relations: string[] = ["sections", "sections.questions"];
    const select: FindOptionsSelect<AnamnesisFormModel> = {
      id: true,
      title: true,
      description: true,
      created_at: true,
      updated_at: true,
      sections: {
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
      },
    };

    return await this.anamnesisFormRepository_.findOne({ where: { id }, relations, select });
  }

  async getForms(query: GetEntitiesQuery): Promise<PaginatedResult<AnamnesisFormResultDto>> {
    const { page = 1, limit = 10, filters, field, order } = query;

    const select = {
      id: true,
      title: true,
      description: true,
      created_at: true,
      updated_at: true,
      sections: {
        id: true,
        form_id: true,
        title: true,
        description: true,
        order: true,
      },
    };

    let query_ = this.anamnesisFormRepository_.createQueryBuilder("form").leftJoinAndSelect("form.sections", "section");

    // Apply select
    for (const key of Object.keys(select)) {
      if (key !== "sections") {
        query_ = query_.addSelect(`form.${key}`, key);
      }
    }

    // Apply filters
    if (filters) {
      filters.forEach((filter, index) => {
        const paramName = `param${index}`;
        switch (filter.operator) {
          case "eq":
            query_ = query_.andWhere(`form.${filter.field} = :${paramName}`, { [paramName]: filter.value });
            break;
          case "neq":
            query_ = query_.andWhere(`form.${filter.field} != :${paramName}`, { [paramName]: filter.value });
            break;
          case "gt":
            query_ = query_.andWhere(`form.${filter.field} > :${paramName}`, { [paramName]: filter.value });
            break;
          case "lt":
            query_ = query_.andWhere(`form.${filter.field} < :${paramName}`, { [paramName]: filter.value });
            break;
          case "gte":
            query_ = query_.andWhere(`form.${filter.field} >= :${paramName}`, { [paramName]: filter.value });
            break;
          case "lte":
            query_ = query_.andWhere(`form.${filter.field} <= :${paramName}`, { [paramName]: filter.value });
            break;
          case "like":
            query_ = query_.andWhere(`form.${filter.field} LIKE :${paramName}`, { [paramName]: `%${filter.value}%` });
            break;
        }
      });
    }

    // Apply sorting
    if (field && order) {
      query_ = query_.orderBy(`form.${field}`, order.toUpperCase() as "ASC" | "DESC");
    }

    const [totalItems, data] = await Promise.all([
      query_.getCount(),
      query_
        .skip((page - 1) * limit)
        .take(limit)
        .getMany(),
    ]);

    const paginatedResult: PaginatedResult<AnamnesisFormResultDto> = {
      data,
      currentPage: page,
      itemsPerPage: limit,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };

    return paginatedResult;
  }

  async updateForm(id: string, data: UpdateAnamnesisFormDto): Promise<string | null> {
    await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisFormRepository = transactionManager.withRepository(this.anamnesisFormRepository_);
      const anamnesisSectionRepository = transactionManager.withRepository(this.anamnesisSectionRepository_);
      const anamnesisQuestionRepository = transactionManager.withRepository(this.anamnesisQuestionRepository_);

      const form = await this.getForm(id);

      if (!form) return null;

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

      const promises: Promise<unknown>[] = [];

      // Delete missing questions
      for (const id of missingQuestionIds) {
        promises.push(anamnesisQuestionRepository.delete(id));
      }

      // Delete missing sections
      for (const id of missingSectionIds) {
        promises.push(anamnesisSectionRepository.delete(id));
      }

      // Create new sections
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

      // Update existing sections
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

      // Create new questions
      for (const section of data.sections) {
        for (const question of section.questions.filter((question) => newQuestionIds.includes(question.id))) {
          promises.push(
            anamnesisQuestionRepository.insert({
              id: question.id,
              section_id: section.id,
              question_text: question.question_text,
              question_type: question.question_type,
              order: question.order,
              options: question.options.map((option) => ({ label: option.label, value: option.value })),
            }),
          );
        }
      }

      // Update existing questions
      for (const section of data.sections) {
        for (const question of section.questions.filter((question) => remaningQuestionIds.includes(question.id))) {
          promises.push(
            anamnesisQuestionRepository.update(question.id, {
              section_id: section.id,
              question_text: question.question_text,
              question_type: question.question_type,
              order: question.order,
              options: question.options.map((option) => ({ label: option.label, value: option.value })),
              updated_at: new Date(),
            }),
          );
        }
      }

      // Update form
      promises.push(
        anamnesisFormRepository.update(id, {
          title: data.title,
          description: data.description,
          updated_at: new Date(),
        }),
      );

      await Promise.all(promises);
    });

    return id;
  }

  async createFormAssignment(formId: string, emails: string[]): Promise<string[]> {
    await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisAssignmentRepository = transactionManager.withRepository(this.anamnesisAssignmentRepository_);
      const customerRepository = transactionManager.withRepository(this.customerRepository);

      const [form, customers] = await Promise.all([
        this.getForm(formId),
        customerRepository.find({ where: { email: In(emails) } }),
      ]);

      if (!form || customers.length !== emails.length) return null;

      const promises: Promise<unknown>[] = [];
      for (const customer of customers) {
        promises.push(
          anamnesisAssignmentRepository.insert({
            form_id: formId,
            user_id: customer.id,
            status: "new",
          }),
        );
      }

      await Promise.all(promises);
    });

    return emails;
  }

  async getFormAssignments(
    customerId: string,
    status: string,
    query: GetEntitiesQuery,
  ): Promise<PaginatedResult<AnamnesisFormResultDto>> {
    const { page = 1, limit = 10 } = query;

    const select = {
      id: true,
      title: true,
      description: true,
      created_at: true,
      updated_at: true,
      sections: {
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
      },
    };

    // Find all form assignments for the specified customer id and apply limit and page
    const assignmentQuery_ = this.anamnesisAssignmentRepository_.createQueryBuilder("assignment");

    // Apply customer id
    assignmentQuery_.where("assignment.user_id = :customerId", { customerId });

    // Apply status if provided
    if (status) {
      assignmentQuery_.andWhere("assignment.status = :status", { status });
    }

    const formAssignments = await assignmentQuery_
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    let query_ = this.anamnesisFormRepository_
      .createQueryBuilder("form")
      .leftJoinAndSelect("form.sections", "section")
      .leftJoinAndSelect("section.questions", "question");

    // Apply form id based on the form assignments
    query_ = query_.where("form.id IN (:...formIds)", {
      formIds: formAssignments.map((assignment) => assignment.form_id),
    });

    // Apply select
    for (const key of Object.keys(select)) {
      if (key !== "sections") {
        query_ = query_.addSelect(`form.${key}`, key);
      }
    }

    for (const key of Object.keys(select.sections)) {
      if (key !== "questions") {
        query_ = query_.addSelect(`section.${key}`, `section_${key}`);
      }
    }

    for (const key of Object.keys(select.sections.questions)) {
      query_ = query_.addSelect(`question.${key}`, `question_${key}`);
    }

    const [totalItems, data] = await Promise.all([
      assignmentQuery_.getCount(),
      query_
        .skip((page - 1) * limit)
        .take(limit)
        .getMany(),
    ]);

    const paginatedResult: PaginatedResult<AnamnesisFormResultDto> = {
      data,
      currentPage: page,
      itemsPerPage: limit,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };

    return paginatedResult;
  }

  async getFormResponses(
    formId: string,
    query: GetEntitiesQuery,
  ): Promise<PaginatedResult<AnamnesisResponseResultDto>> {
    const { page = 1, limit = 10, field, order } = query;

    const select = {
      id: true,
      created_at: true,
      updated_at: true,
      form_id: true,
      customer_id: true,
      order_id: true,
      responses: {
        question_id: true,
        answer: true,
      },
    };

    let query_ = this.anamnesisResponseRepository_
      .createQueryBuilder("response")
      .leftJoinAndSelect("response.responses", "response");

    // Apply id
    query_ = query_.where("response.form_id = :formId", { formId });

    // Apply select
    for (const key of Object.keys(select)) {
      if (key !== "responses") {
        query_ = query_.addSelect(`response.${key}`, key);
      }
    }

    for (const key of Object.keys(select.responses)) {
      query_ = query_.addSelect(`response.${key}`, `response_${key}`);
    }

    // Apply sorting
    if (field && order) {
      query_ = query_.orderBy(`response.${field}`, order.toUpperCase() as "ASC" | "DESC");
    }

    const [totalItems, data] = await Promise.all([
      query_.getCount(),
      query_
        .skip((page - 1) * limit)
        .take(limit)
        .getMany(),
    ]);

    const paginatedResult: PaginatedResult<AnamnesisResponseResultDto> = {
      data,
      currentPage: page,
      itemsPerPage: limit,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };

    return paginatedResult;
  }

  async createFormResponse(
    customerId: string,
    formId: string,
    data: CreateAnamnesisResponseDto,
  ): Promise<string | null> {
    return await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisResponseRepository = transactionManager.withRepository(this.anamnesisResponseRepository_);
      const customerRepository = transactionManager.withRepository(this.customerRepository);

      const [form, customer] = await Promise.all([
        this.getForm(formId),
        customerRepository.findOne({ where: { id: customerId } }),
      ]);

      if (!form || !customer) return null;

      const responseId = uuidv7();

      const responses = data.responses.map((response) => {
        return {
          question_id: response.question_id,
          answer: response.answer,
        };
      });

      await anamnesisResponseRepository.insert({
        id: responseId,
        customer_id: customerId,
        form_id: formId,
        order_id: data.order_id,
        responses,
      });

      return responseId;
    });
  }
}
export default AnamnesisService;
