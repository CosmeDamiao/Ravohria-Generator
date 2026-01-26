import React, { useState } from "react";
import "./Drawer.css";
import { difficultiesConfig } from "../../pieces/difficulties";

export const Drawer = ({
  difficulty,
  onDifficultyChange,
  onGenerate,
  children,
  isEditingConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [canDragClose, setCanDragClose] = useState(false);

  const handleGenerate = () => {
    onGenerate();
    setIsOpen(false);
  };

  const handleDragStart = (clientY, target) => {
    setIsDragging(true);
    setDragStartY(clientY);
    setDragCurrentY(clientY);

    // Only allow drag-to-close if starting from handle area when open
    if (isOpen) {
      const handleArea = target.closest("[data-drag-handle]");
      setCanDragClose(!!handleArea);
    } else {
      setCanDragClose(true);
    }
  };

  const handleDragMove = (clientY) => {
    if (!isDragging) return;

    setDragCurrentY(clientY);
    const delta = clientY - dragStartY;

    if (isOpen && delta > 0 && canDragClose) {
      // Dragging down when open - translate down to close (only if started from handle)
      setDragOffset(delta);
    } else if (!isOpen && delta < 0) {
      // Dragging up when closed - expand drawer upward
      setDragOffset(delta);
      // Start showing content when dragging up (increased threshold for slower response)
      if (Math.abs(delta) > 60 && !isOpen) {
        setIsOpen(true);
      }
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const delta = dragCurrentY - dragStartY;
    const threshold = 100; // Minimum drag distance to trigger open/close (increased for slower swipe)

    // Determine if we should open or close
    if (isOpen && delta > threshold && canDragClose) {
      // Dragged down significantly while open -> close (only if started from handle)
      setIsOpen(false);
    } else if (!isOpen && delta < -threshold) {
      // Dragged up significantly while closed -> open
      setIsOpen(true);
    }

    // Reset offset and drag close permission
    setDragOffset(0);
    setCanDragClose(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(29, 0, 0, 0.14)",
            zIndex: 9998,
            transition: "opacity 0.3s ease",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: "#1d0000",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -4px 32px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxHeight: isOpen ? "80vh" : "auto",
          overflowY: isOpen ? "auto" : "visible",
          transition: isDragging
            ? "none"
            : "transform 0.3s ease, max-height 0.3s ease",
          transform:
            isOpen && dragOffset > 0
              ? `translateY(${dragOffset}px)`
              : "translateY(0)",
        }}
      >
        {/* Fixed Drag Handle - Sticky when drawer is open */}
        <div
          data-drag-handle
          style={{
            position: isOpen ? "sticky" : "relative",
            top: 0,
            display: "flex",
            justifyContent: "center",
            cursor: "grab",
            padding: "20px 0",
            touchAction: "none",
            zIndex: 10,
            backgroundColor: "#1d0000",
            borderRadius: "16px 16px 0 0",
          }}
          onMouseDown={(e) => handleDragStart(e.clientY, e.target)}
          onMouseMove={(e) => handleDragMove(e.clientY)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY, e.target)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
        >
          <div
            style={{
              width: "40px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: "#969696",
            }}
          />
        </div>

        <div
          style={{
            padding: "20px",
            paddingTop: "0",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Difficulty Selector - Always Visible */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#f74b38",
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
                border: "2px solid #8B2323",
                backgroundColor: "#3D1515",
                color: "#fff",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s ease",
              }}
            >
              {Object.entries(difficultiesConfig).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button - Always Visible */}
          <button
            onClick={handleGenerate}
            disabled={isEditingConfig}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
              backgroundColor: isEditingConfig ? "#c5250c" : "#a51707",
              border: "none",
              borderRadius: "8px",
              cursor: isEditingConfig ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: isEditingConfig
                ? "none"
                : "0 2px 8px rgba(255, 107, 91, 0.3)",
              opacity: isEditingConfig ? 0.6 : 1,
            }}
          >
            GENERATE
          </button>

          {/* Collapsible Content - Only visible when open */}
          {isOpen && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingTop: "8px",
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                animation: "slideIn 0.3s ease",
              }}
            >
              {React.Children.map(children, (child) =>
                React.cloneElement(child, { forceExpanded: isOpen })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
