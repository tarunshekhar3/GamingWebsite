
// Helper to fix relative paths when loading content from other directories/files
function fixPaths(container, baseUrl) {
    const prefix = baseUrl.includes("games/") ? "games/" : (baseUrl.includes("blogs/") ? "blogs/" : "");
    if (!prefix) return;

    // Fix images
    container.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http") && !src.startsWith("/") && !src.startsWith(prefix)) {
            img.setAttribute("src", prefix + src);
        }
    });

    // Fix inline styles with url()
    container.querySelectorAll("[style*='url']").forEach((el) => {
        let style = el.getAttribute("style");
        // Regex to find url('...') or url("...") or url(...)
        // We prepend the prefix to the path inside url
        style = style.replace(/url\(['"]?([^)'"]+)['"]?\)/g, (match, url) => {
            if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) return match;
            return `url('${prefix}${url}')`;
        });
        el.setAttribute("style", style);
    });
}

// Global reveal init function (exposed from main.js or re-defined here if needed, but better to trigger event)
function reInitAnimations() {
    // Dispatch a custom event that main.js can listen to
    window.dispatchEvent(new Event("contentChanged"));
}

document.addEventListener("DOMContentLoaded", () => {
    const appContent = document.getElementById("app-content");

    // Handle Navigation Links
    document.body.addEventListener("click", (e) => {
        // Traverse up to find anchor tag
        const link = e.target.closest("a");

        // Only intercept if it's a local link and marked with route-link OR it's a known internal path
        if (link && link.href.startsWith(window.location.origin)) {
            const href = link.getAttribute("href");

            // Ignore anchor hashes on the same page
            if (href.startsWith("#")) return;

            // Ignore login page
            if (href.includes("login/login.html")) return;

            // CRITICAL: If on file protocol, fetch will fail due to CORS.
            // We can try to fetch, but we MUST fallback if it fails.
            // Or simpler: just don't intercept if on file:
            if (window.location.protocol === "file:") {
                return; // Allow default navigation (reload)
            }

            e.preventDefault();
            loadRoute(href);
        }
    });

    // Handle Back/Forward
    window.addEventListener("popstate", (e) => {
        if (e.state && e.state.path) {
            loadRoute(e.state.path, false);
        } else {
            location.reload();
        }
    });

    async function loadRoute(path, pushState = true) {
        try {
            // Fetch the page
            const response = await fetch(path);
            if (!response.ok) throw new Error("Network response was not ok");
            const html = await response.text();

            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Extract content
            // Strategy: Try to find #app-content (if we standardized it),
            // or fallback to 'body > section' elements.
            // For games/index.html: it has <section class="section">...

            let newContent = "";

            // Case 1: If the loaded page is also our SPA shell (unlikely unless full reload happening),
            // but if we are loading 'games/index.html', it's a regular page.

            // specialized extraction based on known pages
            // specialized extraction based on known pages
            if (path.includes("games/index.html")) {
                const validContainer = doc.getElementById("app-content");
                if (validContainer) {
                    newContent = validContainer.innerHTML;
                } else {
                    // Fallback to old selector if structure differs
                    const sections = doc.querySelectorAll("body > section");
                    sections.forEach(sec => newContent += sec.outerHTML);
                }

                // Also might need to inject page-specific CSS? 
                if (!document.querySelector(`link[href*="gamestyle.css"]`)) {
                    const link = document.createElement("link");
                    link.rel = "stylesheet";
                    // Fix relative path based on current location
                    const cssPath = window.location.pathname.includes("blogs/") ? "../games/css/gamestyle.css" : "games/css/gamestyle.css";
                    link.href = cssPath;
                    document.head.appendChild(link);
                }
                // Inject Owl Carousel CSS if needed
                if (!document.querySelector(`link[href*="owl.carousel.min.css"]`)) {
                    const link1 = document.createElement("link");
                    link1.rel = "stylesheet";
                    link1.href = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css";
                    document.head.appendChild(link1);
                    const link2 = document.createElement("link");
                    link2.rel = "stylesheet";
                    link2.href = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css";
                    document.head.appendChild(link2);
                }

            } else if (path.includes("blogs/blogs.html")) {
                const validContainer = doc.getElementById("app-content");
                if (validContainer) {
                    newContent = validContainer.innerHTML;
                } else {
                    const sections = doc.querySelectorAll("body > section");
                    sections.forEach(sec => newContent += sec.outerHTML);
                }
                const styles = doc.querySelectorAll("style");
                styles.forEach(s => newContent += s.outerHTML);

            } else if (path.endsWith("index.html") || path.endsWith("/") || path.includes("index.html")) {
                // Try to find app-content or specific ID
                const validContainer = doc.getElementById("app-content");
                if (validContainer) {
                    newContent = validContainer.innerHTML;
                } else {
                    // fallback extraction for home if it was not wrapped (should be now)
                    const banner = doc.querySelector(".banner");
                    if (banner) newContent += banner.outerHTML;
                    const sections = doc.querySelectorAll("body > section");
                    sections.forEach(sec => newContent += sec.outerHTML);
                }
            }

            // Update DOM
            if (newContent) {
                // Fade out effect? (Optional)
                appContent.innerHTML = newContent;

                // Post-processing
                fixPaths(appContent, path);

                // Scroll to top
                window.scrollTo(0, 0);

                // Re-trigger animations
                reInitAnimations();

                // Push State
                if (pushState) {
                    window.history.pushState({ path }, "", path);
                }
            } else {
                // If no content found, fallback
                throw new Error("No content extracted");
            }

        } catch (err) {
            console.error("Navigation error, falling back to normal load:", err);
            // FALLBACK: If SPA fails (e.g. CORS, 404), load the page normally
            window.location.assign(path);
        }
    }
});

