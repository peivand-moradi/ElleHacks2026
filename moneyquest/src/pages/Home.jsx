export default function Home({ setPage }) {
  return (
    <div className="page page-home">
      <h2>Credit Crust 🍕</h2>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button className="building game-btn" onClick={() => setPage("games")}></button>
        <button className="building grocery-btn" onClick={() => setPage("grocery")}></button>
        <button className="building kitchen-btn" onClick={() => setPage("kitchen")}></button>
      </div>
    </div>
  );
}
