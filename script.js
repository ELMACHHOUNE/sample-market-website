// All figures and asset names below are fictional demo content.
const assets = [
  {
    name: "Northstar Tech",
    symbol: "NST",
    category: "stocks",
    price: 248.62,
    change: 2.48,
    logo: "N",
    trend: [8, 12, 10, 17, 14, 20, 23, 19, 27, 30, 26, 35],
  },
  {
    name: "Greenwave Energy",
    symbol: "GWE",
    category: "stocks",
    price: 86.14,
    change: 5.63,
    logo: "G",
    trend: [8, 10, 9, 13, 12, 16, 15, 21, 19, 25, 27, 33],
  },
  {
    name: "Orbit Coin",
    symbol: "ORBT",
    category: "crypto",
    price: 3.84,
    change: 8.42,
    logo: "O",
    trend: [7, 9, 8, 15, 12, 18, 16, 22, 21, 28, 26, 37],
  },
  {
    name: "Pixel Finance",
    symbol: "PXF",
    category: "crypto",
    price: 42.09,
    change: -1.27,
    logo: "P",
    trend: [32, 29, 31, 25, 28, 22, 25, 19, 21, 16, 18, 14],
  },
  {
    name: "Aurora Motors",
    symbol: "AUM",
    category: "stocks",
    price: 132.75,
    change: 1.16,
    logo: "A",
    trend: [12, 14, 13, 17, 16, 18, 17, 21, 20, 23, 22, 25],
  },
  {
    name: "Solaris Gold",
    symbol: "SLG",
    category: "commodities",
    price: 1964.3,
    change: -0.54,
    logo: "S",
    trend: [30, 28, 29, 26, 27, 24, 26, 22, 23, 20, 22, 19],
  },
  {
    name: "Copperfield",
    symbol: "CPF",
    category: "commodities",
    price: 4.18,
    change: 3.07,
    logo: "C",
    trend: [9, 11, 10, 13, 12, 16, 14, 18, 17, 20, 19, 25],
  },
];
const money = (n) =>
  "$" +
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const rows = document.getElementById("assetRows");
const search = document.getElementById("assetSearch");
let activeFilter = "all";
const saved = new Set();

function sparkline(values, positive) {
  const max = Math.max(...values),
    min = Math.min(...values);
  const points = values
    .map(
      (v, i) =>
        `${(i / (values.length - 1)) * 100},${27 - ((v - min) / (max - min || 1)) * 22}`,
    )
    .join(" ");
  return `<svg class="sparkline" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline points="${points}" fill="none" stroke="${positive ? "#65b780" : "#dc8585"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function renderAssets() {
  const term = search.value.trim().toLowerCase();
  const filtered = assets.filter(
    (a) =>
      (activeFilter === "all" || a.category === activeFilter) &&
      `${a.name} ${a.symbol}`.toLowerCase().includes(term),
  );
  rows.innerHTML = filtered.length
    ? filtered
        .map(
          (a) => `
    <div class="asset-row">
      <div class="asset-info"><span class="asset-logo ${a.category}">${a.logo}</span><span><b>${a.name}</b><small>${a.symbol} · ${a.category}</small></span></div>
      <div class="asset-price">${money(a.price)}</div>
      <div class="change ${a.change >= 0 ? "positive" : "negative"}">${a.change >= 0 ? "+" : ""}${a.change.toFixed(2)}%</div>
      ${sparkline(a.trend, a.change >= 0)}
      <button class="watch-btn ${saved.has(a.symbol) ? "saved" : ""}" data-symbol="${a.symbol}" aria-label="${saved.has(a.symbol) ? "Remove" : "Add"} ${a.name} ${saved.has(a.symbol) ? "from" : "to"} watchlist">${saved.has(a.symbol) ? "✓" : "+"}</button>
    </div>`,
        )
        .join("")
    : `<div class="empty-state">No assets found. Try another search.</div>`;
}
function renderTicker() {
  const picks = [assets[2], assets[1], assets[4], assets[5]];
  document.getElementById("tickerItems").innerHTML = picks
    .map(
      (a) =>
        `<div class="ticker-item"><b>${a.symbol}</b><strong>${money(a.price)}</strong><span class="${a.change < 0 ? "negative" : ""}">${a.change > 0 ? "+" : ""}${a.change.toFixed(2)}%</span></div>`,
    )
    .join("");
}
rows.addEventListener("click", (e) => {
  const btn = e.target.closest(".watch-btn");
  if (!btn) return;
  const symbol = btn.dataset.symbol;
  saved.has(symbol) ? saved.delete(symbol) : saved.add(symbol);
  const asset = assets.find((a) => a.symbol === symbol);
  showToast(
    saved.has(symbol)
      ? `${asset.name} added to your demo watchlist`
      : `${asset.name} removed from your demo watchlist`,
  );
  renderAssets();
});
document.querySelectorAll(".tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    activeFilter = tab.dataset.filter;
    renderAssets();
  }),
);
search.addEventListener("input", renderAssets);
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}
const menuToggle = document.getElementById("menuToggle"),
  navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "✕" : "☰";
});
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }),
);
renderTicker();
renderAssets();
