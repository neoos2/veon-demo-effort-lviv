// Mobile menu (Esc, tap on an item, focus back to the toggle) and the pinned action bar on phones.
const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const menu = document.getElementById("mobile-menu");

function setMenu(open: boolean, returnFocus = true): void {
  if (!toggle || !menu) return;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
  menu.hidden = !open;
  document.documentElement.classList.toggle("menu-open", open);
  if (open) menu.querySelector<HTMLElement>("a")?.focus();
  else if (returnFocus) toggle.focus();
}

if (toggle && menu) {
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) setMenu(false, false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false);
  });
  window.matchMedia("(min-width: 60rem)").addEventListener("change", (m) => {
    if (m.matches && toggle.getAttribute("aria-expanded") === "true") setMenu(false, false);
  });
}

// Action bar: shown after the first screen, hidden once the contacts block is on screen.
const bar = document.querySelector<HTMLElement>(".action-bar");
const hero = document.getElementById("hero");
const contacts = document.getElementById("contacts");
if (bar && hero && contacts) {
  bar.classList.add("is-managed");
  let ticking = false;
  const update = (): void => {
    ticking = false;
    const pastHero = hero.getBoundingClientRect().bottom < 0;
    const nearContacts = contacts.getBoundingClientRect().top < window.innerHeight;
    bar.classList.toggle("is-shown", pastHero && !nearContacts);
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
}
