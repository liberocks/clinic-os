import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useUserContext } from "../../context/auth";
import type {
  AnamnesisForm,
  AnamnesisQuestion,
  AnamnesisSection,
  CreateAnamnesisResponse,
} from "../../types/anamnesis";
import { medusaClient } from "../../utils/medusa";

export const useLogic = () => {
  const [data, setData] = useState<AnamnesisForm | null>(null);

  const [initializing, setInitializing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    userState: { email, firstName, lastName },
  } = useUserContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchData = async () => {
    try {
      setInitializing(true);

      const data = await medusaClient.client.request("GET", `/store/assignment/${id}`, undefined, undefined, {
        Authorization: `Bearer ${Cookies.get("_medusa_jwt")}`,
      });

      setData(data);

      if (data?.sections) {
        setTotalPages(data.sections.length);
      }
    } catch (error) {
      console.error(error);
      navigate("/404");
    } finally {
      setInitializing(false);
    }
  };

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const formData = new FormData(formRef.current!);
    const formValues = Object.fromEntries(formData);

    // check if all question in the current section has been all answered
    const currentSection = data!.sections![currentPage - 1];

    const allAnswered = currentSection.questions!.every((question) => {
      return formValues[question.id] !== "";
    });

    if (!allAnswered) {
      const form = formRef.current;
      form?.reportValidity();
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleGoBack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setCurrentPage((prev) => prev - 1);
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setLoading(true);

      const formData = new FormData(formRef.current!);
      const formValues = Object.fromEntries(formData);

      const responses = Object.keys(formValues).map((key) => {
        return {
          question_id: key,
          answer: formValues[key] as string | string[],
        };
      });

      const payload: CreateAnamnesisResponse = {
        form_id: id!,
        responses,
      };

      await medusaClient.client.request("POST", "/store/assignment", payload, undefined, {
        Authorization: `Bearer ${Cookies.get("_medusa_jwt")}`,
      });

      navigate("/success");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reorderSections = (sections: AnamnesisSection[]) => {
    return sections.sort((a, b) => a.order - b.order);
  };

  const reorderQuestions = (questions: AnamnesisQuestion[]) => {
    return questions.sort((a, b) => a.order - b.order);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    reorderSections,
    reorderQuestions,
    initializing,
    currentPage,
    totalPages,
    handleContinue,
    handleSubmit,
    handleGoBack,
    email,
    firstName,
    lastName,
    loading,
    handleCancel,
    formRef,
  };
};
