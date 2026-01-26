import {
  BOARD_BOTTOM_DESKTOP_PX,
  BOARD_BOTTOM_MOBILE_PX,
  BP_SHIFT_HORIZONTAL,
  BOARD_CENTER_DESKTOP_PX,
  BOARD_CENTER_MOBILE_PX,
  BP_SHIFT_HORIZONTAL_TRINCA,
  EXIT_SHIFT_HORIZONTAL_TRINCA,
} from "./pieces/constants";

export const calculateExitLeft = (previousBoardPiece, l, c, isDesktop) => {
  const prevShiftH =
    previousBoardPiece.c * BP_SHIFT_HORIZONTAL +
    (l - 1) * BP_SHIFT_HORIZONTAL_TRINCA;
  const prevLeft = isDesktop
    ? BOARD_CENTER_DESKTOP_PX + prevShiftH
    : BOARD_CENTER_MOBILE_PX + prevShiftH;

  const columnDiff = c - previousBoardPiece.c;

  const exitLeft =
    prevLeft - EXIT_SHIFT_HORIZONTAL_TRINCA + columnDiff * BP_SHIFT_HORIZONTAL;

  return exitLeft;
};

export const calculateLeft = (
  previousBoardPiece,
  l,
  c,
  isDesktop,
  trincaShift
) => {
  if (previousBoardPiece) {
    // Calculate previous piece's left position
    const prevShiftH =
      previousBoardPiece.c * BP_SHIFT_HORIZONTAL + (l - 1) * trincaShift;
    const prevLeft = isDesktop
      ? BOARD_CENTER_DESKTOP_PX + prevShiftH
      : BOARD_CENTER_MOBILE_PX + prevShiftH;

    // Calculate current piece's position relative to previous piece
    const columnDiff = c - previousBoardPiece.c;
    const horizontalShift = columnDiff * BP_SHIFT_HORIZONTAL + trincaShift;

    return prevLeft + horizontalShift;
  } else {
    const shiftH = c * BP_SHIFT_HORIZONTAL + l * trincaShift;
    return isDesktop
      ? BOARD_CENTER_DESKTOP_PX + shiftH
      : BOARD_CENTER_MOBILE_PX + shiftH;
  }
};

export const calculateTop = (l, isDesktop, shift) => {
  return isDesktop
    ? BOARD_BOTTOM_DESKTOP_PX - l * shift
    : BOARD_BOTTOM_MOBILE_PX - l * shift;
};

export const getZone = (line) => {
  if (line >= 0 && line <= 4) return 1;
  if (line >= 5 && line <= 8) return 2;
  if (line >= 9 && line <= 11) return 3;
  return 1;
};

export const logCoreDistribution = (boardPieces) => {
  const finalZoneCoreCount = {
    1: {},
    2: {},
    3: {},
  };

  const zoneMaxCores = {
    1: 12,
    2: 12,
    3: 6,
  };

  const zoneMaxPerType = {
    1: 2,
    2: 2,
    3: 1,
  };

  for (let i = 0; i < boardPieces.length - 1; i++) {
    const piece = boardPieces[i];
    if (piece.cores && piece.cores.size > 0) {
      piece.cores.forEach((core) => {
        // Determine core type by image URL
        let coreType = "unknown";
        if (core.imgUrl.includes("glitch")) coreType = "glitch";
        else if (core.imgUrl.includes("exchange")) coreType = "exchange";
        else if (core.imgUrl.includes("torment")) coreType = "torment";
        else if (core.imgUrl.includes("deception")) coreType = "deception";
        else if (core.imgUrl.includes("patrol")) coreType = "patrol";
        else if (core.imgUrl.includes("chaos")) coreType = "chaos";

        const zone = piece.zone;
        finalZoneCoreCount[zone][coreType] =
          (finalZoneCoreCount[zone][coreType] || 0) + 1;
      });
    }
  }

  console.log("Core distribution by zone:");
  let totalCores = 0;
  for (let zone = 3; zone >= 1; zone--) {
    const zoneTotal = Object.values(finalZoneCoreCount[zone]).reduce(
      (sum, count) => sum + count,
      0
    );
    totalCores += zoneTotal;
    const extraCores = Math.max(0, zoneTotal - zoneMaxCores[zone]);

    // Calculate overflow per type
    const overflowByType = {};
    for (const [coreType, count] of Object.entries(finalZoneCoreCount[zone])) {
      const overflow = Math.max(0, count - zoneMaxPerType[zone]);
      if (overflow > 0) {
        overflowByType[coreType] = overflow;
      }
    }

    if (extraCores > 0) {
      console.log(
        `Zone ${zone} (${zoneTotal}/${zoneMaxCores[zone]} cores, +${extraCores} overflow):`,
        finalZoneCoreCount[zone],
        Object.keys(overflowByType).length > 0 ? `- Overflow types:` : "",
        Object.keys(overflowByType).length > 0 ? overflowByType : ""
      );
    } else {
      console.log(
        `Zone ${zone} (${zoneTotal}/${zoneMaxCores[zone]} cores):`,
        finalZoneCoreCount[zone]
      );
    }
  }
  console.log(`Total cores added: ${totalCores}`);
};
