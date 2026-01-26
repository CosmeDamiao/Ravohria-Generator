import React from "react";
import { difficultiesConfig } from "../pieces/difficulties";

export const Menu = ({
  difficulty,
  onDifficultyChange,
  onGenerate,
  children,
  isEditingConfig,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "auto",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        minWidth: "300px",
        maxHeight: "calc(100vh - 40px)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "4px",
          }}
        >
          Board Generator
        </div>

        {/* Difficulty Selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#666",
            }}
          >
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(Number(e.target.value))}
            style={{
              padding: "10px 12px",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              backgroundColor: "#fff",
              cursor: "pointer",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#4CAF50";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#e0e0e0";
            }}
          >
            {Object.entries(difficultiesConfig).map(([value, config]) => (
              <option key={value} value={value}>
                {config.name}
              </option>
            ))}
          </select>
        </div>

        {/* Children - where ConfigListing will be rendered */}
        {children}

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={isEditingConfig}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#fff",
            backgroundColor: isEditingConfig ? "#ccc" : "#4CAF50",
            border: "none",
            borderRadius: "8px",
            cursor: isEditingConfig ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow: isEditingConfig ? "none" : "0 2px 8px rgba(76, 175, 80, 0.3)",
            opacity: isEditingConfig ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isEditingConfig) {
              e.target.style.backgroundColor = "#45a049";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isEditingConfig) {
              e.target.style.backgroundColor = "#4CAF50";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(76, 175, 80, 0.3)";
            }
          }}
          onMouseDown={(e) => {
            if (!isEditingConfig) {
              e.target.style.transform = "translateY(0)";
            }
          }}
        >
          Generate
        </button>
      </div>
    </div>
  );
};
