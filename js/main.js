const header = document.querySelector(".site-header");

let lastScrollY = window.scrollY;
let ticking = false;

function updateHeader() {
  const currentScrollY = window.scrollY;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (currentScrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  if (isMobile) {
    const scrollingDown = currentScrollY > lastScrollY + 6;
    const scrollingUp = currentScrollY < lastScrollY - 6;

    if (scrollingDown && currentScrollY > 120) {
      header.classList.add("header-hidden");
    }

    if (scrollingUp || currentScrollY < 80) {
      header.classList.remove("header-hidden");
    }
  } else {
    header.classList.remove("header-hidden");
  }

  lastScrollY = currentScrollY;
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateHeader);
    ticking = true;
  }
});

window.addEventListener("resize", updateHeader);

updateHeader();

/* Reveal group: içerideki elemanları sırayla reveal yapar */

const revealGroups = document.querySelectorAll("[data-reveal-group]");

revealGroups.forEach((group) => {
  const children = Array.from(group.children);

  children.forEach((child, index) => {
    if (!child.hasAttribute("data-reveal")) {
      child.setAttribute("data-reveal", "up");
    }

    child.style.setProperty("--reveal-delay", `${index * 90}ms`);
  });
});

/* Scroll reveal */

const revealElements = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const delay = element.dataset.delay;

      if (delay) {
        element.style.setProperty("--reveal-delay", `${delay}ms`);
      }

      element.classList.add("is-visible");
      observer.unobserve(element);
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -60px 0px",
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* Lazy image */

const lazyImages = document.querySelectorAll("img[data-src]");

const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const image = entry.target;
      const src = image.dataset.src;

      if (!src) return;

      image.src = src;

      image.addEventListener(
        "load",
        () => {
          image.classList.add("is-loaded");
        },
        { once: true }
      );

      image.removeAttribute("data-src");
      observer.unobserve(image);
    });
  },
  {
    rootMargin: "350px 0px",
    threshold: 0.01,
  }
);

lazyImages.forEach((image) => {
  imageObserver.observe(image);
});

/* Lazy background */

const lazyBackgrounds = document.querySelectorAll("[data-bg]");

const backgroundObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const bg = element.dataset.bg;

      if (!bg) return;

      element.style.backgroundImage = `url("${bg}")`;
      element.classList.add("is-loaded");
      element.removeAttribute("data-bg");

      observer.unobserve(element);
    });
  },
  {
    rootMargin: "350px 0px",
    threshold: 0.01,
  }
);

lazyBackgrounds.forEach((element) => {
  backgroundObserver.observe(element);
});
/* Mobile drawer menu */

const menuButton = document.querySelector(".mobile-menu-btn");
const mobileDrawer = document.querySelector(".mobile-drawer");
const menuOverlay = document.querySelector(".mobile-drawer-overlay");
const menuCloseItems = document.querySelectorAll("[data-menu-close]");
const menuLinks = document.querySelectorAll("[data-menu-link]");

function openMobileMenu() {
  if (!menuButton || !mobileDrawer) return;

  document.body.classList.add("menu-open");
  mobileDrawer.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");

  if (header) {
    header.classList.remove("header-hidden");
  }
}

function closeMobileMenu() {
  if (!menuButton || !mobileDrawer) return;

  document.body.classList.remove("menu-open");
  mobileDrawer.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton) {
  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("menu-open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

menuCloseItems.forEach((item) => {
  item.addEventListener("click", closeMobileMenu);
});

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});