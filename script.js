// Track mouse position globally
let mouseX = 0;
let mouseY = 0;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeGlobalMouseTracking();
  initializeHeroTitleEffect();
  initializeButtonEffects();
  initializeDetailsHeadingsEffect();
  initializeAboutUsHeadingsEffect();
  initializeContactForm();
  initializeMoreInfoAnimations();
});
// Add throttling to mouse movement
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

// Track mouse position across the entire document
function initializeGlobalMouseTracking() {
  document.addEventListener(
    "mousemove",
    throttle((e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update all interactive elements
      updateAllElements();
    }, 16)
  ); // Approx. 60fps
}

// Update all interactive elements based on mouse position
function updateAllElements() {
  const title = document.querySelector(".hero-content h1");
  const buttons = document.querySelectorAll(".button-icon-base");
  const detailsHeadings = document.querySelectorAll(".details-content h3");
  const aboutUsHeadings = document.querySelectorAll(".section-about-us .details-content h3");

  if (title) updateElementEffect(title);
  buttons.forEach((button) => updateElementEffect(button));
  detailsHeadings.forEach((heading) => updateElementEffect(heading));
  aboutUsHeadings.forEach((heading) => updateElementEffect(heading));
}

// Hero title hover effect
function initializeHeroTitleEffect() {
  const title = document.querySelector(".hero-content h1");
  if (!title) return;

  // Add initial properties
  title.style.setProperty("--effect-opacity", "0");
  title.style.setProperty("--x", "50%");
  title.style.setProperty("--y", "50%");
}

// Button hover effects
function initializeButtonEffects() {
  const buttons = document.querySelectorAll(".button-icon-base");

  buttons.forEach((button) => {
    // Add initial properties
    button.style.setProperty("--effect-opacity", "0");
    button.style.setProperty("--x", "50%");
    button.style.setProperty("--y", "50%");
  });
}

// Details headings hover effects
function initializeDetailsHeadingsEffect() {
  const headings = document.querySelectorAll(".details-content h3");
  
  headings.forEach((heading) => {
    // Add initial properties
    heading.style.setProperty("--effect-opacity", "0");
    heading.style.setProperty("--x", "50%");
    heading.style.setProperty("--y", "50%");
  });
}

// About Us headings hover effects
function initializeAboutUsHeadingsEffect() {
  const headings = document.querySelectorAll(".section-about-us .details-content h3");
  
  headings.forEach((heading) => {
    // Add initial properties
    heading.style.setProperty("--effect-opacity", "0");
    heading.style.setProperty("--x", "50%");
    heading.style.setProperty("--y", "50%");
  });
}

// Initialize More Info section animations
function initializeMoreInfoAnimations() {
  const infoCards = document.querySelectorAll('.more-info');
  
  // Set initial animation delay for each card
  infoCards.forEach((card, index) => {
    const row = Math.floor(index / 2);
    const delay = 0.2 + (row * 0.1);
    card.style.setProperty('--i', index + 1);
  });
  
  // Add intersection observer to trigger animations when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  infoCards.forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
}

// Initialize contact form validation
function initializeContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  // Add submit event listener
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic form validation
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const emailInput = document.getElementById('email');
    const privacyCheckbox = document.getElementById('privacy');
    
    let isValid = true;
    
    // Validate required fields
    if (!nameInput.value.trim()) {
      highlightInvalidField(nameInput);
      isValid = false;
    } else {
      resetField(nameInput);
    }
    
    if (!surnameInput.value.trim()) {
      highlightInvalidField(surnameInput);
      isValid = false;
    } else {
      resetField(surnameInput);
    }
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value)) {
      highlightInvalidField(emailInput);
      isValid = false;
    } else {
      resetField(emailInput);
    }
    
    // Validate privacy checkbox
    if (!privacyCheckbox.checked) {
      highlightInvalidField(privacyCheckbox.parentElement);
      isValid = false;
    } else {
      resetField(privacyCheckbox.parentElement);
    }
    
    // If form is valid, show success message (in a real app, you would submit the form)
    if (isValid) {
      // Here you would typically send the form data to a server
      showFormSuccess(form);
    }
  });
  
  // Submit button is already added in the HTML
}

// Highlight invalid form field
function highlightInvalidField(element) {
  element.classList.add('invalid');
  
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    element.style.borderBottomColor = '#ff3b30';
  }
}

// Reset form field styling
function resetField(element) {
  element.classList.remove('invalid');
  
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    element.style.borderBottomColor = '';
  }
}

// Show form success message
function showFormSuccess(form) {
  // Hide the form
  form.style.display = 'none';
  
  // Create success message
  const successMessage = document.createElement('div');
  successMessage.className = 'form-success';
  successMessage.innerHTML = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#5FE3FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#5FE3FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <h3>Messaggio inviato con successo!</h3>
    <p>Grazie per averci contattato. Ti risponderemo il prima possibile.</p>
  `;
  
  // Add success message after the form
  form.parentNode.appendChild(successMessage);
  
  // Add some basic styles for the success message
  const style = document.createElement('style');
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

// Update element effect based on mouse proximity
function updateElementEffect(element) {
  const rect = element.getBoundingClientRect();

  // Calculate center point of element
  const elementCenterX = rect.left + rect.width / 2;
  const elementCenterY = rect.top + rect.height / 2;

  // Calculate distance from mouse to element center
  const distanceX = mouseX - elementCenterX;
  const distanceY = mouseY - elementCenterY;
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  // Define proximity threshold based on element size
  const proximityThreshold = Math.max(rect.width, rect.height) * 1.5;

  // If mouse is within threshold distance, calculate effect
  if (distance < proximityThreshold) {
    // Calculate position within the element
    const x = ((mouseX - rect.left) / rect.width) * 100;
    const y = ((mouseY - rect.top) / rect.height) * 100;

    // Calculate opacity based on distance (closer = more intense)
    const opacityValue = 1 - distance / proximityThreshold;

    // Update CSS variables
    requestAnimationFrame(() => {
      element.style.setProperty("--x", `${x}%`);
      element.style.setProperty("--y", `${y}%`);
      element.style.setProperty("--effect-opacity", opacityValue.toFixed(2));
    });
  } else {
    // Reset when mouse is far away
    requestAnimationFrame(() => {
      element.style.setProperty("--effect-opacity", "0");
    });
  }
}
