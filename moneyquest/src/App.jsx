import { useState, useEffect, useRef } from "react";
import { useGameState } from "./state/useGameState";
import { getInnerVoiceAdvice } from "./logic/geminiService";

import StatusBar from "./components/StatusBar";
import PayCreditModal from "./components/PayCreditModal";
import Home from "./pages/Home";
import GamesHub from "./pages/GamesHub";
import Grocery from "./pages/Grocery";
import Kitchen from "./pages/Kitchen";
import Final from "./pages/Final";
import TicTacToe from "./games/tictactoe/TicTacToe";
import MemoryGame from "./games/MemoryGame/MemoryGame";
import WhackACoin from "./games/WhackACoin/WhackACoin";
import QuickMath from "./games/quickmath/QuickMath";


import { GAMES } from "./data/gamesList";
import { earnCoins } from "./logic/rules";

// ... (keep your existing imports)

export default function App() {
  const { state, setState, reset } = useGameState();
  const [page, setPage] = useState("home");
  const [payOpen, setPayOpen] = useState(false);

  const [aiMessage, setAiMessage] = useState("Let's get cooking! We need coins and credit to make this pizza.");
  const [isTyping, setIsTyping] = useState(false);

  // TRACK NUMBERS, NOT OBJECTS (This fixes the "only once" bug)
  const prevCoins = useRef(state.walletCoins);
  const prevDebt = useRef(state.creditDebt);
  const prevInv = useRef(state.inventory.length);
  const prevPage = useRef(page);

  const playing = page.startsWith("play:");
  const gameId = playing ? page.split(":")[1] : null;
  const game = gameId ? GAMES.find(g => g.id === gameId) : null;

  useEffect(() => {
    const triggerAi = async () => {
      let actionLabel = "";

      // 1. Trigger: Page Change
      if (page !== prevPage.current && !playing) {
        if (page === "games") actionLabel = "is looking at the games hub to earn coins.";
        if (page === "grocery") actionLabel = "is at the grocery store to spend credit.";
        if (page === "kitchen") actionLabel = "is checking their pizza progress.";
        if (page === "home") actionLabel = "is back at the map.";
      }
      // 2. Trigger: Earning
      else if (state.walletCoins > prevCoins.current) {
        actionLabel = "earned coins! Remind them coins pay off debt.";
      }
      // 3. Trigger: Paying
      else if (state.creditDebt < prevDebt.current) {
        actionLabel = "paid off debt and boosted their credit score!";
      }
      // 4. Trigger: Buying
      else if (state.inventory.length > prevInv.current) {
        actionLabel = "used credit to buy an ingredient.";
      }

      if (actionLabel) {
        setIsTyping(true);
        const msg = await getInnerVoiceAdvice(actionLabel, state);
        setAiMessage(msg);
        setIsTyping(false);
      }

      // Sync refs
      prevCoins.current = state.walletCoins;
      prevDebt.current = state.creditDebt;
      prevInv.current = state.inventory.length;
      prevPage.current = page;
    };

    triggerAi();
  }, [state.walletCoins, state.creditDebt, state.inventory.length, page, playing]);


  return (
      <div>
        <StatusBar state={state} onOpenPay={() => setPayOpen(true)} />

        <div className="page-wrapper">
          {/* Pages only show when NOT playing a mini-game */}
          {!playing && (
              <>
                {page === "home" && <Home setPage={setPage} />}
                {page === "games" && <GamesHub state={state} setPage={setPage} />}
                {page === "grocery" && <Grocery state={state} setState={setState} setPage={setPage} />}
                {page === "kitchen" && <Kitchen state={state} setPage={setPage} />}
                {page === "final" && <Final state={state} setPage={setPage} reset={reset} />}
              </>
          )}

          {/* --- MINI GAMES (Moved INSIDE page-wrapper) --- */}

          {playing && gameId === "whack" && game && (
              <WhackACoin
                  reward={game.reward}
                  onBack={() => setPage("games")}
                  onFinish={async (earned) => {
                    setState(s => earnCoins(s, earned));
                    setPage("games");

                    // Trigger Gemini Voice
                    setIsTyping(true);
                    const msg = await getInnerVoiceAdvice(`I whacked enough coins to earn ${earned} gold!`, state);
                    setAiMessage(msg);
                    setIsTyping(false);
                  }}
              />
          )}

          {playing && gameId === "quickmath" && game && (
              <QuickMath
                  onBack={() => setPage("games")}
                  onFinish={async (earned) => {
                    setState(s => earnCoins(s, earned));
                    setPage("games");

                    setIsTyping(true);
                    const msg = await getInnerVoiceAdvice(`I used my brain to solve math and earned ${earned} coins!`, state);
                    setAiMessage(msg);
                    setIsTyping(false);
                  }}
              />
          )}

          {/* Memory Game */}
          {playing && gameId === "memory" && game && (
              <MemoryGame
                  reward={game.reward}
                  onFinish={async (earned) => {
                    setState(s => earnCoins(s, earned));
                    setPage("games");

                    setIsTyping(true);
                    const msg = await getInnerVoiceAdvice(
                        `I matched all the pizza ingredients in Memory Match and earned ${earned} coins!`,
                        state
                    );
                    setAiMessage(msg);
                    setIsTyping(false);
                  }}
              />
          )}

          {playing && gameId === "tictactoe" && game && (
              <TicTacToe
                  reward={game.reward}
                  onFinish={async (moves, winner) => {
                    let earned = winner === "X" ? game.reward : (winner === "Draw" ? Math.round(game.reward / 2) : 0);
                    setState(s => earnCoins(s, earned));
                    setPage("games");
                    setIsTyping(true);
                    const msg = await getInnerVoiceAdvice(winner === "X" ? "Won TicTacToe!" : "Played a tough game of TicTacToe!", state);
                    setAiMessage(msg);
                    setIsTyping(false);
                  }}
              />
          )}

          {/* --- GEMINI UI BUBBLE --- */}
          <div className="inner-voice-container">
            <div className="bubble">
              {isTyping ? "Thinking..." : aiMessage}
            </div>
            <div className="avatar-circle">🧠</div>
          </div>
        </div>


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