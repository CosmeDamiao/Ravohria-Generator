import React from "react";
import { NumberInput } from "./NumberInput";

export const ObjectInput = ({ label, value, onChange, readOnly }) => {
  const handlePropertyChange = (key, newValue) => {
    onChange({ ...value, [key]: newValue });
  };

  // Validation function for minOccurrences: must be >= 1 and <= maxOccurrences
  // Validation function for maxOccurrences: must be >= minOccurrences
  const getValidationFunction = (key) => {
    if (key === "minOccurrences") {
      return (val) => {
        if (val === "") return false;
        const numVal = typeof val === "number" ? val : Number(val);
        if (isNaN(numVal) || numVal < 1) return false;

        // Check against maxOccurrences
        const maxOccurrences = value.maxOccurrences;
        if (maxOccurrences !== "" && maxOccurrences !== undefined) {
          const maxNum =
            typeof maxOccurrences === "number"
              ? maxOccurrences
              : Number(maxOccurrences);
          if (!isNaN(maxNum) && numVal > maxNum) return false;
        }
        return true;
      };
    }
    if (key === "maxOccurrences") {
      return (val) => {
        if (val === "") return false;
        const numVal = typeof val === "number" ? val : Number(val);
        if (isNaN(numVal)) return false;

        // Check against minOccurrences
        const minOccurrences = value.minOccurrences;
        if (minOccurrences !== "" && minOccurrences !== undefined) {
          const minNum =
            typeof minOccurrences === "number"
              ? minOccurrences
              : Number(minOccurrences);
          if (!isNaN(minNum) && minNum >= 1 && numVal < minNum) return false;
        }
        return true;
      };
    }
    return undefined; // Use default validation
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "12px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
      }}
    >
      <label
        style={{
          fontSize: "13px",
          fontWeight: "600",
          color: "#333",
          textTransform: "capitalize",
          marginBottom: "4px",
        }}
      >
        {label}
      </label>
      {Object.entries(value).map(([key, val]) => (
        <NumberInput
          key={key}
          label={key.replace(/([A-Z])/g, " $1").trim()}
          value={val}
          onChange={(newValue) => handlePropertyChange(key, newValue)}
          readOnly={readOnly}
          validate={getValidationFunction(key)}
        />
      ))}
    </div>
  );
};
