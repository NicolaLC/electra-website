// Track mouse position globally
let mouseX = 0;
let mouseY = 0;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeGlobalMouseTracking();
  initializeHeroTitleEffect();
  initializeButtonEffects();
  initializeDetailsHeadingsEffect();
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

  if (title) updateElementEffect(title);
  buttons.forEach((button) => updateElementEffect(button));
  detailsHeadings.forEach((heading) => updateElementEffect(heading));
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
