
/* =========================================================
   ASAI COMMUNITY
   INTERACTION ENGINE — REVISED
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // -------------------------------------------------------
  // 1. CINEMATIC VIDEO INTRO
  // -------------------------------------------------------

  const loader = document.getElementById("cinematicLoader");
  const loaderVideo = document.getElementById("loaderVideo");
  const skipButton = document.getElementById("loaderSkip");

  if (loader) {
    let loaderFinished = false;
    let loaderFallback;

    const finishLoader = () => {
      if (loaderFinished) return;

      loaderFinished = true;

      window.clearTimeout(loaderFallback);

      loader.classList.add("is-hidden");
      document.body.classList.remove("loading");

      if (loaderVideo) {
        loaderVideo.pause();
      }
    };

    if (prefersReducedMotion) {
      finishLoader();
    } else {
      document.body.classList.add("loading");

      // Never leave visitors trapped on the intro.
      loaderFallback = window.setTimeout(
        finishLoader,
        12000
      );

      if (loaderVideo) {
        loaderVideo.addEventListener(
          "ended",
          finishLoader,
          { once: true }
        );

        loaderVideo.addEventListener(
          "error",
          finishLoader,
          { once: true }
        );

        const playPromise = loaderVideo.play();

        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn(
              "ASAI intro autoplay was blocked:",
              error
            );
          });
        }
      } else {
        window.setTimeout(finishLoader, 1500);
      }
    }

    if (skipButton) {
      skipButton.addEventListener("click", finishLoader);
    }
  }

  // -------------------------------------------------------
  // 2. SCROLL REVEALS
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

  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  } else {
    revealElements.forEach((element, index) => {
      element.classList.add("reveal");

      if (element.classList.contains("service-card")) {
        element.style.transitionDelay =
          `${(index % 4) * 100}ms`;
      }

      if (element.classList.contains("journey-step")) {
        element.style.transitionDelay =
          `${(index % 4) * 80}ms`;
      }
    });

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
  }

  // -------------------------------------------------------
  // 3. HERO PARALLAX
  // -------------------------------------------------------

  const hero = document.querySelector(".hero-cinematic");

  const heroImage = document.querySelector(
    ".cinematic-background img"
  );

  const supportsParallax =
    !prefersReducedMotion &&
    !window.matchMedia("(pointer: coarse)").matches &&
    window.innerWidth > 768;

  if (hero && heroImage && supportsParallax) {
    let ticking = false;

    const updateParallax = () => {
      const rect = hero.getBoundingClientRect();

      if (
        rect.bottom > 0 &&
        rect.top < window.innerHeight
      ) {
        const progress = Math.max(
          0,
          Math.min(1, -rect.top / rect.height)
        );

        heroImage.style.setProperty(
          "--parallax-y",
          `${progress * 30}px`
        );
      }

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateParallax);
        }
      },
      { passive: true }
    );

    updateParallax();
  }

  // -------------------------------------------------------
  // 4. MOBILE NAVIGATION
  // -------------------------------------------------------

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    const closeMenu = (returnFocus = false) => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute(
        "aria-label",
        "Open navigation"
      );

      document.body.classList.remove("menu-open");

      if (returnFocus) {
        menuToggle.focus();
      }
    };

    const openMenu = () => {
      navLinks.classList.add("open");
      menuToggle.classList.add("active");

      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute(
        "aria-label",
        "Close navigation"
      );

      document.body.classList.add("menu-open");
    };

    // Establish the correct initial accessibility state.
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
      "aria-label",
      "Open navigation"
    );

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => closeMenu());
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
      if (
        event.key === "Escape" &&
        menuToggle.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu(true);
      }
    });

    // Match the actual mobile navigation breakpoint.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // -------------------------------------------------------
  // 5. INTERACTIVE MOOD SELECTOR
  // -------------------------------------------------------

  const moodOptions = document.querySelectorAll(
    ".mood-option"
  );

  const moodResult = document.querySelector(
    ".mood-result"
  );

  if (moodResult) {
    moodResult.setAttribute("role", "status");
    moodResult.setAttribute("aria-live", "polite");
    moodResult.setAttribute("aria-atomic", "true");
  }

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
        "Take that first step. Explore the support and community that may help you move forward."
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

      const heading = document.createElement("h3");
      const paragraph = document.createElement("p");

      heading.textContent = response.title;
      paragraph.textContent = response.message;

      moodResult.replaceChildren(heading, paragraph);

      moodResult.hidden = false;
      moodResult.classList.add("show");
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
  // 7. SMOOTH INTERNAL NAVIGATION
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

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  // -------------------------------------------------------
  // 8. IMAGE LOADING
  // -------------------------------------------------------

  document.querySelectorAll("img").forEach(img => {
    const markLoaded = () => {
      img.classList.add("loaded");
    };

    const markFailed = () => {
      img.classList.add("image-failed");
    };

    if (img.complete) {
      if (img.naturalWidth > 0) {
        markLoaded();
      } else {
        markFailed();
      }
    } else {
      img.addEventListener("load", markLoaded, {
        once: true
      });

      img.addEventListener("error", markFailed, {
        once: true
      });
    }
  });

  // -------------------------------------------------------
  // 9. AUTOMATIC FOOTER YEAR
  // -------------------------------------------------------

  const copyrightYear = document.querySelector(
    "[data-year]"
  );

  if (copyrightYear) {
    copyrightYear.textContent =
      new Date().getFullYear();
  }

});
