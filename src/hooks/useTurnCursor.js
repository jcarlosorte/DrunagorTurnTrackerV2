import { useCallback, useRef, useState } from 'react';
import { popEntry, pushEntry } from '@/utils/turnHistory';

const HISTORY_LIMIT = 10;

/**
 * Cursor del turno: índice, ronda, turnos extra y pila de deshacer.
 *
 * Extraído de `InitTracker` (H8 2/3). No conoce entidades ni efectos: la página
 * decide qué ocurre al avanzar y qué restaurar además del cursor.
 */
export default function useTurnCursor(session = {}) {
  const [turnIndex, setTurnIndex] = useState(() => session.turnIndex ?? -1);
  const [roundNumber, setRoundNumber] = useState(() => session.roundNumber ?? session.round ?? 0);
  const [previousTurnIndex, setPreviousTurnIndex] = useState(() => session.previousTurnIndex ?? null);
  const [groupTurnTracker, setGroupTurnTracker] = useState(
    () => session.groupTurnTracker || { group: [], index: 0 },
  );
  const [extraTurnsQueue, setExtraTurnsQueue] = useState(() => session.extraTurnsQueue || []);
  const [extraTurnIndex, setExtraTurnIndex] = useState(() => session.extraTurnIndex || 0);
  const [extraTurnTotal, setExtraTurnTotal] = useState(() => session.extraTurnTotal || 0);
  const [undoCount, setUndoCount] = useState(0);
  const historyRef = useRef([]);

  /** Copia del cursor actual para apilar antes de avanzar. */
  const snapshot = useCallback(() => ({
    turnIndex,
    roundNumber,
    previousTurnIndex,
    groupTurnTracker,
    extraTurnsQueue,
    extraTurnIndex,
    extraTurnTotal,
  }), [
    turnIndex,
    roundNumber,
    previousTurnIndex,
    groupTurnTracker,
    extraTurnsQueue,
    extraTurnIndex,
    extraTurnTotal,
  ]);

  const pushHistory = useCallback((extra = {}) => {
    const total = pushEntry(historyRef.current, { ...snapshot(), ...extra }, HISTORY_LIMIT);
    setUndoCount(total);
    return total;
  }, [snapshot]);

  const popHistory = useCallback(() => {
    const entry = popEntry(historyRef.current);
    setUndoCount(historyRef.current.length);
    return entry;
  }, []);

  /** Aplica solo los campos del cursor de una entrada del historial. */
  const restoreCursor = useCallback((entry) => {
    if (!entry) return;
    setTurnIndex(entry.turnIndex);
    setRoundNumber(entry.roundNumber);
    setPreviousTurnIndex(entry.previousTurnIndex);
    setGroupTurnTracker(entry.groupTurnTracker);
    setExtraTurnsQueue(entry.extraTurnsQueue);
    setExtraTurnIndex(entry.extraTurnIndex);
    setExtraTurnTotal(entry.extraTurnTotal);
  }, []);

  const resetCursor = useCallback(() => {
    setTurnIndex(0);
    setRoundNumber(1);
    setPreviousTurnIndex(null);
    setGroupTurnTracker({ group: [], index: 0 });
    setExtraTurnsQueue([]);
    setExtraTurnIndex(0);
    setExtraTurnTotal(0);
    historyRef.current = [];
    setUndoCount(0);
  }, []);

  return {
    turnIndex,
    setTurnIndex,
    roundNumber,
    setRoundNumber,
    previousTurnIndex,
    setPreviousTurnIndex,
    groupTurnTracker,
    setGroupTurnTracker,
    extraTurnsQueue,
    setExtraTurnsQueue,
    extraTurnIndex,
    setExtraTurnIndex,
    extraTurnTotal,
    setExtraTurnTotal,
    undoCount,
    setUndoCount,
    pushHistory,
    popHistory,
    restoreCursor,
    resetCursor,
  };
}
