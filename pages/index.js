import { useEffect, useMemo, useState } from "react";

const BASE_PLAN = [
  { subject: "Matematyka", topic: "Procenty: 10%, 25%, 50%", skill: "Obliczanie części liczby", steps: ["Procent to część ze 100.", "10% liczby obliczamy, dzieląc ją przez 10.", "50% liczby to połowa.", "Zadanie: oblicz 10% z 120."] },
  { subject: "Polski", topic: "Czytanie ze zrozumieniem", skill: "Wyszukiwanie informacji w tekście", steps: ["Najpierw czytamy pytanie.", "Potem szukamy w tekście fragmentu, który odpowiada na pytanie.", "Nie zgadujemy. Korzystamy z tekstu.", "Zadanie: wskaż jedno zdanie, które odpowiada na pytanie."] },
  { subject: "Matematyka", topic: "Procenty w zadaniach tekstowych", skill: "Obniżki i podwyżki", steps: ["Najpierw ustalamy cenę początkową.", "Potem liczymy procent zmiany.", "Na końcu dodajemy albo odejmujemy wynik.", "Zadanie: cena 200 zł spada o 10%. Jaka jest nowa cena?"] },
  { subject: "Angielski", topic: "Present Simple", skill: "Zdania twierdzące", steps: ["Present Simple opisuje rutynę i fakty.", "Dla I, you, we, they używamy zwykłego czasownika.", "Dla he, she, it dodajemy -s.", "Zadanie: uzupełnij: He ___ football. (play)"] },
  { subject: "Matematyka", topic: "Równania proste", skill: "Rozwiązywanie równań", steps: ["Równanie ma dwie strony.", "Chcemy zostawić x samo po jednej stronie.", "Robimy to samo po obu stronach równania.", "Zadanie: rozwiąż x + 5 = 12."] },
  { subject: "Polski", topic: "Lektury: motyw bohatera", skill: "Łączenie postaci z cechą", steps: ["Motyw to powtarzający się temat w utworze.", "Bohater może pokazywać odwagę, samotność albo przemianę.", "Najpierw wybieramy cechę, potem przykład z lektury.", "Zadanie: podaj jedną cechę wybranego bohatera."] },
  { subject: "Matematyka", topic: "Geometria: pola figur", skill: "Pole prostokąta i trójkąta", steps: ["Pole prostokąta to bok razy bok.", "Pole trójkąta to podstawa razy wysokość podzielone przez 2.", "Najpierw zapisujemy wzór.", "Zadanie: oblicz pole prostokąta 4 cm na 6 cm."] },
  { subject: "Angielski", topic: "Past Simple", skill: "Czas przeszły", steps: ["Past Simple opisuje zakończone wydarzenia.", "Czasowniki regularne dostają końcówkę -ed.", "Czasowniki nieregularne trzeba znać osobno.", "Zadanie: wpisz formę przeszłą: go → ?"] },
  { subject: "Matematyka", topic: "Ułamki zwykłe", skill: "Dodawanie ułamków", steps: ["Gdy mianowniki są takie same, dodajemy liczniki.", "Mianownik zostaje bez zmian.", "Na końcu sprawdzamy, czy da się skrócić wynik.", "Zadanie: oblicz 2/7 + 3/7."] },
  { subject: "Polski", topic: "Rozprawka: teza", skill: "Formułowanie stanowiska", steps: ["Teza to Twoje stanowisko.", "Powinna być jasna i krótka.", "Potem dobieramy argumenty.", "Zadanie: napisz tezę do tematu: Czy warto pomagać innym?"] },
  { subject: "Matematyka", topic: "Zadania tekstowe", skill: "Wydobywanie danych", steps: ["Najpierw wypisujemy dane z treści.", "Potem ustalamy, czego szukamy.", "Dopiero potem liczymy.", "Zadanie: Ania ma 3 razy więcej monet niż Ola. Ola ma 4 monety. Ile ma Ania?"] },
  { subject: "Angielski", topic: "Słownictwo: szkoła", skill: "Rozpoznawanie znaczeń", steps: ["Uczymy się małych grup słów.", "Nie trzeba zapamiętać wszystkiego naraz.", "Najpierw 3 słowa: lesson, subject, homework.", "Zadanie: co oznacza homework?"] },
  { subject: "Matematyka", topic: "Skala i jednostki", skill: "Zamiana jednostek", steps: ["1 metr to 100 centymetrów.", "1 kilometr to 1000 metrów.", "Zawsze sprawdzamy jednostkę w odpowiedzi.", "Zadanie: ile centymetrów ma 2,5 metra?"] },
  { subject: "Polski", topic: "Środki stylistyczne", skill: "Rozpoznawanie porównania", steps: ["Porównanie zestawia dwie rzeczy.", "Często używa słów: jak, niczym, jakby.", "Szukamy tych słów w zdaniu.", "Zadanie: wskaż porównanie w zdaniu: Szybki jak wiatr."] },
  { subject: "Matematyka", topic: "Powtórka procentów", skill: "Procent liczby", steps: ["Wracamy do procentów.", "10% to jedna dziesiąta.", "20% to dwa razy 10%.", "Zadanie: oblicz 20% z 150."] },
  { subject: "Polski", topic: "Analiza polecenia", skill: "Rozumienie czasowników polecenia", steps: ["Polecenie mówi, co dokładnie zrobić.", "Wyjaśnij oznacza: napisz przyczynę lub sens.", "Uzasadnij oznacza: podaj argument.", "Zadanie: co trzeba zrobić, gdy polecenie brzmi: uzasadnij?"] },
  { subject: "Angielski", topic: "Funkcje językowe", skill: "Prośba i reakcja", steps: ["Funkcje językowe to krótkie reakcje.", "Can you help me? oznacza prośbę o pomoc.", "Odpowiedź: Sure albo Of course.", "Zadanie: wybierz dobrą odpowiedź: Can you help me?"] },
  { subject: "Matematyka", topic: "Bryły", skill: "Objętość prostopadłościanu", steps: ["Objętość mówi, ile miejsca zajmuje bryła.", "Dla prostopadłościanu mnożymy trzy wymiary.", "Wzór: długość razy szerokość razy wysokość.", "Zadanie: oblicz objętość 2 × 3 × 4."] },
  { subject: "Polski", topic: "Opowiadanie", skill: "Plan wydarzeń", steps: ["Opowiadanie ma początek, rozwinięcie i zakończenie.", "Najpierw robimy plan w punktach.", "Każdy punkt to jedno wydarzenie.", "Zadanie: wymyśl pierwszy punkt planu opowiadania."] },
  { subject: "Matematyka", topic: "Egzamin: zadanie mieszane", skill: "Łączenie działań", steps: ["W zadaniu mieszanym najpierw szukamy danych.", "Potem wybieramy działanie.", "Na końcu sprawdzamy sens odpowiedzi.", "Zadanie: 3 zeszyty po 4 zł i długopis za 5 zł. Ile razem?"] },
  { subject: "Angielski", topic: "Czytanie tekstu", skill: "Główna myśl tekstu", steps: ["Najpierw czytamy pytanie.", "Nie tłumaczymy każdego słowa.", "Szukamy ogólnego sensu.", "Zadanie: wybierz tytuł dla krótkiego tekstu o szkole."] },
  { subject: "Matematyka", topic: "Równania z nawiasem", skill: "Uproszczenie wyrażenia", steps: ["Nawias rozwiązujemy zgodnie z kolejnością działań.", "Najpierw mnożenie przez nawias, jeśli występuje.", "Potem przenosimy liczby.", "Zadanie: rozwiąż 2x = 10."] },
  { subject: "Polski", topic: "Lektury: argumenty", skill: "Dobór przykładu", steps: ["Argument powinien pasować do tezy.", "Przykład z lektury wzmacnia argument.", "Nie streszczamy całej lektury.", "Zadanie: podaj jedną lekturę, która pasuje do tematu przyjaźni."] },
  { subject: "Matematyka", topic: "Diagramy i wykresy", skill: "Odczytywanie danych", steps: ["Najpierw czytamy tytuł wykresu.", "Potem sprawdzamy osie albo legendę.", "Dopiero potem odpowiadamy.", "Zadanie: co trzeba sprawdzić jako pierwsze na wykresie?"] },
  { subject: "Angielski", topic: "Pisanie krótkiej wiadomości", skill: "E-mail", steps: ["Krótka wiadomość ma powitanie, treść i zakończenie.", "Piszemy prosto.", "Najpierw odpowiadamy na punkty z polecenia.", "Zadanie: napisz jedno zdanie: Dziękuję za wiadomość."] },
  { subject: "Matematyka", topic: "Powtórka geometrii", skill: "Wzory", steps: ["Przypominamy wzory.", "Prostokąt: a razy b.", "Trójkąt: a razy h podzielone przez 2.", "Zadanie: który wzór dotyczy trójkąta?"] },
  { subject: "Polski", topic: "Wypracowanie: zakończenie", skill: "Wniosek", steps: ["Zakończenie nie musi być długie.", "Ma podsumować Twoje stanowisko.", "Nie dodajemy nowych argumentów.", "Zadanie: napisz jedno zdanie podsumowania."] },
  { subject: "Matematyka", topic: "Mini test", skill: "Sprawdzenie gotowości", steps: ["To jest spokojny mini test.", "Nie mierzymy czasu.", "Robimy jedno zadanie naraz.", "Zadanie: oblicz 25% z 80."] },
  { subject: "Polski", topic: "Powtórka egzaminacyjna", skill: "Tekst i argument", steps: ["Powtarzamy najważniejsze zasady.", "Czytamy polecenie uważnie.", "Odpowiadamy konkretnie.", "Zadanie: czym różni się teza od argumentu?"] },
  { subject: "Mix", topic: "Finalna spokojna misja", skill: "Utrwalenie", steps: ["To ostatni dzień planu.", "Robimy tylko spokojne utrwalenie.", "Celem jest kontrola, nie pośpiech.", "Zadanie: wybierz temat, który chcesz powtórzyć jeszcze raz."] }
];

function levelName(day) {
  if (day < 6) return "Odkrywca";
  if (day < 16) return "Strateg";
  if (day < 26) return "Nawigator";
  return "Mistrz Egzaminu";
}

function compressionMode(days) {
  if (days <= 5) return "exam";
  if (days <= 10) return "intense";
  if (days <= 20) return "balanced";
  return "normal";
}

function maxSteps(mode, engagementMode) {
  if (engagementMode === "ultra") return 2;
  if (engagementMode === "challenge") return 6;
  if (mode === "exam") return 2;
  if (mode === "intense") return 3;
  if (mode === "balanced") return 4;
  return 4;
}

function makeCompressedPlan(days) {
  const d = Math.max(5, Math.min(30, Number(days) || 30));
  const mode = compressionMode(d);
  const ratio = BASE_PLAN.length / d;
  return Array.from({ length: d }, (_, i) => {
    const start = Math.floor(i * ratio);
    const end = Math.floor((i + 1) * ratio);
    const items = BASE_PLAN.slice(start, Math.max(end, start + 1));
    return { day: i + 1, mode, items };
  });
}

function readLS(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeLS(key, value) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
}

export default function Home() {
  const [view, setView] = useState("student");
  const [days, setDays] = useState(30);
  const [plan, setPlan] = useState(() => makeCompressedPlan(30));
  const [currentDay, setCurrentDay] = useState(1);
  const [missionIndex, setMissionIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState({});
  const [engagement, setEngagement] = useState({ help: 0, audio: 0, idle: 0, finish: 0, stop: 0 });
  const [listening, setListening] = useState(false);

  useEffect(() => {
    setProgress(readLS("m8_progress", {}));
    setEngagement(readLS("m8_engagement", { help: 0, audio: 0, idle: 0, finish: 0, stop: 0 }));
    const savedDays = readLS("m8_days", 30);
    setDays(savedDays);
    setPlan(makeCompressedPlan(savedDays));
    setCurrentDay(readLS("m8_currentDay", 1));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (started) updateEngagement("idle");
    }, 45000);
    return () => clearTimeout(timer);
  }, [started, step]);

  const today = plan[Math.max(0, currentDay - 1)] || plan[0];
  const mission = today.items[Math.min(missionIndex, today.items.length - 1)] || BASE_PLAN[0];
  const engagementMode = useMemo(() => {
    if ((engagement.idle || 0) >= 2 || (engagement.help || 0) >= 3 || (engagement.stop || 0) >= 2) return "ultra";
    if ((engagement.finish || 0) >= 5 && (engagement.help || 0) < 2) return "challenge";
    return "micro";
  }, [engagement]);
  const limit = maxSteps(today.mode, engagementMode);
  const steps = useMemo(() => {
    const intro = [`Misja: ${mission.topic}.`, "Zrobimy tylko jeden mały krok na raz."];
    return [...intro, ...mission.steps].slice(0, Math.max(3, limit + 1));
  }, [mission, limit]);

  function updateEngagement(type) {
    setEngagement(prev => {
      const next = { ...prev, [type]: (prev[type] || 0) + 1 };
      writeLS("m8_engagement", next);
      return next;
    });
  }

  function speak(text) {
    updateEngagement("audio");
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    utterance.rate = engagementMode === "ultra" ? 0.78 : 0.86;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function nextStep() {
    if (!started) setStarted(true);
    if (step < steps.length - 1) {
      const next = step + 1;
      setStep(next);
      speak(steps[next]);
    } else {
      finishMission();
    }
  }

  function finishMission() {
    updateEngagement("finish");
    const key = `${currentDay}-${missionIndex}`;
    const newProgress = { ...progress, [key]: { done: true, topic: mission.topic, subject: mission.subject, date: new Date().toISOString() } };
    setProgress(newProgress);
    writeLS("m8_progress", newProgress);

    if (missionIndex < today.items.length - 1) {
      setMissionIndex(missionIndex + 1);
      setStep(0);
      setStarted(false);
    } else {
      const nextDay = Math.min(currentDay + 1, plan.length);
      setCurrentDay(nextDay);
      writeLS("m8_currentDay", nextDay);
      setMissionIndex(0);
      setStep(0);
      setStarted(false);
    }
  }

  function help() {
    updateEngagement("help");
    speak("Zatrzymujemy się. Zrobimy tylko pierwszy krok. Przeczytaj spokojnie jedno zdanie.");
  }

  function stop() {
    updateEngagement("stop");
    setStarted(false);
    speak("Możemy zakończyć. To wystarczy na teraz.");
  }

  function applyCompression() {
    const safe = Math.max(5, Math.min(30, Number(days) || 30));
    setDays(safe);
    setPlan(makeCompressedPlan(safe));
    setCurrentDay(1);
    setMissionIndex(0);
    setStep(0);
    setStarted(false);
    writeLS("m8_days", safe);
    writeLS("m8_currentDay", 1);
  }

  function startVoice() {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Twoja przeglądarka nie obsługuje rozpoznawania mowy. Użyj Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "pl-PL";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      if (text.includes("dalej") || text.includes("start")) nextStep();
      else if (text.includes("pomoc") || text.includes("nie rozumiem")) help();
      else if (text.includes("stop") || text.includes("koniec")) stop();
      else speak("Usłyszałem. Możesz powiedzieć: dalej, pomoc albo stop.");
    };
    recognition.start();
  }

  const completed = Object.keys(progress).length;
  const totalMissions = plan.reduce((sum, d) => sum + d.items.length, 0);

  return (
    <main className="app">
      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #08111f; color: #e5edf7; font-family: Inter, Arial, sans-serif; }
        button, input { font-family: inherit; }
      `}</style>
      <style jsx>{`
        .app { min-height: 100vh; background: radial-gradient(circle at top left, #17335f, #08111f 42%, #050914); padding: 22px; }
        .shell { max-width: 1100px; margin: 0 auto; }
        .top { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:22px; }
        .brand { display:flex; align-items:center; gap:12px; }
        .logo { width:44px; height:44px; border-radius:14px; background: linear-gradient(135deg,#4ade80,#38bdf8); display:flex; align-items:center; justify-content:center; font-weight:900; color:#06101d; }
        .nav { display:flex; gap:8px; flex-wrap:wrap; }
        .nav button, .secondary { background: rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); color:#dbeafe; border-radius:12px; padding:10px 14px; cursor:pointer; }
        .active { background: rgba(56,189,248,.2) !important; border-color:#38bdf8 !important; }
        .grid { display:grid; grid-template-columns: 1.1fr .9fr; gap:18px; }
        .card { background: rgba(15,23,42,.78); border:1px solid rgba(148,163,184,.18); border-radius:26px; padding:24px; box-shadow: 0 18px 60px rgba(0,0,0,.25); }
        .mission { min-height: 430px; display:flex; flex-direction:column; justify-content:space-between; }
        .eyebrow { color:#93c5fd; font-weight:700; letter-spacing:.05em; text-transform:uppercase; font-size:12px; }
        h1 { margin: 0; font-size: 28px; }
        h2 { margin: 8px 0 0; font-size: 34px; line-height:1.1; }
        .bigStep { font-size: 28px; line-height:1.35; margin: 32px 0; color:#f8fafc; }
        .meta { display:flex; gap:10px; flex-wrap:wrap; margin-top:14px; }
        .pill { padding:8px 10px; border-radius:999px; background:rgba(255,255,255,.08); color:#cbd5e1; font-size:14px; }
        .primary { background: linear-gradient(135deg,#22c55e,#38bdf8); color:#04101d; border:0; border-radius:18px; padding:18px 24px; font-size:19px; font-weight:900; cursor:pointer; box-shadow:0 12px 30px rgba(34,197,94,.22); }
        .actions { display:flex; gap:10px; flex-wrap:wrap; }
        .map { display:grid; grid-template-columns: repeat(10, 1fr); gap:8px; margin-top:12px; }
        .dot { height:32px; border-radius:12px; background:rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; font-size:12px; color:#94a3b8; }
        .done { background:rgba(34,197,94,.25); color:#bbf7d0; }
        .today { outline:2px solid #38bdf8; color:#e0f2fe; }
        .stats { display:grid; grid-template-columns: repeat(2,1fr); gap:10px; margin-top:12px; }
        .stat { background:rgba(255,255,255,.06); border-radius:18px; padding:14px; }
        .stat strong { display:block; font-size:24px; }
        input { width:120px; background:#020617; color:white; border:1px solid rgba(148,163,184,.35); border-radius:12px; padding:12px; font-size:18px; }
        .hint { color:#94a3b8; line-height:1.55; }
        @media (max-width: 850px) { .grid { grid-template-columns: 1fr; } .bigStep { font-size:24px; } .top { align-items:flex-start; flex-direction:column; } }
      `}</style>

      <div className="shell">
        <header className="top">
          <div className="brand">
            <div className="logo">M8</div>
            <div>
              <h1>Mentor8</h1>
              <div className="hint">AI edukator: mikro-misje, głos, adaptacja</div>
            </div>
          </div>
          <nav className="nav">
            <button onClick={() => setView("student")} className={view === "student" ? "active" : ""}>Uczeń</button>
            <button onClick={() => setView("compressor")} className={view === "compressor" ? "active" : ""}>Kompresor</button>
            <button onClick={() => setView("parent")} className={view === "parent" ? "active" : ""}>Rodzic</button>
          </nav>
        </header>

        {view === "student" && (
          <div className="grid">
            <section className="card mission">
              <div>
                <div className="eyebrow">Dzień {currentDay} z {plan.length}</div>
                <h2>{mission.topic}</h2>
                <div className="meta">
                  <span className="pill">{mission.subject}</span>
                  <span className="pill">Poziom: {levelName(currentDay)}</span>
                  <span className="pill">Tryb: {engagementMode}</span>
                  <span className="pill">Plan: {today.mode}</span>
                </div>
                <p className="bigStep">{started ? steps[step] : "Zrobimy dziś krótką misję. Jeden krok na raz."}</p>
              </div>
              <div className="actions">
                <button className="primary" onClick={() => { setStarted(true); speak(steps[step]); }}>{started ? "Powtórz krok" : "▶ Zacznij misję"}</button>
                <button className="secondary" onClick={nextStep}>Dalej</button>
                <button className="secondary" onClick={help}>Pomóż mi</button>
                <button className="secondary" onClick={startVoice}>{listening ? "Słucham..." : "🎙 Komenda"}</button>
                <button className="secondary" onClick={stop}>Stop</button>
              </div>
            </section>

            <aside className="card">
              <div className="eyebrow">Mapa misji</div>
              <div className="map">
                {plan.map((d) => {
                  const dayDone = d.items.every((_, idx) => progress[`${d.day}-${idx}`]);
                  return <div key={d.day} className={`dot ${dayDone ? "done" : ""} ${d.day === currentDay ? "today" : ""}`}>{d.day}</div>;
                })}
              </div>
              <div className="stats">
                <div className="stat"><span>Ukończone</span><strong>{completed}/{totalMissions}</strong></div>
                <div className="stat"><span>XP spokoju</span><strong>{completed * 10}</strong></div>
                <div className="stat"><span>Pomoc</span><strong>{engagement.help || 0}</strong></div>
                <div className="stat"><span>Audio</span><strong>{engagement.audio || 0}</strong></div>
              </div>
              <p className="hint">Komendy głosowe w Chrome: „dalej”, „pomoc”, „stop”.</p>
            </aside>
          </div>
        )}

        {view === "compressor" && (
          <section className="card">
            <div className="eyebrow">Kompresor materiału</div>
            <h2>Ustaw liczbę dni do egzaminu</h2>
            <p className="hint">Zakres: 5–30 dni. System skraca misje zamiast robić jedną długą lekcję.</p>
            <div className="actions" style={{ marginTop: 16 }}>
              <input type="number" min="5" max="30" value={days} onChange={(e) => setDays(e.target.value)} />
              <button className="primary" onClick={applyCompression}>Zastosuj plan</button>
              <button className="secondary" onClick={() => { setDays(30); setPlan(makeCompressedPlan(30)); writeLS("m8_days", 30); }}>Plan 30 dni</button>
            </div>
            <div className="stats">
              <div className="stat"><span>Tryb</span><strong>{compressionMode(days)}</strong></div>
              <div className="stat"><span>Dni</span><strong>{Math.max(5, Math.min(30, Number(days) || 30))}</strong></div>
            </div>
            <div className="map">
              {makeCompressedPlan(days).map((d) => <div key={d.day} className="dot">{d.day}</div>)}
            </div>
          </section>
        )}

        {view === "parent" && (
          <section className="card">
            <div className="eyebrow">Panel rodzica</div>
            <h2>Postęp i zachowanie</h2>
            <div className="stats">
              <div className="stat"><span>Misje ukończone</span><strong>{completed}</strong></div>
              <div className="stat"><span>Przerwania</span><strong>{engagement.stop || 0}</strong></div>
              <div className="stat"><span>Idle</span><strong>{engagement.idle || 0}</strong></div>
              <div className="stat"><span>Tryb adaptacji</span><strong>{engagementMode}</strong></div>
            </div>
            <p className="hint">Rekomendacja: jeżeli rośnie „idle” lub „pomoc”, zostaw tryb mikro/ultra i nie wydłużaj sesji. Celem jest powrót następnego dnia, nie przerobienie wszystkiego naraz.</p>
            <div className="actions">
              <button className="secondary" onClick={() => { localStorage.clear(); location.reload(); }}>Reset danych testowych</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
