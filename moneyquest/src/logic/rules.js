export function earnCoins(state, amount) {
  if (amount <= 0) return state;
  return { ...state, walletCoins: state.walletCoins + amount };
}

export function canBuyWithCredit(state, cost) {
  return state.creditDebt + cost <= state.creditLimit;
}

export function buyIngredientWithCredit(state, ingredient) {
  if (!canBuyWithCredit(state, ingredient.cost)) return state;
  if (state.inventory.includes(ingredient.id)) return state;

  return {
    ...state,
    creditDebt: state.creditDebt + ingredient.cost,
    inventory: [...state.inventory, ingredient.id],
    pizzaStage: Math.max(state.pizzaStage, ingredient.stage ?? 0)
  };
}

export function payCredit(state, amount) {
  const payAmt = Math.max(0,
     Math.min(amount, state.walletCoins, state.creditDebt)
    );
  if (payAmt === 0) return state;

  const nextDebt = state.creditDebt - payAmt;

  let next = {
    ...state,
    walletCoins: state.walletCoins - payAmt,
    creditDebt: nextDebt
  };

  if (nextDebt === 0) {
    next = {
      ...next,
      creditScore: next.creditScore + 100,
      creditLimit: state.creditLimit + 50,
      unlockedGameIndex: Math.min(7, next.unlockedGameIndex + 1)
    };
  }

  return next;
}
export function hasAllIngredients(state, ingredients) {
  return ingredients.every(i => state.inventory.includes(i.id));
}

export function ownedCount(state, ingredients) {
  return ingredients.filter(i => state.inventory.includes(i.id)).length;
}