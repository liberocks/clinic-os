import Button from "../../components/button";
import { ProtectedPage } from "../../components/protected-page";
import { ShowIf } from "../../components/show-if";
import Spin from "../../components/spin";
import { AnamnesisQuestionType } from "../../types/anamnesis";
import cx from "../../utils/cx";
import { useLogic } from "./use-logic";

export const FormPage = () => {
  const {
    initializing,
    loading,
    data,
    currentPage,
    totalPages,
    handleContinue,
    handleSubmit,
    handleGoBack,
    email,
    firstName,
    handleCancel,
    lastName,
    reorderQuestions,
    formRef,
    reorderSections,
  } = useLogic();

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
          <ShowIf condition={initializing}>
            <div className="min-h-[80vh] flex flex-col items-center my-6 space-y-2 rounded-md    w-full justify-center">
              <Spin className="text-emerald-600" />
            </div>
          </ShowIf>

          <ShowIf condition={!initializing}>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-y-2xsmall">
                <h2 className="text-lg font-semibold">{data?.title}</h2>
                <p className="text-gray-500 ">{data?.description}</p>

                <p className="mt-4 text-sm text-gray-700">
                  You are filling this form as{" "}
                  <span className="font-medium text-emerald-500">
                    {`${firstName} ${lastName}`} ({email})
                  </span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} ref={formRef}>
              <div className="flex flex-col space-y-4">
                {reorderSections(data?.sections ?? []).map((section, index) => {
                  return (
                    <div
                      className={cx(
                        "flex flex-col justify-between w-full px-5 pt-5 pb-10 mt-5 text-sm bg-white border rounded-md",
                        index + 1 === currentPage ? "block" : "hidden",
                      )}
                      key={section.title}
                    >
                      <div className="flex flex-col gap-y-2xsmall">
                        <p className="mb-4 text-xs text-gray-500">
                          Section {index + 1}/{totalPages}
                        </p>
                        <h2 className="font-medium text-emerald-500">{section?.title}</h2>
                        <p className="text-gray-500 ">{section?.description}</p>
                      </div>

                      <div className="flex flex-col mt-5 space-y-10">
                        {reorderQuestions(section?.questions ?? []).map((question) => {
                          return (
                            <div className="flex flex-col gap-y-2xsmall" key={question.question_text}>
                              <h2 className="mb-4 font-medium">{question?.question_text}</h2>

                              {/* SHORT ANSWER */}
                              <ShowIf condition={question?.question_type === AnamnesisQuestionType.SHORT_ANSWER}>
                                <p className="mb-4 -mt-4 text-sm font-light text-gray-400">Write your answer shortly</p>
                                <input
                                  type="text"
                                  className="w-full p-5 bg-transparent border rounded-md inter-large-regular border-emerald-700 outline-1 outline-emerald-700"
                                  placeholder="Answer goes here"
                                  maxLength={128}
                                  name={question?.id}
                                  required
                                />
                              </ShowIf>

                              {/* LONG ANSWER */}
                              <ShowIf condition={question?.question_type === AnamnesisQuestionType.LONG_ANSWER}>
                                <p className="mb-4 -mt-4 text-sm font-light text-gray-400">
                                  Write down your answers (max. 600 characters)
                                </p>
                                <textarea
                                  className="w-full p-5 break-words bg-transparent border rounded-md inter-large-regular text-grey-500 text-wrap border-emerald-700 outline-1 outline-emerald-700"
                                  placeholder="Answer goes here"
                                  maxLength={600}
                                  name={question?.id}
                                  required
                                />
                              </ShowIf>

                              {/* DATE */}
                              <ShowIf condition={question?.question_type === AnamnesisQuestionType.DATE}>
                                <p className="mb-4 -mt-4 text-sm font-light text-gray-400">Choose the date</p>
                                <input
                                  type="date"
                                  className="w-full p-5 bg-transparent border rounded-md inter-large-regular text-grey-500 border-emerald-700 outline-1 outline-emerald-700"
                                  name={question?.id}
                                  required
                                />
                              </ShowIf>

                              {/* DATE TIME */}
                              <ShowIf condition={question?.question_type === AnamnesisQuestionType.DATE_TIME}>
                                <p className="mb-4 -mt-4 text-sm font-light text-gray-400">
                                  Choose the date and the time
                                </p>
                                <input
                                  type="datetime-local"
                                  className="w-full p-5 bg-transparent border rounded-md inter-large-regular text-grey-500 border-emerald-700 outline-1 outline-emerald-700"
                                  name={question?.id}
                                  required
                                />
                              </ShowIf>

                              {/* TIME */}
                              <ShowIf condition={question?.question_type === AnamnesisQuestionType.TIME}>
                                <p className="mb-4 -mt-4 text-sm font-light text-gray-400">Choose the time</p>
                                <input
                                  type="time"
                                  className="w-full p-5 bg-transparent border rounded-md inter-large-regular text-grey-500 border-emerald-700 outline-1 outline-emerald-700"
                                  name={question?.id}
                                  required
                                />
                              </ShowIf>

                              {/* MULTIPLE CHOICE */}
                              <ShowIf condition={question?.question_type === AnamnesisQuestionType.MULTIPLE_CHOICE}>
                                <p className="mb-4 -mt-4 text-sm font-light text-gray-400">
                                  You can choose mutiple answers or left it blank if there is no right answer
                                </p>
                                <div className="flex flex-col w-full text-gray-700 gap-y-2">
                                  {question?.options?.map((option) => {
                                    return (
                                      <label key={`${question?.id}-item`} className="flex flex-row items-center ">
                                        <input
                                          name={question?.id}
                                          type="checkbox"
                                          className="mr-4 font-semibold text-center border rounded-md accent-emerald-600 size-6 border-emerald-700 hover:border-emerald-90 text-emerald-700"
                                        />

                                        {option.label}
                                      </label>
                                    );
                                  })}
                                </div>
                              </ShowIf>

                              {/* SELECT */}
                              <ShowIf condition={question?.question_type === AnamnesisQuestionType.SELECT}>
                                <p className="mb-4 -mt-4 text-sm font-light text-gray-400">
                                  Choose one that feels right for you
                                </p>
                                <div className="flex flex-col w-full text-gray-700 gap-y-2 radio-group">
                                  {question?.options?.map((option) => {
                                    return (
                                      <label
                                        key={`${question?.id}-item`}
                                        className="flex flex-row items-center space-x-2 w-fit"
                                      >
                                        <input
                                          type="radio"
                                          className="flex-grow px-2 py-2 mr-4 bg-transparent outline-none size-5 accent-emerald-600"
                                          value={option.value}
                                          name={question?.id}
                                          required
                                        />
                                        {option.label}
                                      </label>
                                    );
                                  })}
                                </div>
                              </ShowIf>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-row items-center justify-between w-full px-1 mt-5">
                <div className="w-fit">
                  <Button variant="danger" onClick={handleCancel} disabled={loading}>
                    Abort
                  </Button>
                </div>

                <div className="flex flex-row space-x-2">
                  <ShowIf condition={currentPage !== 1}>
                    <div className="w-fit">
                      <Button variant="secondary" onClick={handleGoBack} disabled={loading}>
                        Go back
                      </Button>
                    </div>
                  </ShowIf>

                  <ShowIf condition={currentPage !== totalPages && currentPage < totalPages}>
                    <div className="w-fit">
                      <Button onClick={handleContinue} disabled={loading}>
                        Continue
                      </Button>
                    </div>
                  </ShowIf>

                  <ShowIf condition={currentPage === totalPages}>
                    <div className="w-fit">
                      <Button type="submit" loading={loading}>
                        Submit
                      </Button>
                    </div>
                  </ShowIf>
                </div>
              </div>
            </form>
          </ShowIf>
        </div>
      </div>
    </ProtectedPage>
  );
};

export default FormPage;
