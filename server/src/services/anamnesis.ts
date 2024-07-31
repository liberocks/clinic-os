import { TransactionBaseService } from "@medusajs/medusa";
import type CustomerRepository from "@medusajs/medusa/dist/repositories/customer";
import { Lifetime } from "awilix";
import { type EntityManager, In } from "typeorm";
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
  protected customerRepository_: typeof CustomerRepository;

  constructor({
    anamnesisFormRepository,
    anamnesisSectionRepository,
    anamnesisQuestionRepository,
    anamnesisResponseRepository,
    anamnesisAssignmentRepository,
    customerRepository,
  }: InjectedDependencies) {
    super(arguments[0]);

    this.anamnesisFormRepository_ = anamnesisFormRepository;
    this.anamnesisSectionRepository_ = anamnesisSectionRepository;
    this.anamnesisQuestionRepository_ = anamnesisQuestionRepository;
    this.anamnesisResponseRepository_ = anamnesisResponseRepository;
    this.anamnesisAssignmentRepository_ = anamnesisAssignmentRepository;
    this.customerRepository_ = customerRepository;
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
      const anamnesisResponseRepository = transactionManager.withRepository(this.anamnesisResponseRepository_);

      const form = await this.getForm(id);

      if (!form) return null;

      let promises: Promise<unknown>[] = [];

      // Delete questions
      for (const section of form.sections) {
        for (const question of section.questions) {
          promises.push(anamnesisQuestionRepository.delete(question.id));
        }
      }
      promises.push(anamnesisResponseRepository.delete({ form_id: id }));

      await Promise.all(promises);

      // Delete sections
      promises = [];
      for (const section of form.sections) {
        promises.push(anamnesisSectionRepository.delete(section.id));
      }
      await Promise.all(promises);

      // Delete form
      await anamnesisFormRepository.delete(id);
    });

    return id;
  }

  async getForm(id: string): Promise<AnamnesisFormResultDto | null> {
    const query_ = this.anamnesisFormRepository_
      .createQueryBuilder("form")
      .leftJoinAndSelect("form.sections", "section")
      .leftJoinAndSelect("section.questions", "question");

    return await query_.where("form.id = :id", { id }).getOne();
  }

  async getForms(query: GetEntitiesQuery): Promise<PaginatedResult<AnamnesisFormResultDto>> {
    const { page = 1, limit = 10, filters, field, order } = query;

    let query_ = this.anamnesisFormRepository_.createQueryBuilder("form").leftJoinAndSelect("form.sections", "section");

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
            query_ = query_.andWhere(`form.${filter.field} ILIKE :${paramName}`, { [paramName]: `%${filter.value}%` });
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
      limit: limit,
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
      const sectionIds = (form.sections ?? []).map((section) => section.id);
      const incomingSectionIds = (data.sections ?? []).map((section) => section.id);
      const missingSectionIds = sectionIds.filter((id) => !incomingSectionIds.includes(id));
      const remaningSectionIds = sectionIds.filter((id) => incomingSectionIds.includes(id));
      const newSectionIds = incomingSectionIds.filter((id) => !remaningSectionIds.includes(id));

      // Find missing question ids
      const questionIds = form.sections.flatMap((section) => (section.questions ?? []).map((question) => question.id));
      const incomingQuestionIds = data.sections.flatMap((section) =>
        (section.questions ?? []).map((question) => question.id),
      );
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
              options: (question.options ?? []).map((option) => ({ label: option.label, value: option.value })),
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
              options: (question.options ?? []).map((option) => ({ label: option.label, value: option.value })),
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

  async createFormAssignment(formId: string, emails: string[]): Promise<string[] | null> {
    const result = await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisAssignmentRepository = transactionManager.withRepository(this.anamnesisAssignmentRepository_);
      const customerRepository = transactionManager.withRepository(this.customerRepository_);

      const [form, customers] = await Promise.all([
        this.getForm(formId),
        customerRepository.find({ where: { email: In(emails) } }),
      ]);

      if (!form || customers.length !== emails.length) return null;

      const existingAssignments = await anamnesisAssignmentRepository.findOne({
        where: { form_id: formId, user_id: In(customers.map((customer) => customer.id)) },
      });

      if (existingAssignments) return null;

      const promises: Promise<unknown>[] = [];
      for (const customer of customers) {
        promises.push(
          anamnesisAssignmentRepository.insert({
            id: uuidv7(),
            form_id: formId,
            user_id: customer.id,
            status: "new",
          }),
        );
      }

      return await Promise.all(promises);
    });

    if (!result) return null;

    return emails;
  }

  async getFormAssignments(
    customerId: string,
    query: GetEntitiesQuery,
  ): Promise<PaginatedResult<AnamnesisFormResultDto>> {
    const { page = 1, limit = 10 } = query;

    // Find all form assignments for the specified customer id and apply limit and page
    const assignmentQuery_ = this.anamnesisAssignmentRepository_.createQueryBuilder("assignment");

    // Apply customer id and status
    assignmentQuery_.where("assignment.user_id = :customerId", {
      customerId,
    });

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
      formIds: (formAssignments ?? []).map((assignment) => assignment.form_id),
    });

    const [totalItems, data] = await Promise.all([
      assignmentQuery_.getCount(),
      query_
        .skip((page - 1) * limit)
        .take(limit)
        .getMany(),
    ]);

    const paginatedResult: PaginatedResult<AnamnesisFormResultDto> = {
      data: data.map((form) => ({
        ...form,
        status: formAssignments.find((assignment) => assignment.form_id === form.id)?.status,
      })),
      currentPage: page,
      limit: limit,
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

    let query_ = this.anamnesisResponseRepository_
      .createQueryBuilder("response")
      .leftJoinAndSelect("response.customer", "customer");

    // Apply id
    query_ = query_.where("response.form_id = :formId", { formId });

    // Select customer name and email
    query_ = query_.addSelect(["customer.email", "customer.first_name", "customer.last_name"]);

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
      limit: limit,
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
      const customerRepository = transactionManager.withRepository(this.customerRepository_);

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

      const promises = [];
      promises.push(
        anamnesisResponseRepository.insert({
          id: responseId,
          customer_id: customerId,
          form_id: formId,
          order_id: data.order_id,
          responses,
        }),
      );

      // Update assignment status to done
      promises.push(
        this.anamnesisAssignmentRepository_.update(
          {
            form_id: formId,
            user_id: customerId,
          },
          { status: "done" },
        ),
      );

      await Promise.all(promises);

      return responseId;
    });
  }
}
export default AnamnesisService;
