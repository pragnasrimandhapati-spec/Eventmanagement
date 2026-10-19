/* =========================================================
   EventHub – Event Registration Application
   ========================================================= */

const img = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

/* ---------- Event data ---------- */
const EVENTS = [
  {
    id: 1, name: "Hackathon 2026", category: "Technical",
    date: "2026-10-31", time: "09:00 AM - 06:00 PM", start: "09:00", venue: "Main Auditorium",
    seats: 120, image: img("photo-1504384308090-c894fdcc538d"),
    desc: "A 9-hour coding marathon where teams build real solutions to real problems. Mentors, snacks and big prizes included.",
    highlights: ["Teams of 1–4", "Mentor support", "Cash prizes & internships", "Lunch & refreshments"]
  },
  {
    id: 2, name: "Cultural Fest", category: "Cultural",
    date: "2026-11-07", time: "10:00 AM - 04:00 PM", start: "10:00", venue: "College Grounds",
    seats: 300, image: img("photo-1492684223066-81342ee5ff30"),
    desc: "Dance, music, drama and art – a celebration of creativity and traditions with performances from across the campus.",
    highlights: ["Live dance & music", "Food stalls", "Open-mic stage", "Photo booths"]
  },
  {
    id: 3, name: "AI Workshop", category: "Technical",
    date: "2026-11-14", time: "10:00 AM - 01:00 PM", start: "10:00", venue: "Seminar Hall",
    seats: 80, image: img("photo-1531482615713-2afd69097998"),
    desc: "Hands-on introduction to machine learning and generative AI by industry practitioners. Bring your laptop!",
    highlights: ["Hands-on labs", "Industry speakers", "Certificate", "Starter code provided"]
  },
  {
    id: 4, name: "Career Connect Fair", category: "Career",
    date: "2026-11-21", time: "11:00 AM - 05:00 PM", start: "11:00", venue: "Convention Centre",
    seats: 200, image: img("photo-1540575467063-178a50c2df87"),
    desc: "Meet recruiters, attend resume clinics and mock interviews, and discover your next opportunity.",
    highlights: ["30+ companies", "Resume clinic", "Mock interviews", "On-spot shortlisting"]
  },
  {
    id: 5, name: "Startup Pitch Day", category: "Career",
    date: "2026-11-28", time: "02:00 PM - 06:00 PM", start: "14:00", venue: "Innovation Lab",
    seats: 60, image: img("photo-1517048676732-d65bc937f952"),
    desc: "Pitch your idea to investors and founders, or come to watch and learn how great ideas get funded.",
    highlights: ["Live pitching", "Investor panel", "Networking tea", "Best idea award"]
  },
  {
    id: 6, name: "Web Dev Bootcamp", category: "Technical",
    date: "2026-12-05", time: "09:30 AM - 04:30 PM", start: "09:30", venue: "Computer Lab 2",
    seats: 50, image: img("photo-1517694712202-14dd9538aa97"),
    desc: "Go from zero to deploying your own responsive website using HTML, CSS, Bootstrap and JavaScript.",
    highlights: ["Build a full project", "Free hosting guide", "Q&A with mentors", "Certificate"]
  }
];

const GALLERY = [
  "photo-1511578314322-379afb476865", "photo-1540575467063-178a50c2df87",
  "photo-1523580846011-d3a5bc25702b", "photo-1492684223066-81342ee5ff30",
  "photo-1531482615713-2afd69097998", "photo-1517048676732-d65bc937f952",
  "photo-1504384308090-c894fdcc538d", "photo-1517694712202-14dd9538aa97"
];

const KEY = "eventhub_registrations";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Storage ---------- */
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} };
let regs = load();

/* ---------- Helpers ---------- */
const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
const mon = (iso) => new Date(iso + "T00:00:00").toLocaleString("en-US", { month: "short" }).toUpperCase();
const day = (iso) => new Date(iso + "T00:00:00").getDate();
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const booked = (id) => regs.filter(r => r.eventId === id).reduce((n, r) => n + r.people, 0);
const left = (e) => Math.max(0, e.seats - booked(e.id));
const evById = (id) => EVENTS.find(e => e.id === +id);
const isPast = (e) => new Date(`${e.date}T${e.start}:00`) < new Date();
const upcoming = () => EVENTS.filter(e => !isPast(e));

function toast(msg) {
  $("#toastMsg").textContent = msg;
  bootstrap.Toast.getOrCreateInstance($("#appToast"), { delay: 2800 }).show();
}

/* ---------- Image with graceful fallback ---------- */
const FALLBACK = "linear-gradient(135deg,#7b4dff,#ff2d87)";
function bgImage(el, url) {
  el.style.background = FALLBACK;
  const t = new Image();
  t.onload = () => { el.style.background = `url("${url}") center/cover no-repeat`; };
  t.src = url;
}

/* =========================================================
   RENDER EVENTS
   ========================================================= */
function renderEvents(filter = "all") {
  const grid = $("#eventGrid");
  const list = EVENTS.filter(e => filter === "all" || e.category === filter);
  grid.innerHTML = list.map(e => {
    const l = left(e), pct = Math.round(((e.seats - l) / e.seats) * 100);
    const past = isPast(e);
    return `
    <div class="col-md-6 col-lg-4 reveal">
      <article class="event-card">
        <div class="event-img">
          <div class="bg" data-bg="${e.image}"></div>
          <span class="cat-tag">${e.category}</span>
          <div class="date-badge"><b>${day(e.date)}</b><span>${mon(e.date)}</span></div>
        </div>
        <div class="event-body">
          <h5>${e.name}</h5>
          <div class="meta"><i class="bi bi-clock"></i>${e.time}</div>
          <div class="meta"><i class="bi bi-geo-alt-fill"></i>${e.venue}</div>
          <div class="seats"><div style="width:${pct}%"></div></div>
          <small class="text-muted mb-3">${l > 0 ? `${l} of ${e.seats} seats left` : "Sold out"}</small>
          <div class="d-flex gap-2 mt-auto">
            <button class="btn btn-outline-secondary flex-fill" data-details="${e.id}">Details</button>
            <button class="btn btn-pink flex-fill" data-register="${e.id}" ${l === 0 || past ? "disabled" : ""}>${past ? "Closed" : l === 0 ? "Full" : "Register Now"}</button>
          </div>
        </div>
      </article>
    </div>`;
  }).join("");
  $$(".event-img .bg", grid).forEach(el => bgImage(el, el.dataset.bg));
  observeReveal();
}

function fillSelects() {
  const opts = upcoming().map(e => `<option value="${e.id}">${e.name} – ${mon(e.date)} ${day(e.date)}</option>`).join("");
  $("#eventSelect").innerHTML = `<option value="">Choose an event…</option>` + opts;
  $("#eventFilter").innerHTML = `<option value="">All events</option>` + EVENTS.map(e => `<option value="${e.id}">${e.name}</option>`).join("");
}

/* ---------- Details modal ---------- */
function showDetails(id) {
  const e = evById(id);
  bgImage($("#modalImg"), e.image);
  $("#modalBody").innerHTML = `
    <span class="badge rounded-pill text-bg-light border mb-2">${e.category}</span>
    <h3 class="fw-bold">${e.name}</h3>
    <p class="text-muted">${e.desc}</p>
    <div class="row g-3 mb-3">
      <div class="col-sm-6"><div class="info-pill"><small>Date</small><i class="bi bi-calendar3"></i><b>${fmtDate(e.date)}</b></div></div>
      <div class="col-sm-6"><div class="info-pill"><small>Time</small><i class="bi bi-clock"></i><b>${e.time}</b></div></div>
      <div class="col-sm-6"><div class="info-pill"><small>Venue</small><i class="bi bi-geo-alt-fill"></i><b>${e.venue}</b></div></div>
      <div class="col-sm-6"><div class="info-pill"><small>Seats available</small><i class="bi bi-people"></i><b>${left(e)} / ${e.seats}</b></div></div>
    </div>
    <h6 class="fw-bold">Highlights</h6>
    <ul class="list-unstyled row g-1 mb-4">${e.highlights.map(h => `<li class="col-sm-6"><i class="bi bi-check-circle-fill text-success me-2"></i>${h}</li>`).join("")}</ul>
    <button class="btn btn-pink w-100" data-register="${e.id}" data-bs-dismiss="modal" ${left(e) === 0 || isPast(e) ? "disabled" : ""}>Register for this event</button>`;
  bootstrap.Modal.getOrCreateInstance($("#eventModal")).show();
}

/* ---------- Selected event panel ---------- */
function showSelected(id) {
  const body = $("#selectedBody");
  if (!id) {
    body.className = "text-white-50";
    body.textContent = "Choose an event from the form or click “Register Now” on any event card to see its details here.";
    return;
  }
  const e = evById(id);
  body.className = "text-white";
  body.innerHTML = `
    <div class="sel-img" data-bg="${e.image}"></div>
    <h4 class="fw-bold">${e.name}</h4>
    <p class="small text-white-50">${e.desc}</p>
    <div class="mb-2"><i class="bi bi-calendar3 me-2 text-warning"></i>${fmtDate(e.date)}</div>
    <div class="mb-2"><i class="bi bi-clock me-2 text-warning"></i>${e.time}</div>
    <div class="mb-2"><i class="bi bi-geo-alt-fill me-2 text-warning"></i>${e.venue}</div>
    <div><i class="bi bi-people me-2 text-warning"></i>${left(e)} seats left</div>`;
  bgImage($(".sel-img", body), e.image);
}

/* =========================================================
   FORM
   ========================================================= */
const form = $("#regForm");

function preselect(id) {
  $("#eventSelect").value = id;
  showSelected(id);
  $("#register").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("#fullName").focus({ preventScroll: true }), 700);
}

$("#eventSelect").addEventListener("change", e => showSelected(e.target.value));
$("#phone").addEventListener("input", e => { e.target.value = e.target.value.replace(/\D/g, ""); });

form.addEventListener("submit", ev => {
  ev.preventDefault();
  const emailEl = $("#email"), evId = +$("#eventSelect").value, people = +$("#tickets").value;
  emailEl.setCustomValidity("");

  // duplicate + capacity checks
  if (evId && regs.some(r => r.eventId === evId && r.email.toLowerCase() === emailEl.value.trim().toLowerCase())) {
    emailEl.setCustomValidity("dup");
    $("#emailFeedback").textContent = "This email is already registered for the selected event.";
  } else {
    $("#emailFeedback").textContent = "Please enter a valid email address.";
  }
  const capErr = evId && people > left(evById(evId));
  if (capErr) toast(`Only ${left(evById(evId))} seat(s) left for this event.`);

  if (!form.checkValidity() || capErr) {
    form.classList.add("was-validated");
    form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
    return;
  }

  const btn = $("#submitBtn");
  btn.disabled = true; $(".btn-text", btn).textContent = "Registering…"; $(".spinner-border", btn).classList.remove("d-none");

  setTimeout(() => {
    const e = evById(evId);
    const reg = {
      ticket: "EH" + e.id + Date.now().toString(36).toUpperCase().slice(-5),
      eventId: evId,
      name: $("#fullName").value.trim(),
      email: emailEl.value.trim(),
      phone: $("#phone").value,
      college: $("#college").value.trim(),
      year: $("#year").value,
      people,
      time: new Date().toISOString()
    };
    regs.push(reg); save(regs);

    form.reset(); form.classList.remove("was-validated"); showSelected("");
    btn.disabled = false; $(".btn-text", btn).textContent = "Register Now"; $(".spinner-border", btn).classList.add("d-none");

    refreshAll();
    showConfirmation(reg, e);
  }, 900);
});

function showConfirmation(r, e) {
  $("#cName").textContent = r.name;
  $("#cId").textContent = r.ticket;
  $("#cEvent").textContent = e.name;
  $("#cDate").textContent = fmtDate(e.date);
  $("#cTime").textContent = e.time;
  $("#cVenue").textContent = e.venue;
  $("#cEmail").textContent = r.email;
  $("#cPeople").textContent = r.people;
  bootstrap.Modal.getOrCreateInstance($("#confirmModal")).show();
  launchConfetti();
}

/* =========================================================
   PARTICIPANTS
   ========================================================= */
function renderParticipants() {
  const q = $("#searchBox").value.trim().toLowerCase();
  const evf = $("#eventFilter").value;
  const rows = regs.filter(r =>
    (!evf || r.eventId === +evf) &&
    (!q || [r.name, r.email, r.ticket, r.college].some(v => v.toLowerCase().includes(q)))
  );
  $("#partBody").innerHTML = rows.map((r, i) => `
    <tr style="animation-delay:${Math.min(i, 10) * 40}ms">
      <td>${i + 1}</td>
      <td><span class="badge-ticket">${esc(r.ticket)}</span></td>
      <td><b>${esc(r.name)}</b><br><small class="text-muted">${esc(r.college)} · ${esc(r.year)}</small></td>
      <td>${esc(r.email)}<br><small class="text-muted">+91 ${esc(r.phone)}</small></td>
      <td>${esc(evById(r.eventId).name)}</td>
      <td>${r.people}</td>
      <td><small>${new Date(r.time).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</small></td>
      <td><button class="btn btn-sm btn-outline-danger" data-del="${esc(r.ticket)}" title="Cancel registration"><i class="bi bi-x-lg"></i></button></td>
    </tr>`).join("");
  $("#emptyState").classList.toggle("d-none", rows.length > 0);
  $("#partBody").closest("table").classList.toggle("d-none", rows.length === 0);
}

$("#searchBox").addEventListener("input", renderParticipants);
$("#eventFilter").addEventListener("change", renderParticipants);
$("#partBody").addEventListener("click", e => {
  const b = e.target.closest("[data-del]"); if (!b) return;
  if (confirm("Cancel this registration?")) {
    regs = regs.filter(r => r.ticket !== b.dataset.del); save(regs); refreshAll(); toast("Registration cancelled.");
  }
});
$("#clearAll").addEventListener("click", () => {
  if (!regs.length) return toast("Nothing to clear.");
  if (confirm("Delete ALL registrations?")) { regs = []; save(regs); refreshAll(); toast("All registrations cleared."); }
});

/* =========================================================
   GLOBAL EVENTS
   ========================================================= */
document.addEventListener("click", e => {
  const r = e.target.closest("[data-register]");
  if (r) { preselect(r.dataset.register); return; }
  const d = e.target.closest("[data-details]");
  if (d) showDetails(+d.dataset.details);
  const f = e.target.closest(".btn-filter");
  if (f) { $$(".btn-filter").forEach(b => b.classList.remove("active")); f.classList.add("active"); renderEvents(f.dataset.filter); }
});

/* Gallery */
function renderGallery() {
  $("#galleryGrid").innerHTML = GALLERY.map((g, i) => `
    <div class="col-6 col-md-4 col-lg-3 reveal" style="transition-delay:${i * 60}ms">
      <div class="g-item" data-src="${img(g, 1400)}"><img src="${img(g, 600)}" alt="Event photo ${i + 1}" loading="lazy" onerror="this.style.display='none'"></div>
    </div>`).join("");
}
$("#galleryGrid").addEventListener("click", e => {
  const g = e.target.closest(".g-item"); if (!g) return;
  $("#lightImg").src = g.dataset.src;
  bootstrap.Modal.getOrCreateInstance($("#lightbox")).show();
});

/* =========================================================
   ANIMATIONS
   ========================================================= */
let io;
function observeReveal() {
  io = io || new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
  }, { threshold: .12 });
  $$(".reveal:not(.visible)").forEach(el => io.observe(el));
}

/* Typing effect */
(function typing() {
  const words = ["Your Future", "Your Skills", "Your Network"];
  let w = 0, c = 0, del = false; const el = $("#typed");
  (function tick() {
    const word = words[w];
    el.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 45 : 90);
  })();
})();

/* Counters */
function animateCounter(el, target) {
  const dur = 1400, start = performance.now();
  (function step(t) {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
function updateStats() {
  const el = $("#statRegs");
  el.dataset.target = regs.reduce((n, r) => n + r.people, 0);
  animateCounter(el, +el.dataset.target);
}

/* Countdown to next event */
function countdown() {
  const next = upcoming()[0];
  if (!next) { $("#nextName").textContent = "No upcoming events"; return; }
  $("#nextName").textContent = next.name;
  const target = new Date(`${next.date}T${next.start}:00`).getTime();
  const tick = () => {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff %= 864e5;
    const h = Math.floor(diff / 36e5); diff %= 36e5;
    const m = Math.floor(diff / 6e4), s = Math.floor((diff % 6e4) / 1e3);
    $("#cdD").textContent = String(d).padStart(2, "0");
    $("#cdH").textContent = String(h).padStart(2, "0");
    $("#cdM").textContent = String(m).padStart(2, "0");
    $("#cdS").textContent = String(s).padStart(2, "0");
  };
  tick(); setInterval(tick, 1000);
  $("#nextBtn").onclick = ev => { ev.preventDefault(); preselect(next.id); };
}

/* Confetti */
function launchConfetti() {
  const colors = ["#ff2d87", "#7b4dff", "#ffc21a", "#22c55e", "#38bdf8"];
  const c = document.createElement("canvas");
  Object.assign(c.style, { position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2000 });
  c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
  const ctx = c.getContext("2d");
  const ps = Array.from({ length: 140 }, () => ({
    x: Math.random() * c.width, y: -20 - Math.random() * c.height * .4,
    w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, vy: 2 + Math.random() * 4,
    vx: -2 + Math.random() * 4, r: Math.random() * 6, vr: -.2 + Math.random() * .4,
    col: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frames = 0;
  (function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    });
    if (++frames < 220) requestAnimationFrame(draw); else c.remove();
  })();
}

/* Navbar, scroll spy, back-to-top */
const nav = $("#mainNav"), toTop = $("#toTop");
const sections = $$("section[id], header[id]");
addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", scrollY > 40);
  toTop.classList.toggle("show", scrollY > 500);
  let cur = "home";
  sections.forEach(s => { if (scrollY + 120 >= s.offsetTop) cur = s.id; });
  $$(".nav-link").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
}, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
$$(".nav-link, #navMenu .btn").forEach(a => a.addEventListener("click", () => {
  const m = $("#navMenu"); if (m.classList.contains("show")) bootstrap.Collapse.getInstance(m)?.hide();
}));

/* =========================================================
   INIT
   ========================================================= */
function refreshAll() {
  const active = $(".btn-filter.active")?.dataset.filter || "all";
  renderEvents(active); fillSelects(); renderParticipants(); updateStats();
}

$("#yr").textContent = new Date().getFullYear();
fillSelects(); renderEvents(); renderGallery(); renderParticipants(); countdown(); observeReveal();
setTimeout(updateStats, 900);
