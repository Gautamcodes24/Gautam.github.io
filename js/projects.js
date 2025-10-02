class ProjectRenderer {
  constructor() {
    this.projects = [];
    this.container = null;
  }

  async init() {
    this.container = document.querySelector(".projects-grid");
    if (!this.container) return;

    try {
      // Show loading state
      this.showLoading();

      await this.loadProjects();

      // Clear loading and render projects
      this.renderProjects();
      this.initializeInteractions();
    } catch (error) {
      console.error("Failed to initialize projects:", error);
      this.showError(error);
    }
  }

  showLoading() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="loading-projects">
        <div class="loading-spinner"></div>
        <p>Loading amazing projects...</p>
      </div>
    `;
  }

  showError(error) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="error-loading">
        <h3>⚠️ Failed to Load Projects</h3>
        <p>Unable to load project data. Please refresh the page or check your connection.</p>
        <p style="font-size: 12px; margin-top: 10px; opacity: 0.5;">${error.message}</p>
      </div>
    `;
  }

  async loadProjects() {
    try {
      const response = await fetch("data/projects.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.projects = data.projects;
      return data;
    } catch (error) {
      console.error("Error loading projects:", error);
      throw error;
    }
  }

  renderProjects() {
    if (!this.container || !this.projects.length) return;

    // Clear existing content
    this.container.innerHTML = "";

    // Render each project
    this.projects.forEach((project, index) => {
      const projectElement = this.createProjectCard(project, index);
      this.container.appendChild(projectElement);
    });
  }

  createProjectCard(project, index) {
    const cardDiv = document.createElement("div");
    cardDiv.className = `project-card ${
      project.featured ? "featured-project" : ""
    }`;
    cardDiv.setAttribute("data-tilt", "");
    cardDiv.setAttribute("data-project-id", project.id);

    const badgeClass = this.getBadgeClass(project.badgeType);
    const statusClass = this.getStatusClass(project.status.type);

    cardDiv.innerHTML = `
      <div class="card-glow"></div>
      <div class="card-border-gradient"></div>
      <div class="floating-particles">
        ${this.generateParticles()}
      </div>
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}" />
        <div class="project-overlay">
          <div class="holographic-effect"></div>
          <div class="project-links">
            <a href="${
              project.links.live
            }" class="project-link live-link neon-btn" title="Live Demo" target="_blank">
              <div class="btn-glow"></div>
              <i class="fas fa-rocket"></i>
              <span>Live</span>
            </a>
            <a href="${
              project.links.github
            }" class="project-link github-link neon-btn" title="GitHub Repository" target="_blank">
              <div class="btn-glow"></div>
              <i class="fab fa-github"></i>
              <span>Code</span>
            </a>
          </div>
          <div class="project-status">
            <div class="status-indicator ${project.status.indicator}"></div>
            <span>${project.status.label}</span>
          </div>
        </div>
      </div>
      <div class="project-content">
        <div class="project-category">
          <div class="category-icon">${project.categoryIcon}</div>
          <span>${project.category}</span>
          <div class="category-badge ${badgeClass}">${project.badge}</div>
        </div>
        <h4 class="project-title gradient-text">${project.title}</h4>
        <p class="project-description">${project.description}</p>
        ${this.renderProjectStats(project.stats)}
        ${this.renderTechStack(project.technologies)}
      </div>
    `;

    return cardDiv;
  }

  generateParticles() {
    return Array.from({ length: 5 }, () => "<span></span>").join("");
  }

  renderProjectStats(stats) {
    if (!stats || stats.length === 0) return "";

    return `
      <div class="project-stats">
        ${stats
          .map(
            (stat) => `
          <div class="stat-item">
            <span class="stat-number">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  renderTechStack(technologies) {
    if (!technologies || technologies.length === 0) return "";

    return `
      <div class="tech-stack">
        ${technologies
          .map(
            (tech) => `
          <span class="tech-tag ${tech.color}">${tech.name}</span>
        `
          )
          .join("")}
      </div>
    `;
  }

  getBadgeClass(badgeType) {
    const badgeClasses = {
      hot: "",
      trending: "trending",
      new: "new",
      pro: "pro",
      latest: "latest",
      innovative: "innovative",
    };
    return badgeClasses[badgeType] || "";
  }

  getStatusClass(statusType) {
    const statusClasses = {
      active: "pulse",
      deployed: "deployed",
      beta: "beta",
      enterprise: "enterprise",
      completed: "completed",
    };
    return statusClasses[statusType] || "";
  }

  initializeInteractions() {
    // Minimal 3D tilt effects - very subtle
    if (window.VanillaTilt) {
      VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 2,
        speed: 800,
        glare: false,
        gyroscope: false,
        perspective: 1000,
        scale: 1.005,
        transition: true,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      });
    }

    // Minimal hover interactions - simple and clean
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transition = "all 0.3s ease";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "all 0.3s ease";
      });
    });

    // Reduce motion for users with motion sensitivity
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".project-card").forEach((card) => {
        card.removeAttribute("data-tilt");
        card.style.transform = "none";
      });
    }
  }

  // Method to filter projects by category
  filterByCategory(category) {
    const filteredProjects =
      category === "all"
        ? this.projects
        : this.projects.filter((project) => project.category === category);

    this.renderFilteredProjects(filteredProjects);
  }

  // Method to search projects
  searchProjects(query) {
    const searchTerm = query.toLowerCase();
    const filteredProjects = this.projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.category.toLowerCase().includes(searchTerm) ||
        project.technologies.some((tech) =>
          tech.name.toLowerCase().includes(searchTerm)
        )
    );

    this.renderFilteredProjects(filteredProjects);
  }

  renderFilteredProjects(projects) {
    if (!this.container) return;

    this.container.innerHTML = "";

    projects.forEach((project, index) => {
      const projectElement = this.createProjectCard(project, index);
      this.container.appendChild(projectElement);
    });

    this.initializeInteractions();
  }

  // Method to get project by ID
  getProject(id) {
    return this.projects.find((project) => project.id === id);
  }

  // Method to get all categories
  getCategories() {
    return [...new Set(this.projects.map((project) => project.category))];
  }

  // Method to get featured projects
  getFeaturedProjects() {
    return this.projects.filter((project) => project.featured);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.projectRenderer = new ProjectRenderer();
  window.projectRenderer
    .init()
    .then(() => {
      console.log("Projects loaded successfully");
    })
    .catch((error) => {
      console.error("Failed to load projects:", error);
    });
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = ProjectRenderer;
}
