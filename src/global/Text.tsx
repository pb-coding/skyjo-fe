import { FC, ReactNode } from "react";

type TextNormalProps = {
  children: ReactNode;
};

const Text: FC<TextNormalProps> = ({ children }) => {
  return <p className="text-white">{children}</p>;
};

export default Text;
