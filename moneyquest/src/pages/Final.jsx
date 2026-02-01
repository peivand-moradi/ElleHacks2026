import { INGREDIENTS } from "../data/ingredients";
import { hasAllIngredients } from "../logic/rules";

export default function Final({ state, setPage, reset }) {
  const done = hasAllIngredients(state, INGREDIENTS);

  // Sort by stage so layers stack correctly
  const layers = [...INGREDIENTS].sort((a, b) => a.stage - b.stage);



  return (
    <div className="page-final">
      <h2 className="title">Final Pizza 🎉</h2>

      {!done ? (
        <div className="final-panel">
          <p>You don’t have all the ingredients yet.</p>
          <button className="back-btn" onClick={() => setPage("kitchen")}>
            Back to Kitchen
          </button>
        </div>
      ) : (
        <div className="final-ui">
          <div className="final-pizza-frame">
            {layers.map((ing) => (
              <img
                key={ing.id}
                src={`/pizza/i-${ing.id}.png`}
                alt={ing.name}
                className="final-pizza-layer"
                style={{
                  zIndex: ing.stage,
                  transform: ing.id === "dough" ? "scale(0.7)" : "scale(1)",
                }}
                draggable={false}
              />
            ))}
          </div>

          <div className="final-panel">
            <h3>Chef’s Kiss xo</h3>
            <p>You built a full pizza using credit wisely!</p>

            <div className="final-stats">
              <div>⭐ Credit Score: <b>{state.creditScore}</b></div>
              <div>🏦 Limit: <b>{state.creditLimit}</b></div>
              <div>📉 Debt: <b>{state.creditDebt}</b></div>
              <div>💰 Wallet: <b>{state.walletCoins}</b></div>
            </div>

            <div className="final-actions">
              <button className="btn" onClick={() => { setPage("home"); reset(); }}>
                Back Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
