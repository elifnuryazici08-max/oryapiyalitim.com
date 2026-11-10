/* ===== BAYİLİKLERİMİZ =====
   Logo eklemek için: images/bayiler/ klasörüne dosyayı koyun ve aşağıda "logo" alanına adını yazın.
   Logo yoksa marka adı, renkli bir amblemle otomatik gösterilir. */
const BRANDS = [
  { name: "Marda",                   color: "#E30613" },
  { name: "Stoper",                  color: "#005095", logo: "stoper.svg" },
  { name: "Kınaş",                   color: "#C8102E", logo: "kinas.png", invert: true },
  { name: "ABS Alçı",                color: "#1F5FA8", logo: "abs-alci.png" },
  { name: "Valbort",                 color: "#1F3E8C" },
  { name: "Tekno Yapı Kimyasalları", color: "#0072BC", logo: "tekno-yapi.png" },
  { name: "Filli Boya",              color: "#E30613", logo: "filli-boya.png" },
  { name: "Dalmaçyalı",              color: "#00A0E3", logo: "dalmacyali.png" },
  { name: "Polisan",                 color: "#E4032E", logo: "polisan.svg" },
  { name: "Onat Alçı",               color: "#1E4D3A", logo: "onat-alci.png" },
  { name: "Fawori",                  color: "#111111", logo: "fawori.svg" },
  { name: "Arkoz Gazbeton",          color: "#23135F", logo: "arkoz-gazbeton.png" },
  { name: "Kalde",                   color: "#004B93", logo: "kalde.png" },
  { name: "İzocam",                  color: "#0072BC", logo: "izocam.svg" },
  { name: "Eskişehir Çimento",       color: "#3B2A9A", logo: "eskisehir-cimento.png" },
  { name: "Vezirhan Çimento",        color: "#1565C0", logo: "vezirhan-cimento-dark.png" },
  { name: "Marmara Çimento",         color: "#3E9B3A", logo: "marmara-cimento.png" },
  { name: "Kilsan Tuğla",            color: "#E0601F", logo: "kilsan.png" },
  { name: "Prosista Yapı",           color: "#D71920", logo: "prosista.png", invert: true }
];

function initials(n){
  const w = n.split(/\s+/);
  return (w.length > 1 ? w[0][0] + w[1][0] : n.slice(0,2)).toLocaleUpperCase("tr");
}

function brandTile(b, i){
  const el = document.createElement("div");
  el.className = "brand-tile";
  el.style.setProperty("--c", b.color);
  if (i !== undefined) el.style.animationDelay = (i * 0.05) + "s";
  el.dataset.name = b.name.toLocaleLowerCase("tr");
  const word = () => {
    const parts = b.name.split(" ");
    const main = parts[0], sub = parts.slice(1).join(" ");
    return `<div class="word"><i>${initials(b.name)}</i>${main}${sub ? `<small>${sub}</small>` : ""}</div>`;
  };
  if (b.logo){
    el.innerHTML = `<img src="images/bayiler/${b.logo}" alt="${b.name} logosu" loading="lazy" class="${b.invert ? "invert" : ""}">`;
    el.querySelector("img").onerror = () => { el.innerHTML = word() + `<div class="name">${b.name}</div>`; };
  } else {
    el.innerHTML = word();
  }
  el.insertAdjacentHTML("beforeend", `<div class="name">${b.name}</div>`);
  el.title = b.name;
  return el;
}

/* Ana sayfa kayan logo şeridi */
const track = document.querySelector(".marquee-track");
if (track){
  [...BRANDS, ...BRANDS].forEach(b => track.appendChild(brandTile(b)));
}

/* Bayilikler sayfası ızgarası + arama */
const grid = document.getElementById("brandsGrid");
if (grid){
  BRANDS.forEach((b, i) => grid.appendChild(brandTile(b, i)));
  document.getElementById("brandCount").textContent = BRANDS.length;
  const input = document.getElementById("brandSearch");
  const empty = document.getElementById("empty");
  input.addEventListener("input", () => {
    const q = input.value.trim().toLocaleLowerCase("tr");
    let shown = 0;
    grid.querySelectorAll(".brand-tile").forEach(t => {
      const ok = t.dataset.name.includes(q);
      t.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    empty.style.display = shown ? "none" : "block";
  });
}

/* Header gölge + mobil menü */
const header = document.querySelector(".header");
addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 10), { passive: true });
const nav = document.querySelector(".nav");
document.querySelector(".menu-btn").addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

/* Görünürken beliren bölümler */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* Sayaçlar */
document.querySelectorAll("[data-count]").forEach(el => {
  const end = +el.dataset.count;
  const obs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    obs.disconnect();
    let s = null;
    const step = t => {
      if (!s) s = t;
      const p = Math.min((t - s) / 1400, 1);
      el.firstChild.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  obs.observe(el);
});

/* İletişim formu → e-posta */
const form = document.getElementById("contactForm");
if (form){
  form.addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(form);
    const body = `Ad Soyad: ${f.get("ad")}\nTelefon: ${f.get("tel")}\nE-posta: ${f.get("mail")}\n\n${f.get("mesaj")}`;
    location.href = `mailto:info@oryapiyalitim.com?subject=${encodeURIComponent("Web Sitesi İletişim Formu")}&body=${encodeURIComponent(body)}`;
  });
}

document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
