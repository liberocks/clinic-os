import type { UniqueIdentifier } from "@dnd-kit/core";
import type { RouteProps } from "@medusajs/admin";
import { nanoid } from "nanoid";
import { createContext, useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { AnamnesisQuestionType, NewAnamnesisSection } from "../../../../types/anamnesis";
import { useDndContext } from "./dnd-context";

interface AnamnesisContextValue {
  id: string;
  sections: NewAnamnesisSection[];
  setSections: React.Dispatch<React.SetStateAction<NewAnamnesisSection[]>>;
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
  handleSave: (notify: RouteProps["notify"]) => () => void;
  handleShare: (notify: RouteProps["notify"]) => () => void;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  shareModalOpened: boolean;
  setShareModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
  patientEmail: string;
  setPatientEmail: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  handleChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  handleChangeDescription: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface AnamnesisWrapperProps {
  children: React.ReactNode;
}

const AnamnesisContext = createContext<AnamnesisContextValue>(null as unknown as AnamnesisContextValue);

export function AnamnesisProvider({ children }: AnamnesisWrapperProps) {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "submissions">("editor");
  const [sections, setSections] = useState<NewAnamnesisSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [shareModalOpened, setShareModalOpened] = useState(false);
  const dndContext = useDndContext();

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleShare = (notify: RouteProps["notify"]) => () => {};

  const handleAddNewSection = () => {
    const newSectionId = nanoid();
    dndContext.setItems((items) => {
      return {
        ...items,
        [newSectionId]: [],
      };
    });

    dndContext.setContainers((containers) => [...containers, newSectionId]);

    const newSections = [
      ...sections,
      {
        id: newSectionId,
        title: "",
        description: "",
        order: 0,
        questions: [],
      },
    ];

    setSections(newSections);
  };

  const handleDeleteSection = (sectionId: UniqueIdentifier) => () => {
    const newSections = sections.filter((section) => section.id !== sectionId);

    dndContext.setItems((items) => {
      const newItems = { ...items };
      delete newItems[sectionId];
      return newItems;
    });
    dndContext.setContainers((containers) => containers.filter((container) => container !== sectionId));
    setSections(newSections);
  };

  const handleAddMultipleChoiceOption = (sectionId: UniqueIdentifier, questionId: UniqueIdentifier) => () => {
    const newSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.map((question) => {
            if (question.id === questionId) {
              return {
                ...question,
                options: [
                  ...question.options,
                  {
                    label: "",
                    value: "",
                  },
                ],
              };
            }

            return question;
          }),
        };
      }

      return section;
    });

    setSections(newSections);
  };

  const handleChangeMultipleChoiceOption =
    (sectionId: UniqueIdentifier, questionId: UniqueIdentifier, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.map((question) => {
              if (question.id === questionId) {
                return {
                  ...question,
                  options: question?.options.map((option, i) => {
                    if (i === index) {
                      return {
                        ...option,
                        label: e.target.value,
                        // change e.target.value to snake case
                        value: e.target.value.toLowerCase().replace(/\s/g, "_"),
                      };
                    }

                    return option;
                  }),
                };
              }

              return question;
            }),
          };
        }

        return section;
      });

      setSections(newSections);
    };

  const handleDeleteMultipleChoiceOption =
    (sectionId: UniqueIdentifier, questionId: UniqueIdentifier, index: number) => () => {
      const newSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.map((question) => {
              if (question.id === questionId) {
                return {
                  ...question,
                  options: question?.options.filter((_, i) => i !== index),
                };
              }

              return question;
            }),
          };
        }

        return section;
      });

      setSections(newSections);
    };

  const handleAddSelectOption = (sectionId: UniqueIdentifier, questionId: UniqueIdentifier) => () => {
    const newSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.map((question) => {
            if (question.id === questionId) {
              return {
                ...question,
                options: [
                  ...question.options,
                  {
                    label: "",
                    value: "",
                  },
                ],
              };
            }

            return question;
          }),
        };
      }

      return section;
    });

    setSections(newSections);
  };

  const handleChangeSelectOptionText =
    (sectionId: UniqueIdentifier, questionId: UniqueIdentifier, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.map((question) => {
              if (question.id === questionId) {
                return {
                  ...question,
                  options: question?.options.map((option, i) => {
                    if (i === index) {
                      return {
                        ...option,
                        label: e.target.value,
                        // change e.target.value to snake case
                        value: e.target.value.toLowerCase().replace(/\s/g, "_"),
                      };
                    }

                    return option;
                  }),
                };
              }

              return question;
            }),
          };
        }

        return section;
      });

      setSections(newSections);
    };

  const handleDeleteSelectOption = (sectionId: UniqueIdentifier, questionId: UniqueIdentifier, index: number) => () => {
    const newSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.map((question) => {
            if (question.id === questionId) {
              return {
                ...question,
                options: question?.options?.filter((_, i) => i !== index),
              };
            }

            return question;
          }),
        };
      }

      return section;
    });

    setSections(newSections);
  };

  const handleChangeQuestionText =
    (sectionId: UniqueIdentifier, questionId: UniqueIdentifier) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.map((question) => {
              if (question.id === questionId) {
                return {
                  ...question,
                  question_text: e.target.value,
                };
              }

              return question;
            }),
          };
        }

        return section;
      });

      setSections(newSections);
    };

  const handleAddQuestion = (sectionId: UniqueIdentifier) => (type: AnamnesisQuestionType) => {
    const newQuestionId = nanoid();
    dndContext.setItems((items) => {
      return {
        ...items,
        [sectionId]: [...items[sectionId], newQuestionId],
      };
    });

    const newSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: [
            ...section.questions,
            {
              id: newQuestionId,
              type,
              question_text: "",
              options: [],
              order: 0,
              question_type: type,
              section_id: sectionId,
            },
          ],
        };
      }

      return section;
    });

    setSections(newSections);
  };

  const handleDeleteQuestion = (sectionId: UniqueIdentifier, questionId: UniqueIdentifier) => () => {
    const newSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.filter((question) => question.id !== questionId),
        };
      }

      return section;
    });

    dndContext.setItems((items) => {
      return {
        ...items,
        [sectionId]: items[sectionId].filter((id) => id !== questionId),
      };
    });

    setSections(newSections);
  };

  const handleSave = (notify: RouteProps["notify"]) => async () => {
    try {
      setIsLoading(true);

      console.log("Anamness ID", id);
      console.log("Title", title);
      console.log("Description", description);
      console.log("Sections", sections);

      await Promise.resolve(setTimeout(() => {}, 3000));

      notify.success("Success", "Anamnesis form saved successfully");
    } catch (error) {
      notify.error("Error", "Failed to save anamnesis form");
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = useMemo(() => {
    return {
      activeTab,
      description,
      handleAddMultipleChoiceOption,
      handleAddNewSection,
      handleAddQuestion,
      handleAddSelectOption,
      handleChangeDescription,
      handleChangeMultipleChoiceOption,
      handleChangeQuestionText,
      handleChangeSelectOptionText,
      handleChangeTitle,
      handleDeleteMultipleChoiceOption,
      handleDeleteQuestion,
      handleDeleteSection,
      handleDeleteSelectOption,
      handleSave,
      handleShare,
      id,
      isFetching,
      isLoading,
      patientEmail,
      sections,
      setActiveTab,
      setIsFetching,
      setIsLoading,
      setPatientEmail,
      setSections,
      setShareModalOpened,
      shareModalOpened,
      title,
    };
  }, [
    activeTab,
    description,
    handleAddMultipleChoiceOption,
    handleAddNewSection,
    handleAddQuestion,
    handleAddSelectOption,
    handleChangeDescription,
    handleChangeMultipleChoiceOption,
    handleChangeQuestionText,
    handleChangeSelectOptionText,
    handleChangeTitle,
    handleDeleteMultipleChoiceOption,
    handleDeleteQuestion,
    handleDeleteSection,
    handleDeleteSelectOption,
    handleSave,
    handleShare,
    id,
    isFetching,
    isLoading,
    patientEmail,
    sections,
    setActiveTab,
    setIsFetching,
    setIsLoading,
    setPatientEmail,
    setSections,
    setShareModalOpened,
    shareModalOpened,
    title,
  ]);

  return <AnamnesisContext.Provider value={contextValue}>{children}</AnamnesisContext.Provider>;
}

export function useAnamnesisContext() {
  return useContext<AnamnesisContextValue>(AnamnesisContext);
}
