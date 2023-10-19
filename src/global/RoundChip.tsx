import { FC } from "react";

type RoundChipProps = {
  description: string;
  children: React.ReactNode;
};

const RoundChip: FC<RoundChipProps> = ({ description, children }) => {
  return (
    <span className="inline-flex items-center justify-center w-12 h-12 ml-4 mt-4 text-sm font-semibold rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300">
      {children}
      <span className="sr-only">{description}</span>
    </span>
  );
};

export default RoundChip;
