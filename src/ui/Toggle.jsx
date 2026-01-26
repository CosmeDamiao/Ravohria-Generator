import React from "react";

export const Toggle = ({ label, value, onChange, readOnly }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
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
      <div
        onClick={() => {
          if (!readOnly) onChange(!value);
        }}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "12px",
          backgroundColor: value ? "#4CAF50" : "#ccc",
          position: "relative",
          cursor: readOnly ? "default" : "pointer",
          transition: "background-color 0.2s ease",
          opacity: readOnly ? 0.6 : 1,
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            position: "absolute",
            top: "3px",
            left: value ? "23px" : "3px",
            transition: "left 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </div>
  );
};
