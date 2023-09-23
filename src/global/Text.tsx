import { FC, ReactNode } from "react";

type TextNormalProps = {
  children: ReactNode;
};

const Text: FC<TextNormalProps> = ({ children }) => {
  return <p className="mb-2 text-sm font-medium text-white">{children}</p>;
};

export default Text;
