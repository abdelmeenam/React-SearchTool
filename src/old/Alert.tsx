import React from "react";

interface AlertProps {
  message: string;
  type: "success" | "error";
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const role = type === "error" ? "alert" : undefined;
  const ariaLive = type === "error" ? "assertive" : "polite";

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`mt-4 p-4 rounded-lg ${
        type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {message}
    </div>
  );
};

export default Alert;
