const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "www");
const publicFiles = [
  "index.html",
  "about.html",
  "services.html",
  "projects.html",
  "project-details.html",
  "design.html",
  "bim.html",
  "floor-plans.html",
  "gallery.html",
  "team.html",
  "testimonials.html",
  "blog.html",
  "contact.html",
  "quote.html",
  "css",
  "js",
  "images",
  "admin"
];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const relativePath of publicFiles) {
  const source = path.join(root, relativePath);
  if (!fs.existsSync(source)) {
    throw new Error(`Required website file is missing: ${relativePath}`);
  }
  fs.cpSync(source, path.join(output, relativePath), { recursive: true });
}

console.log(`Prepared ${publicFiles.length} website entries in www/`);
