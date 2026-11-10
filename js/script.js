
/* =========================================================
   ASAI COMMUNITY
   CINEMATIC INTERACTION ENGINE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // -------------------------------------------------------
  // 1. CINEMATIC INTRO
  // -------------------------------------------------------

  const loader = document.getElementById("cinematicLoader");

  if (loader) {
    try {
      const hasVisited = sessionStorage.getItem("asaiVisited");

      if (hasVisited || prefersReducedMotion) {
        loader.classList.add("finished");
      } else {
        document.body.classList.add("loading");

        const finishIntro = () => {
          setTimeout(() => {
            loader.classList.add("finished");
            document.body.classList.remove("loading");

            try {
              sessionStorage.setItem("asaiVisited", "true");
            } catch (error) {
              // Session storage may be unavailable.
            }
          }, 1900);
        };

        if (document.readyState === "complete") {
          finishIntro();
        } else {
          window.addEventListener("load", finishIntro, {
            once: true
          });
        }
      }
    } catch (error) {
      loader.classList.add("finished");
    }
  }

  // -------------------------------------------------------
  // 2. CINEMATIC SCROLL REVEALS
  // -------------------------------------------------------

  const revealSelectors = [
    ".intro-content",
    ".intro-image",
    ".service-card",
    ".mood-option",
    ".trust-heading",
    ".trust-card",
    ".journey-step",
    ".community-intro",
    ".community-image",
    ".practitioner-content",
    ".practitioner-image",
    ".emergency-heading",
    ".emergency-primary",
    ".final-cta-inner",
    ".section-heading"
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(", ")
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");

    if (element.classList.contains("service-card")) {
      element.style.transitionDelay =
        `${(index % 4) * 120}ms`;
    }

    if (element.classList.contains("journey-step")) {
      element.style.transitionDelay =
        `${(index % 4) * 100}ms`;
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
        rootMargin: "0px 0px -45px 0px"
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
  // 3. CINEMATIC HERO PARALLAX
  // -------------------------------------------------------

  const hero = document.querySelector(".hero-cinematic");

  const heroImage = document.querySelector(
    ".cinematic-background img"
  );

  if (hero && heroImage && !prefersReducedMotion) {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();

        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const progress = Math.max(
            0,
            Math.min(1, -rect.top / rect.height)
          );

          heroImage.style.setProperty(
            "--parallax-y",
            `${progress * 35}px`
          );
        }

        ticking = false;
      });
    }, { passive: true });
  }

  // -------------------------------------------------------
  // 4. MOBILE NAVIGATION
  // -------------------------------------------------------

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    };

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));

      document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  // -------------------------------------------------------
  // 5. INTERACTIVE MOOD SELECTOR
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
    option.setAttribute("aria-pressed", "false");

    option.addEventListener("click", () => {
      const response = moodMessages[option.dataset.mood];

      if (!response) return;

      moodOptions.forEach(item => {
        item.classList.remove("selected");
        item.setAttribute("aria-pressed", "false");
      });

      option.classList.add("selected");
      option.setAttribute("aria-pressed", "true");

      if (!moodResult) return;

      moodResult.classList.remove("show");

      setTimeout(() => {
        const heading = document.createElement("h3");
        const paragraph = document.createElement("p");

        heading.textContent = response.title;
        paragraph.textContent = response.message;

        moodResult.replaceChildren(heading, paragraph);
        moodResult.classList.add("show");
      }, 200);
    });
  });

  // -------------------------------------------------------
  // 6. HEADER SCROLL EFFECT
  // -------------------------------------------------------

  const header = document.querySelector(".site-header");

  if (header) {
    const updateHeader = () => {
      header.classList.toggle(
        "scrolled",
        window.scrollY > 30
      );
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
      passive: true
    });
  }

  // -------------------------------------------------------
  // 7. CINEMATIC SMOOTH SCROLL
  // -------------------------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      let target;

      try {
        target = document.querySelector(targetId);
      } catch (error) {
        return;
      }

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // -------------------------------------------------------
  // 8. IMAGE LOADING
  // -------------------------------------------------------

  document.querySelectorAll("img").forEach(img => {
    const markLoaded = () => {
      img.classList.add("loaded");
    };

    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener("load", markLoaded, {
        once: true
      });
    }
  });

  // -------------------------------------------------------
  // 9. FOOTER YEAR
  // -------------------------------------------------------

  const copyrightYear = document.querySelector("[data-year]");

  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

});
