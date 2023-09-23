import { FC, ReactNode, HTMLProps } from "react";

type TextNormalProps = HTMLProps<HTMLParagraphElement> & {
  children: ReactNode;
};

const Text: FC<TextNormalProps> = ({ children, ...rest }) => {
  return (
    <p className="text-sm font-medium text-white" {...rest}>
      {children}
    </p>
  );
};

export default Text;
