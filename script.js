(function () {
  var nav = document.querySelector(".nav");
  var navToggle = document.querySelector(".nav-toggle");
  var themeToggle = document.querySelector(".theme-toggle");
  var searchInput = document.getElementById("project-search");
  var filterButtons = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card");
  var emptyState = document.getElementById("project-empty");
  var contactForm = document.getElementById("contact-form");
  var formNote = document.getElementById("form-note");
  var activeFilter = "all";

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeToggle) {
      var nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      themeToggle.setAttribute("aria-label", nextLabel);
    }
  }

  function getPreferredTheme() {
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function closeMenu() {
    if (!nav || !navToggle) {
      return;
    }
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function applyProjectFilters() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var visibleCount = 0;

    projectCards.forEach(function (card) {
      var category = card.getAttribute("data-category") || "";
      var title = (card.getAttribute("data-title") || "").toLowerCase();
      var text = card.textContent.toLowerCase();
      var matchesFilter = activeFilter === "all" || category === activeFilter;
      var matchesSearch = query === "" || title.indexOf(query) !== -1 || text.indexOf(query) !== -1;

      if (matchesFilter && matchesSearch) {
        card.hidden = false;
        visibleCount += 1;
      } else {
        card.hidden = true;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  setTheme(getPreferredTheme());

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") || "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyProjectFilters);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-filter") || "all";
      filterButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      applyProjectFilters();
    });
  });

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = contactForm.elements.namedItem("name").value.trim();
      var email = contactForm.elements.namedItem("email").value.trim();
      var message = contactForm.elements.namedItem("message").value.trim();

      if (!name || !email || !message) {
        formNote.textContent = "Please fill in all fields.";
        return;
      }

      formNote.textContent =
        "Thanks, " +
        name +
        ". The contact form is a placeholder for now, so nothing was sent.";
      contactForm.reset();
    });
  }

  applyProjectFilters();
})();
