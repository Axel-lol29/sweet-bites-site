(() => {
  // Año en footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú mobile
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  const closeMenu = () => {
    navMenu?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Cerrar menú al dar click en un link
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener("click", () => closeMenu());
  });

  // Cerrar menú al hacer click fuera
  document.addEventListener("click", (e) => {
    if (!navMenu || !navToggle) return;
    const target = e.target;
    const clickedInside = navMenu.contains(target) || navToggle.contains(target);
    if (!clickedInside) closeMenu();
  });

  // Resaltar link activo según sección visible
  const sections = ["inicio", "productos", "nosotros", "contacto"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const navLinks = Array.from(document.querySelectorAll(".nav__link"));

  const setActive = (id) => {
    navLinks.forEach(a => {
      const href = a.getAttribute("href");
      const isActive = href === `#${id}`;
      a.classList.toggle("is-active", isActive);
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const obs = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(en => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActive(visible.target.id);
    }, { threshold: [0.25, 0.5, 0.7] });

    sections.forEach(sec => obs.observe(sec));
  }

  // Firma digital (canvas)
  const canvas = document.getElementById("signatureCanvas");
  const clearBtn = document.getElementById("clearSignature");

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let last = { x: 0, y: 0 };

    const getPos = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const isTouch = evt.touches && evt.touches[0];
      const clientX = isTouch ? evt.touches[0].clientX : evt.clientX;
      const clientY = isTouch ? evt.touches[0].clientY : evt.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const start = (evt) => {
      drawing = true;
      last = getPos(evt);
    };

    const move = (evt) => {
      if (!drawing || !ctx) return;
      const pos = getPos(evt);

      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#2C1810";

      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      last = pos;
      evt.preventDefault?.();
    };

    const end = () => { drawing = false; };

    // Mouse
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);

    // Touch
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    // Limpiar
    clearBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }
})();