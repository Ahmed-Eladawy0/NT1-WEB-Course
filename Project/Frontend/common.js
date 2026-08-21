/* =========================================================
   SkillHub — shared frontend utilities
   Wired for the real backend contract:
     - JWT auth (Authorization: Bearer <token>)
     - Mongo _id everywhere
     - firstName / lastName (not "name")
     - myCourses (ObjectId refs, populated on GET /auth/profile)
     - real file uploads (multipart/form-data) for avatars & course covers
   ========================================================= */

const SERVER_ORIGIN = "http://localhost:5000";
const API_BASE = `${SERVER_ORIGIN}/api/v1`;

/* ---------------- Auth/session storage ---------------- */
function getToken() { return localStorage.getItem("token"); }
function getStoredUser() {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch (e) { return null; }
}
function setSession(token, user) {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
function logout() {
  clearSession();
  window.location.href = "index.html";
}
function requireUser(redirectIfMissing = "index.html") {
  const user = getStoredUser();
  const token = getToken();
  if (!user || !token) {
    window.location.href = redirectIfMissing;
    return null;
  }
  return user;
}

/**
 * apiFetch — wraps fetch() with auth header + JSON/FormData handling.
 * body: plain object -> sent as JSON. FormData instance -> sent as-is (multipart).
 * On 401, clears the session and bounces to login.
 */
async function apiFetch(path, { method = "GET", body, formData = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let fetchBody;
  if (body instanceof FormData) {
    fetchBody = body; // browser sets multipart Content-Type + boundary automatically
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: fetchBody });

  if (res.status === 401) {
    clearSession();
    toast("Your session expired — please log in again.", "error");
    setTimeout(() => (window.location.href = "index.html"), 900);
    throw new Error("Unauthorized");
  }

  let data;
  try { data = await res.json(); } catch (e) { data = {}; }
  return data;
}

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

/* ---------------- Confirm modal ---------------- */
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
    const close = (result) => { overlay.remove(); resolve(result); };
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(false); });
    overlay.querySelector('[data-act="cancel"]').addEventListener("click", () => close(false));
    overlay.querySelector('[data-act="ok"]').addEventListener("click", () => close(true));
  });
}

/* ---------------- Button loading ---------------- */
function setButtonLoading(btn, loading) {
  if (!btn) return;
  btn.classList.toggle("is-loading", loading);
  btn.disabled = loading;
}

/* ---------------- Small helpers ---------------- */
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
function capitalizeWords(str) {
  return String(str ?? "").replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}
function fullName(user) {
  if (!user) return "";
  return [user.firstName, user.lastName].filter(Boolean).join(" ");
}
function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

/* real uploaded-file URL builder (users/courses subfolder) */
function uploadedFileUrl(folder, filename) {
  if (!filename || filename === "default-user.webp") return null;
  return `${SERVER_ORIGIN}/uploads/${folder}/${filename}`;
}

function avatarHtml(user, size = 34) {
  const style = `width:${size}px;height:${size}px;font-size:${Math.round(size * 0.38)}px`;
  const url = user ? uploadedFileUrl("users", user.imageUrl) : null;
  if (url) return `<span class="avatar" style="${style}"><img src="${url}" alt=""></span>`;
  return `<span class="avatar" style="${style}">${initials(fullName(user))}</span>`;
}

const LEVEL_ORDER = ["beginner", "intermediate", "advanced", "expert"];
function levelDotsHtml(level) {
  const idx = LEVEL_ORDER.indexOf(String(level || "").toLowerCase());
  const filled = idx === -1 ? 1 : Math.min(idx + 1, 3);
  let dots = "";
  for (let i = 0; i < 3; i++) dots += `<span class="${i < filled ? "on" : ""}"></span>`;
  return `<span class="level-dots">${dots}</span><span class="level-label">${escapeHtml(capitalizeWords(level) || "—")}</span>`;
}

const CATEGORY_PALETTE = [
  { bg: "#E3EAE0", fg: "#20402D" },
  { bg: "#F3E1CD", fg: "#8A4520" },
  { bg: "#E4EFEC", fg: "#2B6659" },
  { bg: "#F6E1DD", fg: "#96382B" },
  { bg: "#E7E6DA", fg: "#4B4636" },
  { bg: "#EFE3EE", fg: "#6C3D66" },
];
function categoryHash(category) {
  let hash = 0;
  const s = String(category || "");
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return hash % CATEGORY_PALETTE.length;
}
function categoryPillHtml(category) {
  if (!category) return "";
  const c = CATEGORY_PALETTE[categoryHash(category)];
  return `<span class="pill" style="background:${c.bg};color:${c.fg}">${escapeHtml(capitalizeWords(category))}</span>`;
}

const CATEGORY_ICONS = {
  "cyber security": '<path d="M12 2l8 3v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V5l8-3z"/><path d="M9 12l2 2 4-4"/>',
  "backend": '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r=".6" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r=".6" fill="currentColor" stroke="none"/>',
  "database": '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5V18c0 1.7 3.6 3 8 3s8-1.3 8-3V5.5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  "frontend": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 14l-2 2 2 2M13 14l2 2-2 2"/>',
  "programming": '<path d="M8 9l-4 4 4 4M16 9l4 4-4 4M13 6l-2 14"/>',
  "web": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
  "design": '<circle cx="13.5" cy="6.5" r="2.5"/><path d="M17.5 10.5 L7 21H3v-4L13.5 6.5"/>',
};
function categoryIconSvg(category) {
  const key = String(category || "").toLowerCase();
  const path = CATEGORY_ICONS[key] || '<path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/>';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

/** course cover: real uploaded image if present, else a category-tinted icon placeholder */
function courseCoverHtml(course, badgeLabel) {
  const c = CATEGORY_PALETTE[categoryHash(course && course.category)];
  const badge = badgeLabel ? `<span class="cover-badge left">${escapeHtml(badgeLabel)}</span>` : "";
  const imgUrl = course ? uploadedFileUrl("courses", course.imageUrl) : null;
  if (imgUrl) {
    return `<div class="course-cover" style="background-image:url('${imgUrl}')">${badge}</div>`;
  }
  return `<div class="course-cover" style="background:${c.bg};color:${c.fg}">${badge}${categoryIconSvg(course && course.category)}</div>`;
}

/** Resolve a course id whether it's a populated object or a raw ObjectId string */
function courseIdOf(courseOrId) {
  if (!courseOrId) return null;
  return typeof courseOrId === "object" ? courseOrId._id : courseOrId;
}

initTheme();
