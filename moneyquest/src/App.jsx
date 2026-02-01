import { useState } from "react";
import { useGameState } from "./state/useGameState";

import StatusBar from "./components/StatusBar";
import PayCreditModal from "./components/PayCreditModal";

import Home from "./pages/Home";
import GamesHub from "./pages/GamesHub";
import Grocery from "./pages/Grocery";
import Kitchen from "./pages/Kitchen";

import { GAMES } from "./data/gamesList";
import { earnCoins } from "./logic/rules";
import QuickMath from "./games/quickmath/QuickMath";

export default function App() {
  const { state, setState, reset } = useGameState();
  const [page, setPage] = useState("home");
  const [payOpen, setPayOpen] = useState(false);

  // Handle play: "play:quickmath"
  const playing = page.startsWith("play:");
  const gameId = playing ? page.split(":")[1] : null;
  const game = gameId ? GAMES.find(g => g.id === gameId) : null;

  return (
    <div>

      {/* <div style={{ padding: 12, display: "flex", gap: 8 }}>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("games")}>Games</button>
        <button onClick={() => setPage("grocery")}>Grocery</button>
        <button onClick={() => setPage("kitchen")}>Kitchen</button>
        <button onClick={reset}>Reset</button>
        </div> */}
    <StatusBar state={state} onOpenPay={() => setPayOpen(true)} />
    <div className="page-wrapper">
      {page === "home" && <Home setPage={setPage} />}

      {page === "games" && <GamesHub state={state} setPage={setPage} />}

      {page === "grocery" && <Grocery state={state} setState={setState} setPage={setPage} />}

      {page === "kitchen" && <Kitchen state={state} setPage={setPage} />}
    </div>

      {page === "final" && (
        <div style={{ padding: 16 }}>
          <h2>Pizza Complete! 🎉🍕</h2>
          <p>Elle used credit responsibly and reached her goal.</p>
          <p><strong>Credit Score:</strong> {state.creditScore}</p>
          <button onClick={() => setPage("home")}>Back to Home</button>
        </div>
      )}

      {playing && gameId === "quickmath" && game && (
        <QuickMath
          reward={game.reward}
          onFinish={(numCorrect) => {
            // scale reward by performance (optional)
            const earned = Math.round((numCorrect / 5) * game.reward);
            setState(s => earnCoins(s, earned));
            setPage("games");
          }}
        />
      )}

      {payOpen && (
        <PayCreditModal
          state={state}
          setState={setState}
          onClose={() => setPayOpen(false)}
        />
      )}
    </div>
  );
}
