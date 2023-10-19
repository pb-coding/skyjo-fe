import { FC, ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  children: ReactNode;
};

const Button: FC<ButtonProps> = ({ variant, children, ...rest }) => {
  if (variant === "secondary") {
    return (
      <button
        className="text-white focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-3 py-2 mr-2 bg-gray-800 hover:bg-gray-700 focus:ring-gray-700 border-gray-700"
        {...rest}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 bg-lime-700 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
