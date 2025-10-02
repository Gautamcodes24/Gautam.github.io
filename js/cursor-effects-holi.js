// Simple Holi Color Trail - Lightweight and Performance Optimized
class HoliCursorTrail {
  constructor() {
    this.container = null;
    this.particles = [];
    this.maxParticles = 25; // Keep it lightweight
    this.colors = [
      "holi-red",
      "holi-pink",
      "holi-orange",
      "holi-yellow",
      "holi-green",
      "holi-blue",
      "holi-purple",
      "holi-magenta",
    ];
    this.sizes = ["small", "medium", "large"];
    this.isActive = false;

    this.init();
  }

  init() {
    // Create container
    this.container = document.createElement("div");
    this.container.className = "cursor-trail-container";
    document.body.appendChild(this.container);

    // Add event listeners
    document.addEventListener("mousemove", (e) => this.createParticle(e));
    document.addEventListener("mouseenter", () => (this.isActive = true));
    document.addEventListener("mouseleave", () => (this.isActive = false));

    // Clean up particles periodically
    setInterval(() => this.cleanup(), 100);
  }

  createParticle(event) {
    if (!this.isActive) return;

    // Limit particles for performance
    if (this.particles.length >= this.maxParticles) {
      const oldParticle = this.particles.shift();
      if (oldParticle && oldParticle.parentNode) {
        oldParticle.parentNode.removeChild(oldParticle);
      }
    }

    // Create particle element
    const particle = document.createElement("div");
    particle.className = `cursor-particle ${this.getRandomColor()} ${this.getRandomSize()}`;

    // Set initial position
    particle.style.left = event.clientX + "px";
    particle.style.top = event.clientY + "px";

    // Set random drift values for natural movement
    const driftX1 = (Math.random() - 0.5) * 40;
    const driftY1 = -Math.random() * 30 - 10;
    const driftX2 = driftX1 + (Math.random() - 0.5) * 30;
    const driftY2 = driftY1 - Math.random() * 25 - 15;
    const driftX3 = driftX2 + (Math.random() - 0.5) * 25;
    const driftY3 = driftY2 - Math.random() * 20 - 10;
    const driftX4 = driftX3 + (Math.random() - 0.5) * 30;
    const driftY4 = driftY3 - Math.random() * 25 - 15;

    particle.style.setProperty("--drift-x", driftX1 + "px");
    particle.style.setProperty("--drift-y", driftY1 + "px");
    particle.style.setProperty("--drift-x2", driftX2 + "px");
    particle.style.setProperty("--drift-y2", driftY2 + "px");
    particle.style.setProperty("--drift-x3", driftX3 + "px");
    particle.style.setProperty("--drift-y3", driftY3 + "px");
    particle.style.setProperty("--drift-x4", driftX4 + "px");
    particle.style.setProperty("--drift-y4", driftY4 + "px");

    // Add to DOM and track
    this.container.appendChild(particle);
    this.particles.push(particle);

    // Remove after animation
    setTimeout(() => {
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
        const index = this.particles.indexOf(particle);
        if (index > -1) {
          this.particles.splice(index, 1);
        }
      }
    }, 2000);
  }

  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  getRandomSize() {
    return this.sizes[Math.floor(Math.random() * this.sizes.length)];
  }

  cleanup() {
    // Remove particles that have finished animating
    this.particles = this.particles.filter((particle) => {
      if (!particle.parentNode) {
        return false;
      }
      return true;
    });
  }

  // Method to disable effects on mobile for better performance
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.particles = [];
    this.isActive = false;
  }
}

// Initialize only on desktop for performance
document.addEventListener("DOMContentLoaded", () => {
  // Check if device is mobile
  const isMobile =
    window.innerWidth <= 768 ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (!isMobile) {
    // Only activate in home section for better performance
    const homeSection = document.querySelector(".home");
    let holiTrail = null;

    // Intersection observer to activate only when home section is visible
    if (homeSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !holiTrail) {
              holiTrail = new HoliCursorTrail();
            } else if (!entry.isIntersecting && holiTrail) {
              holiTrail.destroy();
              holiTrail = null;
            }
          });
        },
        {
          threshold: 0.1,
        }
      );

      observer.observe(homeSection);
    }
  }
});
