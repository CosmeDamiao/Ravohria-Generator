import React, { useMemo } from "react";
import {
  BP_SHIFT_VERTICAL,
  BP_SHIFT_HORIZONTAL_TRINCA,
  SIDE_PIECE_SHIFT_LEFT,
  SIDE_PIECE_SHIFT_LEFT_MOBILE,
} from "./constants";
import { calculateTop, calculateLeft } from "../helpers";

export const SidePiece = ({ imgUrl, alt, l, isDesktop, boardPieces }) => {
  const shiftLeft = isDesktop
    ? SIDE_PIECE_SHIFT_LEFT
    : SIDE_PIECE_SHIFT_LEFT_MOBILE;
  const top = useMemo(() => {
    // Calculate position for line below (l-1) to place at bottom of line l
    return calculateTop(l - 1, isDesktop, BP_SHIFT_VERTICAL);
  }, [isDesktop, l]);

  // Calculate the furthest left position in boardPieces and subtract 100px
  const left = useMemo(() => {
    if (!boardPieces || boardPieces.length === 0) {
      return isDesktop ? 3500 : 0;
    }

    let minLeft = Infinity;
    for (let i = 0; i < boardPieces.length; i++) {
      const piece = boardPieces[i];
      const previousPiece = i > 0 ? boardPieces[i - 1] : null;
      const pieceLeft = calculateLeft(
        previousPiece,
        piece.l,
        piece.c,
        isDesktop,
        BP_SHIFT_HORIZONTAL_TRINCA
      );
      if (pieceLeft < minLeft) {
        minLeft = pieceLeft;
      }
    }

    return minLeft - shiftLeft;
  }, [boardPieces, isDesktop, shiftLeft]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 1,
      }}
    >
      <img src={imgUrl} alt={alt} style={{ height: "580px", width: "auto" }} />
    </div>
  );
};
