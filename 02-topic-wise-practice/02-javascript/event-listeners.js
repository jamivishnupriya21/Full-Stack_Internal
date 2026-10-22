// Event delegation: one listener handles all current and future buttons
document.querySelector("#list").addEventListener("click", (e) => {
  if (e.target.matches("button.remove")) {
    e.target.closest("li").remove();
  }
});

// Keyboard and form events
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") console.log("Escape pressed");
});

document.querySelector("form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  console.log(data);
});

// Debounce
const debounce = (fn, wait = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

window.addEventListener("resize", debounce(() => console.log(window.innerWidth)));
