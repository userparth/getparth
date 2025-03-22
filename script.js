// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();
		const targetElement = document.querySelector(this.getAttribute("href"));
		if (targetElement) {
			targetElement.scrollIntoView({ behavior: "smooth" });
		}
	});
});

function showToast(message) {
	const toast = document.createElement("div");
	toast.textContent = message;
	toast.style =
		"position:fixed;bottom:30px;right:30px;background:#333;color:#fff;padding:10px 20px;border-radius:8px;z-index:10000;";
	document.body.appendChild(toast);
	setTimeout(() => toast.remove(), 3000);
}

// Apply Dark Mode Styles to GitHub Cards
function applyDarkModeToGitHubCards() {
	const isDarkMode = document.body.classList.contains("dark-mode");
	document.querySelectorAll(".github-card").forEach((card) => {
		card.style.background = isDarkMode ? "#222" : "#f5f5f5";
		card.style.color = isDarkMode ? "white" : "#333";
		card.style.borderColor = isDarkMode ? "#444" : "#ccc";
	});
}

// Ensure GitHub Projects Update on Dark Mode Toggle
document
	.getElementById("dark-mode-toggle")
	.addEventListener("click", function () {
		document.body.classList.toggle("dark-mode");
		localStorage.setItem(
			"dark-mode",
			document.body.classList.contains("dark-mode") ? "enabled" : "disabled"
		);
		applyDarkModeToGitHubCards();
	});

function setupGitHubProjects() {
	const githubUsername = "userparth";
	const projectsList = document.getElementById("projects-list");

	// ✅ Ensure projects container uses grid layout
	projectsList.classList.add("projects-grid");

	// ✅ Create the filter container
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
			card.style = `
                display: block;
                border: 1px solid #ccc;
                padding: 15px;
                border-radius: 8px;
                background: #f5f5f5;
                text-decoration: none;
                color: inherit;
                transition: transform 0.2s;
            `;
			card.onmouseover = () => (card.style.transform = "scale(1.02)");
			card.onmouseout = () => (card.style.transform = "scale(1)");

			card.innerHTML = `
                <h3 style="margin: 0 0 5px 0; color: #007bff;">${repo.name}</h3>
                <p style="margin: 5px 0 10px 0; font-size: 14px; color: #555;">
                    ${repo.description || "No description provided."}
                </p>
                <div style="font-size: 13px; color: #777;">
                    ⭐ ${repo.stargazers_count} | 🍴 ${
				repo.forks_count
			} | 📅 Updated: ${new Date(repo.updated_at).toLocaleDateString()}
                </div>
            `;
			projectsList.appendChild(card);
		});
	}

	// ✅ Fetch GitHub repos
	fetch(`https://api.github.com/users/${githubUsername}/repos`)
		.then((response) => response.json())
		.then((data) => {
			allRepos = data;
			const uniqueLangs = new Set([
				"All",
				...data.map((repo) => repo.language).filter(Boolean),
			]);

			// ✅ Create filter buttons dynamically
			uniqueLangs.forEach((lang) => {
				const btn = document.createElement("button");
				btn.textContent = `${lang} (${
					data.filter((repo) => repo.language === lang).length || data.length
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

			// ✅ Render all projects initially & set "All" as active
			renderProjects(data);
			document.querySelector(".filter-btn").classList.add("active");
		})
		.catch((error) => {
			projectsList.innerHTML = "Failed to load projects.";
			console.error("GitHub Fetch Error:", error);
		});
}

// Initialize after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
	const darkModeToggle = document.getElementById("dark-mode-toggle");

	// Load dark mode preference
	if (localStorage.getItem("dark-mode") === "enabled") {
		document.body.classList.add("dark-mode");
	}

	function updateDarkModeUI(enabled) {
		document.body.classList.toggle("dark-mode", enabled);
		localStorage.setItem("dark-mode", enabled ? "enabled" : "disabled");

		// Optional: animated emoji toggle
		darkModeToggle.textContent = enabled ? "🌞" : "🌙";

		// Update GitHub card styles if they exist
		document.querySelectorAll(".github-card").forEach((card) => {
			card.style.background = enabled ? "#222" : "#f5f5f5";
			card.style.color = enabled ? "white" : "#333";
			card.style.borderColor = enabled ? "#444" : "#ccc";
		});
	}

	// Load preference on first load
	const savedDarkMode = localStorage.getItem("dark-mode") === "enabled";
	updateDarkModeUI(savedDarkMode);

	// Toggle on click
	darkModeToggle.addEventListener("click", () => {
		const isDark = document.body.classList.contains("dark-mode");
		updateDarkModeUI(!isDark);
	});

	// Optionally keep this D-key toggle
	document.addEventListener("keydown", function (event) {
		if (event.key.toLowerCase() === "d") {
			const isDark = document.body.classList.contains("dark-mode");
			updateDarkModeUI(!isDark);
		}
	});

	const menuToggle = document.getElementById("hamburger-menu");
	const navLinks = document.querySelector(".nav-links");

	// Nav Links: auto close on click (for mobile)
	document.querySelectorAll(".nav-links a").forEach((link) => {
		link.addEventListener("click", () => {
			navLinks.classList.remove("show");
		});
	});
	// Toggle dark mode (button)
	// darkModeToggle.addEventListener("click", function () {
	// 	const enabled = document.body.classList.toggle("dark-mode");
	// 	localStorage.setItem("dark-mode", enabled ? "enabled" : "disabled");
	// });

	// Hamburger Menu Toggle
	menuToggle.addEventListener("click", function () {
		navLinks.classList.toggle("show");
	});

	// Close mobile nav when clicking outside
	document.addEventListener("click", function (event) {
		if (
			!menuToggle.contains(event.target) &&
			!navLinks.contains(event.target)
		) {
			navLinks.classList.remove("show");
		}
	});

	const resumeBtn = document.querySelector(".resume-btn");
	const modal = document.getElementById("resume-modal");
	const closeModal = document.querySelector(".modal-close");

	if (resumeBtn && modal && closeModal) {
		resumeBtn.addEventListener("click", (e) => {
			e.preventDefault();
			modal.classList.add("show");
		});

		closeModal.addEventListener("click", () => {
			modal.classList.remove("show");
		});

		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape") modal.classList.remove("show");
		});

		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.classList.remove("show");
		});
	}

	// Enhanced GitHub Projects Grid
	setupGitHubProjects();

	// Easter Egg: Hover About for Fun Fact
	const aboutSection = document.getElementById("about");
	if (aboutSection) {
		aboutSection.addEventListener("mouseover", function handler() {
			aboutSection.innerHTML +=
				"<p class='fun-fact'>Fun Fact: I built my first full-stack application at the age of 16! 🚀</p>";
			aboutSection.removeEventListener("mouseover", handler);
		});
	}
});

// Easter Egg: Profile Click
const profileImg = document.getElementById("profile-img");
if (profileImg) {
	profileImg.addEventListener("click", function () {
		showToast("You found the hidden Easter Egg! 🎉 Keep exploring!");
	});
}

// Easter Egg: Konami Code
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
	if (konamiCode.length > konamiSequence.length) {
		konamiCode.shift();
	}
	if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
		showToast("Konami Code Activated! You are a true explorer! 🚀");
		document.body.style.backgroundColor = "#000";
		document.body.style.color = "#0f0";
	}
});

// Secret Console Message
console.log(
	"%cYou found a hidden message! 🚀 Want to collaborate? Reach out at userparth@gmail.com!",
	"color: cyan; font-size: 16px;"
);
