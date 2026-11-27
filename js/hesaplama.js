/* ===== MALZEME HESAPLAMA =====
   Katsayılar eski sitedeki hesaplama araçlarından alınmıştır.
   Her satır: [malzeme, m² başına miktar, paket bölüm (1 = yok), birim] → yukarı yuvarlanır. */
const CALCS = {
  "alcipan-asma-tavan": {
    title: "Alçıpan Asma Tavan", icon: "▦",
    desc: "Alçıpan asma tavan yapılacak alan için gereken malzeme listesi.",
    items: [
      ["Alçıpan Flex plaka (3 m²/plaka)", 1, 1, "m²"],
      ["Tavan C profili 0,50 mm (3 m/boy)", 3.2, 3, "boy"],
      ["Tavan U profili 0,50 mm (3 m/boy)", 0.4, 3, "boy"],
      ["Çelik dübel", 1.2, 1, "adet"],
      ["Askı teli 60", 1.2, 1, "adet"],
      ["Askı maşası", 1.2, 1, "adet"],
      ["Klips", 4.6, 1, "adet"],
      ["Ekleme parçası", 0.6, 1, "adet"],
      ["Borazan vida 3,5×35 mm", 17, 1, "adet"],
      ["Derz bandı (90 m/rulo)", 1.2, 90, "rulo"],
      ["Derz alçısı (30 kg/torba)", 0.4, 30, "torba"],
      ["Dübel / pul / vida", 0.4, 1, "adet"]
    ]
  },
  "tasyunu-asma-tavan": {
    title: "Taşyünü Asma Tavan", icon: "▤",
    desc: "60×60 taşyünü plakalı asma tavan için taşıyıcı sistem ve plaka miktarları.",
    items: [
      ["T24 L köşebent (3,05 m/boy)", 0.7, 3.05, "boy"],
      ["Ana taşıyıcı (3,60 m/boy)", 0.84, 3.6, "boy"],
      ["Tali taşıyıcı 1,20 m", 1.67, 1.2, "boy"],
      ["Tali taşıyıcı 0,60 m", 0.84, 0.6, "boy"],
      ["Askı teli 60", 1.74, 1, "adet"],
      ["Çiftli yay", 0.87, 1, "adet"],
      ["Çelik dübel (M6×50)", 0.87, 1, "adet"],
      ["YHB vida / plastik dübel", 0.4, 1, "adet"],
      ["Taşyünü plaka 0,60×0,60", 1, 1, "m²"]
    ]
  },
  "bolme-duvar": {
    title: "Bölme Duvar", icon: "▥",
    desc: "Çift yüzü alçıpan kaplı bölme duvar için malzeme analizi.",
    items: [
      ["Alçıpan plaka (3 m²/plaka)", 2.05, 3, "plaka"],
      ["Duvar C profili (3 m/boy)", 2, 3, "boy"],
      ["Duvar U profili (3 m/boy)", 0.7, 3, "boy"],
      ["Dübel / vida", 1.6, 1, "adet"],
      ["Borazan vida 3,5×25 mm", 29, 1, "adet"],
      ["Derz bandı (90 m/rulo)", 1.6, 90, "rulo"],
      ["Ses yalıtım bandı", 1.2, 1, "m"],
      ["Derz alçısı (30 kg/torba)", 0.5, 30, "torba"],
      ["Yalıtım malzemesi", 1, 1, "m²"]
    ]
  },
  "mantolama": {
    title: "Mantolama", icon: "▧",
    desc: "Dıştan ısı yalıtımı (mantolama) yapılacak cephe alanı için malzeme listesi.",
    items: [
      ["Isı yalıtım plakası", 1, 1, "m²"],
      ["Mantolama yapıştırıcısı (25 kg/torba)", 4.5, 25, "torba"],
      ["Mantolama sıvası (25 kg/torba)", 4.5, 25, "torba"],
      ["Dekoratif sıva (25 kg/torba)", 3, 25, "torba"],
      ["Sıva filesi (50 m²/rulo)", 1.1, 50, "rulo"],
      ["Mantolama dübeli", 6, 1, "adet"],
      ["PVC fileli köşebent (2,5 m/boy)", 0.25, 2.5, "boy"]
    ]
  },
  "giydirme-duvar": {
    title: "Giydirme Duvar", icon: "▨",
    desc: "Mevcut duvar üzerine alçıpan giydirme için malzeme analizi.",
    items: [
      ["Alçıpan plaka (3 m²/plaka)", 1, 1, "m²"],
      ["Tavan U profili (3 m/boy)", 0.7, 3, "boy"],
      ["Tavan C profili (3 m/boy)", 2, 3, "boy"],
      ["Dübel / vida", 1.6, 1, "adet"],
      ["Borazan vida 3,5×25 mm", 14, 1, "adet"],
      ["Mercimek başlı vida", 1.4, 1, "adet"],
      ["Agraf", 0.7, 1, "adet"],
      ["Derz bandı", 0.8, 1, "m"],
      ["Ses yalıtım bandı", 0.85, 1, "m"],
      ["Derz alçısı", 0.25, 1, "kg"],
      ["Yalıtım malzemesi", 1, 1, "m²"]
    ]
  }
};

const tabs = document.getElementById("calcTabs");
const areaIn = document.getElementById("area");
const body = document.getElementById("calcBody");
const titleEl = document.getElementById("calcTitle");
const descEl = document.getElementById("calcDesc");
let current = Object.keys(CALCS)[0];

/* 1,2 × 10 gibi çarpımlarda kayan nokta hatasıyla fazladan yuvarlamayı önler */
const qty = (m2, per, pack) => Math.ceil(Math.round(m2 * per / pack * 1e6) / 1e6);
const fmt = n => n.toLocaleString("tr-TR");

Object.entries(CALCS).forEach(([key, c]) => {
  const b = document.createElement("button");
  b.type = "button"; b.dataset.key = key;
  b.innerHTML = `<span>${c.icon}</span>${c.title}`;
  b.addEventListener("click", () => select(key, true));
  tabs.appendChild(b);
});

function render(){
  const c = CALCS[current];
  const m2 = parseFloat((areaIn.value || "").replace(",", "."));
  const ok = m2 > 0;
  body.innerHTML = c.items.map(([name, per, pack, unit]) => `
    <tr>
      <td>${name}</td>
      <td class="q">${ok ? `<b>${fmt(qty(m2, per, pack))}</b> ${unit}` : `<span class="dash">—</span>`}</td>
    </tr>`).join("");
  document.getElementById("calcHint").style.display = ok ? "none" : "block";
}

function select(key, push){
  if (!CALCS[key]) return;
  current = key;
  tabs.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.key === key));
  titleEl.textContent = CALCS[key].title;
  descEl.textContent = CALCS[key].desc;
  if (push) history.replaceState(null, "", "#" + key);
  render();
}

areaIn.addEventListener("input", render);
document.getElementById("printBtn").addEventListener("click", () => print());
select(location.hash.slice(1) in CALCS ? location.hash.slice(1) : current);
addEventListener("hashchange", () => select(location.hash.slice(1)));
