
/* =========================================================
   ASAI COMMUNITY — CINEMATIC INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // -------------------------------------------------------
  // 1. CINEMATIC INTRO LOADER
  // -------------------------------------------------------

  const loader = document.getElementById("cinematicLoader");

  if (loader) {
    const hasVisited = sessionStorage.getItem("asaiVisited");

    if (hasVisited) {
      loader.classList.add("finished");
    } else {
      document.body.classList.add("loading");

      window.addEventListener("load", () => {
        setTimeout(() => {
          loader.classList.add("finished");
          document.body.classList.remove("loading");
          sessionStorage.setItem("asaiVisited", "true");
        }, 1900);
      });
    }
  }

  // -------------------------------------------------------
  // 2. SCROLL REVEAL ANIMATIONS
  // -------------------------------------------------------

  const revealSelectors = [
    ".intro",
    ".service-card",
    ".mood-option",
    ".trust",
    ".journey",
    ".community",
    ".practitioners",
    ".emergency",
    ".final-cta",
    ".section-heading",
    ".eyebrow"
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(", ")
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");

    if (element.classList.contains("service-card")) {
      element.style.transitionDelay = `${(index % 4) * 100}ms`;
    }
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }

  // -------------------------------------------------------
  // 3. CINEMATIC HERO IMAGE MOVEMENT
  // -------------------------------------------------------

  const hero = document.querySelector(".hero");
  const heroImage = document.querySelector(".hero-image-main img");

  if (hero && heroImage) {
    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const rect = hero.getBoundingClientRect();

            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const progress = Math.max(
                0,
                Math.min(1, -rect.top / Math.max(rect.height, 1))
              );

              heroImage.style.transform =
                `scale(1.08) translateY(${progress * 35}px)`;
            }

            ticking = false;
          });

          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // -------------------------------------------------------
  // 4. MOBILE NAVIGATION
  // -------------------------------------------------------

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });

    document.addEventListener("click", event => {
      if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      }
    });
  }

  // -------------------------------------------------------
  // 5. MOOD SELECTOR
  // -------------------------------------------------------

  const moodOptions = document.querySelectorAll(".mood-option");
  const moodResult = document.querySelector(".mood-result");

  const moodMessages = {
    heavy: {
      title: "You don't have to carry everything alone.",
      message:
        "There is space here to slow down, feel supported, and take things one step at a time."
    },

    lonely: {
      title: "You deserve to feel connected.",
      message:
        "Finding your people takes time. Start with a space where you can feel welcome and understood."
    },

    restless: {
      title: "It's okay not to have everything figured out.",
      message:
        "Give yourself room to explore, reflect, and discover what you need next."
    },

    ready: {
      title: "Your next chapter can start here.",
      message:
        "Take that first step. We're here to help you find the support and community you're looking for."
    }
  };

  moodOptions.forEach(option => {
    option.addEventListener("click", () => {
      const mood = option.dataset.mood;
      const response = moodMessages[mood];

      if (!response) return;

      moodOptions.forEach(item => {
        item.classList.remove("selected");
        item.setAttribute("aria-pressed", "false");
      });

      option.classList.add("selected");
      option.setAttribute("aria-pressed", "true");

      if (moodResult) {
        moodResult.classList.remove("show");

        setTimeout(() => {
          moodResult.innerHTML = `
            <h3>${response.title}</h3>
            <p>${response.message}</p>
          `;

          moodResult.classList.add("show");
        }, 180);
      }
    });

    option.setAttribute("aria-pressed", "false");
  });

  // -------------------------------------------------------
  // 6. HEADER SCROLL EFFECT
  // -------------------------------------------------------

  const header = document.querySelector(".site-header");

  if (header) {
    const updateHeader = () => {
      header.classList.toggle("scrolled", window.scrollY > 30);
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
      passive: true
    });
  }

  // -------------------------------------------------------
  // 7. SMOOTH SCROLLING
  // -------------------------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // -------------------------------------------------------
  // 8. IMAGE LOADING EFFECT
  // -------------------------------------------------------

  document.querySelectorAll("img").forEach(img => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      }, { once: true });
    }
  });

  // -------------------------------------------------------
  // 9. FOOTER COPYRIGHT YEAR
  // -------------------------------------------------------

  const copyrightYear = document.querySelector("[data-year]");

  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

});
