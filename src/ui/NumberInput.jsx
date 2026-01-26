import React from "react";

export const NumberInput = ({ label, value, onChange, readOnly, validate }) => {
  const isInvalid = validate ? !validate(value) : value === "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontSize: "13px",
          fontWeight: "500",
          color: "#555",
          textTransform: "capitalize",
        }}
      >
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          // Allow empty string or convert to number
          onChange(val === "" ? "" : Number(val));
        }}
        readOnly={readOnly}
        style={{
          padding: "8px 10px",
          fontSize: "14px",
          borderRadius: "6px",
          border: `1px solid ${isInvalid ? "#ff6b6b" : "#e0e0e0"}`,
          backgroundColor: readOnly ? "#f5f5f5" : "#fff",
          cursor: readOnly ? "default" : "text",
          outline: "none",
          transition: "all 0.2s ease",
          color: readOnly ? "#666" : "#1a1a1a",
        }}
        onFocus={(e) => {
          if (!readOnly) e.target.style.borderColor = "#4CAF50";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = isInvalid ? "#ff6b6b" : "#e0e0e0";
        }}
      />
    </div>
  );
};
