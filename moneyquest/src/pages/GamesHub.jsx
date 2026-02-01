import { GAMES } from "../data/gamesList";

export default function GamesHub({ state, setPage }) {
  return (
    <div className="page-game game-page">
      <h2 className="title">Games</h2>
      <p className="subtitle" style={{color:"black"}}>
        Play mini-games to earn coins (coins are only for paying credit).
      </p>

      <div className="game-panel">
        <div className="game-grid">
          {GAMES.map((g, i) => {
            const unlocked = i <= state.unlockedGameIndex;

            return (
              <button
                key={g.id}
                onClick={() => unlocked && setPage(`play:${g.id}`)}
                disabled={!unlocked}
                className={`game-card ${unlocked ? "" : "locked"}`}
              >
                <div className="game-card-title">{g.name}</div>
                <div className="game-card-reward">Reward: +{g.reward} coins</div>
                {!unlocked && <div className="game-card-locked">🔒 Locked</div>}
              </button>
            );
          })}
        </div>
      </div>

      <button className="back-btn" onClick={() => setPage("home")}>Back</button>
    </div>
  );
}
