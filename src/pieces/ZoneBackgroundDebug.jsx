import React, { useMemo } from "react";
import {
  BP_SHIFT_VERTICAL,
  BP_SHIFT_HORIZONTAL_TRINCA,
  BP_SHIFT_HORIZONTAL,
} from "./constants";
import { calculateTop, calculateLeft } from "../helpers";

export const ZoneBackgroundDebug = ({
  l,
  c,
  size,
  isDesktop,
  previousBoardPiece,
}) => {
  // Determine zone for this piece
  const zone = useMemo(() => {
    if (l >= 0 && l <= 4) return 1;
    if (l >= 5 && l <= 8) return 2;
    if (l >= 9 && l <= 11) return 3;
    return 1;
  }, [l]);

  // Get zone background color
  const getZoneBackgroundColor = (zone) => {
    const colors = {
      1: "rgba(255, 100, 100, 0.5)", // Red-ish
      2: "rgba(100, 255, 100, 0.5)", // Green-ish
      3: "rgba(100, 100, 255, 0.5)", // Blue-ish
    };
    return colors[zone] || "transparent";
  };

  const left = useMemo(() => {
    return calculateLeft(
      previousBoardPiece,
      l,
      c,
      isDesktop,
      BP_SHIFT_HORIZONTAL_TRINCA
    );
  }, [previousBoardPiece, l, c, isDesktop]);

  const top = useMemo(() => {
    return calculateTop(l, isDesktop, BP_SHIFT_VERTICAL);
  }, [isDesktop, l]);

  // Calculate width based on piece size
  const width = useMemo(() => {
    return size * BP_SHIFT_HORIZONTAL + BP_SHIFT_HORIZONTAL_TRINCA + 200; // +200 for 100px extension on each side
  }, [size]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${left - 100}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${BP_SHIFT_VERTICAL + 200}px`,
        backgroundColor: getZoneBackgroundColor(zone),
        pointerEvents: "none",
      }}
    />
  );
};
