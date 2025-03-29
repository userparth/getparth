// Force restyle all dynamic cards
document.querySelectorAll(".github-card").forEach((card) => {
	card.classList.toggle("dark-card", isDark);
});
// =========================
// TOAST NOTIFICATION
// =========================
function showToast(message) {
	const toast = document.createElement("div");
	toast.textContent = message;
	toast.style =
		"position:fixed;bottom:30px;right:30px;background:#333;color:#fff;padding:10px 20px;border-radius:8px;z-index:10000;";
	document.body.appendChild(toast);
	setTimeout(() => toast.remove(), 3000);
}

// =========================
// LAZY LOAD OBSERVER WRAPPER
// =========================
function lazyLoadSection(selector, callback) {
	const target = document.querySelector(selector);
	if (!target) return;
	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				callback();
				observer.disconnect();
			}
		});
	});
	observer.observe(target);
}

// =========================
// FETCH WRAPPER
// =========================
function fetchData(url, onSuccess, onError) {
	fetch(url)
		.then((res) => res.json())
		.then(onSuccess)
		.catch(onError);
}

// =========================
// GITHUB PROJECTS
// =========================
function setupGitHubProjects() {
	const githubUsername = "userparth";
	const projectsList = document.getElementById("projects-list");
	if (!projectsList) return;

	projectsList.classList.add("projects-grid");

	fetchData(
		`https://api.github.com/users/${githubUsername}/repos`,
		(repos) => {
			projectsList.innerHTML = "";

			repos.forEach((repo) => {
				const card = document.createElement("div");
				card.className = "github-card";
				card.innerHTML = `
          <div class="card-header">
            <span class="type-icon">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub Logo" />
            </span>
            <a href="${
							repo.html_url
						}" class="external-icon" target="_blank" rel="noopener">
              <i class="fas fa-arrow-up-right-from-square"></i>
            </a>
          </div>
          <div class="project-title">${repo.name}</div>
          <a class="project-link" href="${repo.html_url}" target="_blank">${
					repo.html_url
				}</a>
          <div class="last-edited">Edited ${new Date(
						repo.updated_at
					).toLocaleDateString()}</div>
          <hr />
          <div class="button-group">
            <button class="btn primary-btn">Guide editor</button>
            <button class="btn secondary-btn">Dashboard</button>
          </div>
        `;
				projectsList.appendChild(card);
			});
		},
		(error) => {
			projectsList.innerHTML = "<p>Failed to load GitHub projects.</p>";
			console.error("GitHub Fetch Error:", error);
		}
	);
}

// =========================
// NPM PACKAGES
// =========================
function setupNpmPackages() {
	const username = "userparth";
	const npmListContainer = document.getElementById("npm-packages-list");
	if (!npmListContainer) return;

	npmListContainer.classList.add("projects-grid");

	fetchData(
		`https://registry.npmjs.org/-/v1/search?text=maintainer:${username}&size=20`,
		(data) => {
			const packages = data.objects;
			npmListContainer.innerHTML = "";

			packages.forEach((pkg) => {
				const card = document.createElement("div");
				card.className = "github-card";
				card.innerHTML = `
          <div class="card-header">
            <span class="type-icon">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/npm.svg" alt="NPM Logo" />
            </span>
            <a href="https://www.npmjs.com/package/${
							pkg.package.name
						}" class="external-icon" target="_blank" rel="noopener">
              <i class="fas fa-arrow-up-right-from-square"></i>
            </a>
          </div>
          <div class="project-title">${pkg.package.name}</div>
          <a class="project-link" href="https://www.npmjs.com/package/${
						pkg.package.name
					}" target="_blank">
            npmjs.com/package/${pkg.package.name}
          </a>
          <div class="last-edited">Edited ${new Date(
						pkg.package.date
					).toLocaleDateString()}</div>
          <hr />
          <div class="button-group">
            <button class="btn primary-btn">Guide editor</button>
            <button class="btn secondary-btn">Dashboard</button>
          </div>
        `;
				npmListContainer.appendChild(card);
			});
		},
		(error) => {
			npmListContainer.innerHTML = "<p>Failed to load NPM packages.</p>";
			console.error("NPM Fetch Error:", error);
		}
	);
}

// =========================
// RESUME MODAL & UI EVENTS
// =========================
document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("section").forEach((el, i) => {
		el.classList.add("fade-in-up");
		el.style.animationDelay = `${i * 0.2}s`;
	});

	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute("href"));
			target?.scrollIntoView({ behavior: "smooth" });
		});
	});

	const darkModeToggle = document.getElementById("dark-mode-toggle");
	const savedDark = localStorage.getItem("dark-mode") === "enabled";
	document.body.classList.toggle("dark-mode", savedDark);
	if (darkModeToggle) {
		darkModeToggle.textContent = savedDark ? "🌞" : "🌙";
		darkModeToggle.addEventListener("click", () => {
			const isDark = document.body.classList.toggle("dark-mode");
			localStorage.setItem("dark-mode", isDark ? "enabled" : "disabled");
			darkModeToggle.textContent = isDark ? "🌞" : "🌙";
			document.querySelectorAll(".github-card").forEach((card) => {
				card.style.background = isDark ? "#222" : "#f5f5f5";
				card.style.color = isDark ? "white" : "#333";
				card.style.borderColor = isDark ? "#444" : "#ccc";
			});
		});
	}

	// Hamburger toggle
	const menuToggle = document.getElementById("hamburger-menu");
	const navLinks = document.querySelector(".nav-links");
	menuToggle?.addEventListener("click", () =>
		navLinks?.classList.toggle("show")
	);
	document.addEventListener("click", (e) => {
		if (
			menuToggle &&
			navLinks &&
			!menuToggle.contains(e.target) &&
			!navLinks.contains(e.target)
		) {
			navLinks.classList.remove("show");
		}
	});

	// Resume modal
	const modal = document.getElementById("resume-modal");
	const closeModal = document.querySelector(".modal-close");
	document.querySelectorAll(".resume-btn").forEach((btn) =>
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			modal.classList.add("show");
		})
	);
	closeModal?.addEventListener("click", () => modal.classList.remove("show"));
	window.addEventListener(
		"keydown",
		(e) => e.key === "Escape" && modal.classList.remove("show")
	);
	modal?.addEventListener(
		"click",
		(e) => e.target === modal && modal.classList.remove("show")
	);

	// Fun Fact
	const aboutSection = document.getElementById("about");
	aboutSection?.addEventListener("mouseover", function handler() {
		aboutSection.innerHTML +=
			"<p class='fun-fact'>Fun Fact: I built my first full-stack application at the age of 16! 🚀</p>";
		aboutSection.removeEventListener("mouseover", handler);
	});

	// Konami code Easter egg
	let konamiCode = [];
	const konamiSequence = [
		"ArrowUp",
		"ArrowUp",
		"ArrowDown",
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"ArrowLeft",
		"ArrowRight",
		"b",
		"a",
	];
	document.addEventListener("keydown", function (event) {
		konamiCode.push(event.key);
		if (konamiCode.length > konamiSequence.length) konamiCode.shift();
		if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
			showToast("Konami Code Activated! You are a true explorer! 🚀");
			document.body.style.backgroundColor = "#000";
			document.body.style.color = "#0f0";
		}
	});

	// GitHub Heatmap
	const calendarWrapper = document.createElement("div");
	calendarWrapper.className = "github-calendar-wrapper";
	const calendarDiv = document.createElement("div");
	calendarDiv.className = "calendar";
	calendarDiv.textContent = "Loading GitHub activity...";
	calendarWrapper.appendChild(calendarDiv);

	const githubHeading = document.querySelector("#github-projects h2");
	githubHeading?.parentNode?.insertBefore(
		calendarWrapper,
		githubHeading.nextSibling
	);

	const interval = setInterval(() => {
		if (typeof GitHubCalendar !== "undefined") {
			GitHubCalendar(".calendar", "userparth", { responsive: true });
			clearInterval(interval);
			setTimeout(() => {
				document
					.querySelectorAll(".calendar .contrib-column")
					.forEach((el) => el.remove());
				const scrollWrapper = document.querySelector(
					".calendar [style*='overflow-x: auto']"
				);
				if (scrollWrapper) scrollWrapper.scrollLeft = scrollWrapper.scrollWidth;
			}, 20);
		}
	}, 10);

	// Lazy load GitHub/NPM
	lazyLoadSection("#github-projects", setupGitHubProjects);
	lazyLoadSection("#npm-packages", setupNpmPackages);

	// Console message
	console.log(
		"%cYou found a hidden message! 🚀 Want to collaborate? Reach out at userparth@gmail.com!",
		"color: cyan; font-size: 16px;"
	);
});

document.querySelectorAll(".project-actions button").forEach((btn) => {
	btn.addEventListener("click", () => {
		alert("Add your custom action here");
	});
});
