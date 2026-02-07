/* ========== READIFY - Shared JS ========== */

// Page loading overlay - hide when ready, show when navigating away
function initPageLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  function hideLoader() {
    loader.classList.add("hidden");
  }

  window.addEventListener("load", () => {
    setTimeout(hideLoader, 300);
  });

  document.querySelectorAll("a[href]").forEach(a => {
    const href = (a.getAttribute("href") || "").trim();
    if (href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("javascript:") && !href.startsWith("http")) {
      a.addEventListener("click", () => loader.classList.remove("hidden"));
    }
  });
}

initPageLoader();

// Hamburger menu (reusable across all pages)
function toggleMenu() {
  const nav = document.querySelector(".nav");
  if (nav) nav.classList.toggle("active");
}

// Dark mode toggle (reusable)
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("readifyDarkMode", isDark);
  const btn = document.querySelector(".theme-toggle");
  if (btn) btn.textContent = isDark ? "☀️" : "🌙";
}

function initDarkMode() {
  const saved = localStorage.getItem("readifyDarkMode") === "true";
  if (saved) {
    document.body.classList.add("dark-mode");
    const btn = document.querySelector(".theme-toggle");
    if (btn) btn.textContent = "☀️";
  }
}

// Reading streak - tracks consecutive visit days
function updateStreak() {
  const badge = document.getElementById("streakBadge");
  const countEl = document.getElementById("streakCount");
  if (!badge || !countEl) return;

  const today = new Date().toDateString();
  const data = JSON.parse(localStorage.getItem("readifyStreak") || '{"last":"","count":0}');
  let { last, count } = data;

  if (last === today) { countEl.textContent = count; return; }
  const diffDays = last ? Math.floor((new Date() - new Date(last)) / 86400000) : 999;
  if (diffDays === 1) count++;
  else if (diffDays > 1 || !last) count = 1;

  localStorage.setItem("readifyStreak", JSON.stringify({ last: today, count }));
  countEl.textContent = count;
}

// Hero quote rotation with author photos - only on Home page
function initQuoteRotation() {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const quotePhoto = document.getElementById("quote-photo");
  if (!quoteText || !quoteAuthor) return;

  const quotes = [
    { text: "So many books, so little time.", author: "Frank Zappa", photo: "https://i.pravatar.cc/300?img=11" },
    { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin", photo: "https://i.pravatar.cc/300?img=12" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss", photo: "https://i.pravatar.cc/300?img=13" },
    { text: "Books are a uniquely portable magic.", author: "Stephen King", photo: "https://i.pravatar.cc/300?img=14" },
    { text: "Reading is dreaming with open eyes.", author: "Anissa Djefri", photo: "https://i.pravatar.cc/300?img=15" }
  ];

  let index = 0;
  function showQuote() {
    quoteText.textContent = quotes[index].text;
    quoteAuthor.textContent = `— ${quotes[index].author}`;
    if (quotePhoto && quotes[index].photo) quotePhoto.src = quotes[index].photo;
    index = (index + 1) % quotes.length;
  }
  showQuote();
  setInterval(showQuote, 4500);
}

// Author of the Day - date-based, only on Home page
function initAuthorOfDay() {
  const authorName = document.getElementById("author-name");
  const authorDesc = document.getElementById("author-desc");
  if (!authorName || !authorDesc) return;

  const authors = [
    { name: "Octavia Butler", desc: "Pioneer of science fiction and Afrofuturism." },
    { name: "Haruki Murakami", desc: "Master of surreal and introspective fiction." },
    { name: "Zadie Smith", desc: "Contemporary novelist exploring identity and culture." },
    { name: "Chimamanda Ngozi Adichie", desc: "Author of Half of a Yellow Sun and Americanah." },
    { name: "Neil Gaiman", desc: "Writer of fantasy, comics, and modern myth." },
    { name: "Arundhati Roy", desc: "Author of The God of Small Things." }
  ];

  const today = new Date().getDate();
  const author = authors[today % authors.length];
  authorName.textContent = author.name;
  authorDesc.textContent = author.desc;
}

// Newsletter - store email in localStorage (reusable)
function saveEmail() {
  const emailEl = document.getElementById("email");
  const msgEl = document.getElementById("msg");
  if (!emailEl || !msgEl) return;

  const email = emailEl.value.trim();
  if (!email) {
    msgEl.textContent = "Please enter your email.";
    return;
  }

  localStorage.setItem("newsletterEmail", email);
  msgEl.textContent = "Thanks for subscribing!";
}

// PWA Service Worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

initDarkMode();
initQuoteRotation();
initAuthorOfDay();
updateStreak();
// Shared helper - reusable across pages
function $(id) { return document.getElementById(id); }

// Scroll reveal - reusable across pages (adds .revealed when element enters viewport)
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal-on-scroll");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("revealed");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", initScrollReveal);

// -------------------- BOOK DATA (shared across pages) --------------------
const PLACEHOLDER = "https://placehold.co/150x220/5C4033/F8F4EF?text=📖";

const BOOKS = [
  {
    id: 1,
    title: "Percy Jackson: The Lightning Thief",
    author: "Rick Riordan",
    genre: "Fantasy",
    length: "Medium",
    cover: "Percy Jackson.png",
    synopsis: "Twelve-year-old Percy discovers he is a demigod, son of Poseidon. He must find Zeus's stolen lightning bolt to prevent a war among the gods.",
    series: ["Sequel: The Sea of Monsters", "Sequel: The Titan's Curse"],
    reviews: [
      { reviewer: "Alex", rating: "5/5", comment: "Fun adventure, loved the Greek myths!" },
      { reviewer: "Maya", rating: "5/5", comment: "Couldn't put it down." }
    ]
  },
  {
    id: 2,
    title: "The Hunger Games",
    author: "Suzanne Collins",
    genre: "Sci-Fi",
    length: "Medium",
    cover: "The Hunger Games.png",
    synopsis: "In a dystopian future, Katniss volunteers to take her sister's place in the Hunger Games – a televised fight to the death.",
    series: ["Sequel: Catching Fire", "Sequel: Mockingjay"],
    reviews: [
      { reviewer: "Sam", rating: "5/5", comment: "Thrilling from start to finish." }
    ]
  },
  {
    id: 3,
    title: "A Good Girl's Guide to Murder",
    author: "Holly Jackson",
    genre: "Crime",
    length: "Medium",
    cover: "A Girls Guide to Murder.png",
    synopsis: "Pip decides to reopen a closed murder case for her school project. As she digs deeper, she uncovers secrets someone will kill to keep hidden.",
    series: ["Sequel: Good Girl, Bad Blood"],
    reviews: [
      { reviewer: "Jordan", rating: "5/5", comment: "Best YA thriller I've read!" }
    ]
  },
  {
    id: 4,
    title: "Death Note",
    author: "Tsugumi Ohba",
    genre: "Manga",
    length: "Long",
    cover: "Death Note.png",
    synopsis: "Light Yagami finds a notebook that kills anyone whose name is written in it. He decides to use it to rid the world of criminals, but a genius detective is on his trail.",
    series: ["Sequel: Death Note Vol. 2–12"],
    reviews: [
      { reviewer: "Kai", rating: "5/5", comment: "Mind-blowing cat-and-mouse game." }
    ]
  },
  {
    id: 5,
    title: "One of Us Is Lying",
    author: "Karen M. McManus",
    genre: "Mystery",
    length: "Medium",
    cover: "One of us is lying.png",
    synopsis: "Five students enter detention. Only four leave alive. Each had a motive to kill Simon, who was about to reveal their darkest secrets.",
    series: ["Sequel: One of Us Is Next"],
    reviews: [
      { reviewer: "Riley", rating: "4/5", comment: "Great twists, very addictive." }
    ]
  },
  {
    id: 6,
    title: "Six of Crows",
    author: "Leigh Bardugo",
    genre: "Fantasy",
    length: "Long",
    cover: "Six of crows.png",
    synopsis: "A crew of six outcasts must pull off an impossible heist – break into an ice court and rescue a prisoner who holds the key to a deadly drug.",
    series: ["Sequel: Crooked Kingdom"],
    reviews: [
      { reviewer: "Luna", rating: "5/5", comment: "Amazing characters and plot." }
    ]
  },
  {
    id: 7,
    title: "My Hero Academia Vol. 1",
    author: "Kohei Horikoshi",
    genre: "Manga",
    length: "Short",
    cover: "My hero academia vol 1.png",
    synopsis: "In a world where most people have superpowers, Izuku Midoriya dreams of becoming a hero despite being born Quirkless. When he meets his idol, everything changes.",
    series: ["Sequel: My Hero Academia Vol. 2–38+"],
    reviews: [
      { reviewer: "Zara", rating: "5/5", comment: "So inspiring and action-packed!" }
    ]
  },
  {
    id: 8,
    title: "The Maze Runner",
    author: "James Dashner",
    genre: "Sci-Fi",
    length: "Medium",
    cover: "The maze runner.png",
    synopsis: "Thomas wakes up in a glade with no memory. Surrounded by a deadly maze, he and the other boys must find a way out – or die trying.",
    series: ["Sequel: The Scorch Trials", "Sequel: The Death Cure"],
    reviews: [
      { reviewer: "Chris", rating: "4/5", comment: "Pulse-pounding and mysterious." }
    ]
  },
  {
    id: 9,
    title: "The Inheritance Games",
    author: "Jennifer Lynn Barnes",
    genre: "Mystery",
    length: "Medium",
    cover: "The inheritance game.png",
    synopsis: "Avery Grambs inherits billions from a stranger she's never met. To claim it, she must move into his mansion and solve a dangerous puzzle alongside his hostile grandsons.",
    series: ["Sequel: The Hawthorne Legacy"],
    reviews: [
      { reviewer: "Emma", rating: "5/5", comment: "Clever and twisty!" }
    ]
  },
  {
    id: 10,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    length: "Medium",
    cover: "Harry potter 1.png",
    synopsis: "Harry discovers he's a wizard and begins his first year at Hogwarts School of Witchcraft and Wizardry.",
    series: ["Sequel: Harry Potter and the Chamber of Secrets"],
    reviews: [
      { reviewer: "Ava", rating: "5/5", comment: "Magical and unforgettable." }
    ]
  },
  {
    id: 11,
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    genre: "Fantasy",
    length: "Medium",
    cover: "Harry potter 2.png",
    synopsis: "A dark force threatens Hogwarts as the Chamber of Secrets is opened once more.",
    series: ["Prequel: Harry Potter and the Philosopher's Stone", "Sequel: Harry Potter and the Prisoner of Azkaban"],
    reviews: [
      { reviewer: "Noah", rating: "5/5", comment: "Creepy mystery with great twists." }
    ]
  },
  {
    id: 12,
    title: "Harry Potter and the Prisoner of Azkaban",
    author: "J.K. Rowling",
    genre: "Fantasy",
    length: "Long",
    cover: "Harry potter 3.png",
    synopsis: "A dangerous prisoner escapes Azkaban and Harry uncovers secrets about his past.",
    series: ["Prequel: Harry Potter and the Chamber of Secrets", "Sequel: Harry Potter and the Goblet of Fire"],
    reviews: [
      { reviewer: "Mia", rating: "5/5", comment: "Best one yet, so emotional." }
    ]
  },
  {
    id: 13,
    title: "Harry Potter and the Goblet of Fire",
    author: "J.K. Rowling",
    genre: "Fantasy",
    length: "Long",
    cover: "Harry potter 4.png",
    synopsis: "Harry is unexpectedly entered into the Triwizard Tournament, a deadly magical competition.",
    series: ["Prequel: Harry Potter and the Prisoner of Azkaban", "Sequel: Harry Potter and the Order of the Phoenix"],
    reviews: [
      { reviewer: "Liam", rating: "5/5", comment: "Epic adventure and darker stakes." }
    ]
  },
  {
    id: 14,
    title: "Harry Potter and the Order of the Phoenix",
    author: "J.K. Rowling",
    genre: "Fantasy",
    length: "Long",
    cover: "Harry potter 5.png",
    synopsis: "Harry faces a rising dark threat while the Ministry denies Voldemort's return.",
    series: ["Prequel: Harry Potter and the Goblet of Fire", "Sequel: Harry Potter and the Half-Blood Prince"],
    reviews: [
      { reviewer: "Ella", rating: "5/5", comment: "Intense and full of heart." }
    ]
  },
  {
    id: 15,
    title: "Harry Potter and the Half-Blood Prince",
    author: "J.K. Rowling",
    genre: "Fantasy",
    length: "Long",
    cover: "Harry potter 6.png",
    synopsis: "Harry and Dumbledore uncover Voldemort's past and the secret of the Horcruxes.",
    series: ["Prequel: Harry Potter and the Order of the Phoenix", "Sequel: Harry Potter and the Deathly Hallows"],
    reviews: [
      { reviewer: "Sofia", rating: "5/5", comment: "Powerful and tragic." }
    ]
  },
  {
    id: 16,
    title: "Harry Potter and the Deathly Hallows",
    author: "J.K. Rowling",
    genre: "Fantasy",
    length: "Long",
    cover: "Harry potter 7.png",
    synopsis: "Harry, Ron, and Hermione leave Hogwarts to hunt Horcruxes and face Voldemort.",
    series: ["Prequel: Harry Potter and the Half-Blood Prince"],
    reviews: [
      { reviewer: "Zoe", rating: "5/5", comment: "A satisfying, emotional finale." }
    ]
  },
  {
    id: 17,
    title: "Never Never",
    author: "Colleen Hoover & Tarryn Fisher",
    genre: "Romance",
    length: "Medium",
    cover: "never never.png",
    synopsis: "Two teens wake up with no memory of who they are or why they are together, and must uncover the truth about their relationship.",
    series: ["Sequel: Never Never Part Two", "Sequel: Never Never Part Three"],
    reviews: [
      { reviewer: "Grace", rating: "4/5", comment: "Fast, addictive, and mysterious." }
    ]
  },
  {
    id: 18,
    title: "It Ends with Us",
    author: "Colleen Hoover",
    genre: "Romance",
    length: "Medium",
    cover: "it ends with us .png",
    synopsis: "Lily navigates a complex relationship that forces her to confront hard truths about love and choice.",
    series: ["Sequel: It Starts with Us"],
    reviews: [
      { reviewer: "Hana", rating: "5/5", comment: "Emotional and thought-provoking." }
    ]
  },
  {
    id: 19,
    title: "Naruto Vol. 1",
    author: "Masashi Kishimoto",
    genre: "Manga",
    length: "Short",
    cover: "Naruto.png",
    synopsis: "Naruto Uzumaki, a mischievous ninja, dreams of becoming the Hokage and earning his village's respect.",
    series: ["Sequel: Naruto Vol. 1"],
    reviews: [
      { reviewer: "Ken", rating: "5/5", comment: "Classic shonen start with tons of energy." }
    ]
  }
];

// -------------------- EXPLORER PAGE --------------------
function initExplorer() {
  const grid = $("booksGrid");
  const search = $("searchInput");
  const genre = $("genreSelect");
  const reset = $("resetBtn");

  if (!grid || !search || !genre || !reset) return;

  function render(list) {
    grid.innerHTML = list.map(b => `
      <div class="book-card" data-id="${b.id}">
        <img src="${b.cover}" alt="${b.title}">
        <div class="info">
          <p class="title">${b.title}</p>
          <p class="meta">${b.author} • ${b.genre}</p>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".book-card").forEach(card => {
      card.addEventListener("click", () => openModal(Number(card.dataset.id)));
    });
  }

  function apply() {
    const q = search.value.trim().toLowerCase();
    const g = genre.value;

    const filtered = BOOKS.filter(b => {
      const textOk =
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      const genreOk = (g === "All") || (b.genre === g);
      return textOk && genreOk;
    });

    render(filtered);
  }

  search.addEventListener("input", apply);
  genre.addEventListener("change", apply);
  reset.addEventListener("click", () => {
    search.value = "";
    genre.value = "All";
    apply();
  });

  render(BOOKS);
}

function openModal(id) {
  const modal = $("bookModal");
  const close = $("closeModal");
  const book = BOOKS.find(b => b.id === id);
  if (!modal || !close || !book) return;

  $("modalCover").src = book.cover;
  $("modalTitle").textContent = book.title;
  $("modalAuthor").textContent = `By ${book.author}`;
  $("modalGenre").textContent = `Genre: ${book.genre}`;
  $("modalSynopsis").textContent = book.synopsis;

  $("modalSeries").innerHTML = book.series.map(x => `<li>${x}</li>`).join("");

  $("modalReviews").innerHTML = book.reviews.map(r => `
    <tr>
      <td>${r.reviewer}</td>
      <td>${r.rating}</td>
      <td>${r.comment}</td>
    </tr>
  `).join("");

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  close.onclick = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    }
  };
}

// -------------------- TRACKER PAGE --------------------
function initTracker() {
  const form = $("trackerForm");
  if (!form) return;

  const totalEl = $("totalPages");
  const readEl = $("pagesRead");
  const perDayEl = $("pagesPerDay");

  const pctOut = $("percentOut");
  const bar = $("bar");
  const finishOut = $("finishOut");
  const msg = $("trackerMsg");

  const saveBtn = $("saveBtn");
  const savedOut = $("savedOut");

  function calc(total, read, perDay) {
    const pct = Math.min(100, Math.max(0, (read / total) * 100));
    const remaining = Math.max(0, total - read);
    const days = Math.ceil(remaining / perDay);
    return { pct, days };
  }

  function renderSaved() {
    const saved = localStorage.getItem("readingProgress");
    if (!saved) {
      savedOut.textContent = "Nothing saved yet.";
      return;
    }
    const d = JSON.parse(saved);
    savedOut.textContent = `Total ${d.total}, Read ${d.read}, Speed ${d.perDay}/day (${Math.round(d.pct)}%)`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const total = Number(totalEl.value);
    const read = Number(readEl.value);
    const perDay = Number(perDayEl.value);

    if (!total || total <= 0) { msg.textContent = "Total pages must be > 0"; msg.style.color="crimson"; return; }
    if (read < 0 || read > total) { msg.textContent = "Pages read must be 0 to total"; msg.style.color="crimson"; return; }
    if (!perDay || perDay <= 0) { msg.textContent = "Pages per day must be > 0"; msg.style.color="crimson"; return; }

    const r = calc(total, read, perDay);
    pctOut.textContent = `${Math.round(r.pct)}%`;
    bar.style.width = `${r.pct}%`;
    finishOut.textContent = (r.days === 0) ? "Finished 🎉" : `${r.days} day(s)`;

    msg.textContent = "Calculated!";
    msg.style.color = "#2b7a2b";
  });

  saveBtn.addEventListener("click", () => {
    const total = Number(totalEl.value);
    const read = Number(readEl.value);
    const perDay = Number(perDayEl.value);

    if (!total || total <= 0 || read < 0 || read > total || !perDay || perDay <= 0) {
      msg.textContent = "Enter valid values first.";
      msg.style.color = "crimson";
      return;
    }

    const r = calc(total, read, perDay);
    localStorage.setItem("readingProgress", JSON.stringify({ total, read, perDay, pct: r.pct }));
    msg.textContent = "Saved to localStorage.";
    msg.style.color = "#2b7a2b";
    renderSaved();
  });

  renderSaved();
}

// Run initializers (only activates if elements exist)
initExplorer();
initTracker();
// -------------------- RECOMMENDER PAGE --------------------
function initRecommender() {
  const genreSel = document.getElementById("recGenre");
  const lengthSel = document.getElementById("recLength");
  const pickBtn = document.getElementById("pickBtn");
  const pickAgainBtn = document.getElementById("pickAgainBtn");
  const saveBtn = document.getElementById("saveRecBtn");
  const box = document.getElementById("recBox");
  const msg = document.getElementById("recMsg");
  const savedList = document.getElementById("savedList");

  if (!genreSel || !lengthSel || !pickBtn || !saveBtn || !box || !msg || !savedList) return;

  function doPick() {
    pickBtn.classList.add("pulse");
    setTimeout(() => pickBtn.classList.remove("pulse"), 400);
    if (pickAgainBtn) pickAgainBtn.classList.add("pick-again-anim");
    setTimeout(() => { if (pickAgainBtn) pickAgainBtn.classList.remove("pick-again-anim"); }, 600);
  }

  let currentPick = null;

  function getLengthTag(book) {
    return book.length || "Medium";
  }

  function renderSaved() {
    const data = JSON.parse(localStorage.getItem("readingList") || "[]");
    savedList.innerHTML = data.length
      ? data.map(x => `<li>${x.title} — ${x.author}</li>`).join("")
      : "<li class='muted'>No saved books yet.</li>";
  }

  function runPick() {
    doPick();
    const g = genreSel.value;
    const l = lengthSel.value;

    const filtered = BOOKS.filter(b => {
      const genreOk = (g === "All") || (b.genre === g);
      const lengthOk = (l === "All") || (getLengthTag(b) === l);
      return genreOk && lengthOk;
    });

    if (filtered.length === 0) {
      msg.textContent = "No books match your selection.";
      msg.style.color = "crimson";
      box.innerHTML = "<p class='muted'>Try a different filter.</p>";
      currentPick = null;
      return;
    }

    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    currentPick = pick;

    msg.textContent = "Recommendation generated!";
    msg.style.color = "#2b7a2b";

    box.innerHTML = `
      <img src="${pick.cover}" alt="${pick.title}">
      <div>
        <p><strong>${pick.title}</strong></p>
        <p class="muted">${pick.author} • ${pick.genre}</p>
        <p>${pick.synopsis}</p>
      </div>
    `;
  }

  pickBtn.addEventListener("click", runPick);
  if (pickAgainBtn) pickAgainBtn.addEventListener("click", runPick);

  saveBtn.addEventListener("click", () => {
    if (!currentPick) {
      msg.textContent = "Generate a recommendation first.";
      msg.style.color = "crimson";
      return;
    }

    const list = JSON.parse(localStorage.getItem("readingList") || "[]");
    const exists = list.some(x => x.id === currentPick.id);
    if (!exists) list.push({ id: currentPick.id, title: currentPick.title, author: currentPick.author });

    localStorage.setItem("readingList", JSON.stringify(list));
    msg.textContent = "Saved to reading list!";
    msg.style.color = "#2b7a2b";
    renderSaved();
  });

  renderSaved();
}

initRecommender();


// -------------------- FLOW PAGE --------------------
function initFlow() {
  const sounds = [
    { btn: "playRain", audio: "rainAudio", label: "Rain" },
    { btn: "playFire", audio: "fireAudio", label: "Fire" },
    { btn: "playOcean", audio: "oceanAudio", label: "Ocean waves" },
    { btn: "playCafe", audio: "cafeAudio", label: "Café ambience" },
    { btn: "playForest", audio: "forestAudio", label: "Forest birds" },
    { btn: "playPiano", audio: "pianoAudio", label: "Soft piano" }
  ];

  const stop = document.getElementById("stopSound");
  const soundMsg = document.getElementById("soundMsg");
  const input = document.getElementById("completedInput");
  const addBtn = document.getElementById("addCompletedBtn");
  const listEl = document.getElementById("completedList");
  const clearBtn = document.getElementById("clearCompletedBtn");

  if (!stop || !soundMsg || !input || !addBtn || !listEl || !clearBtn) return;

  const audioEls = sounds.map(s => document.getElementById(s.audio));

  function stopAll() {
    audioEls.forEach(el => { if (el) { el.pause(); el.currentTime = 0; } });
  }

  sounds.forEach((s, i) => {
    const btn = document.getElementById(s.btn);
    const audio = audioEls[i];
    if (btn && audio) {
      btn.addEventListener("click", () => {
        stopAll();
        audio.play();
        soundMsg.textContent = `${s.label} playing…`;
      });
    }
  });

  stop.addEventListener("click", () => {
    stopAll();
    soundMsg.textContent = "Stopped.";
  });

  function renderCompleted() {
    const arr = JSON.parse(localStorage.getItem("completedBooks") || "[]");
    listEl.innerHTML = arr.length
      ? arr.map(x => `<li>${x}</li>`).join("")
      : "<li class='muted'>No completed books yet.</li>";
  }

  addBtn.addEventListener("click", () => {
    const title = input.value.trim();
    if (!title) return;

    const arr = JSON.parse(localStorage.getItem("completedBooks") || "[]");
    arr.push(title);
    localStorage.setItem("completedBooks", JSON.stringify(arr));
    input.value = "";
    renderCompleted();
  });

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("completedBooks");
    renderCompleted();
  });

  renderCompleted();
}

initFlow();


// -------------------- FEEDBACK PAGE --------------------
function initFeedback() {
  const form = document.getElementById("feedbackForm");
  const nameEl = document.getElementById("fbName");
  const emailEl = document.getElementById("fbEmail");
  const msgEl = document.getElementById("fbMessage");
  const out = document.getElementById("fbMsg");

  if (!form || !nameEl || !emailEl || !msgEl || !out) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = msgEl.value.trim();

    if (!name) {
      out.textContent = "Please enter your name.";
      out.style.color = "crimson";
      nameEl.focus();
      return;
    }
    if (name.length < 2) {
      out.textContent = "Name must be at least 2 characters.";
      out.style.color = "crimson";
      nameEl.focus();
      return;
    }
    if (!email) {
      out.textContent = "Please enter your email address.";
      out.style.color = "crimson";
      emailEl.focus();
      return;
    }
    if (!emailRegex.test(email)) {
      out.textContent = "Please enter a valid email address (e.g. user@example.com).";
      out.style.color = "crimson";
      emailEl.focus();
      return;
    }
    if (!message) {
      out.textContent = "Please enter your message.";
      out.style.color = "crimson";
      msgEl.focus();
      return;
    }
    if (message.length < 10) {
      out.textContent = "Message must be at least 10 characters.";
      out.style.color = "crimson";
      msgEl.focus();
      return;
    }

    const feedback = JSON.parse(localStorage.getItem("feedbackList") || "[]");
    feedback.push({ name, email, message, time: new Date().toLocaleString() });
    localStorage.setItem("feedbackList", JSON.stringify(feedback));

    out.textContent = "Thank you! Your feedback has been saved successfully.";
    out.style.color = "#2b7a2b";

    form.reset();
  });

  // FAQ accordion
  const qs = document.querySelectorAll(".faq-q");
  qs.forEach(btn => {
    btn.addEventListener("click", () => {
      const ans = btn.nextElementSibling;
      if (ans) ans.classList.toggle("show");
    });
  });
}

initFeedback();
