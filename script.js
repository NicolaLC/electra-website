// Global mouse position tracking variables
let mouseX = 0;
let mouseY = 0;

// Initialize functions when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeGlobalMouseTracking();
  initializeEffects();
  initializeContactForm();
});

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
      const res = await fetch("http://localhost:4243/mailer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name.value,
          surname: fields.surname.value,
          email: fields.email.value,
          message: fields.message.value,
        }),
      });

      const data = await res.json();
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
