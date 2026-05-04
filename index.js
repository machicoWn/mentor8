
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(0);

  const steps = [
    "Zrobimy jeden krok.",
    "Procent to część ze 100.",
    "10% to jedna dziesiąta.",
    "Oblicz 10% z 100.",
    "Koniec na dziś."
  ];

  return (
    <div style={{
      background: "#0f172a",
      color: "white",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "24px",
      textAlign: "center"
    }}>
      <h1>Mentor8</h1>
      <p>{steps[step]}</p>
      <button
        style={{
          padding: "20px",
          fontSize: "20px",
          marginTop: "20px"
        }}
        onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
      >
        ▶ Dalej
      </button>
    </div>
  );
}
