import { useEffect, useMemo, useState } from "react";

const SUBJECTS = {
  polish: "Język polski",
  math: "Matematyka",
  english: "Język angielski",
};

const BASE_MISSIONS = [
  {
    subject: "polish",
    topic: "Czytanie polecenia i wyszukiwanie informacji",
    examContext: "Na egzaminie z języka polskiego trzeba uważnie czytać tekst i polecenie. Część zadań wymaga zaznaczenia jednej odpowiedzi, a część odpowiedzi własnymi słowami.",
    learn: [
      "Najpierw sprawdź, o co dokładnie pyta polecenie.",
      "Potem znajdź w tekście fragment, który odpowiada na pytanie.",
      "Nie dopowiadaj rzeczy, których nie ma w tekście.",
    ],
    strategy: "Strategia 3 kroków: polecenie → fragment tekstu → odpowiedź własnymi słowami.",
    example: "Jeśli pytanie brzmi: Dlaczego bohater zmienił decyzję?, szukasz zdania, w którym pojawia się powód zmiany decyzji.",
    task: "Przeczytaj zdanie: 'Antek zamknął zeszyt, bo zrozumiał, że najpierw musi poprawić wcześniejsze błędy'. Pytanie: Dlaczego Antek zamknął zeszyt?",
    answer: "Bo zrozumiał, że najpierw musi poprawić wcześniejsze błędy.",
    hint: "Szukaj po słowie: bo.",
  },
  {
    subject: "polish",
    topic: "Lektura obowiązkowa: bohater i uzasadnienie",
    examContext: "W zadaniach z lektur nie wystarczy podać tytułu. Często trzeba dodać bohatera i uzasadnić odpowiedź sytuacją z utworu.",
    learn: [
      "Odpowiedź lekturowa ma trzy elementy: tytuł, bohater, sytuacja z lektury.",
      "Błąd rzeczowy w lekturze może zabrać punkt.",
      "Uzasadnienie musi pasować do treści książki.",
    ],
    strategy: "Schemat: Wybieram [bohatera], ponieważ [cecha]. Widać to, gdy [sytuacja z lektury].",
    example: "Nemeczek jest przykładem odwagi, bo mimo słabości przeciwstawia się silniejszym chłopcom i pozostaje lojalny wobec kolegów.",
    task: "Uzupełnij jedno zdanie: Bohaterem, który pokazuje odwagę, jest ________, ponieważ ________.",
    answer: "Przykład: Nemeczek, ponieważ mimo strachu nie zdradza przyjaciół i zachowuje lojalność.",
    hint: "Wybierz bohatera, którego znasz najlepiej. Najpierw cecha, potem sytuacja.",
  },
  {
    subject: "polish",
    topic: "Argument a przykład",
    examContext: "W języku polskim oceniana jest umiejętność argumentowania. Uczeń powinien odróżniać argument od przykładu.",
    learn: [
      "Argument mówi, dlaczego coś jest prawdą.",
      "Przykład pokazuje konkretną sytuację, która potwierdza argument.",
      "Najbezpieczniej pisać: argument + przykład z lektury.",
    ],
    strategy: "Argument: 'przyjaźń wymaga lojalności'. Przykład: konkretna scena z lektury, która to pokazuje.",
    example: "Argument: Odwaga nie zawsze oznacza siłę fizyczną. Przykład: Nemeczek jest słaby, ale postępuje odważnie.",
    task: "Wybierz, co jest argumentem: A) Nemeczek był członkiem chłopców z Placu Broni. B) Odwaga może polegać na obronie przyjaciół mimo strachu.",
    answer: "B. To argument, bo wyjaśnia ogólną myśl.",
    hint: "Argument jest bardziej ogólny. Przykład jest konkretnym wydarzeniem.",
  },
  {
    subject: "polish",
    topic: "Dłuższa wypowiedź: plan przed pisaniem",
    examContext: "W wypracowaniu oceniane są m.in. realizacja tematu, elementy twórcze albo retoryczne, kompetencje literackie, kompozycja, styl, język, ortografia i interpunkcja.",
    learn: [
      "Nie zaczynaj od pisania całego tekstu.",
      "Najpierw zrób plan: teza, argumenty, przykłady, zakończenie.",
      "Każdy akapit powinien mieć jedną funkcję.",
    ],
    strategy: "Plan minimum: 1) stanowisko, 2) argument z lektury, 3) drugi argument, 4) wniosek.",
    example: "Temat: Czy warto pomagać słabszym? Teza: Warto, bo pomoc buduje wspólnotę i pokazuje odpowiedzialność.",
    task: "Napisz tylko tezę do tematu: Czy odwaga jest ważniejsza niż siła?",
    answer: "Przykład: Odwaga jest ważniejsza niż siła, ponieważ pozwala człowiekowi postąpić właściwie mimo strachu.",
    hint: "Teza to jedno zdanie z jasnym stanowiskiem.",
  },
  {
    subject: "math",
    topic: "Diagramy, dane i ułamki",
    examContext: "W matematyce pojawiają się zadania z odczytywaniem danych z diagramów i opisywaniem części całości ułamkiem.",
    learn: [
      "Najpierw odczytaj wszystkie dane.",
      "Potem sprawdź, o jaką część pyta zadanie.",
      "Ułamek zapisuje relację: część / całość.",
    ],
    strategy: "Pytanie o część: liczba wybranych elementów dzielona przez liczbę wszystkich elementów.",
    example: "Jeśli w klasie 6 osób wybrało piłkę, a wszystkich jest 24, to część klasy to 6/24 = 1/4.",
    task: "W grupie jest 20 uczniów. 5 wybrało matematykę jako ulubiony przedmiot. Jaką część grupy stanowią?",
    answer: "5/20 = 1/4.",
    hint: "Część to 5, całość to 20.",
  },
  {
    subject: "math",
    topic: "Kolejność działań i potęgi",
    examContext: "Egzamin sprawdza sprawność rachunkową: kolejność działań, kwadraty, sześciany i działania na potęgach.",
    learn: [
      "Najpierw nawiasy.",
      "Potem potęgi.",
      "Potem mnożenie i dzielenie, a na końcu dodawanie i odejmowanie.",
    ],
    strategy: "Nie licz od lewej do prawej, jeśli w działaniu są potęgi albo nawiasy.",
    example: "2 + 3² = 2 + 9 = 11. Nie 5².",
    task: "Oblicz: 4 + 2² · 3",
    answer: "2² = 4, potem 4 · 3 = 12, potem 4 + 12 = 16.",
    hint: "Najpierw potęga, potem mnożenie.",
  },
  {
    subject: "math",
    topic: "Ułamki dziesiętne w zadaniu tekstowym",
    examContext: "W zadaniach praktycznych trzeba połączyć obliczenia z treścią zadania. Ważne jest zapisanie, co oznacza wynik.",
    learn: [
      "Najpierw wypisz dane.",
      "Potem wybierz działanie.",
      "Na końcu odpowiedz pełnym zdaniem.",
    ],
    strategy: "Dane → działanie → wynik → odpowiedź z jednostką.",
    example: "3 bilety po 4,50 zł kosztują 3 · 4,50 = 13,50 zł.",
    task: "Jedna bułka kosztuje 1,80 zł. Ile kosztują 4 bułki?",
    answer: "4 · 1,80 zł = 7,20 zł.",
    hint: "To jest powtarzanie tej samej ceny 4 razy.",
  },
  {
    subject: "math",
    topic: "Algebra: podstawianie i redukcja",
    examContext: "Na egzaminie pojawiają się wyrażenia algebraiczne: obliczanie wartości i redukowanie wyrazów podobnych.",
    learn: [
      "Litera oznacza liczbę.",
      "Wyrazy podobne mają tę samą literę w tej samej potędze.",
      "Przy podstawianiu najpierw wpisz liczbę za literę.",
    ],
    strategy: "Dla x = 3 wyrażenie 2x + 5 oznacza 2 · 3 + 5.",
    example: "2x + 5 dla x = 3: 2 · 3 + 5 = 11.",
    task: "Oblicz wartość wyrażenia 3x - 2 dla x = 4.",
    answer: "3 · 4 - 2 = 12 - 2 = 10.",
    hint: "Zamień x na 4.",
  },
  {
    subject: "math",
    topic: "Geometria: kąty w trójkącie",
    examContext: "W geometrii trzeba znać własności figur, np. sumę kątów w trójkącie i własności trójkąta równoramiennego.",
    learn: [
      "Suma kątów w każdym trójkącie to 180°.",
      "W trójkącie równoramiennym kąty przy podstawie są równe.",
      "Najpierw zapisz znane kąty, potem odejmij od 180°.",
    ],
    strategy: "Brakujący kąt = 180° - suma znanych kątów.",
    example: "Jeśli kąty mają 50° i 60°, trzeci kąt to 180° - 110° = 70°.",
    task: "W trójkącie dwa kąty mają 45° i 75°. Ile ma trzeci kąt?",
    answer: "180° - 45° - 75° = 60°.",
    hint: "Dodaj znane kąty i odejmij od 180°.",
  },
  {
    subject: "english",
    topic: "Listening: jak słuchać nagrania",
    examContext: "W arkuszu z języka angielskiego zadania ze słuchania są odtwarzane dwukrotnie. To oznacza, że pierwsze słuchanie służy sensowi, a drugie sprawdzeniu szczegółów.",
    learn: [
      "Przed nagraniem przeczytaj odpowiedzi.",
      "W pierwszym słuchaniu złap ogólny sens.",
      "W drugim słuchaniu potwierdź konkretny szczegół.",
    ],
    strategy: "Nie tłumacz każdego słowa. Szukaj informacji potrzebnej do odpowiedzi.",
    example: "Jeśli pytanie dotyczy ulubionego sportu, słuchaj nazw sportów i zdań typu I love / my favourite.",
    task: "Usłyszysz zdanie: 'I sometimes go running, but I love swimming in summer.' Jaki sport jest najważniejszy dla mówiącej osoby?",
    answer: "Swimming.",
    hint: "Słowo 'love' jest mocniejszą wskazówką niż 'sometimes'.",
  },
  {
    subject: "english",
    topic: "Grammar: will, have to, don't have to",
    examContext: "W zadaniach otwartych trzeba uzupełnić zdanie tak, aby zachować sens po polsku i poprawność gramatyczną po angielsku.",
    learn: [
      "Will używamy często do przyszłości.",
      "Have to oznacza 'musieć'.",
      "Don't have to oznacza 'nie musieć'.",
    ],
    strategy: "Najpierw rozpoznaj polski sens, potem dobierz konstrukcję po angielsku.",
    example: "Oni skończą projekt: They will finish the project.",
    task: "Przetłumacz fragment: 'nie musimy' w zdaniu: We ______ get up early this week.",
    answer: "don't have to.",
    hint: "Nie musimy to nie zakaz. To brak obowiązku.",
  },
  {
    subject: "english",
    topic: "E-mail egzaminacyjny: 3 informacje",
    examContext: "W zadaniu pisemnym z angielskiego trzeba rozwinąć wszystkie podpunkty. Oceniane są: przekazanie informacji, spójność, zakres słownictwa i poprawność językowa.",
    learn: [
      "Najpierw wypisz trzy informacje z polecenia.",
      "Każdą informację rozwiń w osobnym zdaniu.",
      "Nie pisz bardzo krótko: osoba czytająca musi zrozumieć sytuację.",
    ],
    strategy: "Plan e-maila: greeting → reason → reaction → future contact → ending.",
    example: "I have to leave the club because my family is moving to another city.",
    task: "Napisz jedno zdanie po angielsku: Wyjaśnij, że odchodzisz z klubu, bo masz za dużo nauki.",
    answer: "I have to leave the club because I have too much schoolwork.",
    hint: "Użyj: I have to leave... because...",
  },
];

function generateCompressedPlan(days) {
  const clamped = Math.max(5, Math.min(30, Number(days) || 30));
  const mode = clamped <= 5 ? "exam" : clamped <= 10 ? "intense" : clamped <= 20 ? "balanced" : "normal";
  return Array.from({ length: clamped }, (_, i) => {
    const missionIndex = Math.floor((i / clamped) * BASE_MISSIONS.length);
    return { day: i + 1, mode, mission: BASE_MISSIONS[missionIndex % BASE_MISSIONS.length] };
  });
}

function speak(text, enabled) {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pl-PL";
  utterance.rate = 0.86;
  utterance.pitch = 0.95;
  window.speechSynthesis.speak(utterance);
}

function getLevel(doneCount) {
  if (doneCount >= 20) return "Mistrz egzaminu";
  if (doneCount >= 10) return "Strateg";
  if (doneCount >= 5) return "Odkrywca";
  return "Start";
}

export default function Home() {
  const [days, setDays] = useState(30);
  const [plan, setPlan] = useState(() => generateCompressedPlan(30));
  const [activeDay, setActiveDay] = useState(1);
  const [step, setStep] = useState(0);
  const [voiceOn, setVoiceOn] = useState(false);
  const [view, setView] = useState("student");
  const [showAnswer, setShowAnswer] = useState(false);
  const [events, setEvents] = useState({ help: 0, idle: 0, audio: 0, done: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mentor8-state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.days) setDays(parsed.days);
        if (parsed.activeDay) setActiveDay(parsed.activeDay);
        if (parsed.voiceOn !== undefined) setVoiceOn(parsed.voiceOn);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.days) setPlan(generateCompressedPlan(parsed.days));
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("mentor8-state", JSON.stringify({ days, activeDay, voiceOn, events }));
    } catch (_) {}
  }, [days, activeDay, voiceOn, events]);

  const current = plan[Math.min(activeDay - 1, plan.length - 1)] || plan[0];
  const mission = current.mission;
  const doneCount = events.done || 0;
  const level = getLevel(doneCount);

  const lessonSteps = useMemo(() => [
    `Misja: ${mission.topic}`,
    `Kontekst egzaminacyjny: ${mission.examContext}`,
    `Nauka 1: ${mission.learn[0]}`,
    `Nauka 2: ${mission.learn[1]}`,
    `Nauka 3: ${mission.learn[2]}`,
    `Strategia: ${mission.strategy}`,
    `Przykład: ${mission.example}`,
    `Zadanie: ${mission.task}`,
  ], [mission]);

  const currentText = lessonSteps[Math.min(step, lessonSteps.length - 1)];

  function nextStep() {
    setShowAnswer(false);
    if (step < lessonSteps.length - 1) {
      const next = step + 1;
      setStep(next);
      speak(lessonSteps[next], voiceOn);
    } else {
      setEvents((e) => ({ ...e, done: (e.done || 0) + 1 }));
      if (activeDay < plan.length) setActiveDay(activeDay + 1);
      setStep(0);
      speak("Koniec tej misji. To wystarczy na teraz.", voiceOn);
    }
  }

  function startMission() {
    setStep(0);
    setShowAnswer(false);
    speak(lessonSteps[0], voiceOn);
  }

  function help() {
    setEvents((e) => ({ ...e, help: (e.help || 0) + 1 }));
    speak(mission.hint, voiceOn);
    alert(`Pomoc: ${mission.hint}`);
  }

  function repeat() {
    setEvents((e) => ({ ...e, audio: (e.audio || 0) + 1 }));
    speak(currentText, voiceOn);
  }

  function applyCompression() {
    const nextPlan = generateCompressedPlan(days);
    setPlan(nextPlan);
    setActiveDay(1);
    setStep(0);
  }

  const modeLabel = current.mode === "exam" ? "Tryb egzaminowy" : current.mode === "intense" ? "Tryb intensywny" : current.mode === "balanced" ? "Tryb zbalansowany" : "Tryb normalny";

  return (
    <main className="page">
      <style jsx>{`
        .page { min-height: 100vh; background: radial-gradient(circle at top left, #18233f, #08111f 50%, #05080f); color: #e5f0ff; font-family: Inter, Arial, sans-serif; padding: 24px; }
        .shell { max-width: 1120px; margin: 0 auto; }
        .top { display:flex; justify-content:space-between; gap:16px; align-items:center; margin-bottom:24px; }
        .brand { display:flex; flex-direction:column; gap:4px; }
        .brand h1 { margin:0; font-size: 34px; letter-spacing:-0.04em; }
        .brand p { margin:0; color:#9db2d3; }
        .nav { display:flex; gap:10px; flex-wrap:wrap; }
        button, input { font: inherit; }
        .btn { border:1px solid rgba(148,163,184,.25); background:rgba(15,23,42,.75); color:#e5f0ff; padding:12px 16px; border-radius:16px; cursor:pointer; }
        .btn:hover { background:rgba(30,41,59,.9); }
        .primary { background: linear-gradient(135deg, #2dd4bf, #3b82f6); border:none; color:#02111f; font-weight:800; }
        .danger { background:rgba(127,29,29,.35); }
        .grid { display:grid; grid-template-columns: 1.2fr .8fr; gap:20px; }
        .card { background:rgba(15,23,42,.76); border:1px solid rgba(148,163,184,.18); border-radius:28px; padding:24px; box-shadow: 0 16px 50px rgba(0,0,0,.22); }
        .mission { min-height: 430px; display:flex; flex-direction:column; justify-content:space-between; }
        .small { color:#9db2d3; font-size:14px; }
        .pill { display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:999px; background:rgba(45,212,191,.12); color:#99f6e4; font-size:14px; margin-right:8px; margin-bottom:8px; }
        .lessonText { font-size:26px; line-height:1.35; letter-spacing:-0.02em; margin:24px 0; }
        .context { background:rgba(59,130,246,.12); border:1px solid rgba(59,130,246,.25); padding:14px; border-radius:18px; color:#bfdbfe; margin-top:14px; }
        .controls { display:flex; flex-wrap:wrap; gap:12px; margin-top:18px; }
        .map { display:grid; grid-template-columns: repeat(10, 1fr); gap:8px; margin-top:16px; }
        .dot { height:34px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:rgba(148,163,184,.14); color:#94a3b8; font-size:13px; }
        .dot.active { background:#2dd4bf; color:#031018; font-weight:800; }
        .dot.done { background:rgba(34,197,94,.35); color:#bbf7d0; }
        .settingRow { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid rgba(148,163,184,.12); }
        .input { width:90px; padding:10px; border-radius:12px; border:1px solid rgba(148,163,184,.3); background:#07111f; color:white; }
        .answer { margin-top:16px; padding:16px; border-radius:18px; background:rgba(34,197,94,.12); color:#bbf7d0; border:1px solid rgba(34,197,94,.25); }
        .source { font-size:13px; color:#8ea3c2; line-height:1.45; }
        @media(max-width: 860px) { .grid { grid-template-columns: 1fr; } .top { flex-direction:column; align-items:flex-start; } .lessonText { font-size:22px; } }
      `}</style>
      <div className="shell">
        <header className="top">
          <div className="brand">
            <h1>Mentor8</h1>
            <p>AI edukator egzaminacyjny: więcej kontekstu, mniej chaosu.</p>
          </div>
          <div className="nav">
            <button className="btn" onClick={() => setView("student")}>Uczeń</button>
            <button className="btn" onClick={() => setView("parent")}>Panel rodzica</button>
            <button className="btn" onClick={() => setView("compressor")}>Kompresor</button>
          </div>
        </header>

        {view === "student" && (
          <section className="grid">
            <div className="card mission">
              <div>
                <span className="pill">Dzień {activeDay} z {plan.length}</span>
                <span className="pill">{SUBJECTS[mission.subject]}</span>
                <span className="pill">{modeLabel}</span>
                <h2>{mission.topic}</h2>
                <div className="context">{mission.examContext}</div>
                <p className="lessonText">{currentText}</p>
                {showAnswer && <div className="answer"><strong>Odpowiedź / wzór:</strong><br />{mission.answer}</div>}
              </div>
              <div className="controls">
                <button className="btn primary" onClick={startMission}>▶ Start misji</button>
                <button className="btn primary" onClick={nextStep}>Dalej</button>
                <button className="btn" onClick={help}>Pomóż mi</button>
                <button className="btn" onClick={() => setShowAnswer(!showAnswer)}>{showAnswer ? "Ukryj odpowiedź" : "Pokaż odpowiedź"}</button>
                <button className="btn" onClick={repeat}>Powtórz głosem</button>
              </div>
            </div>

            <aside className="card">
              <h3>Ustawienia</h3>
              <div className="settingRow">
                <div>
                  <strong>Głos</strong>
                  <div className="small">Możesz całkowicie wyłączyć czytanie.</div>
                </div>
                <button className={voiceOn ? "btn primary" : "btn"} onClick={() => { window.speechSynthesis?.cancel(); setVoiceOn(!voiceOn); }}>
                  {voiceOn ? "ON" : "OFF"}
                </button>
              </div>
              <div className="settingRow">
                <div>
                  <strong>Poziom</strong>
                  <div className="small">{level}</div>
                </div>
                <div>{doneCount * 10} XP</div>
              </div>
              <h3>Mapa</h3>
              <div className="map">
                {plan.map((p) => (
                  <button key={p.day} className={`dot ${p.day === activeDay ? "active" : ""} ${p.day < activeDay ? "done" : ""}`} onClick={() => { setActiveDay(p.day); setStep(0); }}>
                    {p.day}
                  </button>
                ))}
              </div>
            </aside>
          </section>
        )}

        {view === "compressor" && (
          <section className="card">
            <h2>Kompresor materiału</h2>
            <p className="small">Ustaw, ile dni zostało do egzaminu. System nie robi jednej długiej lekcji. Układa krótkie, merytoryczne misje z kontekstem.</p>
            <div className="controls">
              <input className="input" type="number" min="5" max="30" value={days} onChange={(e) => setDays(e.target.value)} />
              <button className="btn primary" onClick={applyCompression}>Zastosuj plan</button>
              <button className="btn" onClick={() => { setDays(30); setPlan(generateCompressedPlan(30)); setActiveDay(1); }}>Wróć do 30 dni</button>
            </div>
            <p>Tryb po zastosowaniu: <strong>{generateCompressedPlan(days)[0]?.mode}</strong></p>
          </section>
        )}

        {view === "parent" && (
          <section className="grid">
            <div className="card">
              <h2>Panel rodzica</h2>
              <p>Ukończone misje: {events.done || 0}</p>
              <p>Użycia pomocy: {events.help || 0}</p>
              <p>Użycia audio: {events.audio || 0}</p>
              <p>Aktualny dzień: {activeDay} / {plan.length}</p>
              <p>Rekomendacja: jeśli dziecko traci zainteresowanie, utrzymaj głos OFF albo używaj go tylko do powtórzenia kroku. Nie przedłużaj sesji po ukończeniu misji.</p>
              <button className="btn danger" onClick={() => { setEvents({help:0,idle:0,audio:0,done:0}); setActiveDay(1); setStep(0); }}>Reset postępów</button>
            </div>
            <div className="card source">
              <h3>Na czym oparto treści?</h3>
              <p>Polski: czytanie poleceń, lektury obowiązkowe, argumentacja i kryteria dłuższej wypowiedzi.</p>
              <p>Matematyka: dane/diagramy, ułamki, kolejność działań, potęgi, algebra, zadania tekstowe i geometria.</p>
              <p>Angielski: słuchanie, gramatyka użytkowa i e-mail egzaminacyjny.</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
