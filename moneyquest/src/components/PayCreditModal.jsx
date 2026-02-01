import { useState } from "react";
import { payCredit } from "../logic/rules";

export default function PayCreditModal({ state, setState, onClose }) {
  const [amt, setAmt] = useState(1);

  const maxPay = Math.min(state.walletCoins, state.creditDebt);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ background: "white", padding: 16, width: 360, borderRadius: 12 }}>
        <h3>Pay Credit</h3>
        <div>Wallet: {state.walletCoins} coins</div>
        <div>Debt: {state.creditDebt} coins</div>

        <div style={{ marginTop: 12 }}>
          <input
            type="number"
            min={1}
            max={maxPay || 1}
            value={amt}
            onChange={(e) => setAmt(Number(e.target.value))}
            style={{ width: "100%" }}
            disabled={maxPay === 0}
          />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={() => setState(s => payCredit(s, amt))}
            disabled={maxPay === 0}
          >
            Pay
          </button>

          <button
            onClick={() => setState(s => payCredit(s, 99999))}
            disabled={maxPay === 0}
          >
            Pay Max
          </button>

          <button onClick={onClose} style={{ marginLeft: "auto" }}>Close</button>
        </div>

        {state.creditDebt === 0 && (
          <p style={{ marginTop: 10 }}>
            ✅ Debt cleared! Credit score goes up and next game unlocks after payoff.
          </p>
        )}
      </div>
    </div>
  );
}
