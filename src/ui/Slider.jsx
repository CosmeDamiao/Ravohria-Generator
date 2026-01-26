import React from "react";

export const Slider = ({
  label,
  value,
  onChange,
  readOnly,
  min = 0,
  max = 1,
  step = 0.05,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
        <span
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#4CAF50",
            backgroundColor: "#f0f9f0",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={readOnly}
        style={{
          width: "100%",
          height: "6px",
          borderRadius: "3px",
          outline: "none",
          cursor: readOnly ? "default" : "pointer",
          opacity: readOnly ? 0.6 : 1,
          accentColor: "#4CAF50",
        }}
      />
    </div>
  );
};
