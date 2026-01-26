import React, { useMemo } from "react";

export const OverflowedCoresDebug = ({ cores }) => {
  // Get overflow cores for this piece
  const overflowCores = useMemo(() => {
    if (!cores) return [];
    const overflow = [];

    // Handle both Map and plain object
    if (cores instanceof Map) {
      for (const [position, core] of cores.entries()) {
        if (core && core.isOverflow) {
          overflow.push({ position, type: core.type });
        }
      }
    } else if (typeof cores === "object") {
      // If cores is a plain object
      for (const [position, core] of Object.entries(cores)) {
        if (core && core.isOverflow) {
          overflow.push({ position, type: core.type });
        }
      }
    }

    // Sort by position
    overflow.sort((a, b) => a.position - b.position);

    return overflow;
  }, [cores]);

  if (overflowCores.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: "calc(100% + 20px)",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(255, 255, 0, 0.8)",
        color: "black",
        paddingTop: "12px",
        paddingBottom: "12px",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderRadius: "4px",
        fontWeight: "bold",
        border: "3px solid #ff6b00",
        zIndex: 10,
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        fontSize: "80px",
        whiteSpace: "nowrap",
      }}
    >
      {overflowCores
        .map(({ position, type }) => `Pos ${position + 1}: ${type}`)
        .join(", ")}
    </div>
  );
};
