import { useEffect, useState } from "react";
import { INITIAL_STATE } from "../logic/constants";
import { loadState, saveState } from "./storage";

export function useGameState() {
  const [state, setState] = useState(() => loadState(INITIAL_STATE));

  useEffect(() => {
    saveState(state);
  }, [state]);

  const reset = () => setState(INITIAL_STATE);

  return { state, setState, reset };
}
