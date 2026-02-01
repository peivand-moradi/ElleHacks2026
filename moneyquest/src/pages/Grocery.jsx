import { INGREDIENTS } from "../data/ingredients";
import { buyIngredientWithCredit, canBuyWithCredit } from "../logic/rules";

export default function Grocery({ state, setState, setPage }) {
  return (
    <div style={{ padding: 16 }}>
      <h2>Grocery Store 🛒</h2>
      <p>Ingredients can only be bought with credit.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 12 }}>
        {INGREDIENTS.map((ing) => {
          const owned = state.inventory.includes(ing.id);
          const locked = !canBuyWithCredit(state, ing.cost);

          return (
            <div key={ing.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{ing.name}</div>
              <div>Cost: {ing.cost} credit</div>

              {owned ? (
                <div style={{ marginTop: 8 }}>✅ Owned</div>
              ) : locked ? (
                <div style={{ marginTop: 8 }}>🔒 Need higher credit limit</div>
              ) : (
                <button
                  style={{ marginTop: 8 }}
                  onClick={() => setState(s => buyIngredientWithCredit(s, ing))}
                >
                  Buy with Credit
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setPage("home")}>Back</button>
      </div>
    </div>
  );
}
