import React, { useState } from "react";

export const AboutMe = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

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
          borderBottom: isCollapsed ? "none" : "1px solid #710000",
          cursor: "pointer",
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "18px",
              transition: "transform 0.2s ease",
              color: "#929292",
              transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#929292",
              margin: 0,
            }}
          >
            About the Generator
          </h3>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "8px 0",
            color: "#7d7d7d",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          <p style={{ margin: 0 }}>
            This is a board generator application that creates custom game
            boards for Ravohria with different difficulty levels.
          </p>
          <p style={{ margin: 0 }}>
            Select a difficulty level and click "Generate" to create a new board
            configuration.
          </p>
          <p style={{ margin: 0 }}>
            Each difficulty level has unique parameters that affect the board
            layout, including tower positions, blockade placement, and path
            complexity.
          </p>
          <p style={{ margin: 0 }}>
            Made by{" "}
            <a
              href="https://www.linkedin.com/in/sebastiao-rmvm"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#258cf4",
                textDecoration: "none",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = "none";
              }}
            >
              Sebastião Maya
            </a>
          </p>
        </div>
      )}
    </div>
  );
};
