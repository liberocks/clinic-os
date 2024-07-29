import type React from "react";

import DateIcon from "../../../../components/shared/icons/date";
import DateTimeIcon from "../../../../components/shared/icons/date-time";
import LongTextIcon from "../../../../components/shared/icons/long-text";
import MultipleChoiceIcon from "../../../../components/shared/icons/multiple-choice";
import SelectIcon from "../../../../components/shared/icons/select";
import ShortTextIcon from "../../../../components/shared/icons/short-text";
import TimeIcon from "../../../../components/shared/icons/time";
import { AnamnesisQuestionType } from "../../../../types/anamnesis";

interface ToolbarProps {
  onAddQuestion: (type: AnamnesisQuestionType) => void;
}

const ToolButton: React.FC<{
  icon: React.FC;
  tooltip: string;
  onClick: () => void;
}> = ({ icon, tooltip, onClick }) => {
  return (
    <div className="relative flex justify-center m-2 group">
      <button
        type="button"
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:bg-gray-300"
        onClick={onClick}
      >
        {icon({ size: 18 })}
      </button>
      <span className="absolute p-2 text-xs text-white scale-0 bg-gray-600 rounded min-w-[175px] text-center top-10 group-hover:scale-100">
        {tooltip}
      </span>
    </div>
  );
};

export const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onAddQuestion } = props;

  const tools = [
    {
      type: AnamnesisQuestionType.SHORT_ANSWER,
      icon: ShortTextIcon,
      tooltipText: "Add short text question",
    },
    {
      type: AnamnesisQuestionType.LONG_ANSWER,
      icon: LongTextIcon,
      tooltipText: "Add long text question",
    },
    {
      type: AnamnesisQuestionType.DATE_TIME,
      icon: DateTimeIcon,
      tooltipText: "Add date and time question",
    },
    {
      type: AnamnesisQuestionType.DATE,
      icon: DateIcon,
      tooltipText: "Add date question",
    },
    {
      type: AnamnesisQuestionType.TIME,
      icon: TimeIcon,
      tooltipText: "Add time question",
    },
    {
      type: AnamnesisQuestionType.MULTIPLE_CHOICE,
      icon: MultipleChoiceIcon,
      tooltipText: "Add multiple choice",
    },
    {
      type: AnamnesisQuestionType.SELECT,
      icon: SelectIcon,
      tooltipText: "Add selection question",
    },
  ];

  return (
    <div className="flex flex-col items-center px-4 py-2 mx-auto space-x-4 bg-white h-fit w-fit">
      <div className="flex flex-row space-x-2">
        {tools.map((tool) => (
          <ToolButton
            key={tool.type}
            icon={tool.icon}
            tooltip={tool.tooltipText}
            onClick={() => onAddQuestion(tool.type)}
          />
        ))}
      </div>
      <p className="text-xs text-center w-fit inter-base-regular text-grey-50">
        Click icon above to add new question
        <br />
        You can also drag and drop the question within a section or between sections
      </p>
    </div>
  );
};

export default Toolbar;
