import type { UniqueIdentifier } from "@dnd-kit/core";
import type { RouteProps } from "@medusajs/admin";

import type { Column } from "react-table";
import type { AnamnesisQuestionType, AnamnesisSectionData } from "../../types/shared/anamnesis";

export interface AnamnesisContextValue {
  id: string;
  sections: AnamnesisSectionData[];
  setSections: React.Dispatch<React.SetStateAction<AnamnesisSectionData[]>>;
  handleAddNewSection: () => void;
  handleAddQuestion: (sectionId: UniqueIdentifier) => (type: AnamnesisQuestionType) => void;
  activeTab: "editor" | "submissions";
  setActiveTab: React.Dispatch<React.SetStateAction<"editor" | "submissions">>;
  handleAddMultipleChoiceOption: (sectionId: UniqueIdentifier, questionId: UniqueIdentifier) => () => void;
  handleChangeMultipleChoiceOption: (
    sectionId: UniqueIdentifier,
    questionId: UniqueIdentifier,
    index: number,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteMultipleChoiceOption: (
    sectionId: UniqueIdentifier,
    questionId: UniqueIdentifier,
    index: number,
  ) => () => void;
  handleAddSelectOption: (sectionId: UniqueIdentifier, questionId: UniqueIdentifier) => () => void;
  handleChangeSelectOptionText: (
    sectionId: UniqueIdentifier,
    questionId: UniqueIdentifier,
    index: number,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteSelectOption: (sectionId: UniqueIdentifier, questionId: UniqueIdentifier, index: number) => () => void;
  handleChangeQuestionText: (
    sectionId: UniqueIdentifier,
    questionId: UniqueIdentifier,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteSection: (sectionId: UniqueIdentifier) => () => void;
  handleDeleteQuestion: (sectionId: UniqueIdentifier, questionId: UniqueIdentifier) => () => void;
  handleCreateForm: (notify: RouteProps["notify"]) => () => void;
  handleUpdateForm: (notify: RouteProps["notify"]) => () => void;
  handleShare: (notify: RouteProps["notify"]) => () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  shareModalOpened: boolean;
  setShareModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
  patientEmail: string;
  setPatientEmail: React.Dispatch<React.SetStateAction<string>>;
  handleChangePatientEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  handleChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  handleChangeDescription: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMoveQuestion: (destinationContainerId: UniqueIdentifier, questionId: UniqueIdentifier) => void;
  isValid: boolean;
  isInitialised: boolean;
  init: () => Promise<void>;
  handleChangeSectionTitle: (sectionId: UniqueIdentifier) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeSectionDescription: (sectionId: UniqueIdentifier) => (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  columns: readonly Column<{}>[];
  handleViewSubmission: (id: string, payload: {}) => void;
  handleShareForm: (notify: RouteProps["notify"]) => () => void;
  setDetailModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
  detailModalOpened: boolean;
  detailPayload: {};
}

export interface AnamnesisWrapperProps {
  children: React.ReactNode;
}
