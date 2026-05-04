import { useEffect, useMemo, useState } from "react";

const SUBJECTS = {
  all: "Wszystkie",
  polish: "Język polski",
  math: "Matematyka",
  english: "Język angielski"
};

const CATEGORIES = {
  all: ["Wszystkie"],
  polish: ["Lektury", "Czytanie ze zrozumieniem", "Gramatyka", "Środki stylistyczne", "Pisanie"],
  math: ["Procenty i dane", "Działania", "Algebra", "Geometria", "Zadania tekstowe", "Prawdopodobieństwo"],
  english: ["Listening / rozumienie", "Reading", "Grammar", "Functions", "Vocabulary", "Writing"]
};

const LECTURES = [
  { title: "Chłopcy z Placu Broni", author: "Ferenc Molnár", fact: "Boka był liderem chłopców, a Nemeczek był najmłodszy i bardzo lojalny.", q: "Kto był liderem chłopców z Placu Broni?", answer: "Boka", wrong: ["Nemeczek", "Geréb", "Feri Acz"] },
  { title: "Zemsta", author: "Aleksander Fredro", fact: "Papkin dużo mówił o odwadze, ale często zachowywał się tchórzliwie.", q: "Który bohater Zemsty często udawał wielkiego odważnego rycerza?", answer: "Papkin", wrong: ["Rejent", "Cześnik", "Wacław"] },
  { title: "Kamienie na szaniec", author: "Aleksander Kamiński", fact: "Rudy, Alek i Zośka pokazują przyjaźń, odwagę i poświęcenie w czasie wojny.", q: "Która lektura opowiada o Rudym, Alku i Zośce?", answer: "Kamienie na szaniec", wrong: ["Balladyna", "Latarnik", "Opowieść wigilijna"] },
  { title: "Mały Książę", author: "Antoine de Saint-Exupéry", fact: "Lis uczy Małego Księcia, że najważniejsze relacje wymagają odpowiedzialności.", q: "Kto mówi Małemu Księciu o oswajaniu?", answer: "Lis", wrong: ["Król", "Latarnik", "Geograf"] },
  { title: "Opowieść wigilijna", author: "Charles Dickens", fact: "Scrooge zmienia się po spotkaniach z duchami i zaczyna dostrzegać innych ludzi.", q: "Który bohater przechodzi przemianę w Opowieści wigilijnej?", answer: "Ebenezer Scrooge", wrong: ["Nemeczek", "Papkin", "Bilbo Baggins"] },
  { title: "Balladyna", author: "Juliusz Słowacki", fact: "Balladyna popełnia zbrodnię z żądzy władzy i ponosi karę.", q: "Która bohaterka zabija siostrę, aby zdobyć władzę?", answer: "Balladyna", wrong: ["Alina", "Klara", "Róża"] },
  { title: "Latarnik", author: "Henryk Sienkiewicz", fact: "Skawiński to emigrant, który tęskni za ojczyzną.", q: "Jak nazywa się bohater Latarnika?", answer: "Skawiński", wrong: ["Soplica", "Wokulski", "Rzecki"] },
  { title: "Hobbit", author: "J.R.R. Tolkien", fact: "Bilbo Baggins wyrusza w podróż i stopniowo odkrywa odwagę.", q: "Kto jest głównym bohaterem Hobbita?", answer: "Bilbo Baggins", wrong: ["Frodo", "Aslan", "Nemeczek"] },
  { title: "Akademia Pana Kleksa", author: "Jan Brzechwa", fact: "Akademia pokazuje świat wyobraźni, nauki i zabawy.", q: "Kto prowadzi Akademię Pana Kleksa?", answer: "Pan Kleks", wrong: ["Pan Twardowski", "Profesor Dumbledore", "Geograf"] },
  { title: "Reduta Ordona", author: "Adam Mickiewicz", fact: "Utwór pokazuje poświęcenie i walkę o wolność.", q: "Reduta Ordona wiąże się przede wszystkim z motywem...", answer: "poświęcenia za ojczyznę", wrong: ["komizmu", "podróży kosmicznej", "magicznej szkoły"] }
];

const GRAMMAR_PL = [
  { topic: "strona czynna i bierna", q: "Które zdanie jest w stronie biernej?", answer: "List został napisany przez ucznia.", wrong: ["Uczeń napisał list.", "Uczeń pisze list.", "Uczeń napisze list."] },
  { topic: "wypowiedzenie złożone", q: "Które zdanie jest złożone?", answer: "Poszedłem do domu, ponieważ zaczął padać deszcz.", wrong: ["Pada deszcz.", "Lubię książki.", "To ciekawy film."] },
  { topic: "związek frazeologiczny", q: "Co oznacza frazeologizm 'mieć muchy w nosie'?", answer: "być w złym humorze", wrong: ["lubić owady", "biegać bardzo szybko", "czytać książkę"] },
  { topic: "części mowy", q: "Który wyraz jest czasownikiem?", answer: "czyta", wrong: ["książka", "zielony", "szybko"] },
  { topic: "argument", q: "Czym jest argument w wypowiedzi?", answer: "Uzasadnieniem stanowiska", wrong: ["Samym przykładem bez wyjaśnienia", "Tytułem tekstu", "Przypadkowym cytatem"] }
];

const STYLISTIC = [
  { name: "porównanie", marker: "jak", example: "odważny jak lew" },
  { name: "epitet", marker: "określenie rzeczownika", example: "ciemny las" },
  { name: "przenośnia", marker: "znaczenie niedosłowne", example: "morze łez" },
  { name: "apostrofa", marker: "bezpośredni zwrot", example: "Litwo! Ojczyzno moja!" },
  { name: "onomatopeja", marker: "naśladowanie dźwięku", example: "szum, stuk, huk" }
];

const EN_CONTEXTS = [
  { ctx: "Sam receives a parcel before a competition. He tries on the trainers and says they are perfect.", q: "What was in the parcel?", answer: "trainers", wrong: ["headphones", "a T-shirt", "a book"], explain: "W rozmowie pada: 'try the trainers on', więc w paczce były buty sportowe." },
  { ctx: "Jack cannot go by bike because something is wrong with the wheel. It will rain, so his mum decides to drive him.", q: "How will Jack get to school?", answer: "by car", wrong: ["by bike", "by bus", "on foot"], explain: "Autobus odpada, bo do przystanku jest daleko i ma padać. Mama zgadza się go zawieźć." },
  { ctx: "A girl is waiting in a queue to buy fruit for a class party after returning library books.", q: "Where is the girl probably calling from?", answer: "at a shop", wrong: ["at a doctor", "at school", "at the theatre"], explain: "Kupuje owoce i stoi w kolejce, więc jest w sklepie." },
  { ctx: "A girl asks James if she can bring her cousin to his party.", q: "What does the girl want James to do?", answer: "agree to something", wrong: ["lend money", "teach her English", "cancel the party"], explain: "Prosi o zgodę, aby przyprowadzić kuzyna." },
  { ctx: "The boy talks about actors, a stage, and a mystery based on Agatha Christie’s book.", q: "What is the boy talking about?", answer: "a play at the theatre", wrong: ["a football match", "a school test", "a computer game"], explain: "Słowa 'actors' i 'stage' wskazują teatr." }
];

const ENG_GRAMMAR = [
  { q: "I ____ football every Saturday.", answer: "play", wrong: ["plays", "playing", "played"], explain: "Present Simple: I/you/we/they + podstawowa forma czasownika." },
  { q: "She ____ to school yesterday.", answer: "went", wrong: ["go", "goes", "going"], explain: "Yesterday wskazuje Past Simple. Od 'go' forma przeszła to 'went'." },
  { q: "We ____ get up early this week. It is winter break.", answer: "don't have to", wrong: ["must", "has to", "had to"], explain: "Brak obowiązku: don't have to." },
  { q: "They ____ finish the project next Friday.", answer: "will", wrong: ["was", "did", "are yesterday"], explain: "Next Friday mówi o przyszłości, więc pasuje 'will'." },
  { q: "Can I borrow your pen?", answer: "Sure, here you are.", wrong: ["I am 14.", "It is Monday.", "I like pizza."], explain: "To pytanie o pozwolenie/prośbę, odpowiedź musi być adekwatna." }
];

const VOCAB = [
  ["journey", "podróż"], ["borrow", "pożyczyć od kogoś"], ["queue", "kolejka"], ["competition", "konkurs/zawody"], ["invite", "zaprosić"], ["advice", "rada"], ["opinion", "opinia"], ["reason", "powód"], ["future", "przyszłość"], ["past", "przeszłość"]
];

function shuffle(arr, seed) {
  const a = [...arr];
  let x = seed || 12345;
  for (let i = a.length - 1; i > 0; i--) {
    x = (x * 9301 + 49297) % 233280;
    const j = Math.floor((x / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestion({ subject, category, skill, lesson, question, answer, wrong, explanation, difficulty = 1, seed = 1 }) {
  const options = shuffle([answer, ...wrong], seed).map(String);
  return {
    id: `${subject}-${category}-${seed}`,
    subject,
    category,
    skill,
    lesson,
    question,
    options,
    correct: String(answer),
    explanation,
    difficulty
  };
}

function buildQuestions() {
  const qs = [];
  let seed = 1;

  for (let i = 0; i < 180; i++) {
    const l = LECTURES[i % LECTURES.length];
    qs.push(makeQuestion({
      subject: "polish", category: "Lektury", skill: "znajomość lektur i bohaterów",
      lesson: `Najpierw rozpoznaj lekturę i bohatera. W pytaniach o lektury nie zgadujemy: jeden błąd rzeczowy może zepsuć całą odpowiedź. ${l.fact}`,
      question: l.q, answer: l.answer, wrong: l.wrong,
      explanation: `Poprawna odpowiedź: ${l.answer}. ${l.fact}`,
      difficulty: 1 + (i % 3), seed: seed++
    }));
  }
  for (let i = 0; i < 80; i++) {
    const g = GRAMMAR_PL[i % GRAMMAR_PL.length];
    qs.push(makeQuestion({
      subject: "polish", category: "Gramatyka", skill: g.topic,
      lesson: `Zadanie sprawdza: ${g.topic}. Najpierw nazwij zjawisko językowe, potem wybierz odpowiedź.`,
      question: g.q, answer: g.answer, wrong: g.wrong,
      explanation: `Poprawna odpowiedź: ${g.answer}. To pasuje do kategorii: ${g.topic}.`,
      difficulty: 1 + (i % 3), seed: seed++
    }));
  }
  for (let i = 0; i < 70; i++) {
    const s = STYLISTIC[i % STYLISTIC.length];
    qs.push(makeQuestion({
      subject: "polish", category: "Środki stylistyczne", skill: s.name,
      lesson: `Środek stylistyczny rozpoznajemy po funkcji. ${s.name}: ${s.marker}. Przykład: ${s.example}.`,
      question: `Jaki środek stylistyczny występuje w przykładzie: "${s.example}"?`, answer: s.name, wrong: STYLISTIC.filter(x => x.name !== s.name).slice(0,3).map(x => x.name),
      explanation: `Poprawna odpowiedź: ${s.name}. W przykładzie "${s.example}" widać: ${s.marker}.`,
      difficulty: 1 + (i % 2), seed: seed++
    }));
  }
  for (let i = 0; i < 70; i++) {
    const contexts = [
      ["Czytanie ze zrozumieniem", "W tekście: 'Marta wróciła do domu, ponieważ zaczął padać deszcz.'", "Dlaczego Marta wróciła do domu?", "Bo zaczął padać deszcz", ["Bo zgubiła telefon", "Bo była głodna", "Bo nie lubiła spacerów"]],
      ["Pisanie", "W rozprawce argument to powód popierający tezę, a przykład tylko go ilustruje.", "Co jest argumentem?", "Powód uzasadniający tezę", ["Samo imię bohatera", "Tytuł książki bez wyjaśnienia", "Losowe zdanie z tekstu"]]
    ][i % 2];
    qs.push(makeQuestion({ subject: "polish", category: contexts[0], skill: contexts[0], lesson: contexts[1], question: contexts[2], answer: contexts[3], wrong: contexts[4], explanation: `Poprawna odpowiedź: ${contexts[3]}. ${contexts[1]}`, difficulty: 1, seed: seed++ }));
  }

  for (let i = 0; i < 140; i++) {
    const price = 100 + (i % 10) * 20;
    const pct = [10, 20, 25, 50][i % 4];
    const ans = price * pct / 100;
    qs.push(makeQuestion({
      subject: "math", category: "Procenty i dane", skill: "obliczanie procentu liczby",
      lesson: `${pct}% oznacza ${pct}/100. Aby obliczyć ${pct}% z liczby, pomnóż liczbę przez ${pct}/100.`,
      question: `Ile to ${pct}% z ${price}?`, answer: ans, wrong: [ans + 5, Math.max(1, ans - 5), ans * 2],
      explanation: `Poprawna odpowiedź: ${ans}. Obliczenie: ${price} × ${pct}/100 = ${ans}.`,
      difficulty: 1 + (i % 3), seed: seed++
    }));
  }
  for (let i = 0; i < 100; i++) {
    const a = 10 + (i % 40), b = 2 + (i % 8), c = 3 + (i % 7);
    const ans = a + b * c;
    qs.push(makeQuestion({ subject: "math", category: "Działania", skill: "kolejność działań", lesson: "Najpierw wykonujemy mnożenie i dzielenie, potem dodawanie i odejmowanie.", question: `Oblicz: ${a} + ${b} × ${c}`, answer: ans, wrong: [(a+b)*c, ans+1, ans-1], explanation: `Poprawna odpowiedź: ${ans}. Najpierw ${b} × ${c} = ${b*c}, potem ${a} + ${b*c} = ${ans}.`, difficulty: 1, seed: seed++ }));
  }
  for (let i = 0; i < 90; i++) {
    const x = 2 + (i % 9), add = 3 + (i % 11), result = 2*x + add;
    qs.push(makeQuestion({ subject: "math", category: "Algebra", skill: "równania", lesson: "Równanie rozwiązujemy tak, aby znaleźć wartość niewiadomej. Sprawdzamy wynik przez podstawienie.", question: `Rozwiąż równanie: 2x + ${add} = ${result}`, answer: x, wrong: [x+1, x-1, result], explanation: `Poprawna odpowiedź: x = ${x}. Po podstawieniu: 2×${x} + ${add} = ${result}.`, difficulty: 2, seed: seed++ }));
  }
  for (let i = 0; i < 100; i++) {
    const a = 3 + (i % 12), b = 4 + (i % 10);
    const area = a*b;
    qs.push(makeQuestion({ subject: "math", category: "Geometria", skill: "pole prostokąta", lesson: "Pole prostokąta liczymy ze wzoru: długość × szerokość.", question: `Prostokąt ma boki ${a} cm i ${b} cm. Jakie ma pole?`, answer: `${area} cm²`, wrong: [`${2*a+2*b} cm²`, `${a+b} cm²`, `${area+2} cm²`], explanation: `Poprawna odpowiedź: ${area} cm². Obliczenie: ${a} × ${b} = ${area}.`, difficulty: 1, seed: seed++ }));
  }
  for (let i = 0; i < 70; i++) {
    const distance = [60, 90, 120, 150][i % 4], speed = [30, 45, 60][i % 3];
    const time = distance / speed;
    qs.push(makeQuestion({ subject: "math", category: "Zadania tekstowe", skill: "droga, prędkość, czas", lesson: "Czas obliczamy ze wzoru: czas = droga / prędkość. Jednostki muszą pasować.", question: `Samochód jedzie ${distance} km z prędkością ${speed} km/h. Ile godzin trwa jazda?`, answer: `${time} h`, wrong: [`${distance*speed} h`, `${speed/distance} h`, `${time+1} h`], explanation: `Poprawna odpowiedź: ${time} h. Obliczenie: ${distance} / ${speed} = ${time}.`, difficulty: 2, seed: seed++ }));
  }
  for (let i = 0; i < 40; i++) {
    const total = 10 + (i % 10), good = 1 + (i % 5);
    qs.push(makeQuestion({ subject: "math", category: "Prawdopodobieństwo", skill: "proste doświadczenia losowe", lesson: "Prawdopodobieństwo to liczba wyników sprzyjających podzielona przez liczbę wszystkich wyników.", question: `W pudełku jest ${total} losów, w tym ${good} wygrywających. Jakie jest prawdopodobieństwo wygranej?`, answer: `${good}/${total}`, wrong: [`${total}/${good}`, `${good}/${total+good}`, `${total-good}/${total}`], explanation: `Poprawna odpowiedź: ${good}/${total}. Wyniki sprzyjające: ${good}, wszystkie: ${total}.`, difficulty: 2, seed: seed++ }));
  }

  for (let i = 0; i < 110; i++) {
    const e = EN_CONTEXTS[i % EN_CONTEXTS.length];
    qs.push(makeQuestion({ subject: "english", category: "Listening / rozumienie", skill: "wyszukiwanie informacji", lesson: `Najpierw zrozum sytuację. Kontekst: ${e.ctx}`, question: e.q, answer: e.answer, wrong: e.wrong, explanation: `Correct answer: ${e.answer}. ${e.explain}`, difficulty: 1 + (i % 2), seed: seed++ }));
  }
  for (let i = 0; i < 90; i++) {
    const g = ENG_GRAMMAR[i % ENG_GRAMMAR.length];
    qs.push(makeQuestion({ subject: "english", category: "Grammar", skill: "środki językowe", lesson: "W zadaniach gramatycznych szukaj słowa-klucza: yesterday, every day, next week, must, can. Ono wskazuje formę.", question: g.q, answer: g.answer, wrong: g.wrong, explanation: g.explain, difficulty: 1 + (i % 3), seed: seed++ }));
  }
  for (let i = 0; i < 70; i++) {
    const [word, pl] = VOCAB[i % VOCAB.length];
    qs.push(makeQuestion({ subject: "english", category: "Vocabulary", skill: "słownictwo", lesson: `Poznaj słowo w kontekście. '${word}' = ${pl}.`, question: `What does '${word}' mean in Polish?`, answer: pl, wrong: ["krzesło", "ciemność", "szybko"], explanation: `Correct answer: ${pl}. Zapamiętaj: ${word} = ${pl}.`, difficulty: 1, seed: seed++ }));
  }
  for (let i = 0; i < 70; i++) {
    const item = [
      { q: "Your friend says: I passed the exam! What do you say?", a: "Congratulations!", w: ["I'm sorry.", "Can I borrow it?", "Turn left."], ex: "Na gratulacje odpowiadamy zwrotem 'Congratulations!'" },
      { q: "You want permission to open the window. What do you say?", a: "May I open the window?", w: ["I opened the window yesterday.", "The window is blue.", "I don't like windows."], ex: "Pytanie o pozwolenie: May I...?" },
      { q: "You want to invite a friend. What do you say?", a: "Would you like to come?", w: ["I was born there.", "It costs five pounds.", "She is my sister."], ex: "Zaproszenie często zaczyna się od: Would you like to...?" }
    ][i % 3];
    qs.push(makeQuestion({ subject: "english", category: "Functions", skill: "funkcje językowe", lesson: "W funkcjach językowych najważniejsze jest dopasowanie reakcji do sytuacji.", question: item.q, answer: item.a, wrong: item.w, explanation: item.ex, difficulty: 1, seed: seed++ }));
  }
  for (let i = 0; i < 40; i++) {
    const prompts = [
      { q: "Który element musi znaleźć się w krótkim e-mailu po angielsku?", a: "Odpowiedź na wszystkie punkty polecenia", w: ["Tylko długie zdania", "Same trudne słowa", "Brak podpisu"], ex: "W writing liczy się przekazanie informacji, spójność, zakres i poprawność." },
      { q: "Które zdanie dobrze rozwija informację 'why I left the club'?", a: "I left the club because I moved to another city.", w: ["I like pizza.", "My club is blue.", "Yesterday very good."], ex: "Zdanie musi odpowiadać na konkretny punkt polecenia." }
    ][i % 2];
    qs.push(makeQuestion({ subject: "english", category: "Writing", skill: "krótka wypowiedź pisemna", lesson: "W e-mailu egzaminacyjnym rozwiń trzy podpunkty. Lepiej prosto i jasno niż długo i chaotycznie.", question: prompts.q, answer: prompts.a, wrong: prompts.w, explanation: prompts.ex, difficulty: 2, seed: seed++ }));
  }

  return qs.slice(0, 1000);
}

const ALL_QUESTIONS = buildQuestions();

function readStore(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeStore(key, value) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
}

export default function Home() {
  const [view, setView] = useState("learn");
  const [subject, setSubject] = useState("all");
  const [category, setCategory] = useState("all");
  const [voice, setVoice] = useState(false);
  const [showLesson, setShowLesson] = useState(true);
  const [selected, setSelected] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [days, setDays] = useState(14);
  const [microMode, setMicroMode] = useState(true);
  const [stats, setStats] = useState({ answered: 0, correct: 0, bySubject: {}, mistakes: [], sessions: 0, help: 0, skips: 0 });

  useEffect(() => { setStats(readStore("mentor8_stats_v5", { answered: 0, correct: 0, bySubject: {}, mistakes: [], sessions: 0, help: 0, skips: 0 })); }, []);
  useEffect(() => { if (voice && current) speak(current.lesson); }, [voice]);

  const categoryOptions = subject === "all" ? ["all"] : ["all", ...CATEGORIES[subject]];

  const filtered = useMemo(() => {
    return ALL_QUESTIONS.filter(q => (subject === "all" || q.subject === subject) && (category === "all" || q.category === category));
  }, [subject, category]);

  useEffect(() => {
    setQuestionIndex(0);
    setSelected(null);
    setShowLesson(true);
  }, [subject, category]);

  const current = filtered.length ? filtered[questionIndex % filtered.length] : null;
  const planMode = days <= 5 ? "tryb egzaminowy" : days <= 10 ? "tryb intensywny" : days <= 20 ? "tryb zbalansowany" : "tryb normalny";
  const dailyTarget = days <= 5 ? 18 : days <= 10 ? 12 : days <= 20 ? 8 : 5;
  const sessionLimit = microMode ? Math.min(5, dailyTarget) : dailyTarget;

  function speak(text) {
    if (!voice || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pl-PL";
    utter.rate = 0.86;
    window.speechSynthesis.speak(utter);
  }

  function answer(option) {
    if (!current || selected) return;
    const ok = option === current.correct;
    setSelected(option);
    const nextStats = { ...stats };
    nextStats.answered += 1;
    if (ok) nextStats.correct += 1;
    nextStats.bySubject[current.subject] = nextStats.bySubject[current.subject] || { answered: 0, correct: 0 };
    nextStats.bySubject[current.subject].answered += 1;
    if (ok) nextStats.bySubject[current.subject].correct += 1;
    if (!ok) nextStats.mistakes = [{ id: current.id, subject: current.subject, category: current.category, question: current.question, selected: option, correct: current.correct, explanation: current.explanation }, ...(nextStats.mistakes || [])].slice(0, 20);
    setStats(nextStats);
    writeStore("mentor8_stats_v5", nextStats);
    speak(ok ? `Dobrze. ${current.explanation}` : `Jeszcze nie. Poprawna odpowiedź to: ${current.correct}. ${current.explanation}`);
  }

  function nextQuestion() {
    setQuestionIndex(i => (i + 1) % Math.max(1, filtered.length));
    setSelected(null);
    setShowLesson(true);
    setSessionCount(c => c + 1);
  }

  function skip() {
    const nextStats = { ...stats, skips: (stats.skips || 0) + 1 };
    setStats(nextStats); writeStore("mentor8_stats_v5", nextStats); nextQuestion();
  }

  function resetStats() {
    const s = { answered: 0, correct: 0, bySubject: {}, mistakes: [], sessions: 0, help: 0, skips: 0 };
    setStats(s); writeStore("mentor8_stats_v5", s);
  }

  function help() {
    const nextStats = { ...stats, help: (stats.help || 0) + 1 };
    setStats(nextStats); writeStore("mentor8_stats_v5", nextStats);
    setShowLesson(true);
    speak(current?.lesson || "");
  }

  const pct = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;

  return <main className="app">
    <style>{styles}</style>
    <header className="topbar">
      <div>
        <div className="brand">Mentor8</div>
        <div className="sub">CKE Focus • spokojny tryb nauki • bez timera</div>
      </div>
      <nav>
        <button className={view === "learn" ? "active" : ""} onClick={() => setView("learn")}>Uczeń</button>
        <button className={view === "compressor" ? "active" : ""} onClick={() => setView("compressor")}>Kompresor</button>
        <button className={view === "parent" ? "active" : ""} onClick={() => setView("parent")}>Panel rodzica</button>
      </nav>
    </header>

    {view === "learn" && <section className="grid">
      <aside className="card side">
        <h2>Ustawienia</h2>
        <label>Przedmiot</label>
        <select value={subject} onChange={e => setSubject(e.target.value)}>
          {Object.entries(SUBJECTS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label>Kategoria</label>
        <select value={category} onChange={e => setCategory(e.target.value)} disabled={subject === "all"}>
          {categoryOptions.map(c => <option key={c} value={c}>{c === "all" ? "Wszystkie" : c}</option>)}
        </select>
        <div className="toggle"><span>Głos</span><button onClick={() => setVoice(v=>!v)} className={voice ? "on" : ""}>{voice ? "ON" : "OFF"}</button></div>
        <div className="toggle"><span>Mikro-sesja</span><button onClick={() => setMicroMode(v=>!v)} className={microMode ? "on" : ""}>{microMode ? "ON" : "OFF"}</button></div>
        <div className="muted">Znaleziono pytań: {filtered.length}. Filtrowanie działa lokalnie po przedmiocie i kategorii.</div>
        <div className="score">Wynik: {stats.correct}/{stats.answered} ({pct}%)</div>
      </aside>

      <section className="card questionCard">
        {!current ? <h2>Brak pytań dla filtra.</h2> : <>
          <div className="pillrow"><span>{SUBJECTS[current.subject]}</span><span>{current.category}</span><span>{current.skill}</span></div>
          <h1>{showLesson ? "Najpierw krótka nauka" : "Pytanie"}</h1>
          {showLesson ? <div className="lesson">
            <p>{current.lesson}</p>
            <button className="primary" onClick={() => { setShowLesson(false); speak(current.question); }}>Rozumiem. Pokaż pytanie</button>
          </div> : <>
            <p className="question">{current.question}</p>
            <div className="options">
              {current.options.map(opt => {
                const state = selected ? opt === current.correct ? "good" : opt === selected ? "bad" : "" : "";
                return <button key={opt} className={state} onClick={() => answer(opt)} disabled={!!selected}>{opt}</button>
              })}
            </div>
            {selected && <div className={selected === current.correct ? "feedback goodbox" : "feedback badbox"}>
              <h3>{selected === current.correct ? "Poprawnie" : "Jeszcze nie"}</h3>
              <p><b>Poprawna odpowiedź:</b> {current.correct}</p>
              <p>{current.explanation}</p>
            </div>}
          </>}
          <div className="actions">
            <button onClick={help}>Pomóż mi</button>
            <button onClick={skip}>Pomiń</button>
            <button className="primary" onClick={nextQuestion}>{sessionCount + 1 >= sessionLimit ? "Zakończ / następne" : "Następne"}</button>
          </div>
          {sessionCount + 1 >= sessionLimit && <div className="calm">To wystarczy na jedną mikro-sesję. Możesz skończyć bez straty postępu.</div>}
        </>}
      </section>
    </section>}

    {view === "compressor" && <section className="card full">
      <h1>Kompresor nauki</h1>
      <p className="muted">Ustaw liczbę dni do egzaminu. System nie wydłuża jednej lekcji, tylko dzieli naukę na krótkie mikro-sesje.</p>
      <label>Liczba dni do egzaminu: {days}</label>
      <input type="range" min="5" max="30" value={days} onChange={e=>setDays(Number(e.target.value))} />
      <div className="compressGrid">
        <div><b>Tryb:</b><br/>{planMode}</div>
        <div><b>Cel dzienny:</b><br/>{dailyTarget} pytań</div>
        <div><b>Mikro-sesja:</b><br/>{sessionLimit} pytań</div>
      </div>
      <h2>Proponowany dzień nauki</h2>
      <ol className="plan">
        <li>Matematyka: 1 mikro-sesja z obliczeń i zadania tekstowego.</li>
        <li>Polski: 1 mikro-sesja z lektur lub gramatyki.</li>
        <li>Angielski: 1 mikro-sesja ze słownictwa / funkcji / reading.</li>
        <li>Powtórka błędów z panelu rodzica.</li>
      </ol>
      <p className="calm">Przy 5–10 dniach system ma trenować najważniejsze typy zadań, nie „przerabiać wszystko na siłę”.</p>
    </section>}

    {view === "parent" && <section className="card full">
      <h1>Panel rodzica</h1>
      <div className="compressGrid">
        <div><b>Odpowiedzi:</b><br/>{stats.answered}</div>
        <div><b>Poprawne:</b><br/>{stats.correct}</div>
        <div><b>Skuteczność:</b><br/>{pct}%</div>
        <div><b>Pomoc:</b><br/>{stats.help || 0}</div>
      </div>
      <h2>Wynik według przedmiotów</h2>
      <div className="table">
        {Object.keys(SUBJECTS).filter(s=>s!=="all").map(s => {
          const st = stats.bySubject?.[s] || { answered: 0, correct: 0 };
          const p = st.answered ? Math.round(st.correct/st.answered*100) : 0;
          return <div key={s} className="row"><span>{SUBJECTS[s]}</span><span>{st.correct}/{st.answered}</span><span>{p}%</span></div>
        })}
      </div>
      <h2>Ostatnie błędy — do spokojnej powtórki</h2>
      {(stats.mistakes || []).length === 0 ? <p className="muted">Brak zapisanych błędów.</p> : stats.mistakes.map((m, i) => <div className="mistake" key={i}>
        <b>{SUBJECTS[m.subject]} • {m.category}</b>
        <p>{m.question}</p>
        <p>Wybrano: {m.selected}. Poprawnie: {m.correct}.</p>
        <p>{m.explanation}</p>
      </div>)}
      <button onClick={resetStats}>Wyczyść statystyki</button>
    </section>}
  </main>
}

const styles = `
  *{box-sizing:border-box} body{margin:0;background:#08111f;color:#eaf2ff;font-family:Inter,Arial,sans-serif} .app{min-height:100vh;padding:24px;max-width:1180px;margin:0 auto}.topbar{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:22px}.brand{font-size:32px;font-weight:800}.sub,.muted{color:#94a3b8;line-height:1.5}nav{display:flex;gap:10px;flex-wrap:wrap}button,select,input{font:inherit}button{background:#17233a;color:#eaf2ff;border:1px solid #31415f;border-radius:14px;padding:12px 16px;cursor:pointer}button:hover{border-color:#76e4b8}.active,.primary{background:#2dd4bf;color:#06131f;border-color:#2dd4bf;font-weight:800}.grid{display:grid;grid-template-columns:290px 1fr;gap:20px}.card{background:linear-gradient(180deg,#101b31,#0d1728);border:1px solid #24324f;border-radius:24px;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,.25)}.side label,.full label{display:block;margin-top:18px;margin-bottom:8px;color:#cbd5e1}select{width:100%;background:#0b1324;color:#fff;border:1px solid #31415f;border-radius:12px;padding:12px}.toggle{display:flex;align-items:center;justify-content:space-between;margin:18px 0}.toggle .on{background:#2dd4bf;color:#06131f}.score{margin-top:18px;padding:14px;border-radius:14px;background:#0b1324}.pillrow{display:flex;gap:8px;flex-wrap:wrap}.pillrow span{background:#16233b;color:#a7f3d0;border:1px solid #2b4b62;padding:8px 10px;border-radius:999px;font-size:13px}.questionCard h1,.full h1{font-size:34px;margin:18px 0}.lesson,.question{font-size:24px;line-height:1.55}.options{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px}.options button{font-size:20px;text-align:left;min-height:72px}.options .good{background:#134e4a;border-color:#2dd4bf}.options .bad{background:#4c1d1d;border-color:#fb7185}.feedback{margin-top:18px;padding:18px;border-radius:18px}.goodbox{background:#0f3f37;border:1px solid #2dd4bf}.badbox{background:#3b1620;border:1px solid #fb7185}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}.calm{margin-top:18px;background:#111d33;border:1px solid #334155;border-radius:16px;padding:14px;color:#cbd5e1}.full{max-width:980px;margin:0 auto}.compressGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:20px 0}.compressGrid div{background:#0b1324;border:1px solid #253857;border-radius:16px;padding:18px}.plan li{margin:12px 0;line-height:1.45}.table{display:grid;gap:10px}.row{display:grid;grid-template-columns:1fr 100px 80px;gap:12px;background:#0b1324;padding:14px;border-radius:14px}.mistake{background:#0b1324;border:1px solid #253857;border-radius:16px;padding:16px;margin:12px 0}input[type=range]{width:100%}@media(max-width:800px){.topbar{display:block}.grid{grid-template-columns:1fr}.options{grid-template-columns:1fr}.compressGrid{grid-template-columns:1fr 1fr}.questionCard h1,.full h1{font-size:28px}.lesson,.question{font-size:20px}}`;
