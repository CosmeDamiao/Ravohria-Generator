import entrance from "../imagens/entrance.png";
import exit from "../imagens/exit_step.png";
import pecaDe1 from "../imagens/1x1.png";
import pecaDe2 from "../imagens/2x1.png";
import pecaDe3 from "../imagens/3x1.png";
import pecaDe3_2 from "../imagens/3x2.png";
import pecaDe3_3 from "../imagens/3x3.png";
import pecaDe4 from "../imagens/4x1.png";
import pecaDe4_2 from "../imagens/4x2.png";
import pecaDe4_3 from "../imagens/4x3.png";
import pecaDe4_4 from "../imagens/4x4.png";
import pecaDe4_5 from "../imagens/4x5.png";
import pecaDe5 from "../imagens/5x2.png";

import chaos from "../imagens/chaos.png";
import torment from "../imagens/torment.png";
import deception from "../imagens/deception.png";
import patrol from "../imagens/patrol.png";
import exchange from "../imagens/exchange.png";
import glitch from "../imagens/glitch.png";

import { getZone, logCoreDistribution } from "../helpers";

const generateBoardPieces = (config) => {
  // const coresTest = new Map();
  // coresTest.set(0, { imgUrl: glitch });
  // coresTest.set(1, { imgUrl: exchange });

  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    attempts++;

    let boardPieces = [
      {
        l: 0,
        c: 2,
        size: 10,
        imgUrl: entrance,
        maxCores: 5,
        maxBlockades: 5,
        zone: getZone(0),
        // cores: coresTest,
        // blockades: [1, 2],
      },
    ];
    let notPositionedBoardPieces = [
      {
        imgUrl: pecaDe1,
        size: 2,
        maxCores: 1,
        maxBlockades: 1,
      },
      {
        imgUrl: pecaDe2,
        size: 4,
        maxCores: 2,
        maxBlockades: 2,
      },
      {
        imgUrl: pecaDe3,
        size: 6,
        maxCores: 3,
        maxBlockades: 3,
      },
      {
        imgUrl: pecaDe3_2,
        size: 6,
        maxCores: 3,
        maxBlockades: 3,
      },
      {
        imgUrl: pecaDe3_3,
        size: 6,
        maxCores: 3,
        maxBlockades: 3,
      },
      {
        imgUrl: pecaDe4,
        size: 8,
        maxCores: 4,
        maxBlockades: 4,
      },
      {
        imgUrl: pecaDe4_2,
        size: 8,
        maxCores: 4,
        maxBlockades: 4,
      },
      {
        imgUrl: pecaDe4_3,
        size: 8,
        maxCores: 4,
        maxBlockades: 4,
      },
      {
        imgUrl: pecaDe4_4,
        size: 8,
        maxCores: 4,
        maxBlockades: 4,
      },
      {
        imgUrl: pecaDe4_5,
        size: 8,
        maxCores: 4,
        maxBlockades: 4,
      },
      {
        imgUrl: pecaDe5,
        size: 10,
        maxCores: 5,
        maxBlockades: 5,
      },
    ];
    const exitPiece = {
      imgUrl: exit,
      size: 6,
      isExit: true,
    };

    const success = addPiecesToBoard(
      boardPieces,
      notPositionedBoardPieces,
      config,
    );

    if (!success) {
      console.log(`Attempt ${attempts} failed, retrying...`);
      continue;
    }

    // Add exit piece as the last piece
    const lastPiece = boardPieces[boardPieces.length - 1];
    if (lastPiece) {
      const exitLine = lastPiece.l + 1;
      const connectionMin = Math.max(0, lastPiece.c - exitPiece.size + 1);
      const connectionMax = Math.min(13, lastPiece.c + lastPiece.size - 1);

      const validColumns = [];
      for (let c = connectionMin; c <= connectionMax; c++) {
        const withinBounds = c >= 0 && c <= 13;
        const doesntOverflow = c + exitPiece.size <= 14;
        // Match column parity with previous line's parity
        const matchesParity =
          (lastPiece.l % 2 === 0 && c % 2 === 0) ||
          (lastPiece.l % 2 === 1 && c % 2 === 1);

        if (withinBounds && doesntOverflow && matchesParity) {
          validColumns.push(c);
        }
      }

      if (validColumns.length > 0) {
        const randomIndex = Math.floor(Math.random() * validColumns.length);
        boardPieces.push({
          ...exitPiece,
          l: exitLine,
          c: validColumns[randomIndex],
          zone: getZone(exitLine),
        });

        console.log(
          `Generated Board Pieces on attempt ${attempts}:`,
          boardPieces,
        );
        return boardPieces;
      }
    }

    console.log(`Attempt ${attempts} failed to place exit, retrying...`);
  }

  console.error(`Failed to generate board after ${maxAttempts} attempts`);
  return [];
};

const addPiecesToBoard = (boardPieces, notPositionedBoardPieces, config) => {
  const COLUMN_MIN = 0;
  const COLUMN_MAX = 13;

  const maxShift = config.shift || 2;
  const singlePathConfig = config.singlePathConstraints || {
    minLine: 5,
    maxOccurrences: 1,
    minOccurrences: 0,
  };
  let singlePathCount = 0;

  let currentLine = 1;
  const remainingPieces = [...notPositionedBoardPieces];

  while (remainingPieces.length > 0) {
    let pieceWasPlaced = false;
    const piecesToTry = [...remainingPieces];

    // Shuffle pieces to try them in random order
    for (let i = piecesToTry.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [piecesToTry[i], piecesToTry[j]] = [piecesToTry[j], piecesToTry[i]];
    }

    for (const piece of piecesToTry) {
      const previousPiece = boardPieces[boardPieces.length - 1];

      // Calculate connection range from previous piece
      // A piece is connected if it overlaps with the previous piece
      let connectionMin = COLUMN_MIN;
      let connectionMax = COLUMN_MAX;

      if (previousPiece) {
        // Piece must overlap with previous piece range [previousPiece.c, previousPiece.c + previousPiece.size - 1]
        // For overlap: newPiece.c + newPiece.size > previousPiece.c AND newPiece.c <= previousPiece.c + previousPiece.size - 1
        // Simplify: previousPiece.c - newPiece.size + 1 <= newPiece.c <= previousPiece.c + previousPiece.size - 1
        connectionMin = Math.max(COLUMN_MIN, previousPiece.c - piece.size + 1);
        connectionMax = Math.min(
          COLUMN_MAX,
          previousPiece.c + previousPiece.size - 1,
        );
      }

      // Generate all valid columns
      const validColumns = [];

      for (let c = connectionMin; c <= connectionMax; c++) {
        // Check all constraints
        const withinBounds = c >= COLUMN_MIN && c <= COLUMN_MAX;
        const doesntOverflow = c + piece.size <= COLUMN_MAX + 1;
        const notSameAsPrevious = !previousPiece || c !== previousPiece.c;
        const matchesParity =
          (currentLine % 2 === 0 && c % 2 === 0) ||
          (currentLine % 2 === 1 && c % 2 === 1);

        // Check single-path constraint
        // Single path = piece with size 2 OR overlap of 1 column with previous piece
        let allowSinglePath = true;
        let wouldCreateSinglePath = false;

        // Check if piece itself is size 2
        if (piece.size === 2) {
          wouldCreateSinglePath = true;
        }

        // Check if overlap with previous piece is only 1 column
        if (previousPiece) {
          const newPieceEnd = c + piece.size - 1;
          const prevPieceEnd = previousPiece.c + previousPiece.size - 1;
          const overlapStart = Math.max(c, previousPiece.c);
          const overlapEnd = Math.min(newPieceEnd, prevPieceEnd);
          const overlapSize = overlapEnd - overlapStart + 1;

          if (overlapSize === 1) {
            wouldCreateSinglePath = true;
          }
        }

        // Apply single-path constraints
        if (wouldCreateSinglePath) {
          // Before minLine: no single paths allowed at all
          if (currentLine < singlePathConfig.minLine) {
            allowSinglePath = false;
          }

          // After minLine: only allow up to maxOccurrences single paths
          if (
            currentLine >= singlePathConfig.minLine &&
            singlePathCount >= singlePathConfig.maxOccurrences
          ) {
            allowSinglePath = false;
          }
        }

        if (
          withinBounds &&
          doesntOverflow &&
          notSameAsPrevious &&
          matchesParity &&
          allowSinglePath
        ) {
          validColumns.push(c);
        }
      }

      if (validColumns.length === 0) {
        continue; // Try next piece
      }

      // Check if we need to prioritize single path creation to meet minOccurrences
      const minOccurrences = singlePathConfig.minOccurrences || 0;
      const piecesLeftToPlace = remainingPieces.length;
      const singlePathsNeeded = Math.max(0, minOccurrences - singlePathCount);

      // Separate columns into single-path and non-single-path options
      const singlePathColumns = [];
      const nonSinglePathColumns = [];

      for (const c of validColumns) {
        let wouldCreateSinglePath = false;

        // Check if piece is size 2
        if (piece.size === 2) {
          wouldCreateSinglePath = true;
        }

        // Check if overlap would be 1
        if (previousPiece && !wouldCreateSinglePath) {
          const newPieceEnd = c + piece.size - 1;
          const prevPieceEnd = previousPiece.c + previousPiece.size - 1;
          const overlapStart = Math.max(c, previousPiece.c);
          const overlapEnd = Math.min(newPieceEnd, prevPieceEnd);
          const overlapSize = overlapEnd - overlapStart + 1;

          if (overlapSize === 1) {
            wouldCreateSinglePath = true;
          }
        }

        if (wouldCreateSinglePath) {
          singlePathColumns.push(c);
        } else {
          nonSinglePathColumns.push(c);
        }
      }

      // Determine column selection strategy based on single path requirements
      let columnsToConsider = validColumns;

      // If we're past minLine and still need single paths, be aggressive
      if (
        currentLine >= singlePathConfig.minLine &&
        singlePathsNeeded > 0 &&
        singlePathColumns.length > 0
      ) {
        // Strongly prefer single-path columns when we're below minimum
        // Use a probability-based approach: higher chance when we need more paths
        const singlePathProbability = Math.min(
          0.9,
          singlePathsNeeded / minOccurrences,
        );

        if (
          Math.random() < singlePathProbability ||
          singlePathsNeeded >= piecesLeftToPlace
        ) {
          columnsToConsider = singlePathColumns;
        }
      }

      // Apply difficulty-based center preference with directional bias
      // Center is based on the piece's center position relative to previous piece
      const previousPieceCenterColumn = previousPiece
        ? Math.floor(previousPiece.c + previousPiece.size / 2)
        : 6;

      const columnsWithPriority = columnsToConsider.map((c) => {
        const pieceCenterColumn = Math.floor(c + piece.size / 2);
        const distanceFromCenter = Math.abs(
          pieceCenterColumn - previousPieceCenterColumn,
        );
        const withinShift = distanceFromCenter <= maxShift;

        // Add bias to encourage left shifts
        let priority = withinShift ? 2 : 1;

        // Bonus priority for columns to the left of previous piece
        if (previousPiece && c < previousPiece.c) {
          priority += 1;
        }

        return { column: c, priority };
      });

      // Try to place within center shift first (priority >= 2)
      let candidateColumns = columnsWithPriority.filter(
        (cp) => cp.priority >= 2,
      );

      // If no columns within center shift, use all valid columns
      if (candidateColumns.length === 0) {
        candidateColumns = columnsWithPriority;
      }

      // Random selection from candidate columns
      const randomIndex = Math.floor(Math.random() * candidateColumns.length);
      const selectedColumn = candidateColumns[randomIndex].column;

      // Track single-path pieces (size 2 OR overlap of 1)
      let isSinglePath = false;

      // Check if piece is size 2
      if (piece.size === 2) {
        isSinglePath = true;
      }

      // Check if overlap with previous piece is 1
      if (previousPiece) {
        const newPieceEnd = selectedColumn + piece.size - 1;
        const prevPieceEnd = previousPiece.c + previousPiece.size - 1;
        const overlapStart = Math.max(selectedColumn, previousPiece.c);
        const overlapEnd = Math.min(newPieceEnd, prevPieceEnd);
        const overlapSize = overlapEnd - overlapStart + 1;

        if (overlapSize === 1) {
          isSinglePath = true;
        }
      }

      if (isSinglePath && currentLine >= singlePathConfig.minLine) {
        singlePathCount++;
      }

      // Add piece to board
      boardPieces.push({
        ...piece,
        l: currentLine,
        c: selectedColumn,
        zone: getZone(currentLine),
      });

      // Remove the piece from remaining pieces
      const pieceIndex = remainingPieces.indexOf(piece);
      remainingPieces.splice(pieceIndex, 1);
      pieceWasPlaced = true;
      currentLine++;
      break; // Move to next line
    }

    // Safety check: if no piece could be placed, break to avoid infinite loop
    if (!pieceWasPlaced) {
      return false; // Signal failure to caller
    }
  }

  // Check if minimum single path occurrences requirement is met
  const minOccurrences = singlePathConfig.minOccurrences || 0;
  if (singlePathCount < minOccurrences) {
    console.log(
      `Failed to meet minimum single path requirement: ${singlePathCount}/${minOccurrences}`,
    );
    return false; // Signal failure to retry
  }

  return true; // All pieces placed successfully
};

const addCoresToBoard = (boardPieces, config) => {
  const areBlockadesRestrictedToChaos =
    config?.areBlockadesRestrictedToChaos ?? true;

  let notPlacedCores = [
    { imgUrl: glitch, type: "glitch" },
    { imgUrl: glitch, type: "glitch" },
    { imgUrl: glitch, type: "glitch" },
    { imgUrl: glitch, type: "glitch" },
    { imgUrl: glitch, type: "glitch" },
    { imgUrl: exchange, type: "exchange" },
    { imgUrl: exchange, type: "exchange" },
    { imgUrl: exchange, type: "exchange" },
    { imgUrl: exchange, type: "exchange" },
    { imgUrl: exchange, type: "exchange" },
    { imgUrl: torment, type: "torment" },
    { imgUrl: torment, type: "torment" },
    { imgUrl: torment, type: "torment" },
    { imgUrl: torment, type: "torment" },
    { imgUrl: torment, type: "torment" },
    { imgUrl: deception, type: "deception" },
    { imgUrl: deception, type: "deception" },
    { imgUrl: deception, type: "deception" },
    { imgUrl: deception, type: "deception" },
    { imgUrl: deception, type: "deception" },
    { imgUrl: patrol, type: "patrol" },
    { imgUrl: patrol, type: "patrol" },
    { imgUrl: patrol, type: "patrol" },
    { imgUrl: patrol, type: "patrol" },
    { imgUrl: patrol, type: "patrol" },
    { imgUrl: chaos, type: "chaos" },
    { imgUrl: chaos, type: "chaos" },
    { imgUrl: chaos, type: "chaos" },
    { imgUrl: chaos, type: "chaos" },
    { imgUrl: chaos, type: "chaos" },
  ];

  // Track cores placed per zone per type
  const zoneCoreCount = {
    1: { total: 0, byType: {} },
    2: { total: 0, byType: {} },
    3: { total: 0, byType: {} },
  };

  const zoneConstraints = {
    1: { maxTotal: 12, maxPerType: 2 },
    2: { maxTotal: 12, maxPerType: 2 },
    3: { maxTotal: 6, maxPerType: 1 },
  };

  // Phase 1: If restricted, place chaos cores on blockade positions
  if (areBlockadesRestrictedToChaos) {
    // Process each zone
    for (let targetZone = 1; targetZone <= 3; targetZone++) {
      // Shuffle pieces in this zone
      const zonePieces = [];
      for (let i = 0; i < boardPieces.length - 1; i++) {
        if (boardPieces[i].zone === targetZone) {
          zonePieces.push(i);
        }
      }

      for (let i = zonePieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [zonePieces[i], zonePieces[j]] = [zonePieces[j], zonePieces[i]];
      }

      // Try to place chaos cores on blockade positions in this zone
      for (const pieceIndex of zonePieces) {
        const piece = boardPieces[pieceIndex];

        if (!piece.cores) {
          piece.cores = new Map();
        }

        // Get blockade positions
        if (piece.blockades && piece.blockades.length > 0) {
          for (const blockadePos of piece.blockades) {
            // Check if position is available for a core
            if (!piece.cores.has(blockadePos)) {
              // Try to find a chaos core
              let chaosCoreIndex = -1;
              for (let j = 0; j < notPlacedCores.length; j++) {
                if (notPlacedCores[j].type === "chaos") {
                  const typeCount =
                    zoneCoreCount[targetZone].byType["chaos"] || 0;
                  if (typeCount < zoneConstraints[targetZone].maxPerType) {
                    chaosCoreIndex = j;
                    break;
                  }
                }
              }

              if (chaosCoreIndex !== -1) {
                // Place chaos core at blockade position
                const [selectedCore] = notPlacedCores.splice(chaosCoreIndex, 1);
                piece.cores.set(blockadePos, {
                  imgUrl: selectedCore.imgUrl,
                  type: selectedCore.type,
                  isOverflow: false,
                });

                // Update zone tracking
                zoneCoreCount[targetZone].total++;
                zoneCoreCount[targetZone].byType["chaos"] =
                  (zoneCoreCount[targetZone].byType["chaos"] || 0) + 1;
              }
            }
          }
        }
      }
    }
  }

  // Phase 2: Place remaining cores respecting zone constraints
  // Shuffle remaining cores for randomness
  for (let i = notPlacedCores.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [notPlacedCores[i], notPlacedCores[j]] = [
      notPlacedCores[j],
      notPlacedCores[i],
    ];
  }

  // Track overflow cores with their intended zone
  const overflowCores = [];

  // First, collect all available empty valid positions per zone
  const zoneAvailablePositions = {
    1: [],
    2: [],
    3: [],
  };

  for (let targetZone = 1; targetZone <= 3; targetZone++) {
    for (let i = 0; i < boardPieces.length - 1; i++) {
      const piece = boardPieces[i];

      if (piece.zone !== targetZone) continue;

      if (!piece.cores) {
        piece.cores = new Map();
      }

      // Collect available positions for this piece
      for (let pos = 0; pos < piece.maxCores; pos++) {
        if (!piece.cores.has(pos)) {
          zoneAvailablePositions[targetZone].push({
            pieceIndex: i,
            position: pos,
          });
        }
      }
    }

    // Shuffle available positions for this zone
    for (let i = zoneAvailablePositions[targetZone].length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [
        zoneAvailablePositions[targetZone][i],
        zoneAvailablePositions[targetZone][j],
      ] = [
        zoneAvailablePositions[targetZone][j],
        zoneAvailablePositions[targetZone][i],
      ];
    }
  }

  // Now place cores in random valid positions per zone
  for (let targetZone = 1; targetZone <= 3; targetZone++) {
    const availablePositions = zoneAvailablePositions[targetZone];

    for (const { pieceIndex, position } of availablePositions) {
      if (notPlacedCores.length === 0) {
        break;
      }

      // Check if target zone has capacity
      if (
        zoneCoreCount[targetZone].total >= zoneConstraints[targetZone].maxTotal
      ) {
        break;
      }

      const piece = boardPieces[pieceIndex];

      // Find a valid core for this zone
      let coreIndex = -1;
      for (let j = 0; j < notPlacedCores.length; j++) {
        const core = notPlacedCores[j];
        const typeCount = zoneCoreCount[targetZone].byType[core.type] || 0;
        if (typeCount < zoneConstraints[targetZone].maxPerType) {
          // Check if position has blockade and core is not chaos
          const hasBlockade =
            piece.blockades && piece.blockades.includes(position);
          if (
            areBlockadesRestrictedToChaos &&
            hasBlockade &&
            core.type !== "chaos"
          ) {
            continue; // Skip this core, try next one
          }

          coreIndex = j;
          break;
        }
      }

      if (coreIndex === -1) continue; // Try next position

      // Place the core
      const [selectedCore] = notPlacedCores.splice(coreIndex, 1);
      piece.cores.set(position, {
        imgUrl: selectedCore.imgUrl,
        type: selectedCore.type,
        isOverflow: false,
      });

      // Update zone tracking
      zoneCoreCount[targetZone].total++;
      zoneCoreCount[targetZone].byType[selectedCore.type] =
        (zoneCoreCount[targetZone].byType[selectedCore.type] || 0) + 1;

      // Shuffle remaining cores for more randomness
      for (let k = notPlacedCores.length - 1; k > 0; k--) {
        const l = Math.floor(Math.random() * (k + 1));
        [notPlacedCores[k], notPlacedCores[l]] = [
          notPlacedCores[l],
          notPlacedCores[k],
        ];
      }
    }
  }

  // Mark any remaining cores as overflow (track which zone they belong to)
  // We'll assign them to the zone that would have taken them if it had space
  for (const core of notPlacedCores) {
    // Determine which zone this core type needs to go to based on current distribution
    let targetZone = 1;
    let minTypeCount = Infinity;

    for (let zone = 1; zone <= 3; zone++) {
      const typeCount = zoneCoreCount[zone].byType[core.type] || 0;
      if (typeCount < minTypeCount) {
        minTypeCount = typeCount;
        targetZone = zone;
      }
    }

    overflowCores.push({
      ...core,
      intendedZone: targetZone,
    });
  }

  // Clear notPlacedCores since we've moved them to overflowCores
  notPlacedCores = [];

  // Phase 2.5: Place overflow cores in closest available positions to their intended zones
  while (overflowCores.length > 0) {
    let bestOptions = [];
    let bestDistance = Infinity;
    let respectMaxPerType = true;

    // Define zone boundaries for distance calculation
    const zoneBoundaries = {
      1: { start: 0, end: 4 },
      2: { start: 5, end: 8 },
      3: { start: 9, end: 11 },
    };

    // Try twice: first respecting maxPerType, then ignoring it if no positions found
    for (let attempt = 0; attempt < 2; attempt++) {
      bestOptions = [];
      bestDistance = Infinity;

      // On second attempt, ignore maxPerType constraints
      if (attempt === 1) {
        respectMaxPerType = false;
        console.log(
          `Overflow attempt 2 for ${overflowCores.length} cores - ignoring maxPerType`,
        );
      }

      // Search all pieces globally to find the closest valid empty position
      for (let i = 0; i < boardPieces.length - 1; i++) {
        const piece = boardPieces[i];

        if (!piece.cores) {
          piece.cores = new Map();
        }

        // Check for available positions in this piece
        for (let pos = 0; pos < piece.maxCores; pos++) {
          if (!piece.cores.has(pos)) {
            const hasBlockade =
              piece.blockades && piece.blockades.includes(pos);

            // Try to find a valid core for this position
            for (let j = 0; j < overflowCores.length; j++) {
              const core = overflowCores[j];
              const pieceZone = piece.zone;
              const zoneTypeCount =
                zoneCoreCount[pieceZone].byType[core.type] || 0;

              // During overflow, respect maxPerType on first attempt only
              if (
                respectMaxPerType &&
                zoneTypeCount >= zoneConstraints[pieceZone].maxPerType
              ) {
                continue;
              }

              // Check blockade restriction
              if (
                areBlockadesRestrictedToChaos &&
                hasBlockade &&
                core.type !== "chaos"
              ) {
                continue;
              }

              // Calculate distance from this piece to the core's intended zone
              const intendedZoneBoundary = zoneBoundaries[core.intendedZone];
              let pieceDistance;

              if (piece.l < intendedZoneBoundary.start) {
                // Piece is before intended zone
                pieceDistance = intendedZoneBoundary.start - piece.l;
              } else if (piece.l > intendedZoneBoundary.end) {
                // Piece is after intended zone
                pieceDistance = piece.l - intendedZoneBoundary.end;
              } else {
                // Piece is within intended zone
                pieceDistance = 0;
              }

              // Valid combination found - check if this is the closest so far
              if (pieceDistance < bestDistance) {
                // Found a closer position, reset the list
                bestDistance = pieceDistance;
                bestOptions = [
                  {
                    pieceIndex: i,
                    position: pos,
                    coreIndex: j,
                  },
                ];
              } else if (pieceDistance === bestDistance) {
                // Found an equally close position, add to list
                bestOptions.push({
                  pieceIndex: i,
                  position: pos,
                  coreIndex: j,
                });
              }

              // Found a valid option for this position, move to next position
              break;
            }
          }
        }
      }

      // If we found valid options, break out of attempt loop
      if (bestOptions.length > 0) {
        if (attempt === 1) {
          console.log(
            `Found ${bestOptions.length} options on attempt 2 at distance ${bestDistance}`,
          );
        }
        break;
      }
    }

    // If no valid position found after both attempts, break
    if (bestOptions.length === 0) {
      console.warn(
        `Could not place ${overflowCores.length} overflow cores - no valid positions found`,
      );
      console.log(
        "Remaining overflow cores:",
        overflowCores.map((c) => `${c.type} (zone ${c.intendedZone})`),
      );
      console.log("Zone core counts:", zoneCoreCount);
      break;
    }

    // Randomly select from the best options
    const selectedOption =
      bestOptions[Math.floor(Math.random() * bestOptions.length)];

    // Place the core in the selected position
    const [selectedCore] = overflowCores.splice(selectedOption.coreIndex, 1);
    const targetPiece = boardPieces[selectedOption.pieceIndex];
    targetPiece.cores.set(selectedOption.position, {
      imgUrl: selectedCore.imgUrl,
      isOverflow: true,
      type: selectedCore.type,
    });

    // Update zone tracking for the zone where we actually placed it
    const actualZone = targetPiece.zone;
    zoneCoreCount[actualZone].total++;
    zoneCoreCount[actualZone].byType[selectedCore.type] =
      (zoneCoreCount[actualZone].byType[selectedCore.type] || 0) + 1;
  }

  // Log core distribution by zone and type
  logCoreDistribution(boardPieces);

  return boardPieces;
};

const addBlockadesToBoard = (boardPieces, config) => {
  const blockadesInSinglePathChance =
    config?.blockadesInSinglePathChance ?? 0.5;
  const blockadeStartBias = config?.blockadeStartBias ?? 0.5;
  const guaranteeSafeStartLines = config?.guaranteeSafeStartLines || 0;
  const nonAdjacentBlockadesBias = config?.nonAdjacentBlockadesBias ?? 0.5;

  let totalBlockadesPlaced = 0;
  const totalBlockadesNeeded = 11;

  // Track blockades per zone
  const zoneBlockadeCount = {
    1: 0,
    2: 0,
    3: 0,
  };

  const zoneBlockadeTargets = {
    1: 4,
    2: 4,
    3: 3,
  };

  // Helper function to check if a blockade position is adjacent to existing blockades
  const isAdjacentToExistingBlockade = (pieceIndex, position) => {
    const piece = boardPieces[pieceIndex];
    const currStart = piece.c;
    // Blockades column position: c + size - 2 - (2 * position)
    const absolutePos = currStart + piece.size - 2 - 2 * position;

    // Check on the same piece (horizontal adjacency within same piece)
    if (piece.blockades && piece.blockades.length > 0) {
      for (const existingPos of piece.blockades) {
        // Adjacent blockade slots on same piece: position indices differ by 1
        // This means absolute positions differ by 2 columns
        if (Math.abs(position - existingPos) === 1) {
          return true;
        }
      }
    }

    // Check ALL other pieces (not just immediate neighbors) for adjacency
    // This prevents chains of adjacent blockades across multiple lines
    for (let i = 0; i < boardPieces.length; i++) {
      if (i === pieceIndex) continue; // Skip current piece

      const otherPiece = boardPieces[i];
      if (!otherPiece.blockades || otherPiece.blockades.length === 0) {
        continue;
      }

      const otherStart = otherPiece.c;

      // Check each blockade in the other piece
      for (const otherBlockadePos of otherPiece.blockades) {
        // Blockades column position: c + size - 2 - (2 * position)
        const otherAbsolutePos =
          otherStart + otherPiece.size - 2 - 2 * otherBlockadePos;

        // Check pieces that are on the same line
        if (piece.l === otherPiece.l) {
          // Adjacent on same line means: column positions differ by 2 (since blockades are 2 steps apart)
          if (Math.abs(absolutePos - otherAbsolutePos) === 2) {
            return true;
          }
        }
        // Check pieces that are on adjacent lines (differ by 1)
        else if (Math.abs(piece.l - otherPiece.l) === 1) {
          // Adjacent on different lines means: same column (shift 0) OR adjacent columns (shift 1)
          // Same column: absolutePos - otherAbsolutePos = 0
          // Adjacent columns: absolutePos - otherAbsolutePos = ±1
          if (Math.abs(absolutePos - otherAbsolutePos) <= 1) {
            return true;
          }
        }
      }
    }

    return false;
  };

  // Helper function to check if a position would block the last safe path
  const wouldBlockLastSafePath = (pieceIndex, position) => {
    if (guaranteeSafeStartLines === 0) return false;

    const piece = boardPieces[pieceIndex];
    const lineIndex = piece.l;

    // Only check for guaranteed safe lines
    if (lineIndex > guaranteeSafeStartLines) return false;

    const previousPiece = boardPieces[pieceIndex - 1];
    if (!previousPiece) return false;

    // Calculate overlap between previous and current piece
    const prevStart = previousPiece.c;
    const prevEnd = previousPiece.c + previousPiece.size - 1;
    const currStart = piece.c;
    const currEnd = piece.c + piece.size - 1;

    const overlapStart = Math.max(prevStart, currStart);
    const overlapEnd = Math.min(prevEnd, currEnd);

    // Get overlapping positions on current piece (relative to piece)
    const overlappingPositions = [];
    for (let col = overlapStart; col <= overlapEnd; col++) {
      const relativePos = col - currStart;
      if (relativePos >= 0 && relativePos < piece.size) {
        overlappingPositions.push(relativePos);
      }
    }

    // Check how many overlapping positions are already blocked
    const unblockedOverlappingPositions = overlappingPositions.filter(
      (pos) => !piece.blockades || !piece.blockades.includes(pos),
    );

    // If this is the last unblocked overlapping position, don't block it
    if (
      unblockedOverlappingPositions.length === 1 &&
      unblockedOverlappingPositions[0] === position
    ) {
      return true;
    }

    return false;
  };

  // Identify single path pieces
  const singlePathPieces = new Set();
  for (let i = 0; i < boardPieces.length - 1; i++) {
    const piece = boardPieces[i];
    if (piece.size === 2) {
      singlePathPieces.add(i);
    } else if (i > 0) {
      const prevPiece = boardPieces[i - 1];
      const pieceEnd = piece.c + piece.size - 1;
      const prevEnd = prevPiece.c + prevPiece.size - 1;
      const overlapStart = Math.max(piece.c, prevPiece.c);
      const overlapEnd = Math.min(pieceEnd, prevEnd);
      const overlapSize = overlapEnd - overlapStart + 1;
      if (overlapSize === 1) {
        singlePathPieces.add(i);
      }
    }
  }

  // Place blockades according to zone targets
  // Process each zone in order and place blockades
  for (let targetZone = 1; targetZone <= 3; targetZone++) {
    const blockadesToPlace = zoneBlockadeTargets[targetZone];

    for (let i = 0; i < blockadesToPlace; i++) {
      if (totalBlockadesPlaced >= totalBlockadesNeeded) break;

      // Try to find a position in the target zone first
      let bestPieceIndex = -1;
      let bestPosition = -1;
      let foundInTargetZone = false;

      // Separate single-path and non-single-path pieces in target zone
      const singlePathZonePieces = [];
      const nonSinglePathZonePieces = [];

      for (let j = 0; j < boardPieces.length - 1; j++) {
        if (boardPieces[j].zone === targetZone) {
          if (singlePathPieces.has(j)) {
            singlePathZonePieces.push(j);
          } else {
            nonSinglePathZonePieces.push(j);
          }
        }
      }

      // Apply blockadeStartBias: sort by line number or shuffle
      const shouldBiasToStart = Math.random() < blockadeStartBias;

      if (shouldBiasToStart) {
        // Sort by line number (ascending) to prefer start of zone
        singlePathZonePieces.sort(
          (a, b) => boardPieces[a].l - boardPieces[b].l,
        );
        nonSinglePathZonePieces.sort(
          (a, b) => boardPieces[a].l - boardPieces[b].l,
        );
      } else {
        // Shuffle both arrays for random placement
        for (let k = singlePathZonePieces.length - 1; k > 0; k--) {
          const l = Math.floor(Math.random() * (k + 1));
          [singlePathZonePieces[k], singlePathZonePieces[l]] = [
            singlePathZonePieces[l],
            singlePathZonePieces[k],
          ];
        }

        for (let k = nonSinglePathZonePieces.length - 1; k > 0; k--) {
          const l = Math.floor(Math.random() * (k + 1));
          [nonSinglePathZonePieces[k], nonSinglePathZonePieces[l]] = [
            nonSinglePathZonePieces[l],
            nonSinglePathZonePieces[k],
          ];
        }
      }

      // Determine order based on blockadesInSinglePathChance
      let targetZonePieces;
      if (blockadesInSinglePathChance === 0) {
        // Never place on single-path pieces
        targetZonePieces = [...nonSinglePathZonePieces];
      } else if (Math.random() < blockadesInSinglePathChance) {
        // Prefer single-path pieces
        targetZonePieces = [
          ...singlePathZonePieces,
          ...nonSinglePathZonePieces,
        ];
      } else {
        // Prefer non-single-path pieces
        targetZonePieces = [
          ...nonSinglePathZonePieces,
          ...singlePathZonePieces,
        ];
      }

      // Try to place in target zone - prioritize pieces without blockades
      // First pass: try pieces without any blockades
      for (const pieceIndex of targetZonePieces) {
        const piece = boardPieces[pieceIndex];

        if (!piece.blockades) {
          piece.blockades = [];
        }

        // Skip pieces that already have blockades in first pass
        if (piece.blockades.length > 0) continue;

        // Get all available positions
        const availablePositions = [];
        const nonAdjacentPositions = [];

        for (let pos = 0; pos < piece.maxBlockades; pos++) {
          if (!piece.blockades.includes(pos)) {
            // Check if placing blockade here would block the last safe path
            if (!wouldBlockLastSafePath(pieceIndex, pos)) {
              availablePositions.push(pos);

              // Also track non-adjacent positions
              if (!isAdjacentToExistingBlockade(pieceIndex, pos)) {
                nonAdjacentPositions.push(pos);
              }
            }
          }
        }

        if (availablePositions.length > 0) {
          // Apply nonAdjacentBlockadesBias - force non-adjacent based on chance
          let positionsToUse = availablePositions;
          const forceNonAdjacent = Math.random() < nonAdjacentBlockadesBias;

          if (forceNonAdjacent && nonAdjacentPositions.length > 0) {
            // Force use of non-adjacent positions only
            positionsToUse = nonAdjacentPositions;
          } else if (forceNonAdjacent && nonAdjacentPositions.length === 0) {
            // Skip this piece if forced non-adjacent but no positions available
            continue;
          }

          // Pick a random available position
          const randomIndex = Math.floor(Math.random() * positionsToUse.length);
          bestPieceIndex = pieceIndex;
          bestPosition = positionsToUse[randomIndex];
          foundInTargetZone = true;
          break;
        }
      }

      // Second pass: if no piece without blockades found, try all pieces
      if (!foundInTargetZone) {
        for (const pieceIndex of targetZonePieces) {
          const piece = boardPieces[pieceIndex];

          if (!piece.blockades) {
            piece.blockades = [];
          }

          // Get all available positions
          const availablePositions = [];
          const nonAdjacentPositions = [];

          for (let pos = 0; pos < piece.maxBlockades; pos++) {
            if (!piece.blockades.includes(pos)) {
              // Check if placing blockade here would block the last safe path
              if (!wouldBlockLastSafePath(pieceIndex, pos)) {
                availablePositions.push(pos);

                // Also track non-adjacent positions
                if (!isAdjacentToExistingBlockade(pieceIndex, pos)) {
                  nonAdjacentPositions.push(pos);
                }
              }
            }
          }

          if (availablePositions.length > 0) {
            // Apply nonAdjacentBlockadesBias - force non-adjacent based on chance
            let positionsToUse = availablePositions;
            const forceNonAdjacent = Math.random() < nonAdjacentBlockadesBias;

            if (forceNonAdjacent && nonAdjacentPositions.length > 0) {
              // Force use of non-adjacent positions only
              positionsToUse = nonAdjacentPositions;
            } else if (forceNonAdjacent && nonAdjacentPositions.length === 0) {
              // Skip this piece if forced non-adjacent but no positions available
              continue;
            }

            // Pick a random available position
            const randomIndex = Math.floor(
              Math.random() * positionsToUse.length,
            );
            bestPieceIndex = pieceIndex;
            bestPosition = positionsToUse[randomIndex];
            foundInTargetZone = true;
            break;
          }
        }
      }

      // Third pass: if still not found, override nonAdjacentBlockadesBias to ensure zone targets are met
      if (!foundInTargetZone) {
        for (const pieceIndex of targetZonePieces) {
          const piece = boardPieces[pieceIndex];

          if (!piece.blockades) {
            piece.blockades = [];
          }

          // Get all available positions
          const availablePositions = [];

          for (let pos = 0; pos < piece.maxBlockades; pos++) {
            if (!piece.blockades.includes(pos)) {
              // Check if placing blockade here would block the last safe path
              if (!wouldBlockLastSafePath(pieceIndex, pos)) {
                availablePositions.push(pos);
              }
            }
          }

          if (availablePositions.length > 0) {
            // Pick a random available position (ignoring non-adjacent bias)
            const randomIndex = Math.floor(
              Math.random() * availablePositions.length,
            );
            bestPieceIndex = pieceIndex;
            bestPosition = availablePositions[randomIndex];
            foundInTargetZone = true;
            break;
          }
        }
      }

      if (bestPieceIndex === -1) {
        console.warn(
          `Could not place blockade ${i + 1} for zone ${targetZone}`,
        );
        continue;
      }

      boardPieces[bestPieceIndex].blockades.push(bestPosition);
      zoneBlockadeCount[targetZone]++;
      totalBlockadesPlaced++;
    }
  }

  // Log blockade distribution
  console.log("Blockade Distribution by Zone:");
  console.log(`Zone 1: ${zoneBlockadeCount[1]} blockades`);
  console.log(`Zone 2: ${zoneBlockadeCount[2]} blockades`);
  console.log(`Zone 3: ${zoneBlockadeCount[3]} blockades`);
  console.log(`Total Blockades Placed: ${totalBlockadesPlaced}`);

  return boardPieces;
};

export const calculateTowerPositions = (config) => {
  const towerVerticalShift = config?.towerVerticalShift || 0;

  // Base tower positions
  const baseTowerPositions = [5, 8, 10];

  // Calculate shifted positions with fixed shift value
  let shiftedTowerPositions = [...baseTowerPositions];

  if (towerVerticalShift > 0) {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;

      // Apply fixed shift to each tower (shift to previous lines)
      const tempPositions = baseTowerPositions.map((basePos) => {
        return basePos - towerVerticalShift; // Shift to previous lines by exact value
      });

      // Validate: all must be in range [1, 12] and unique
      const allInRange = tempPositions.every((pos) => pos >= 1 && pos <= 12);
      const allUnique = new Set(tempPositions).size === tempPositions.length;

      if (allInRange && allUnique) {
        shiftedTowerPositions = tempPositions;

        // Log tower positions and shifts
        console.log("Tower Positions:");
        baseTowerPositions.forEach((basePos, index) => {
          const shiftedPos = tempPositions[index];
          const shift = basePos - shiftedPos;
          console.log(
            `  Tower ${
              index + 1
            }: Line ${shiftedPos} (base: ${basePos}, shift: ${shift})`,
          );
        });

        break;
      }
      // If validation fails, try again with different random shifts
    }

    // If no valid configuration found after max attempts, keep base positions
    if (attempts >= maxAttempts) {
      console.warn(
        "Could not find valid tower positions with shifts, using base positions",
      );
    }
  } else {
    // Log tower positions when no shift is configured
    console.log("Tower Positions (no shift):");
    baseTowerPositions.forEach((basePos, index) => {
      console.log(`  Tower ${index + 1}: Line ${basePos}`);
    });
  }

  return shiftedTowerPositions;
};

export const mapGenerator = (config) => {
  const boardPieces = generateBoardPieces(config);
  addBlockadesToBoard(boardPieces, config);
  addCoresToBoard(boardPieces, config);

  console.log(`Generated Board Pieces:`, boardPieces);
  return boardPieces;
};
