import { FC, ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const Button: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button
      className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
