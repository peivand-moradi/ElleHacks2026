import { useMemo, useState } from "react";

function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export default function QuickMath({ reward, onFinish }) {
  const questions = useMemo(() => {
    return Array.from({ length: 5 }, () => {
      const x = randInt(1, 12);
      const y = randInt(1, 12);
      return { x, y, ans: x + y };
    });
  }, []);

  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(0);

  const q = questions[idx];

  function submit() {
    const val = Number(input);
    if (!Number.isNaN(val) && val === q.ans) setCorrect(c => c + 1);
    setInput("");
    if (idx === questions.length - 1) {
      onFinish(correct + (val === q.ans ? 1 : 0));
    } else {
      setIdx(i => i + 1);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Quick Math 🧠</h2>
      <p>Question {idx + 1}/5</p>

      <div style={{ fontSize: 24, margin: "12px 0" }}>
        {q.x} + {q.y} = ?
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: 8, width: 120 }}
      />

      <button onClick={submit} style={{ marginLeft: 8 }}>
        Submit
      </button>

      <p style={{ marginTop: 12 }}>Correct so far: {correct}</p>
      <p>Finish to earn up to +{reward} coins.</p>
    </div>
  );
}
