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

	const filterContainer = document.createElement("div");
	filterContainer.classList.add("filter-container");
	projectsList.before(filterContainer);

	let allRepos = [];

	function renderProjects(repos, language = "all") {
		projectsList.innerHTML = "";
		const filtered =
			language === "all"
				? repos
				: repos.filter((repo) => repo.language === language);

		if (filtered.length === 0) {
			projectsList.innerHTML = "<p>No projects found.</p>";
			return;
		}

		filtered.forEach((repo) => {
			const card = document.createElement("a");
			card.href = repo.html_url;
			card.target = "_blank";
			card.classList.add("github-card");
			card.setAttribute("aria-label", repo.name);
			card.innerHTML = `
				<h3 style="margin-bottom: 5px; color: #e83e8c;">${repo.name}</h3>
				<p style="font-size: 14px; color: #555;">${
					repo.description || "No description provided."
				}</p>
				<div style="font-size: 13px; color: #777;">⭐ ${repo.stargazers_count} | 🍴 ${
				repo.forks_count
			} | 📅 Updated: ${new Date(repo.updated_at).toLocaleDateString()}</div>
			`;
			projectsList.appendChild(card);
		});
	}

	fetchData(
		`https://api.github.com/users/${githubUsername}/repos`,
		(data) => {
			allRepos = data;
			const uniqueLangs = new Set([
				"All",
				...data.map((r) => r.language).filter(Boolean),
			]);

			uniqueLangs.forEach((lang) => {
				const btn = document.createElement("button");
				btn.textContent = `${lang} (${
					data.filter((r) => r.language === lang).length || data.length
				})`;
				btn.classList.add("filter-btn");
				btn.dataset.lang = lang.toLowerCase();

				btn.addEventListener("click", () => {
					document
						.querySelectorAll(".filter-btn")
						.forEach((b) => b.classList.remove("active"));
					btn.classList.add("active");
					renderProjects(allRepos, lang === "All" ? "all" : lang);
				});

				filterContainer.appendChild(btn);
			});

			renderProjects(data);
			document.querySelector(".filter-btn").classList.add("active");
		},
		(error) => {
			projectsList.innerHTML = "Failed to load projects.";
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

	fetchData(
		`https://registry.npmjs.org/-/v1/search?text=maintainer:${username}&size=20`,
		(data) => {
			const packages = data.objects;
			if (!packages.length) {
				npmListContainer.innerHTML = "<p>No packages found.</p>";
				return;
			}
			const list = document.createElement("div");
			list.classList.add("projects-grid");

			packages.forEach((pkg) => {
				const card = document.createElement("a");
				card.href = `https://www.npmjs.com/package/${pkg.package.name}`;
				card.target = "_blank";
				card.classList.add("github-card");
				card.setAttribute("aria-label", pkg.package.name);
				card.innerHTML = `
					<h3 style="margin-bottom: 5px; color: #e83e8c;">${pkg.package.name}</h3>
					<p style="font-size: 14px; color: #555;">${
						pkg.package.description || "No description available."
					}</p>
					<div style="font-size: 13px; color: #777;">📦 v${
						pkg.package.version
					} | ⏱️ Updated: ${new Date(
					pkg.package.date
				).toLocaleDateString()}</div>
				`;
				list.appendChild(card);
			});

			npmListContainer.innerHTML = "";
			npmListContainer.appendChild(list);
		},
		(err) => {
			npmListContainer.innerHTML = "Failed to load NPM packages.";
			console.error("NPM Fetch Error:", err);
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
		if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
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
