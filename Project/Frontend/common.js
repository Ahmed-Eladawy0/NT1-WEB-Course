/* =========================================================
   SkillHub — shared frontend utilities
   (theme, toast, confirm modal, small render helpers)
   Pure UI helpers only — no API/business logic lives here.
   ========================================================= */

const API_BASE = "http://localhost:5000/api/v1";

/* ---------------- Theme ---------------- */
function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon(saved);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  document.querySelectorAll("[data-theme-icon]").forEach((el) => {
    el.innerHTML =
      theme === "dark"
        ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
        : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>';
  });
}

/* ---------------- Toast ---------------- */
function ensureToastRoot() {
  let root = document.getElementById("toast-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "toast-root";
    document.body.appendChild(root);
  }
  return root;
}
function toast(message, type = "info", duration = 3800) {
  const root = ensureToastRoot();
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-dot"></span><span>${escapeHtml(message)}</span>`;
  root.appendChild(el);
  setTimeout(() => {
    el.classList.add("leaving");
    setTimeout(() => el.remove(), 200);
  }, duration);
}

/* ---------------- Confirm modal (replaces window.confirm) ---------------- */
function confirmDialog({ title = "Are you sure?", message = "", confirmLabel = "Confirm", danger = true } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(message)}</p>
        <div class="modal-actions">
          <button class="btn btn-ghost" data-act="cancel">Cancel</button>
          <button class="btn ${danger ? "btn-danger" : "btn-primary"}" data-act="ok">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const close = (result) => {
      overlay.remove();
      resolve(result);
    };
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close(false);
    });
    overlay.querySelector('[data-act="cancel"]').addEventListener("click", () => close(false));
    overlay.querySelector('[data-act="ok"]').addEventListener("click", () => close(true));
  });
}

/* ---------------- Button loading state ---------------- */
function setButtonLoading(btn, loading) {
  if (!btn) return;
  btn.classList.toggle("is-loading", loading);
  btn.disabled = loading;
}

/* ---------------- Small render helpers ---------------- */
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

function avatarHtml(user, size = 34) {
  const style = `width:${size}px;height:${size}px;font-size:${Math.round(size * 0.38)}px`;
  if (user && user.avatar) {
    return `<span class="avatar" style="${style}"><img src="${user.avatar}" alt=""></span>`;
  }
  return `<span class="avatar" style="${style}">${initials(user && user.name)}</span>`;
}

const LEVEL_ORDER = ["Beginner", "Intermediate", "Advanced", "Expert"];
function levelDotsHtml(level) {
  const idx = LEVEL_ORDER.indexOf(level);
  const filled = idx === -1 ? 1 : Math.min(idx + 1, 3);
  let dots = "";
  for (let i = 0; i < 3; i++) dots += `<span class="${i < filled ? "on" : ""}"></span>`;
  return `<span class="level-dots">${dots}</span><span class="level-label">${escapeHtml(level || "—")}</span>`;
}

const CATEGORY_PALETTE = [
  { bg: "#EEEDFC", fg: "#4F46E5" },
  { bg: "#FEF3E2", fg: "#B45309" },
  { bg: "#E7F9F3", fg: "#0D9488" },
  { bg: "#FDECEC", fg: "#DC2626" },
  { bg: "#EAF2FE", fg: "#2563EB" },
  { bg: "#F3E8FF", fg: "#7E22CE" },
];
function categoryPillHtml(category) {
  if (!category) return "";
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  const c = CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
  return `<span class="pill" style="background:${c.bg};color:${c.fg}">${escapeHtml(category)}</span>`;
}

function requireUser(redirectIfMissing = "index.html") {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }
  if (!user) {
    window.location.href = redirectIfMissing;
  }
  return user;
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

initTheme();
