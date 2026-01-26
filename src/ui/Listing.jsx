import React, { useState } from "react";
import { NumberInput } from "./NumberInput";
import { Slider } from "./Slider";
import { Toggle } from "./Toggle";
import { ObjectInput } from "./ObjectInput";

export const Listing = ({
  difficulty,
  config,
  onConfigChange,
  onEditingChange,
  forceExpanded = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Update local config when config prop changes (e.g., difficulty changes)
  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  // Handle force expanded prop
  React.useEffect(() => {
    if (forceExpanded) {
      setIsCollapsed(false);
    }
  }, [forceExpanded]);

  // Notify parent when editing state changes
  React.useEffect(() => {
    if (onEditingChange) {
      onEditingChange(isEditing);
    }
  }, [isEditing, onEditingChange]);

  const handleLocalConfigUpdate = (key, value) => {
    setLocalConfig({ ...localConfig, [key]: value });
  };

  const validateConfig = (cfg) => {
    for (const [key, value] of Object.entries(cfg)) {
      if (key === "name") continue;

      // Check if it's a nested object (like singlePathConstraints)
      if (typeof value === "object" && !Array.isArray(value)) {
        let minOccurrences = null;
        let maxOccurrences = null;

        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          // Empty string is invalid, but 0 is valid
          if (nestedValue === "") {
            return false;
          }
          // Check if it's a valid number (including 0)
          const numValue =
            typeof nestedValue === "number" ? nestedValue : Number(nestedValue);
          if (isNaN(numValue)) {
            return false;
          }
          // Special validation for minOccurrences: must be >= 1
          if (nestedKey === "minOccurrences") {
            if (numValue < 1) return false;
            minOccurrences = numValue;
          }
          if (nestedKey === "maxOccurrences") {
            maxOccurrences = numValue;
          }
        }

        // Check minOccurrences <= maxOccurrences
        if (minOccurrences !== null && maxOccurrences !== null) {
          if (minOccurrences > maxOccurrences) {
            return false;
          }
        }
      }
      // Check primitive values that should be numbers
      else if (
        key === "shift" ||
        key === "guaranteeSafeStartLines" ||
        key === "towerVerticalShift"
      ) {
        // Empty string is invalid, but 0 is valid
        if (value === "") {
          return false;
        }
        // Check if it's a valid number (including 0)
        const numValue = typeof value === "number" ? value : Number(value);
        if (isNaN(numValue)) {
          return false;
        }
        // Special validation for towerVerticalShift: must be 0-2
        if (key === "towerVerticalShift" && (numValue < 0 || numValue > 2)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleDoneClick = () => {
    if (isEditing) {
      // Apply changes when clicking Done
      if (validateConfig(localConfig) && onConfigChange) {
        onConfigChange(difficulty, localConfig);
        setIsEditing(false);
        setIsCollapsed(true);
      }
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  const isValid = validateConfig(localConfig);

  const renderConfigInput = (key, value) => {
    // Skip rendering the name field as it's displayed in the header
    if (key === "name") return null;

    // Number inputs for integer values
    if (
      key === "shift" ||
      key === "guaranteeSafeStartLines" ||
      key === "towerVerticalShift"
    ) {
      // Custom validation for towerVerticalShift
      const validate =
        key === "towerVerticalShift"
          ? (val) => {
              if (val === "") return false;
              const numVal = typeof val === "number" ? val : Number(val);
              return !isNaN(numVal) && numVal >= 0 && numVal <= 2;
            }
          : undefined;

      return (
        <NumberInput
          key={key}
          label={key.replace(/([A-Z])/g, " $1").trim()}
          value={value}
          onChange={(newValue) => handleLocalConfigUpdate(key, newValue)}
          readOnly={!isEditing}
          validate={validate}
        />
      );
    }

    // Sliders for probability/chance values (0-1 range)
    if (
      key === "blockadesInSinglePathChance" ||
      key === "blockadeStartBias" ||
      key === "nonAdjacentBlockadesBias"
    ) {
      return (
        <Slider
          key={key}
          label={key.replace(/([A-Z])/g, " $1").trim()}
          value={value}
          onChange={(newValue) => handleLocalConfigUpdate(key, newValue)}
          readOnly={!isEditing}
          min={0}
          max={1}
        />
      );
    }

    // Toggle for boolean values
    if (key === "areBlockadesRestrictedToChaos") {
      return (
        <Toggle
          key={key}
          label={key.replace(/([A-Z])/g, " $1").trim()}
          value={value}
          onChange={(newValue) => handleLocalConfigUpdate(key, newValue)}
          readOnly={!isEditing}
        />
      );
    }

    // Object input for nested objects
    if (typeof value === "object" && !Array.isArray(value)) {
      return (
        <ObjectInput
          key={key}
          label={key.replace(/([A-Z])/g, " $1").trim()}
          value={value}
          onChange={(newValue) => handleLocalConfigUpdate(key, newValue)}
          readOnly={!isEditing}
        />
      );
    }

    return null;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
      }}
    >
      {/* Header with Collapse Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: isCollapsed ? "0" : "8px",
          borderBottom: isCollapsed ? "none" : "1px solid #e0e0e0",
          cursor: isEditing ? "default" : "pointer",
        }}
        onClick={() => {
          if (!isEditing) {
            setIsCollapsed(!isCollapsed);
          }
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "18px",
              transition: "transform 0.2s ease",
              transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#333",
              margin: 0,
            }}
          >
            Configuration
          </h3>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <>
          {/* Edit Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "-4px",
            }}
          >
            <button
              onClick={handleDoneClick}
              disabled={isEditing && !isValid}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "600",
                color: isEditing ? "#fff" : "#4CAF50",
                backgroundColor: isEditing
                  ? isValid
                    ? "#4CAF50"
                    : "#ccc"
                  : "transparent",
                border: `1px solid ${
                  isEditing ? (isValid ? "#4CAF50" : "#ccc") : "#4CAF50"
                }`,
                borderRadius: "6px",
                cursor: isEditing && !isValid ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: isEditing && !isValid ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isEditing && isValid) {
                  e.target.style.backgroundColor = "#f0f9f0";
                }
              }}
              onMouseLeave={(e) => {
                if (!isEditing) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>

          {/* Config Inputs */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {Object.entries(localConfig).map(([key, value]) =>
              renderConfigInput(key, value)
            )}
          </div>
        </>
      )}
    </div>
  );
};
