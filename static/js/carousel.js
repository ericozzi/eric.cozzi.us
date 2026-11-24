const carousel = document.querySelector(".accomplishments-carousel");

if (carousel) {
  const track = carousel.querySelector(".carousel-track");
  const controls = carousel.querySelector(".carousel-controls");
  const previous = carousel.querySelector(".carousel-prev");
  const next = carousel.querySelector(".carousel-next");
  const toggle = carousel.querySelector(".carousel-toggle");
  const toggleIcon = toggle.querySelector("path");
  const position = carousel.querySelector(".carousel-position");
  const count = track.children.length;

  if (count > 1) {
    let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hovered = false;
    let focused = false;
    let timer;
    const currentIndex = () => Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));

    const updateControls = () => {
      const index = currentIndex();
      position.textContent = `${index + 1} / ${count}`;
      const toggleLabel = paused ? "Resume rotation" : "Pause rotation";
      toggle.setAttribute("aria-label", toggleLabel);
      toggle.title = toggleLabel;
      toggleIcon.setAttribute("d", paused ? "M8 5l11 7-11 7z" : "M9 5v14M15 5v14");
    };

    const advance = () => {
      track.scrollTo({ left: ((currentIndex() + 1) % count) * track.clientWidth });
    };

    const scheduleRotation = () => {
      window.clearTimeout(timer);
      if (!paused && !hovered && !focused && !document.hidden) {
        timer = window.setTimeout(() => {
          advance();
          scheduleRotation();
        }, 5000);
      }
    };

    previous.addEventListener("click", () => {
      track.scrollTo({ left: ((currentIndex() - 1 + count) % count) * track.clientWidth });
      scheduleRotation();
    });

    next.addEventListener("click", () => {
      advance();
      scheduleRotation();
    });

    toggle.addEventListener("click", () => {
      paused = !paused;
      updateControls();
      scheduleRotation();
    });

    track.addEventListener("scroll", () => {
      updateControls();
      scheduleRotation();
    });
    carousel.addEventListener("mouseenter", () => {
      hovered = true;
      scheduleRotation();
    });
    carousel.addEventListener("mouseleave", () => {
      hovered = false;
      scheduleRotation();
    });
    carousel.addEventListener("focusin", () => {
      focused = true;
      scheduleRotation();
    });
    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) {
        focused = false;
        scheduleRotation();
      }
    });
    document.addEventListener("visibilitychange", scheduleRotation);
    window.addEventListener("resize", updateControls);
    updateControls();
    controls.hidden = false;
    scheduleRotation();
  }
}
