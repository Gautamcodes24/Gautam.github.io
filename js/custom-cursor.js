// Fast Custom Cursor - Performance Optimized
class CustomCursor {
  constructor() {
    this.cursor = null;
    this.follower = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isActive = true;

    this.init();
  }

  init() {
    // Check if mobile or low-end device
    if (
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return;
    }

    this.createCursor();
    this.createFollower();
    this.addEventListeners();
    this.animate();
  }

  createCursor() {
    this.cursor = document.createElement("div");
    this.cursor.className = "custom-cursor";
    document.body.appendChild(this.cursor);
  }

  createFollower() {
    this.follower = document.createElement("div");
    this.follower.className = "cursor-follower";
    document.body.appendChild(this.follower);
  }

  addEventListeners() {
    // Optimized mouse movement with throttling
    let ticking = false;
    document.addEventListener("mousemove", (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
          ticking = false;
        });
        ticking = true;
      }
    });

    // Simplified hover states - only for interactive elements
    this.addHoverListeners("a, button, .btn, .nav-link", "button");
    this.addHoverListeners(".portfolio-item, .project-card", "portfolio");

    // Click events
    document.addEventListener("mousedown", () => {
      this.cursor.classList.add("click");
      this.follower.classList.add("click");
    });

    document.addEventListener("mouseup", () => {
      this.cursor.classList.remove("click");
      this.follower.classList.remove("click");
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      this.isActive = false;
    });

    document.addEventListener("mouseenter", () => {
      this.isActive = true;
    });
  }

  addHoverListeners(selector, className) {
    document.addEventListener("mouseover", (e) => {
      if (e.target.matches(selector)) {
        this.cursor.classList.add(className);
        this.follower.classList.add(className);
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (e.target.matches(selector)) {
        this.cursor.classList.remove(className);
        this.follower.classList.remove(className);
      }
    });
  }

  animate() {
    if (!this.isActive) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    // Use CSS transforms for better performance
    if (this.cursor) {
      this.cursor.style.transform = `translate3d(${this.mouseX - 10}px, ${
        this.mouseY - 10
      }px, 0)`;
    }

    if (this.follower) {
      this.follower.style.transform = `translate3d(${this.mouseX - 20}px, ${
        this.mouseY - 20
      }px, 0)`;
    }

    requestAnimationFrame(() => this.animate());
  }

  // Method to temporarily disable cursor
  disable() {
    if (this.cursor) this.cursor.style.display = "none";
    if (this.follower) this.follower.style.display = "none";
    this.dots.forEach((dot) => {
      dot.element.style.display = "none";
    });
  }

  // Method to enable cursor
  enable() {
    if (this.cursor) this.cursor.style.display = "block";
    if (this.follower) this.follower.style.display = "block";
    this.dots.forEach((dot) => {
      dot.element.style.display = "block";
    });
  }
}

// Initialize custom cursor
document.addEventListener("DOMContentLoaded", () => {
  const customCursor = new CustomCursor();

  // Global access for debugging
  window.customCursor = customCursor;
});
