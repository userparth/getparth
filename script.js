// Force restyle all dynamic cards
document.querySelectorAll(".github-card").forEach((card) => {
	//card.classList.toggle("dark-card", isDark);
	card.style.background = isDark ? "#222" : "#f5f5f5";
	card.style.color = isDark ? "white" : "#333";
	card.style.borderColor = isDark ? "#444" : "#ccc";
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
			if (entry.isIntersecting || window.innerWidth < 640) {
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
// ScrollButtons PROJECTS
// =========================
function setupScrollButtons(containerId) {
	const container = document.getElementById(containerId);
	if (!container || window.innerWidth < 640) return;

	const scrollWrapper = container.parentElement;
	const leftBtn = scrollWrapper.querySelector(".scroll-btn.left");
	const rightBtn = scrollWrapper.querySelector(".scroll-btn.right");

	const updateButtonVisibility = () => {
		const scrollLeft = container.scrollLeft;
		const maxScrollLeft = container.scrollWidth - container.clientWidth;

		const totalCards = container.children.length;

		if (totalCards <= 1) {
			leftBtn.style.display = "none";
			rightBtn.style.display = "none";
			return;
		}

		leftBtn.style.display = scrollLeft > 10 ? "flex" : "none";
		rightBtn.style.display = scrollLeft < maxScrollLeft - 10 ? "flex" : "none";
	};

	setTimeout(updateButtonVisibility, 100);
	container.addEventListener("scroll", updateButtonVisibility);

	leftBtn?.addEventListener("click", () => {
		container.scrollBy({ left: -300, behavior: "smooth" });
	});

	rightBtn?.addEventListener("click", () => {
		container.scrollBy({ left: 300, behavior: "smooth" });
	});
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
					<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub Logo" class="gh-icon" />
					</span>
					<div class="card-title-group">
					<div class="project-title">${repo.name}</div>
					<a href="${
						repo.html_url
					}" class="external-icon" target="_blank" rel="noopener" aria-label="Open on GitHub">
						<i class="fas fa-arrow-up-right-from-square"></i>
					</a>
					</div>
				</div>
				<a class="project-link" href="${repo.html_url}" target="_blank">${
					repo.html_url
				}</a>
				<div class="last-edited">Edited ${new Date(
					repo.updated_at
				).toLocaleDateString()}</div>
					<!--<hr />
					<div class="button-group">
					<button class="btn primary-btn">Guide editor</button>
					<button class="btn secondary-btn">Dashboard</button>
					</div>-->
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

				const name = pkg.package.name;
				const url = `https://www.npmjs.com/package/${name}`;
				const lastUpdated = new Date(pkg.package.date).toLocaleDateString();
				card.innerHTML = `
					<div class="card-header">
						<span class="type-icon">
							<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/npm.svg" alt="NPM Logo" class="gh-icon" />
						</span>
						<div class="card-title-group">
							<div class="project-title">${name}</div>
							<a href="${url}" class="external-icon" target="_blank" rel="noopener" aria-label="Open on NPM">
								<i class="fas fa-arrow-up-right-from-square"></i>
							</a>
						</div>
					</div>
					<a class="project-link" href="${url}" target="_blank">${url}</a>
					<div class="last-edited">Last updated ${lastUpdated}</div>
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
// MEDIUM BLOGS
// =========================
function setupMediumBlogs() {
	const mediumUsername = "getparth"; // Replace with your Medium username
	const blogList = document.getElementById("blogs-list");

	// Proxy: Medium doesn't offer public API, so we fetch via RSS to JSON API
	const feedUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUsername}`;

	fetchData(
		feedUrl,
		(data) => {
			if (!data.items || data.items.length === 0) {
				blogList.innerHTML = "<p>No blog posts found.</p>";
				return;
			}
			blogList.innerHTML = "";

			data.items.slice(0, 6).forEach((post) => {
				const card = document.createElement("div");
				card.className = "github-card";

				const match = post.description.match(/<img[^>]+src="([^">]+)"/i);
				const image = match
					? match[1]
					: "https://cdn-icons-png.flaticon.com/512/5968/5968906.png";

				const snippet =
					post.description
						.replace(/<[^>]*>?/gm, "")
						.replace(/\s+/g, " ")
						.trim()
						.slice(0, 120) + "...";

				const tags = post.categories
					.slice(0, 4) // limit to 4 tags
					.map((tag) => `<span>${tag}</span>`)
					.join("");

				card.innerHTML = `
						<div class="card-header">
							<span class="type-icon">
								<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/medium.svg" alt="Medium Logo" class="gh-icon" />
							</span>
							<div class="card-title-group">
								<div class="project-title">${post.title}</div>
								<a href="${
									post.link
								}" class="external-icon" target="_blank" rel="noopener" aria-label="Read blog">
									<i class="fas fa-arrow-up-right-from-square"></i>
								</a>
							</div>
						</div>
						<img src="${image}" alt="${post.title}" class="blog-thumbnail" loading="lazy" />
						<p>${snippet}</p>
						<div class="last-edited">Published ${new Date(
							post.pubDate
						).toLocaleDateString()}</div>
						<div class="stack-tags">${tags}</div>
				`;
				blogList.appendChild(card);
			});
		},
		(error) => {
			blogList.innerHTML = "<p>Failed to load blogs.</p>";
			console.error("Blog Fetch Error:", error);
		}
	);
}

// =========================
// RESUME MODAL & UI EVENTS
// =========================
document.addEventListener("DOMContentLoaded", () => {
	// Lazy load GitHub/NPM/Medium
	lazyLoadSection("#github-projects", () => {
		setupGitHubProjects();
		setupScrollButtons("projects-list");
	});

	lazyLoadSection("#npm-packages", () => {
		setupNpmPackages();
		setupScrollButtons("npm-packages-list");
	});

	lazyLoadSection("#blogs", () => {
		setupMediumBlogs();
		setupScrollButtons("blogs-list");
	});
	const checkbox = document.getElementById("checkbox");

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

	const html = document.documentElement;
	const body = document.body;

	// Theme Load State
	const savedTheme = localStorage.getItem("dark-mode");
	const enableDark = () => {
		body.classList.add("dark-mode");
		html.classList.add("dark");
		localStorage.setItem("dark-mode", "enabled");
	};
	const disableDark = () => {
		body.classList.remove("dark-mode");
		html.classList.remove("dark");
		localStorage.setItem("dark-mode", "disabled");
	};
	if (savedTheme === "enabled") enableDark();

	// Toggle Button
	if (savedTheme === "enabled") {
		enableDark();
		checkbox.checked = true;
	} else {
		checkbox.checked = false;
	}

	checkbox.addEventListener("change", () => {
		if (checkbox.checked) {
			enableDark();
		} else {
			disableDark();
		}
	});

	// Keyboard Shortcut: Ctrl+J
	document.addEventListener("keydown", (e) => {
		if (e.key.toLowerCase() === "d") {
			e.preventDefault();
			const isDark = body.classList.contains("dark-mode");
			if (isDark) {
				disableDark();
				checkbox.checked = false;
			} else {
				enableDark();
				checkbox.checked = true;
			}
		}
	});

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
	// calendarWrapper.className = "github-calendar-wrapper";
	// const calendarDiv = document.createElement("div");
	// calendarDiv.className = "calendar";
	// calendarDiv.textContent = "Loading GitHub activity...";
	// calendarWrapper.appendChild(calendarDiv);

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

	// Console message
	console.log(
		"%cYou found a hidden message! 🚀 Want to collaborate? Reach out at userparth@gmail.com!",
		"color: cyan; font-size: 16px;"
	);

	const nav = document.getElementById("main-nav");

	// Create a marker right above the navbar
	const marker = document.createElement("div");
	marker.style.position = "absolute";
	marker.style.top = `${nav.offsetTop}px`;
	marker.style.height = "1px";
	marker.id = "nav-trigger";
	nav.parentNode.insertBefore(marker, nav);

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) {
				nav.classList.add("sticky");
			} else {
				nav.classList.remove("sticky");
			}
		},
		{ threshold: [0] }
	);

	observer.observe(document.getElementById("nav-trigger"));
});

document.querySelectorAll(".project-actions button").forEach((btn) => {
	btn.addEventListener("click", () => {
		alert("Add your custom action here");
	});
});
