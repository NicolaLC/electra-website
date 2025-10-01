// Global mouse position tracking variables
let mouseX = 0;
let mouseY = 0;

// Utility logger - only logs on localhost
const logger = (() => {
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  return {
    log: (...args) => {
      if (isLocalhost) {
        console.log(...args);
      }
    },
  };
})();

// Global function to show cookie preferences modal
window.showCookiePreferences = function () {
  try {
    // Try the preferences modal method first
    if (CookieConsent && CookieConsent.showPreferences) {
      CookieConsent.showPreferences();
    } else if (CookieConsent && CookieConsent.show) {
      // Fallback to show method with force parameter
      CookieConsent.show(true);
    } else {
      console.warn("CookieConsent preferences not available");
    }
  } catch (error) {
    console.error("Error showing cookie preferences:", error);
  }
};

// Initialize Cookie Consent
function initializeCookieConsent() {
  if (typeof CookieConsent === "undefined") {
    console.warn("CookieConsent library not loaded");
    return;
  }

  // Check if there's already stored consent and update GA immediately
  const storedConsent = CookieConsent.getCookie();
  if (storedConsent && storedConsent.categories) {
    updateAnalyticsConsent(storedConsent.categories.includes("analytics"));
  }

  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: "box inline",
        position: "bottom left",
        equalWeightButtons: true,
        flipButtons: false,
      },
      preferencesModal: {
        layout: "box",
        position: "right",
        equalWeightButtons: true,
        flipButtons: false,
      },
    },
    categories: {
      necessary: {
        readOnly: true,
      },
      analytics: {},
    },
    language: {
      default: "it",
      translations: {
        it: {
          consentModal: {
            title: "Utilizziamo i cookie",
            description:
              "Questo sito web utilizza cookie essenziali per garantire il corretto funzionamento e cookie di analisi per migliorare la tua esperienza. Puoi accettare tutti i cookie o personalizzare le tue preferenze.",
            acceptAllBtn: "Accetta tutti",
            acceptNecessaryBtn: "Solo necessari",
            showPreferencesBtn: "Gestisci preferenze",
            footer: '<a href="#privacy-policy">Privacy Policy</a>',
          },
          preferencesModal: {
            title: "Centro Preferenze Cookie",
            acceptAllBtn: "Accetta tutti",
            acceptNecessaryBtn: "Solo necessari",
            savePreferencesBtn: "Salva preferenze",
            closeIconLabel: "Chiudi",
            sections: [
              {
                title: "Utilizzo dei Cookie 📢",
                description:
                  'Utilizziamo i cookie per garantire le funzionalità di base del sito web e per migliorare la tua esperienza online. Puoi scegliere per ogni categoria di accettare/rifiutare quando vuoi. Per maggiori dettagli sui cookie e altri dati sensibili, leggi la <a href="#privacy-policy" class="cc-link">Privacy Policy</a>.',
              },
              {
                title: "Cookie Strettamente Necessari",
                description:
                  "Questi cookie sono essenziali per il corretto funzionamento del sito web. Senza questi cookie, il sito web non funzionerà correttamente.",
                linkedCategory: "necessary",
              },
              {
                title: "Cookie di Analisi e Performance",
                description:
                  "Questi cookie ci permettono di contare le visite e le sorgenti di traffico, così possiamo misurare e migliorare le performance del nostro sito.",
                linkedCategory: "analytics",
              },
            ],
          },
        },
      },
    },
    onFirstConsent: ({ cookie }) => {
      logger.log("First consent given", cookie);
      // Update consent if analytics accepted
      if (CookieConsent.acceptedCategory("analytics")) {
        updateAnalyticsConsent(true);
      }
    },
    onConsent: ({ cookie }) => {
      logger.log("Consent updated", cookie);
      // Update consent if analytics accepted
      if (CookieConsent.acceptedCategory("analytics")) {
        updateAnalyticsConsent(true);
      }
    },
    onChange: ({ cookie, changedCategories }) => {
      logger.log("Consent changed", cookie, changedCategories);
      // Handle analytics category change
      if (changedCategories.includes("analytics")) {
        updateAnalyticsConsent(CookieConsent.acceptedCategory("analytics"));
      }
    },
    onModalReady: ({ modalName }) => {
      logger.log("Modal ready", modalName);
    },
  });
}

// Update Google Analytics consent
function updateAnalyticsConsent(granted) {
  logger.log(
    `Updating analytics consent to: ${granted ? "granted" : "denied"}`
  );

  gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

// Initialize Privacy Modal
function initializePrivacyModal() {
  const privacyModal = document.getElementById("privacy-modal");
  const privacyLinks = document.querySelectorAll(
    'a[href="#privacy-policy"], #privacy-policy-link'
  );
  const closeButton = document.querySelector(".privacy-modal-close");

  // Open privacy modal
  privacyLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      privacyModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  // Close privacy modal
  function closeModal() {
    privacyModal.style.display = "none";
    document.body.style.overflow = "";
  }

  closeButton?.addEventListener("click", closeModal);

  // Close modal when clicking outside
  privacyModal.addEventListener("click", (e) => {
    if (e.target === privacyModal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && privacyModal.style.display === "flex") {
      closeModal();
    }
  });
}

// Initialize functions when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeCookieConsent();
  initializePrivacyModal();
  initializeGlobalMouseTracking();
  initializeEffects();
  initializeContactForm();
  initializeLocationSelector();
  handleMenuToggle();
});

// Initialize location selector for map switching
function initializeLocationSelector() {
  const locationTabs = document.querySelectorAll(".location-tab");
  const locationMap = document.getElementById("location-map");

  if (!locationTabs.length || !locationMap) return;

  // Location data for easy management and future expansion
  // To add new locations, simply:
  // 1. Add a new entry here with the location key, name, address, and encoded query
  // 2. Add a corresponding button in the HTML with matching data-location attribute
  const locations = {
    bellinzona: {
      name: "Bellinzona",
      address: "Via Codeborgo 1, 6500 Bellinzona, Switzerland",
      query: "Via%20Codeborgo%201,%206500%20Bellinzona,%20Switzerland",
      title: "Electra Fitness Bellinzona",
    },
    locarno: {
      name: "Locarno",
      address: "Via Vincenzo Vela 5, 6600 Locarno, Switzerland",
      query: "Via%20Vincenzo%20Vela%205,%206600%20Locarno,%20Switzerland",
      title: "Electra Fitness Locarno",
    },
    giubiasco: {
      name: "Giubiasco",
      address: "Viale stazione 3c, Giubiasco, Switzerland",
      query: "Viale%20stazione%203c,%20Giubiasco,%20Switzerland",
      title: "Electra Fitness Giubiasco",
    },
    // Future locations can be added here:
    // zurich: {
    //   name: 'Zurich',
    //   address: 'Sample Address, 8000 Zurich, Switzerland',
    //   query: 'Sample%20Address,%208000%20Zurich,%20Switzerland',
    //   title: 'Electra Fitness Zurich'
    // }
  };

  // Handle tab clicks
  locationTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      const locationKey = tab.getAttribute("data-location");
      const location = locations[locationKey];

      if (!location) return;

      // Update active state
      locationTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Update map iframe
      const newSrc = `https://maps.google.com/maps?width=100%&height=400&hl=en&q=${location.query}&t=&z=15&ie=UTF8&iwloc=B&output=embed`;
      locationMap.src = newSrc;
      locationMap.title = location.title;
    });
  });
}

// Add throttling to mouse movement to optimize performance
function throttle(callback, limit) {
  let waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}

// Track and update mouse position
function initializeGlobalMouseTracking() {
  document.addEventListener(
    "mousemove",
    throttle((e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      updateAllElements();
    }, 16) // Throttle to approximately 60fps
  );
}

// Initialize hover and animations effects
function initializeEffects() {
  const elements = {
    title: document.querySelector(".hero-content h1"),
    buttons: document.querySelectorAll(".button-icon-base"),
    detailsHeadings: document.querySelectorAll(".details-content h3"),
    aboutUsHeadings: document.querySelectorAll(
      ".section-about-us .details-content h3"
    ),
    infoCards: document.querySelectorAll(".more-info"),
    detailImages: document.querySelectorAll(".details-image"),
  };

  // Apply initial styles
  setInitialStyles(elements);
  // Set up intersection observer for animations
  setupIntersectionObserver(elements.infoCards);
  setupIntersectionObserver(elements.detailImages);

  const parallaxElements = document.querySelectorAll(".parallax");

  window.addEventListener("scroll", () => {
    parallaxElements.forEach((element) => {
      const scrollPosition = window.scrollY;
      const elementOffset = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const scrollRatio = (scrollPosition - elementOffset) / elementHeight;

      element.style.backgroundPosition = `${scrollRatio * 100}px ${
        scrollRatio * 50
      }px`;
    });
  });
}

// Set initial styles for elements
function setInitialStyles({
  title,
  buttons,
  detailsHeadings,
  aboutUsHeadings,
  infoCards,
  detailImages,
}) {
  applyInitialProperties(title);

  buttons.forEach(applyInitialProperties);
  detailsHeadings.forEach(applyInitialProperties);
  aboutUsHeadings.forEach(applyInitialProperties);
  infoCards.forEach(applyInitialProperties);
  detailImages.forEach(applyInitialProperties);
}

// Apply initial CSS properties to elements
function applyInitialProperties(element) {
  if (element) {
    element.style.setProperty("--effect-opacity", "0");
    element.style.setProperty("--x", "50%");
    element.style.setProperty("--y", "50%");
  }
}

// Setup intersection observer for More Info animations
function setupIntersectionObserver(infoCards) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  infoCards.forEach((card, index) => {
    card.style.setProperty("--i", index + 1);
    card.style.animationPlayState = "paused";
    observer.observe(card);
  });
}

// Update all interactive elements based on mouse position
function updateAllElements() {
  const elements = [
    document.querySelector(".hero-content h1"),
    ...document.querySelectorAll(".button-icon-base"),
    ...document.querySelectorAll(".details-content h3"),
    ...document.querySelectorAll(".section-about-us .details-content h3"),
    ...document.querySelectorAll(".details-image"),
  ];
  elements.forEach(updateElementEffect);
}

// Update individual element's effects based on mouse proximity
function updateElementEffect(element) {
  const rect = element.getBoundingClientRect();
  const elementCenterX = rect.left + rect.width / 2;
  const elementCenterY = rect.top + rect.height / 2;
  const distanceX = mouseX - elementCenterX;
  const distanceY = mouseY - elementCenterY;
  const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
  const proximityThreshold = Math.max(rect.width, rect.height) * 1.5;

  if (distance < proximityThreshold) {
    const x = ((mouseX - rect.left) / rect.width) * 100;
    const y = ((mouseY - rect.top) / rect.height) * 100;
    const opacityValue = 1 - distance / proximityThreshold;

    requestAnimationFrame(() => {
      element.style.setProperty("--x", `${x}%`);
      element.style.setProperty("--y", `${y}%`);
      element.style.setProperty("--effect-opacity", opacityValue.toFixed(2));
    });
  } else {
    requestAnimationFrame(() => {
      element.style.setProperty("--effect-opacity", "0");
    });
  }
}

// Initialize contact form validation
function initializeContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fields = {
      name: document.getElementById("name"),
      surname: document.getElementById("surname"),
      email: document.getElementById("email"),
      privacy: document.getElementById("privacy"),
      message: document.getElementById("message"),
    };

    const isValid = validateForm(fields);

    if (isValid) {
      const res = await fetch(`${window.location.origin}/server/mailer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name.value,
          surname: fields.surname.value,
          email: fields.email.value,
          message: fields.message.value,
        }),
      });

      await res.json();
      if (res.ok) {
        showFormSuccess(form);
      }
    }
  });
}

// Validate form fields
function validateForm({ name, surname, email, privacy }) {
  let isValid = true;

  if (!name.value.trim()) {
    highlightInvalidField(name);
    isValid = false;
  } else {
    resetField(name);
  }

  if (!surname.value.trim()) {
    highlightInvalidField(surname);
    isValid = false;
  } else {
    resetField(surname);
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailPattern.test(email.value)) {
    highlightInvalidField(email);
    isValid = false;
  } else {
    resetField(email);
  }

  if (!privacy.checked) {
    highlightInvalidField(privacy.parentElement);
    isValid = false;
  } else {
    resetField(privacy.parentElement);
  }

  return isValid;
}

// Highlight invalid form field
function highlightInvalidField(element) {
  element.classList.add("invalid");
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    element.style.borderBottomColor = "#ff3b30";
  }
}

// Reset form field styling
function resetField(element) {
  element.classList.remove("invalid");
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    element.style.borderBottomColor = "";
  }
}

// Show form success message
function showFormSuccess(form) {
  form.style.display = "none";

  const successMessage = document.createElement("div");
  successMessage.className = "form-success";
  successMessage.innerHTML = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#5FE3FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#5FE3FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <h3>Messaggio inviato con successo!</h3>
    <p>Grazie per averci contattato. Ti risponderemo il prima possibile.</p>
  `;

  form.parentNode.appendChild(successMessage);

  const style = document.createElement("style");
  style.textContent = `
    .form-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
      padding: 2rem;
      animation: fadeIn 0.5s ease-out forwards;
    }
    .form-success h3 {
      font-family: var(--font-family-primary);
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--color-white);
    }
    .form-success p {
      font-family: var(--font-family-secondary);
      font-size: 1rem;
      color: var(--color-white);
    }
  `;
  document.head.appendChild(style);
}

// Handle menu toggle
function handleMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".app-menu");
  const body = document.body;

  menuToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle("active");
    menu?.classList.toggle("active");
    body.classList.toggle("no-scroll");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      e.target.tagName === "A" ||
      (!menuToggle.contains(e.target) && !menu.contains(e.target))
    ) {
      menuToggle.classList.remove("active");
      menu.classList.remove("active");
      body.classList.remove("no-scroll");
    }
  });
}
