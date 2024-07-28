import { TransactionBaseService } from "@medusajs/medusa";
import type { EntityManager } from "typeorm";
import type { AnamnesisForm } from "../models/anamnesis-form";
import type AnamnesisFormRepository from "../repositories/anamnesis-form";
type InjectedDependencies = {
  manager: EntityManager;

  anamnesisFormRepository: typeof AnamnesisFormRepository;
};
class AnamnesisFormService extends TransactionBaseService {
  protected anamnesisFormRepository_: typeof AnamnesisFormRepository;
  constructor({ anamnesisFormRepository: onboardingRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.anamnesisFormRepository_ = onboardingRepository;
  }
  async create(data: Partial<AnamnesisForm>): Promise<AnamnesisForm> {
    return await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisFormRepository = transactionManager.withRepository(this.anamnesisFormRepository_);
      const form = anamnesisFormRepository.create(data);
      return await anamnesisFormRepository.save(form);
    });
  }
  async update(id: string, data: Partial<AnamnesisForm>): Promise<AnamnesisForm> {
    return await this.atomicPhase_(async (transactionManager: EntityManager) => {
      const anamnesisFormRepository = transactionManager.withRepository(this.anamnesisFormRepository_);
      await anamnesisFormRepository.update({ id }, data);
      return await anamnesisFormRepository.findOne({ where: { id } });
    });
  }
}
export default AnamnesisFormService;
