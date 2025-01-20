import React from "react";
import Button from "./Button";
import { v4 as uuidv4 } from "uuid";

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
    if (!showExplanation) return "secondary";
    if (optionId === correctAnswer) return "success";
    if (optionId === selectedOption) return "danger";
    return "secondary";
  };

  return (
    <ul className="flex flex-col space-y-4">
      {options.map((option) => (
        <li key={uuidv4()}>
          <Button
            variant={getOptionClass(option.id)}
            onClick={() => onSelectOption && onSelectOption(option.id)}
            disabled={showExplanation}
            fullWidth
            enableFocusRing
          >
            {option.name}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default OptionsList;
