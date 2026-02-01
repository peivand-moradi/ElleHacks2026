export default function Modal({ children, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ background: "white", padding: 16, borderRadius: 12, minWidth: 320 }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose}>✖</button>
        </div>
        {children}
      </div>
    </div>
  );
}
