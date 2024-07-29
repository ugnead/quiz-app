import React from "react";

interface Option {
  id: string;
  name: string;
}

interface OptionsListProps {
  options: Option[];
  selectedOption?: string | null;
  correctAnswer?: string;
  onSelectOption?: (optionId: string) => void;
  showExplanation?: boolean;
}

const OptionsList: React.FC<OptionsListProps> = ({
  options,
  selectedOption,
  correctAnswer,
  onSelectOption,
  showExplanation,
}) => {
  const getOptionClass = (optionId: string) => {
    if (!showExplanation) return "w-full";
    if (optionId === correctAnswer) return "w-full bg-green-500 text-white";
    if (optionId === selectedOption) return "w-full bg-red-500 text-white";
    return "w-full";
  };

  return (
    <ul className="flex flex-col space-y-4">
      {options.map((option) => (
        <li key={option.id}>
          <button
            className={getOptionClass(option.id)}
            onClick={() => onSelectOption && onSelectOption(option.id)}
            disabled={showExplanation}
          >
            {option.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default OptionsList;
