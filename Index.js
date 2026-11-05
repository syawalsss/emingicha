// --- PRELOADER ---
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(function () {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 600);
    }, 1500);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // --- AUDIO LOGIC ---
  const soundToggle = document.getElementById("soundToggle");
  const bgMusic = document.getElementById("bgMusic");
  let isMuted = localStorage.getItem("muted") === "true";

  const updateSoundUI = () => {
    if (soundToggle) {
      soundToggle.innerHTML = isMuted ? "🔇" : "🎵";
      // Tambahkan efek pulse saat musik menyala agar lebih hidup
      soundToggle.style.animation = isMuted ? "none" : "pulseBtn 2s infinite";
    }
  };

  if (bgMusic) {
    bgMusic.muted = isMuted;
    bgMusic
      .play()
      .then(() => {
        if (isMuted) bgMusic.pause();
      })
      .catch((e) => {
        console.warn("Autoplay diblokir oleh browser:", e);
        isMuted = true;
        bgMusic.muted = true;
        localStorage.setItem("muted", "true");
        updateSoundUI();
      });
  }
  updateSoundUI();

  if (soundToggle && bgMusic) {
    soundToggle.addEventListener("click", () => {
      isMuted = !isMuted;
      localStorage.setItem("muted", isMuted.toString());
      if (isMuted) {
        bgMusic.pause();
        bgMusic.muted = true;
      } else {
        bgMusic.muted = false;
        bgMusic.play();
      }
      updateSoundUI();
    });
  }

  // --- OPEN BUTTON ---
  const openBtn = document.getElementById("openBtn");
  if (openBtn) {
    openBtn.addEventListener("click", function () {
      // Menggunakan location.href agar UX lebih seamless (tidak membuka tab baru yang mengganggu di HP)
      window.location.href = "invitation.html" + window.location.search;
    });
  }

  // --- COUNTDOWN (Disesuaikan dengan HTML: 14 Nov 2026) ---
  const daysEl = document.getElementById("days");
  if (daysEl) {
    const countDate = new Date("Nov 14, 2026 10:00:00").getTime();
    const countdown = () => {
      const now = new Date().getTime();
      const gap = countDate - now;

      if (gap < 0) return; // Hentikan jika waktu sudah lewat

      const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
      document.getElementById("days").innerText = Math.floor(gap / day)
        .toString()
        .padStart(2, "0");
      document.getElementById("hours").innerText = Math.floor(
        (gap % day) / hour,
      )
        .toString()
        .padStart(2, "0");
      document.getElementById("minutes").innerText = Math.floor(
        (gap % hour) / minute,
      )
        .toString()
        .padStart(2, "0");
      document.getElementById("seconds").innerText = Math.floor(
        (gap % minute) / second,
      )
        .toString()
        .padStart(2, "0");
    };
    setInterval(countdown, 1000);
    countdown();
  }

  // --- RSVP FORM WHATSAPP ---
  const rsvpForm = document.getElementById("rsvpForm");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const message = document.getElementById("message").value.trim();
      if (name === "" || message === "") {
        alert("Mohon isi nama dan pesan terlebih dahulu.");
        return;
      }
      const fullMessage = `Halo! Saya *${name}* ingin mengucapkan:\n\n_"${message}"_\n\nSelamat atas pernikahannya!`;
      const encodedMessage = encodeURIComponent(fullMessage);
      const waNumber = "6282337218686"; // Sesuai nomor di source Anda
      window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, "_blank");
    });
  }

  // --- SCROLL ANIMATION OBSERVER ---
  // Memicu animasi hanya saat elemen terlihat di layar (seperti undangan premium)
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        obs.unobserve(entry.target); // Animasi hanya berjalan sekali
      }
    });
  }, observerOptions);

  document.querySelectorAll(".anim-pop").forEach((el) => observer.observe(el));
});

// --- COPY REKENING ---
window.copyRekening = function (id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Nomor rekening berhasil disalin!");
  });
};
