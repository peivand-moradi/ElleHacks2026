import { INGREDIENTS } from "../data/ingredients";
import { hasAllIngredients, ownedCount } from "../logic/rules";

export default function Kitchen({ state, setPage }) {
  const count = ownedCount(state, INGREDIENTS);
  const done = hasAllIngredients(state, INGREDIENTS);

  const stageEmoji =
    count === 0 ? "🍽️" :
    count === 1 ? "🍞" :
    count === 2 ? "🍞🟥" :
    count === 3 ? "🍞🟥🟨" :
    "🍕";

  return (
    <div style={{ padding: 16 }}>
      <h2>Kitchen 🍕</h2>
      <div style={{ fontSize: 42, marginTop: 12 }}>{stageEmoji}</div>
      <p>Ingredients owned: {count}/{INGREDIENTS.length}</p>

      {!done ? (
        <p>Buy all ingredients to unlock “Make Pizza”.</p>
      ) : (
        <div style={{ marginTop: 12 }}>
          <button onClick={() => setPage("final")}>Make Pizza 🎉</button>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setPage("home")}>Back</button>
      </div>
    </div>
  );
}
