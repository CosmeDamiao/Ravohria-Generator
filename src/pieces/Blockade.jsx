import React from "react";
import blockade from "../imagens/blockade.png";
import { BLOCKADE_SHIFT_HORIZONTAL } from "./constants";

export const Blockade = ({ l, position }) => {
  return (
    <div
      key={`blockade_${l}_${position}`}
      style={{
        position: "absolute",
        right: `${position * BLOCKADE_SHIFT_HORIZONTAL}px`,
        zIndex: 2,
      }}
    >
      <img src={blockade} alt={`blockade_${l}_${position}_alt`} />
    </div>
  );
};
