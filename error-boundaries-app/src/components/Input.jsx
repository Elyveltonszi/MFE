import React from "react";
import "./Input.css";

const Input = ({ label, type = "text", value, onChange, placeholder, required = false }) => {
  return (
    <div className="shared-input-group">
      {label && <label className="shared-input-label">{label}</label>}
      <input
        className="shared-input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default Input;
