import type { UniqueIdentifier } from "@dnd-kit/core";
import type { RouteProps } from "@medusajs/admin";
import { useAdminCustomPost, useMedusa } from "medusa-react";
import { nanoid } from "nanoid";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type {
  AnamnesisQuestionType,
  CreateAnamnesisFormResponse,
  NewAnamnesisSection,
} from "../../../../types/anamnesis";
import { ANAMNESIS_QUERY_KEY, type CreateAnamnesisFormPayload } from "../../../../types/anamnesis";
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
}

interface AnamnesisWrapperProps {
  children: React.ReactNode;
}

const AnamnesisContext = createContext<AnamnesisContextValue>(null as unknown as AnamnesisContextValue);

export function AnamnesisProvider({ children }: AnamnesisWrapperProps) {
  // STATES

  // Get the anamnesis ID from the URL
  const { id } = useParams();

  // State for the anamnesis form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "submissions">("editor");
  const [sections, setSections] = useState<NewAnamnesisSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [shareModalOpened, setShareModalOpened] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isInitialised, setIsInitialised] = useState(false);

  // Other hooks
  const dndContext = useDndContext();
  const navigate = useNavigate();

  // QUERIES
  const { client } = useMedusa();
  const { mutate: createAnamnesisForm } = useAdminCustomPost<CreateAnamnesisFormPayload, CreateAnamnesisFormResponse>(
    "/anamnesis",
    ANAMNESIS_QUERY_KEY,
  );

  // HANDLERS
  const init = async () => {
    if (!isInitialised && id !== "new") {
      try {
        setIsFetching(true);
        setIsLoading(true);

        const res = await client.admin.custom.get(`/anamnesis/${id}`);

        // Populate form details
        setTitle(res.title);
        setDescription(res.description);
        setSections(res.sections);

        // Populate dndContext
        dndContext.setItems(
          res.sections.reduce(
            (acc, section) => {
              acc[section.id] = (section.questions || []).map((question) => question.id);
              return acc;
            },
            {} as Record<string, string[]>,
          ),
        );
        dndContext.setContainers(res.sections.map((section) => section.id));
      } catch (error) {
        // If anamnesis form is not found or something goes wrong with the data retrieval, redirect to 404 page
        navigate("/404.html");
      } finally {
        setIsInitialised(true);
        setIsLoading(false);
        setIsFetching(false);
      }
    }
  };

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

  const handleChangeSectionTitle = (sectionId: UniqueIdentifier) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          title: e.target.value,
        };
      }

      return section;
    });

    setSections(newSections);
  };

  const handleChangeSectionDescription =
    (sectionId: UniqueIdentifier) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            description: e.target.value,
          };
        }

        return section;
      });

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

  const handleCreateForm = (notify: RouteProps["notify"]) => async () => {
    setIsLoading(true);

    // Reorder sections and its questions based on dndContext
    const newSections = dndContext.containers.map((containerId, index) => {
      const section = sections.find((section) => section.id === containerId);

      return {
        ...section,
        questions: dndContext.items[containerId].map((questionId, index) => {
          const question = section?.questions.find((question) => question.id === questionId);

          return {
            ...question,
            order: index,
          };
        }),
        order: index,
      };
    });

    createAnamnesisForm(
      { title, description, sections: newSections },
      {
        onSuccess: async (data) => {
          notify.success("Success", "Anamnesis form saved successfully. Redirecting to form details...");

          // delay to allow the success notification to show
          await new Promise((resolve) => setTimeout(resolve, 1500));

          navigate(`/a/anamnesis/${data.formId}`);
        },
        onError: (error) => {
          notify.error("Error", "Failed to save anamnesis form");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };

  const handleUpdateForm = (notify: RouteProps["notify"]) => async () => {
    setIsLoading(true);

    // Reorder sections and its questions based on dndContext
    const newSections = dndContext.containers.map((containerId, index) => {
      const section = sections.find((section) => section.id === containerId);

      return {
        ...section,
        questions: dndContext.items[containerId].map((questionId, index) => {
          const question = section?.questions.find((question) => question.id === questionId);

          return {
            ...question,
            order: index,
          };
        }),
        order: index,
      };
    });

    // TODO: Implement update form
  };

  const handleMoveQuestion = (destinationContainerId: UniqueIdentifier, questionId: UniqueIdentifier) => {
    const originSectionId = sections.find((section) =>
      section.questions.find((question) => question.id === questionId),
    )?.id;

    if (originSectionId !== destinationContainerId) {
      const newSections = sections.map((section) => {
        if (section.id === originSectionId) {
          return {
            ...section,
            questions: section.questions.filter((question) => question.id !== questionId),
          };
        }

        if (section.id === destinationContainerId) {
          return {
            ...section,
            questions: [
              ...section.questions,
              sections
                .find((section) => section.id === originSectionId)
                ?.questions.find((question) => question.id === questionId),
            ],
          };
        }

        return section;
      });

      setSections(newSections);
    }
  };

  // // EFFECTS
  // useEffect(() => {
  //   if (id === "new") {
  //     // cleanup form state
  //     setTitle("");
  //     setDescription("");
  //     setSections([]);
  //     dndContext.setItems({});
  //     dndContext.setContainers([]);
  //   } else {
  //     client.admin.custom
  //       .get(`/anamnesis/${id}`)
  //       .then((res) => {
  //         // Populate form details
  //         setTitle(res.title);
  //         setDescription(res.description);
  //         setSections(res.sections);

  //         // Populate dndContext
  //         dndContext.setItems(
  //           res.sections.reduce(
  //             (acc, section) => {
  //               acc[section.id] = (section.questions || []).map((question) => question.id);
  //               return acc;
  //             },
  //             {} as Record<string, string[]>,
  //           ),
  //         );
  //         dndContext.setContainers(res.sections.map((section) => section.id));
  //       })
  //       .catch((error) => {
  //         // If anamnesis form is not found or something goes wrong with the data retrieval, redirect to 404 page
  //         navigate("/404.html");
  //       });
  //   }
  // }, [id]);

  useEffect(() => {
    if (!title) {
      // Check if title is not empty
      return setIsValid(false);
    }

    if (!description) {
      // Check if description is not empty
      return setIsValid(false);
    }

    for (const section of sections) {
      if (!section.title) {
        // Check if section title is not empty
        return setIsValid(false);
      }

      if (!section.description) {
        // Check if section description is not empty
        return setIsValid(false);
      }

      for (const question of section.questions) {
        if (!question.question_text) {
          // Check if question text is not empty
          return setIsValid(false);
        }

        if (question.question_type === "multiple_choice" || question.question_type === "select") {
          for (const option of question.options) {
            if (!option.label) {
              // Check if option label is not empty
              return setIsValid(false);
            }

            if (!option.value) {
              // Check if option value is not empty
              return setIsValid(false);
            }
          }
        }
      }
    }

    setIsValid(true);
  }, [sections, title, description, activeTab]);

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
      handleChangeSectionDescription,
      handleChangeSectionTitle,
      handleChangeSelectOptionText,
      handleChangeTitle,
      handleCreateForm,
      handleDeleteMultipleChoiceOption,
      handleDeleteQuestion,
      handleDeleteSection,
      handleDeleteSelectOption,
      handleMoveQuestion,
      handleShare,
      handleUpdateForm,
      id,
      init,
      isFetching,
      isInitialised,
      isLoading,
      isValid,
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
    handleChangeSectionDescription,
    handleChangeSectionTitle,
    handleChangeSelectOptionText,
    handleChangeTitle,
    handleCreateForm,
    handleDeleteMultipleChoiceOption,
    handleDeleteQuestion,
    handleDeleteSection,
    handleDeleteSelectOption,
    handleMoveQuestion,
    handleShare,
    handleUpdateForm,
    id,
    init,
    isFetching,
    isInitialised,
    isLoading,
    isValid,
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
