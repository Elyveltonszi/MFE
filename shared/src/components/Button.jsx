import React from "react";
import "./Button.css";

const Button = ({ children, onClick, variant = "primary", disabled = false }) => {
  return (
    <button
      className={`shared-btn shared-btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
