import { Icon } from "../UI/Icon";
import React from "react";

type ButtonProps = {
  type?: "submit" | "reset" | "button"; // button type
  variant?: "primary" | "secondary" | "green" | "blue"; // color variant
  onClick?: () => void; // click handler
  text?: string; // text label
  children?: React.ReactNode; // optional children (icons, JSX)
  disabled?: boolean; // disabled state
};

export const FormButton: React.FC<ButtonProps> = ({
  type = "button",
  text,
  variant = "primary",
  onClick,
  disabled = false,
  children,
}) => {
  const colors = {
    primary: "bg-gray-900 text-gray-100 hover:bg-gray-950 focus:ring-gray-700 rounded-md",
    secondary:
      "bg-transparent text-blue-600 hover:bg-blue-200 focus:ring-blue-400 rounded-full",
    green: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 rounded-md",
    blue: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 rounded-md",
  };

  return (
    <button
      type={type}
      className={`${colors[variant]} ${
        disabled ? "opacity-80 cursor-not-allowed" : "cursor-pointer"
      } text-md font-semibold duration-400 text-base px-4 py-2 flex items-center justify-center gap-2 focus:ring-2 w-full`}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? (
        <Icon name="Loader" size={20} className="animate-spin" />
      ) : children ? (
        children
      ) : (
        text
      )}
    </button>
  );
};
// Note: This button is used in forms and other places where a button is needed.