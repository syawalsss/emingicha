(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const preloader = $("#preloader");
  window.addEventListener("load", () => {
    if (preloader)
      window.setTimeout(() => preloader.classList.add("fade-out"), 350);
  });
  // Scroll reveal; elements stay visible on browsers without IntersectionObserver.
  const animated = document.querySelectorAll(".anim-pop");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    animated.forEach((el) => observer.observe(el));
  } else animated.forEach((el) => el.classList.add("show"));
  // 14 November 2026, 10:00 WITA = 02:00 UTC.
  const eventTime = new Date("2026-11-14T02:00:00Z").getTime();
  const updateCountdown = () => {
    const delta = Math.max(0, eventTime - Date.now());
    const values = [
      Math.floor(delta / 86400000),
      Math.floor(delta / 3600000) % 24,
      Math.floor(delta / 60000) % 60,
      Math.floor(delta / 1000) % 60,
    ];
    ["days", "hours", "minutes", "seconds"].forEach((id, index) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(values[index]).padStart(2, "0");
    });
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
  const notify = (message) => window.alert(message);
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext)
      return navigator.clipboard.writeText(text);
    const input = document.createElement("textarea");
    input.value = text;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const ok = document.execCommand("copy");
    input.remove();
    if (!ok) throw new Error("Copy failed");
  }
  window.copyRekening = async (id) => {
    const value = document.getElementById(id)?.textContent?.trim();
    if (!value) return;
    try {
      await copyText(value);
      notify("Nomor rekening berhasil disalin.");
    } catch {
      notify("Gagal menyalin. Silakan salin nomor secara manual.");
    }
  };
  $("#copyAddress")?.addEventListener("click", async () => {
    try {
      await copyText(
        "Jln Kh Ahmad Dahlan, Kel. Bonto Perak, Kec. Pangkajene, Kab. Pangkep",
      );
      notify("Alamat berhasil disalin.");
    } catch {
      notify("Gagal menyalin alamat.");
    }
  });
  // Local demo guestbook. Entries are saved on THIS browser only, not sent to a server.
  const form = $("#rsvpForm");
  const wishesList = $("#wishesList");
  const storageKey = "icha-eming-wishes";
  const readWishes = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  };
  const renderWishes = () => {
    if (!wishesList) return;
    wishesList.replaceChildren();
    readWishes()
      .slice(0, 20)
      .forEach(({ name, message }) => {
        const wrap = document.createElement("article");
        wrap.className = "wish";
        const strong = document.createElement("strong");
        strong.textContent = name;
        const p = document.createElement("p");
        p.textContent = message;
        wrap.append(strong, p);
        wishesList.append(wrap);
      });
  };
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#name")?.value.trim().slice(0, 80);
    const message = $("#message")?.value.trim().slice(0, 700);
    if (!name || !message) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify([{ name, message }, ...readWishes()].slice(0, 30)),
      );
    } catch {
      notify("Browser tidak dapat menyimpan ucapan.");
      return;
    }
    form.reset();
    renderWishes();
    notify("Ucapan tersimpan di perangkat ini.");
  });
  renderWishes();
  const audio = $("#bgMusic");
  const toggle = $("#soundToggle");
  if (audio && toggle) {
    const sync = () => {
      toggle.textContent = audio.paused ? "♫" : "♫";
      toggle.setAttribute("aria-pressed", String(!audio.paused));
      toggle.title = audio.paused ? "Putar musik" : "Jeda musik";
      toggle.style.opacity = audio.paused ? "0.75" : "1";
    };
    toggle.addEventListener("click", async () => {
      if (audio.paused) {
        try {
          await audio.play();
        } catch {
          notify("Musik tidak dapat diputar. Periksa berkas audio.mp3.");
        }
      } else audio.pause();
      sync();
    });
    sync();
  }
})();
