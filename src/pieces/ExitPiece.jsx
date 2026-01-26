import React from "react";
import { BP_SHIFT_VERTICAL, EXIT_SHIFT_VERTICAL } from "./constants";
import { calculateExitLeft, calculateTop } from "../helpers";

export const ExitPiece = ({
  imgUrl,
  alt,
  l,
  c,
  isDesktop,
  previousBoardPiece,
}) => {
  const left = calculateExitLeft(previousBoardPiece, l, c, isDesktop);
  const top =
    calculateTop(12, isDesktop, BP_SHIFT_VERTICAL) + EXIT_SHIFT_VERTICAL;
  return (
    <div
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 1,
      }}
    >
      <img src={imgUrl} alt={alt} />
    </div>
  );
};
