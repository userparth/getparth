# 🚀 – Portfolio Website

Welcome to the source of my personal portfolio, hosted at [getparth.com](https://getparth.com). This minimalist, responsive website showcases my professional journey, open-source projects, NPM packages, technical blogs, and more — built with performance, accessibility, and dark mode support in mind.

---

## 🌐 Live URL

🔗 **[https://getparth.com](https://getparth.com)**

---

## 🧐 About

This portfolio reflects my experience as an **Associate Engineering Manager** specializing in:

- Full-Stack Development (MERN)
- AI-powered Solutions
- Scalable Microservices
- DevOps on AWS/GCP

It includes:

- **Hero Section** with animated intro and avatar
- **About, Experience, Education** in structured Bento layout
- Dynamic **GitHub Projects**, **NPM Packages**, and **Medium Blogs**
- Resume viewer with **modal PDF preview and download**
- **Dark mode toggle** (persistent across sessions)
- **Konami code Easter egg** 🕽️
- Mobile-first, sticky navbar with smooth scroll behavior

---

## 🛠️ Tech Stack

- **HTML5 + CSS3** (modern bento grid + animations)
- **Vanilla JavaScript** for interactions and data fetch
- **GitHub + NPM API** for live repo and package listing
- **Responsive Layout** with CSS Grid + Media Queries
- **SEO-optimized** with OpenGraph and structured JSON-LD
- **Playwright** for automated testing

---

## 📁 Project Structure

```
├── index.html          # Main page
├── styles.css          # Complete responsive + dark-mode CSS
├── script.js           # All UI + API logic, lazy loaders, themes
├── robots.txt          # Crawler directives
├── sitemap.xml         # SEO sitemap
├── tests/
│   └── homepage.spec.js  # Playwright test suite
└── playwright.config.js  # Headless test config
```

---

## 🧪 Tests with Playwright

Run all tests with:

```bash
npx playwright test
```

Test Coverage:

- ✅ Page title and metadata
- ✅ SEO `meta` tags
- ✅ Robots.txt and sitemap availability
- ✅ Section navigation (`#about`, sticky nav)
- ⚠️ Further visual regression tests in progress

---

## 🔍 SEO Essentials

- `robots.txt` and `sitemap.xml` configured
- Canonical tag for homepage
- OpenGraph + Twitter Card metadata
- JSON-LD structured data: `Person` + `FAQPage`
- Meta keywords and author tag

---

## 💡 Unique Features

- Dynamic scroll buttons that vanish when single/edge items appear
- Medium blog parsing via RSS→JSON API
- Fun Fact popup on `#about` section hover
- Keyboard shortcut `D` toggles dark mode
- GitHub contributions calendar (auto-loaded)

---

## ⚙️ Deployment

This site is **FTP-hosted**, hence no framework or SSR dependency. Just:

1. Push files via FTP
2. Done!

> You can automate this via GitHub Actions or a local shell script.

---

## 📨 Contact

📧 **connect@getparth.com**  
🔗 [LinkedIn](https://www.linkedin.com/in/userparth/)  
🔍 [GitHub](https://github.com/userparth)

---

## 📄 License

This project is open for inspiration but **not licensed for reuse**. Reach out if you'd like a custom version or collaboration.

---

> Built with precision. Maintained with passion. Designed to inspire.
