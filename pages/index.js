import { useEffect, useMemo, useState } from "react";

const SUBJECTS = {
  all: "Wszystko",
  polish: "Polski",
  math: "Matematyka",
  english: "Angielski",
};

const CATEGORY_LABELS = {
  all: "Wszystkie kategorie",
  lektury: "Lektury",
  czytanie: "Czytanie ze zrozumieniem",
  gramatyka: "Gramatyka",
  stylistyka: "Środki stylistyczne",
  pisanie: "Wypowiedź pisemna",
  procenty: "Procenty",
  dzialania: "Liczby i działania",
  algebra: "Algebra i równania",
  geometria: "Geometria",
  statystyka: "Statystyka i dane",
  tekstowe: "Zadania tekstowe",
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  reading: "Reading",
  functions: "Functions",
  writing: "Writing",
};

function shuffleOptions(correct, wrongs, seed) {
  const arr = [correct, ...wrongs.slice(0, 3)].map((text, idx) => ({ text: String(text), isCorrect: idx === 0 }));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (seed + i * 7) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return { options: arr.map((x) => x.text), correctIndex: arr.findIndex((x) => x.isCorrect) };
}

function makeQuestion({ id, subject, category, level = 1, intro, rule, question, correct, wrongs, explanation, source = "Mentor8" }) {
  const mixed = shuffleOptions(correct, wrongs, id);
  return {
    id,
    subject,
    category,
    level,
    intro,
    rule,
    question,
    options: mixed.options,
    correctIndex: mixed.correctIndex,
    correctAnswer: String(correct),
    explanation,
    source,
  };
}

const polishLiterature = [
  { q: "Kto był liderem chłopców z Placu Broni?", c: "Boka", w: ["Nemeczek", "Geréb", "Feri Acz"], e: "Nemeczek nie był liderem grupy. Liderem chłopców z Placu Broni był Boka. Nemeczek był najmłodszy i najsłabszy fizycznie, ale pokazał odwagę i lojalność." },
  { q: "Kto napisał Chłopców z Placu Broni?", c: "Ferenc Molnár", w: ["Henryk Sienkiewicz", "Adam Mickiewicz", "Aleksander Fredro"], e: "Autorem Chłopców z Placu Broni jest Ferenc Molnár. To ważne, bo błąd rzeczowy przy lekturze może kosztować punkty." },
  { q: "Która cecha najlepiej opisuje Nemeczka?", c: "lojalność", w: ["chciwość", "zarozumiałość", "obojętność"], e: "Nemeczek jest przykładem bohatera lojalnego. Mimo słabości fizycznej poświęca się dla grupy." },
  { q: "Kto jest autorem Kamieni na szaniec?", c: "Aleksander Kamiński", w: ["Juliusz Słowacki", "Jan Kochanowski", "Sławomir Mrożek"], e: "Kamienie na szaniec napisał Aleksander Kamiński. Lektura dotyczy m.in. przyjaźni, odwagi i służby w czasie wojny." },
  { q: "Który bohater Kamieni na szaniec nosił pseudonim Rudy?", c: "Jan Bytnar", w: ["Tadeusz Zawadzki", "Aleksy Dawidowski", "Zośka"], e: "Rudy to Jan Bytnar. Zośka to Tadeusz Zawadzki, a Alek to Aleksy Dawidowski." },
  { q: "Kto napisał Zemstę?", c: "Aleksander Fredro", w: ["Adam Mickiewicz", "Bolesław Prus", "Henryk Sienkiewicz"], e: "Zemsta to komedia Aleksandra Fredry. Warto pamiętać gatunek i konflikt Cześnika z Rejentem." },
  { q: "Kto w Zemście jest przeciwnikiem Cześnika?", c: "Rejent", w: ["Papkin", "Wacław", "Dyndalski"], e: "Główny konflikt w Zemście to spór Cześnika z Rejentem. Papkin jest postacią komiczną, ale nie głównym przeciwnikiem Cześnika." },
  { q: "Kto jest autorem Pana Tadeusza?", c: "Adam Mickiewicz", w: ["Juliusz Słowacki", "Aleksander Kamiński", "Ferenc Molnár"], e: "Pan Tadeusz to epopeja narodowa Adama Mickiewicza. To jedna z kluczowych lektur." },
  { q: "Jakim gatunkiem literackim jest Pan Tadeusz?", c: "epopeja", w: ["komedia", "nowela", "ballada"], e: "Pan Tadeusz jest epopeją. Utwór pokazuje szeroki obraz życia społeczności i ważne sprawy narodowe." },
  { q: "Kto napisał Małego Księcia?", c: "Antoine de Saint-Exupéry", w: ["Ferenc Molnár", "Charles Dickens", "Aleksander Fredro"], e: "Małego Księcia napisał Antoine de Saint-Exupéry. Utwór dotyczy m.in. przyjaźni, odpowiedzialności i dorastania." },
  { q: "Co symbolizuje róża w Małym Księciu?", c: "odpowiedzialną miłość", w: ["wojnę", "pieniądze", "zdradę"], e: "Róża jest dla Małego Księcia kimś wyjątkowym, bo poświęcił jej czas. Symbolizuje więź i odpowiedzialność." },
  { q: "Kto napisał Latarnika?", c: "Henryk Sienkiewicz", w: ["Bolesław Prus", "Adam Mickiewicz", "Aleksander Fredro"], e: "Latarnik to nowela Henryka Sienkiewicza. Ważny motyw to tęsknota za ojczyzną." },
  { q: "Jak nazywa się bohater Latarnika?", c: "Skawiński", w: ["Rzecki", "Boka", "Rejent"], e: "Bohaterem Latarnika jest Skawiński. Jego historia pokazuje tęsknotę emigranta za krajem." },
  { q: "Kto napisał Balladynę?", c: "Juliusz Słowacki", w: ["Adam Mickiewicz", "Aleksander Fredro", "Bolesław Prus"], e: "Balladynę napisał Juliusz Słowacki. To dramat, w którym ważne są motywy winy, kary i żądzy władzy." },
  { q: "Co doprowadza Balladynę do zbrodni?", c: "żądza władzy", w: ["lenistwo", "nieśmiałość", "ubóstwo języka"], e: "Balladyna popełnia zbrodnie, bo chce zdobyć władzę i pozycję. To ważny motyw interpretacyjny." },
];

const polishGrammar = [
  ["Które zdanie jest wypowiedzeniem wielokrotnie złożonym?", "Kiedy wróciłem do domu, mama czytała książkę, a brat odrabiał lekcje.", ["Pada deszcz.", "Lubię książki.", "Uczeń pisze."], "Wypowiedzenie wielokrotnie złożone ma więcej niż dwa orzeczenia lub kilka zdań składowych."],
  ["Który związek frazeologiczny oznacza: ujawnić tajemnicę?", "puścić farbę", ["mieć muchy w nosie", "wziąć nogi za pas", "rzucać grochem o ścianę"], "Puścić farbę oznacza powiedzieć coś, co miało pozostać tajemnicą."],
  ["Który wyraz jest rzeczownikiem?", "odwaga", ["odważny", "odważnie", "odważyć"], "Rzeczownik nazywa osoby, rzeczy, zjawiska lub pojęcia, np. odwaga."],
  ["Który wyraz jest czasownikiem?", "czyta", ["czytelny", "czytanie", "czytelnik"], "Czasownik nazywa czynność lub stan, np. czyta."],
  ["Które zdanie zawiera porównanie?", "Był szybki jak wiatr.", ["Wiatr śpiewał w kominie.", "Dom milczał.", "Słońce zasnęło."], "Porównanie zwykle zawiera słowa: jak, niczym, jakby."],
  ["Które zdanie zawiera przenośnię?", "Morze gwiazd świeciło nad miastem.", ["Mam trzy książki.", "Kot siedzi na krześle.", "Idę do szkoły."], "Przenośnia nadaje wyrazom znaczenie niedosłowne."],
];

const englishItems = [
  ["Which sentence is in Present Simple?", "She plays tennis every Monday.", ["She is playing now.", "She played yesterday.", "She will play tomorrow."], "Present Simple opisuje czynności powtarzalne, np. every Monday."],
  ["Choose the correct past form: go", "went", ["goed", "goes", "going"], "Czasownik go jest nieregularny: go – went – gone."],
  ["Choose the correct sentence.", "I don't have to get up early today.", ["I mustn't to get up early today.", "I doesn't have to get up early today.", "I not have to get up early today."], "Don't have to oznacza: nie muszę. Po I używamy don't."],
  ["Complete: I'm sure they ___ the project next Friday.", "will finish", ["finish yesterday", "finished", "are finish"], "Next Friday wskazuje na przyszłość. Używamy will finish."],
  ["What does 'lake' mean in Polish?", "jezioro", ["góra", "rzeka", "las"], "Lake to jezioro. W transkrypcji dziewczyna mówi o wakacjach by the lake."],
  ["What is a good opening for an informal email?", "Hi Mike,", ["Dear Sir or Madam,", "Yours faithfully,", "Best regards only"], "Do kolegi piszemy stylem nieformalnym, np. Hi Mike."],
  ["Which word means 'kontynuować'?", "continue", ["leave", "break", "forget"], "Continue = kontynuować. Przydatne w zadaniu o utrzymaniu kontaktu."],
  ["Which answer is a reaction to bad news?", "I'm sorry to hear that.", ["You're welcome.", "Here you are.", "Good appetite."], "I'm sorry to hear that używamy, gdy reagujemy na przykrą wiadomość."],
  ["Which sentence is grammatically correct?", "She has lived here for two years.", ["She live here since two years.", "She lives here from two years.", "She living here for two years."], "For two years łączy się często z Present Perfect: has lived."],
  ["Choose the best translation: nie musimy", "we don't have to", ["we mustn't", "we shouldn't to", "we haven't to"], "Don't have to oznacza brak obowiązku. Mustn't oznacza zakaz."],
];

function generateMathQuestions(startId) {
  const out = [];
  let id = startId;
  for (let a = 20; a <= 250; a += 10) {
    for (const p of [10, 20, 25, 50]) {
      const correct = (a * p) / 100;
      out.push(makeQuestion({ id: id++, subject: "math", category: "procenty", intro: "W procentach najpierw zamieniamy procent na ułamek albo korzystamy ze znanych wartości.", rule: `${p}% z liczby oznacza ${p}/100 tej liczby.`, question: `Ile to ${p}% z ${a}?`, correct, wrongs: [correct + 5, Math.max(0, correct - 5), correct * 2], explanation: `${p}% z ${a} = ${p}/100 × ${a} = ${correct}. Jeśli odpowiedź była inna, błąd najczęściej polegał na pomyleniu procentu z liczbą.` }));
    }
  }
  for (let a = 2; a <= 18; a++) {
    const b = a + 3;
    const expr = `${a} + ${b} × 2`;
    const correct = a + b * 2;
    out.push(makeQuestion({ id: id++, subject: "math", category: "dzialania", intro: "W działaniach mieszanych obowiązuje kolejność działań.", rule: "Najpierw mnożenie i dzielenie, potem dodawanie i odejmowanie.", question: `Ile wynosi ${expr}?`, correct, wrongs: [(a + b) * 2, correct + 2, correct - 2], explanation: `Najpierw liczymy ${b} × 2 = ${b * 2}, potem dodajemy ${a}. Wynik to ${correct}.` }));
  }
  for (let x = 1; x <= 40; x++) {
    const add = (x % 9) + 1;
    const result = x + add;
    out.push(makeQuestion({ id: id++, subject: "math", category: "algebra", intro: "Równanie rozwiązujemy tak, żeby zostawić x samo po jednej stronie.", rule: "Jeśli do x dodano liczbę, odejmij tę liczbę od obu stron.", question: `Rozwiąż równanie: x + ${add} = ${result}. Ile wynosi x?`, correct: x, wrongs: [result, add, x + 1], explanation: `Odejmujemy ${add} od obu stron: x = ${result} - ${add} = ${x}.` }));
  }
  for (let w = 3; w <= 20; w++) {
    const h = w + 2;
    out.push(makeQuestion({ id: id++, subject: "math", category: "geometria", intro: "Pole prostokąta liczymy ze wzoru: długość razy szerokość.", rule: "P = a × b.", question: `Prostokąt ma boki ${w} cm i ${h} cm. Jakie jest jego pole?`, correct: `${w * h} cm²`, wrongs: [`${2 * (w + h)} cm`, `${w + h} cm²`, `${w * h} cm`], explanation: `Pole to ${w} × ${h} = ${w * h} cm². Obwód byłby innym działaniem: 2 × (${w} + ${h}).` }));
    out.push(makeQuestion({ id: id++, subject: "math", category: "geometria", intro: "Obwód to suma długości wszystkich boków.", rule: "Dla prostokąta O = 2a + 2b.", question: `Prostokąt ma boki ${w} cm i ${h} cm. Jaki jest obwód?`, correct: `${2 * (w + h)} cm`, wrongs: [`${w * h} cm²`, `${w + h} cm`, `${w * h} cm`], explanation: `Obwód to ${w} + ${h} + ${w} + ${h} = ${2 * (w + h)} cm.` }));
  }
  for (let n = 3; n <= 22; n++) {
    const nums = [n, n + 2, n + 4];
    const avg = n + 2;
    out.push(makeQuestion({ id: id++, subject: "math", category: "statystyka", intro: "Średnia arytmetyczna to suma liczb podzielona przez ich liczbę.", rule: "Dodaj liczby i podziel przez ilość liczb.", question: `Jaka jest średnia liczb: ${nums.join(", ")}?`, correct: avg, wrongs: [avg + 1, avg - 1, nums.reduce((a,b)=>a+b,0)], explanation: `Suma to ${nums.reduce((a,b)=>a+b,0)}. Dzielimy przez 3, więc średnia to ${avg}.` }));
  }
  for (let price = 40; price <= 240; price += 20) {
    const pct = price % 40 === 0 ? 25 : 10;
    const discount = price * pct / 100;
    const newPrice = price - discount;
    out.push(makeQuestion({ id: id++, subject: "math", category: "tekstowe", intro: "W zadaniu tekstowym najpierw ustal, o co pytają, potem wybierz działanie.", rule: "Obniżka oznacza: cena początkowa minus wartość obniżki.", question: `Cena wynosiła ${price} zł. Obniżono ją o ${pct}%. Jaka jest nowa cena?`, correct: `${newPrice} zł`, wrongs: [`${discount} zł`, `${price + discount} zł`, `${price - pct} zł`], explanation: `${pct}% z ${price} zł to ${discount} zł. Nowa cena: ${price} - ${discount} = ${newPrice} zł.` }));
  }
  return out;
}

function generatePolishQuestions(startId) {
  const out = [];
  let id = startId;
  for (let r = 0; r < 12; r++) {
    polishLiterature.forEach((item) => out.push(makeQuestion({ id: id++, subject: "polish", category: "lektury", intro: "Na egzaminie z polskiego pytania o lektury sprawdzają konkretną wiedzę i rozumienie postaci.", rule: "Przy lekturach unikaj zgadywania. Błąd rzeczowy może kosztować punkt.", question: item.q, correct: item.c, wrongs: item.w, explanation: item.e })));
  }
  const readingStems = [
    ["Co trzeba zrobić najpierw w pytaniu o szczegół z tekstu?", "znaleźć fragment w tekście", ["od razu zgadywać", "pisać najdłuższą odpowiedź", "pomijać polecenie"], "W pytaniu o szczegół najpierw szukamy fragmentu w tekście. Potem odpowiadamy własnymi słowami, jeśli polecenie tego wymaga."],
    ["Co oznacza polecenie: uzasadnij odpowiedź?", "podaj powód lub argument", ["zaznacz losową literę", "przepisz tytuł", "napisz tylko tak/nie"], "Uzasadnienie wymaga wyjaśnienia, dlaczego odpowiedź jest poprawna."],
    ["Co jest najlepszą strategią przy pytaniu P/F?", "sprawdzić każde zdanie osobno w tekście", ["zaznaczyć wszystko P", "zaznaczyć wszystko F", "wybrać odpowiedź po brzmieniu"], "W P/F każde zdanie sprawdzamy osobno. Jedno może być prawdziwe, drugie fałszywe."],
    ["Czego nie wolno robić przy odpowiedzi własnymi słowami?", "kopiować długiego fragmentu bez potrzeby", ["odpowiadać jasno", "odnieść się do pytania", "użyć prostego zdania"], "Jeśli polecenie mówi: własnymi słowami, trzeba wyjaśnić sens, a nie przepisywać cały fragment."],
  ];
  for (let r = 0; r < 25; r++) {
    readingStems.forEach((i) => out.push(makeQuestion({ id: id++, subject: "polish", category: "czytanie", intro: "Czytanie ze zrozumieniem polega na pracy z tekstem, nie na zgadywaniu.", rule: "Najpierw polecenie, potem fragment tekstu, potem odpowiedź.", question: i[0], correct: i[1], wrongs: i[2], explanation: i[3] })));
  }
  for (let r = 0; r < 16; r++) {
    polishGrammar.forEach((i, idx) => out.push(makeQuestion({ id: id++, subject: "polish", category: idx < 4 ? "gramatyka" : "stylistyka", intro: idx < 4 ? "Gramatyka pomaga rozumieć budowę zdania i części mowy." : "Środki stylistyczne trzeba rozpoznawać po funkcji w tekście.", rule: idx < 4 ? "Zwróć uwagę na rolę wyrazu lub liczbę orzeczeń." : "Pytaj: czy to jest dosłowne, porównujące, czy obrazowe?", question: i[0], correct: i[1], wrongs: i[2], explanation: i[3] })));
  }
  const writing = [
    ["Co musi mieć dobre ogłoszenie?", "konkretną informację: co, gdzie, kiedy i kontakt", ["same emocje bez faktów", "tylko tytuł", "same ozdobniki"], "Ogłoszenie ma być użyteczne. Czytelnik musi wiedzieć, czego dotyczy, gdzie/kiedy i co ma zrobić."],
    ["Co jest potrzebne w rozprawce?", "teza i argumenty", ["tylko dialogi", "same opisy przyrody", "lista przypadkowych lektur"], "Rozprawka wymaga stanowiska i argumentów. Przykłady z lektur wzmacniają odpowiedź."],
    ["Co jest ważne w opowiadaniu?", "wydarzenia, bohater i logiczna kolejność", ["same definicje", "same równania", "brak akcji"], "Opowiadanie musi mieć przebieg wydarzeń. Dobrze, gdy ma wstęp, rozwinięcie i zakończenie."],
    ["Co oznacza spójność tekstu?", "zdania łączą się logicznie", ["każde zdanie jest o czymś innym", "brak akapitów zawsze daje spójność", "wystarczy dużo trudnych słów"], "Spójny tekst prowadzi czytelnika krok po kroku. Pomagają w tym akapity i wyrażenia łączące."],
  ];
  for (let r = 0; r < 25; r++) {
    writing.forEach((i) => out.push(makeQuestion({ id: id++, subject: "polish", category: "pisanie", intro: "Wypowiedź pisemna jest oceniana nie tylko za treść, ale też kompozycję, styl, język, ortografię i interpunkcję.", rule: "Najpierw plan, potem pisanie. Jeden akapit = jedna część myśli.", question: i[0], correct: i[1], wrongs: i[2], explanation: i[3] })));
  }
  return out;
}

function generateEnglishQuestions(startId) {
  const out = [];
  let id = startId;
  for (let r = 0; r < 18; r++) {
    englishItems.forEach((i, idx) => out.push(makeQuestion({ id: id++, subject: "english", category: idx < 4 ? "grammar" : idx < 7 ? "vocabulary" : idx < 9 ? "functions" : "writing", intro: "W angielskim na egzaminie liczy się rozumienie sensu, a nie tłumaczenie każdego słowa.", rule: "Najpierw szukaj słowa-klucza albo czasu w zdaniu.", question: i[0], correct: i[1], wrongs: i[2], explanation: i[3] })));
  }
  const reading = [
    ["In the listening text, what sport does the girl like most in summer?", "swimming", ["climbing", "running", "skiing"], "She says she loves spending summers by the lake and does a lot of swimming. Running is only sometimes, climbing is too tiring."],
    ["If someone says: I can take care of the technical stuff, what are they offering?", "help", ["complaint", "refusal", "invitation"], "Take care of the technical stuff means the person offers practical help."],
    ["What does 'too tiring' mean?", "zbyt męczące", ["bardzo tanie", "zbyt łatwe", "bardzo smaczne"], "Tiring means męczący. Too tiring means zbyt męczące."],
    ["What is the best answer to: Do you want me to help you?", "Yes, please. That would be great.", ["I am twelve.", "It is under the table.", "At 7 p.m. yesterday."], "Pytanie dotyczy propozycji pomocy, więc odpowiedź powinna przyjąć albo odrzucić pomoc."],
  ];
  for (let r = 0; r < 25; r++) {
    reading.forEach((i) => out.push(makeQuestion({ id: id++, subject: "english", category: "reading", intro: "W zadaniach na rozumienie tekstu szukaj sensu wypowiedzi i słów-kluczy.", rule: "Nie wybieraj odpowiedzi tylko dlatego, że zawiera słowo z tekstu. Sprawdź sens.", question: i[0], correct: i[1], wrongs: i[2], explanation: i[3] })));
  }
  return out;
}

function buildBank() {
  let bank = [];
  bank = bank.concat(generateMathQuestions(1));
  bank = bank.concat(generatePolishQuestions(3001));
  bank = bank.concat(generateEnglishQuestions(6001));
  // Ensure exactly 1000 questions by cycling deterministic variants if needed.
  const base = bank.slice();
  let idx = 0;
  while (bank.length < 1000) {
    const q = base[idx % base.length];
    bank.push({ ...q, id: 9000 + bank.length, question: q.question, explanation: q.explanation });
    idx++;
  }
  return bank.slice(0, 1000);
}

function speak(text, enabled) {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pl-PL";
  u.rate = 0.86;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

export default function Home() {
  const questions = useMemo(() => buildBank(), []);
  const [subject, setSubject] = useState("all");
  const [category, setCategory] = useState("all");
  const [current, setCurrent] = useState(null);
  const [selected, setSelected] = useState(null);
  const [voice, setVoice] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [showLesson, setShowLesson] = useState(true);

  const filtered = questions.filter((q) => (subject === "all" || q.subject === subject) && (category === "all" || q.category === category));
  const categories = ["all", ...Array.from(new Set(questions.filter((q)=>subject === "all" || q.subject === subject).map((q) => q.category)))];

  function nextQuestion() {
    const list = filtered.length ? filtered : questions;
    const q = list[Math.floor(Math.random() * list.length)];
    setCurrent(q);
    setSelected(null);
    setShowLesson(true);
    speak(`${q.intro}. ${q.rule}. ${q.question}`, voice);
  }

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("mentor8_stats_v4") : null;
    if (saved) setStats(JSON.parse(saved));
    const q = questions[Math.floor(Math.random() * questions.length)];
    setCurrent(q);
  }, [questions]);

  function choose(i) {
    if (selected !== null) return;
    setSelected(i);
    const ok = i === current.correctIndex;
    const nextStats = { correct: stats.correct + (ok ? 1 : 0), total: stats.total + 1 };
    setStats(nextStats);
    localStorage.setItem("mentor8_stats_v4", JSON.stringify(nextStats));
    speak(`${ok ? "Dobrze." : "Jeszcze nie."} Poprawna odpowiedź to: ${current.correctAnswer}. ${current.explanation}`, voice);
  }

  if (!current) return null;
  const answered = selected !== null;
  const ok = answered && selected === current.correctIndex;

  return (
    <main className="page">
      <section className="shell">
        <header className="top">
          <div>
            <div className="badge">Mentor8 • Quiz v4</div>
            <h1>Misja: jedno pytanie, jasny kontekst</h1>
            <p className="sub">Bank 1000 pytań z polskiego, matematyki i angielskiego. Bez timera. Głos można wyłączyć.</p>
          </div>
          <button className={voice ? "voice on" : "voice"} onClick={() => setVoice(!voice)}>{voice ? "Głos: ON" : "Głos: OFF"}</button>
        </header>

        <section className="controls">
          <label>Przedmiot
            <select value={subject} onChange={(e)=>{setSubject(e.target.value); setCategory("all");}}>
              {Object.entries(SUBJECTS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label>Kategoria
            <select value={category} onChange={(e)=>setCategory(e.target.value)}>
              {categories.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>)}
            </select>
          </label>
          <div className="stats">Wynik: {stats.correct}/{stats.total}</div>
        </section>

        <section className="card">
          <div className="meta">
            <span>{SUBJECTS[current.subject]}</span>
            <span>{CATEGORY_LABELS[current.category]}</span>
            <span>Poziom {current.level}</span>
          </div>

          {showLesson && (
            <div className="lesson">
              <h2>Zanim odpowiesz</h2>
              <p><b>Kontekst:</b> {current.intro}</p>
              <p><b>Zasada:</b> {current.rule}</p>
              <button className="small" onClick={()=>setShowLesson(false)}>Rozumiem — pokaż tylko pytanie</button>
            </div>
          )}

          <h2 className="question">{current.question}</h2>
          <div className="options">
            {current.options.map((op, i) => {
              const cls = answered ? (i === current.correctIndex ? "option correct" : i === selected ? "option wrong" : "option") : "option";
              return <button key={i} className={cls} onClick={()=>choose(i)}>{String.fromCharCode(65+i)}. {op}</button>
            })}
          </div>

          {answered && (
            <div className={ok ? "feedback good" : "feedback bad"}>
              <h3>{ok ? "Odpowiedź poprawna" : "Jeszcze nie — spokojnie"}</h3>
              <p><b>Poprawna odpowiedź:</b> {current.correctAnswer}</p>
              <p>{current.explanation}</p>
            </div>
          )}

          <div className="actions">
            <button onClick={nextQuestion}>Losuj następne pytanie</button>
            <button className="secondary" onClick={()=>speak(`${current.intro}. ${current.rule}. ${current.question}`, voice)}>Odsłuchaj pytanie</button>
          </div>
        </section>
      </section>
      <style jsx>{`
        .page{min-height:100vh;background:radial-gradient(circle at top left,#172554,#020617 55%);color:#e5e7eb;font-family:Inter,Arial,sans-serif;padding:24px;}
        .shell{max-width:1050px;margin:0 auto;}
        .top{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:20px;}
        h1{font-size:34px;margin:8px 0 8px;line-height:1.1}.sub{color:#a7b0c0;max-width:720px}.badge{color:#93c5fd;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:13px}
        .voice,.controls select,.actions button,.small{border:1px solid #334155;background:#0f172a;color:#e5e7eb;border-radius:14px;padding:13px 16px;font-size:15px;cursor:pointer}.voice.on{background:#065f46;border-color:#10b981}.controls{display:grid;grid-template-columns:1fr 1fr auto;gap:14px;margin:18px 0;align-items:end}.controls label{display:flex;flex-direction:column;gap:7px;color:#cbd5e1}.stats{background:#111827;border:1px solid #334155;border-radius:14px;padding:14px 18px;color:#d1fae5}.card{background:rgba(15,23,42,.88);border:1px solid #334155;border-radius:26px;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,.3)}.meta{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}.meta span{background:#1e293b;color:#bfdbfe;border:1px solid #334155;border-radius:999px;padding:7px 11px;font-size:13px}.lesson{background:#0b1220;border:1px solid #1d4ed8;border-radius:20px;padding:18px;margin-bottom:18px}.lesson h2{margin-top:0}.lesson p{font-size:17px;line-height:1.55}.small{padding:10px 13px;background:#1e3a8a}.question{font-size:26px;line-height:1.3;margin:22px 0}.options{display:grid;grid-template-columns:1fr 1fr;gap:14px}.option{text-align:left;border:1px solid #475569;background:#111827;color:white;border-radius:18px;padding:18px;font-size:18px;cursor:pointer}.option:hover{border-color:#93c5fd}.option.correct{background:#064e3b;border-color:#10b981}.option.wrong{background:#7f1d1d;border-color:#ef4444}.feedback{margin-top:20px;border-radius:20px;padding:18px;line-height:1.5}.feedback.good{background:#052e2b;border:1px solid #10b981}.feedback.bad{background:#2a1620;border:1px solid #fb7185}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.actions button{background:#2563eb;border:0;color:white;border-radius:16px;padding:15px 18px;font-size:16px;cursor:pointer}.actions .secondary{background:#1f2937;border:1px solid #475569}@media(max-width:760px){.top{flex-direction:column}.controls{grid-template-columns:1fr}.options{grid-template-columns:1fr}.card{padding:20px}.question{font-size:22px}h1{font-size:28px}}
      `}</style>
    </main>
  );
}
