// ===== NEXT LEVEL CURSOR TRAIL EFFECTS - 2025 EDITION =====

class CursorTrailEffect {
  constructor() {
    this.trailContainer = null;
    this.magneticCursor = null;
    this.particles = [];
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.particleCount = 0;
    this.maxParticles = 150;
    this.isActive = false;

    // Performance throttling
    this.lastParticleTime = 0;
    this.particleDelay = 16; // ~60fps

    // Color and size arrays for variety
    this.colors = [
      "color-1",
      "color-2",
      "color-3",
      "color-4",
      "color-5",
      "color-6",
      "color-7",
      "color-8",
    ];
    this.sizes = ["size-1", "size-2", "size-3", "size-4", "size-5"];

    this.init();
  }

  init() {
    // Check if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Check if it's a touch device
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      return;
    }

    this.createTrailContainer();
    this.createMagneticCursor();
    this.bindEvents();
    this.startAnimation();
  }

  createTrailContainer() {
    this.trailContainer = document.createElement("div");
    this.trailContainer.className = "cursor-trail";
    document.body.appendChild(this.trailContainer);
  }

  createMagneticCursor() {
    this.magneticCursor = document.createElement("div");
    this.magneticCursor.className = "cursor-magnetic";
    document.body.appendChild(this.magneticCursor);
  }

  bindEvents() {
    // Mouse move event
    document.addEventListener("mousemove", (e) => {
      this.updateMousePosition(e);
      this.updateMagneticCursor(e);
    });

    // Mouse enter/leave for home section
    const homeSection = document.querySelector("#home");
    if (homeSection) {
      homeSection.addEventListener("mouseenter", () => {
        this.isActive = true;
        this.trailContainer.style.filter = "brightness(1.2) saturate(1.3)";
      });

      homeSection.addEventListener("mouseleave", () => {
        this.isActive = false;
        this.trailContainer.style.filter = "brightness(1) saturate(1)";
      });
    }

    // Click explosion effect
    document.addEventListener("click", (e) => {
      if (this.isActive) {
        this.createExplosion(e.clientX, e.clientY);
      }
    });

    // Performance optimization - pause when tab not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseEffect();
      } else {
        this.resumeEffect();
      }
    });
  }

  updateMousePosition(e) {
    this.lastMousePos = { ...this.mousePos };
    this.mousePos = { x: e.clientX, y: e.clientY };

    // Calculate mouse velocity for dynamic effects
    const deltaX = this.mousePos.x - this.lastMousePos.x;
    const deltaY = this.mousePos.y - this.lastMousePos.y;
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Create particles based on movement and timing
    const now = Date.now();
    if (this.isActive && now - this.lastParticleTime > this.particleDelay) {
      const particleCount = Math.min(Math.floor(velocity / 10) + 1, 5);
      for (let i = 0; i < particleCount; i++) {
        this.createParticle(this.mousePos.x, this.mousePos.y, velocity);
      }
      this.lastParticleTime = now;
    }
  }

  updateMagneticCursor(e) {
    if (this.magneticCursor) {
      this.magneticCursor.style.left = e.clientX + "px";
      this.magneticCursor.style.top = e.clientY + "px";
    }
  }

  createParticle(x, y, velocity = 0) {
    if (this.particleCount >= this.maxParticles) {
      return;
    }

    const particle = document.createElement("div");
    const size = this.getRandomSize();
    const color = this.getRandomColor();
    particle.className = `cursor-particle ${size} ${color}`;

    // Add more randomness for liquid effect
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;

    particle.style.left = x + offsetX + "px";
    particle.style.top = y + offsetY + "px";

    // Enhanced liquid physics with more variation
    const randomX = (Math.random() - 0.5) * 300;
    const randomY = (Math.random() - 0.5) * 250 - 80;
    particle.style.setProperty("--random-x", randomX + "px");
    particle.style.setProperty("--random-y", randomY + "px");

    // Velocity-based liquid behavior
    const duration = Math.max(2, 4 - velocity / 80);
    particle.style.animationDuration = duration + "s";

    // Add liquid morphing effect
    const morphingDelay = Math.random() * 500;
    setTimeout(() => {
      if (particle.parentNode) {
        this.addLiquidMorphing(particle);
      }
    }, morphingDelay);

    this.trailContainer.appendChild(particle);
    this.particles.push(particle);
    this.particleCount++;

    // Create liquid drops occasionally
    if (Math.random() < 0.4) {
      this.createLiquidDrop(x + offsetX, y + offsetY);
    }

    // Remove particle after animation
    setTimeout(() => {
      this.removeParticle(particle);
    }, duration * 1000);
  }

  addLiquidMorphing(particle) {
    // Create continuous morphing effect
    const morphShapes = [
      "60% 40% 70% 30%",
      "40% 60% 50% 80%",
      "70% 30% 60% 40%",
      "80% 20% 90% 10%",
      "50% 50% 40% 60%",
      "90% 10% 80% 20%",
    ];

    let currentShape = 0;
    const morphInterval = setInterval(() => {
      if (!particle.parentNode) {
        clearInterval(morphInterval);
        return;
      }

      currentShape = (currentShape + 1) % morphShapes.length;
      particle.style.borderRadius = morphShapes[currentShape];
    }, 200 + Math.random() * 300);

    // Clean up interval when particle is removed
    setTimeout(() => clearInterval(morphInterval), 4000);
  }

  createLiquidDrop(x, y) {
    const drop = document.createElement("div");
    drop.className = "cursor-liquid-drop";
    drop.style.left = x + "px";
    drop.style.top = y + "px";

    // Random liquid drop properties
    const size = 3 + Math.random() * 8;
    drop.style.width = size + "px";
    drop.style.height = size + "px";
    drop.style.borderRadius = "50% 40% 60% 30%";

    // Random color from palette
    const colors = ["#ff006e", "#8338ec", "#3a86ff", "#06ffa5", "#ffbe0b"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    drop.style.background = `radial-gradient(ellipse, ${color}, transparent)`;
    drop.style.boxShadow = `0 0 ${size * 2}px ${color}`;

    // Liquid drop animation
    drop.style.animation = `liquidDrop ${1 + Math.random()}s ease-out forwards`;

    this.trailContainer.appendChild(drop);

    setTimeout(() => {
      if (drop.parentNode) {
        drop.parentNode.removeChild(drop);
      }
    }, 1500);
  }

  createExplosion(x, y) {
    const explosionCount = 12;
    const colors = this.colors.slice(0, 5); // Use first 5 colors for explosion

    for (let i = 0; i < explosionCount; i++) {
      const explosion = document.createElement("div");
      explosion.className = `cursor-explosion ${
        colors[Math.floor(Math.random() * colors.length)]
      }`;

      const angle = (i / explosionCount) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const explosionX = x + Math.cos(angle) * distance;
      const explosionY = y + Math.sin(angle) * distance;

      explosion.style.left = explosionX + "px";
      explosion.style.top = explosionY + "px";

      this.trailContainer.appendChild(explosion);

      setTimeout(() => {
        if (explosion.parentNode) {
          explosion.parentNode.removeChild(explosion);
        }
      }, 600);
    }
  }

  removeParticle(particle) {
    if (particle && particle.parentNode) {
      particle.parentNode.removeChild(particle);
      const index = this.particles.indexOf(particle);
      if (index > -1) {
        this.particles.splice(index, 1);
      }
      this.particleCount--;
    }
  }

  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  getRandomSize() {
    return this.sizes[Math.floor(Math.random() * this.sizes.length)];
  }

  startAnimation() {
    this.isRunning = true;
    this.animate();
  }

  animate() {
    if (!this.isRunning) return;

    // Clean up old particles periodically
    if (this.particleCount > this.maxParticles * 0.8) {
      this.cleanupOldParticles();
    }

    requestAnimationFrame(() => this.animate());
  }

  cleanupOldParticles() {
    const particlesToRemove = this.particles.slice(
      0,
      Math.floor(this.particles.length * 0.3)
    );
    particlesToRemove.forEach((particle) => this.removeParticle(particle));
  }

  pauseEffect() {
    this.isRunning = false;
    if (this.trailContainer) {
      this.trailContainer.style.display = "none";
    }
    if (this.magneticCursor) {
      this.magneticCursor.style.display = "none";
    }
  }

  resumeEffect() {
    this.isRunning = true;
    if (this.trailContainer) {
      this.trailContainer.style.display = "block";
    }
    if (this.magneticCursor) {
      this.magneticCursor.style.display = "block";
    }
    this.animate();
  }

  destroy() {
    this.isRunning = false;

    if (this.trailContainer && this.trailContainer.parentNode) {
      this.trailContainer.parentNode.removeChild(this.trailContainer);
    }

    if (this.magneticCursor && this.magneticCursor.parentNode) {
      this.magneticCursor.parentNode.removeChild(this.magneticCursor);
    }

    // Remove event listeners
    document.removeEventListener("mousemove", this.updateMousePosition);
    document.removeEventListener("click", this.createExplosion);
  }
}

// Initialize cursor trail effect when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit for page to settle
  setTimeout(() => {
    window.cursorTrailEffect = new CursorTrailEffect();
    console.log("🎨 Next-level cursor trail effect activated!");
  }, 500);
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (window.cursorTrailEffect) {
    window.cursorTrailEffect.destroy();
  }
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = CursorTrailEffect;
}
