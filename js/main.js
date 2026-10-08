const agNavigation = [
  ["Home", "index.html"],
  ["About", "about.html"],
  ["Services", "services.html"],
  ["Projects", "projects.html"],
  ["2D/3D Design", "design.html"],
  ["BIM", "bim.html"],
  ["Gallery", "gallery.html"],
  ["Blog", "blog.html"],
  ["Contact", "contact.html"]
];

const pageName = location.pathname.split("/").pop() || "index.html";

if (!window.Capacitor?.isNativePlatform?.()) {
  const manifestLink = document.createElement("link");
  manifestLink.rel = "manifest";
  manifestLink.href = "manifest.webmanifest";
  document.head.appendChild(manifestLink);

  if ("serviceWorker" in navigator && window.isSecureContext) {
    navigator.serviceWorker.register("sw.js")
      .catch(error => console.error("Unable to register the A.G. Associates offline service worker", error));
  }
}

if (window.Capacitor?.isNativePlatform?.()) {
  const adLoader = document.createElement("script");
  adLoader.src = "js/admob.js";
  adLoader.defer = true;
  document.head.appendChild(adLoader);
}

document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.removeAttribute("pattern");
  input.addEventListener("input", () => {
    const isValid = /^[+0-9 ()-]{8,20}$/.test(input.value);
    input.setCustomValidity(input.value && !isValid ? "Enter a valid phone number." : "");
  });
});

const header = document.getElementById("site-header");
if (header) {
  const links = agNavigation.map(([label, url]) => `
    <li class="nav-item">
      <a class="nav-link ${pageName === url ? "active" : ""}" href="${url}">${label}</a>
    </li>`).join("");

  header.innerHTML = `
    <nav class="site-nav navbar navbar-expand-lg">
      <div class="container nav-inner">
        <a class="brand-lockup" href="index.html" aria-label="A.G. Associates home">
          <span class="brand-mark">A.G.</span>
          <span class="brand-text"><strong>A.G. Associates</strong><small>Architectural Design &amp; Civil Construction</small></span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavigation" aria-controls="mainNavigation" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="mainNavigation">
          <ul class="navbar-nav align-items-lg-center">${links}
            <li class="nav-item ms-lg-2"><a class="nav-link nav-quote" href="quote.html">Get a quote ↗</a></li>
          </ul>
        </div>
      </div>
    </nav>`;
}

const footer = document.getElementById("site-footer");
if (footer) {
  footer.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <a class="brand-lockup" href="index.html">
              <span class="brand-mark">A.G.</span>
              <span class="brand-text"><strong>A.G. Associates</strong><small>Architectural Design &amp; Civil Construction</small></span>
            </a>
            <p>Thoughtful spaces, carefully engineered. An architecture and civil engineering practice for projects with purpose.</p>
          </div>
          <div class="footer-col">
            <h3>Explore</h3><a href="about.html">About us</a><a href="services.html">Our services</a>
            <a href="projects.html">Projects</a><a href="team.html">Our team</a><a href="testimonials.html">Testimonials</a>
          </div>
          <div class="footer-col">
            <h3>Expertise</h3><a href="design.html">2D/3D design</a><a href="bim.html">BIM services</a>
            <a href="floor-plans.html">Floor plans</a><a href="gallery.html">Gallery</a><a href="blog.html">Journal</a>
          </div>
          <div class="footer-col">
            <h3>Get in touch</h3><a href="contact.html">Mande, Maharashtra, India</a>
            <a href="tel:+919284454150">+91 92844 54150</a><a href="mailto:hello@agassociates.in">hello@agassociates.in</a>
            <a href="quote.html">Request a quote ↗</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} A.G. Associates. All rights reserved.</span>
          <span>Designed with care · <a href="admin/login.html">Admin</a></span>
        </div>
      </div>
    </footer>
    <a class="whatsapp-float" href="https://wa.me/919284454150" target="_blank" rel="noopener" aria-label="Chat with A.G. Associates on WhatsApp"><span aria-hidden="true" style="font-size:12px;font-weight:700;letter-spacing:0">WA</span></a>`;
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".service-feature,.project-card,.process-grid>div,.team-card,.article-card,.gallery-tile")
    .forEach(item => {
      item.classList.add("reveal");
      revealObserver.observe(item);
    });

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || "";
      const start = performance.now();
      const duration = 1200;

      function animate(now) {
        const progress = Math.min((now - start) / duration, 1);
        element.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3))) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      countObserver.unobserve(element);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll("[data-count]").forEach(element => countObserver.observe(element));
} else {
  document.querySelectorAll("[data-count]").forEach(element => {
    element.textContent = element.dataset.count + (element.dataset.suffix || "");
  });
}

document.querySelectorAll("form[data-local-form]").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    try {
      const key = form.dataset.localForm;
      const records = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(records)) throw new Error(`Stored ${key} value is not a list`);

      const record = {};
      for (const [name, value] of new FormData(form).entries()) {
        const storedValue = value instanceof File
          ? (value.name ? { name: value.name, size: value.size, type: value.type } : "")
          : value;
        if (Object.prototype.hasOwnProperty.call(record, name)) {
          record[name] = Array.isArray(record[name])
            ? [...record[name], storedValue]
            : [record[name], storedValue];
        } else {
          record[name] = storedValue;
        }
      }

      record.submittedAt = new Date().toISOString();
      records.unshift(record);
      localStorage.setItem(key, JSON.stringify(records));
      form.reset();
      agToast("Thank you. Your request has been saved in this browser demo.");
    } catch (error) {
      console.error("Unable to save form submission", error);
      agToast("We couldn’t save this request in browser storage. Please contact us by phone or email.");
    }
  });
});

function agToast(message) {
  let toast = document.querySelector(".toast-message");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-message";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3600);
}
