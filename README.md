# A.G. Associates — Architecture & Civil Construction

A responsive multi-page architecture and civil engineering consultancy website built with HTML5, CSS3, JavaScript and Bootstrap 5. The first version is static and can be opened directly in a browser; its forms and admin prototype use browser `localStorage`.

## Pages

- Home, About Us, Services, Projects and Project Details
- 2D/3D Design, BIM Services, Floor Plans, Gallery and Team
- Testimonials, Blog / Articles, Contact Us and Get a Quote
- Admin Login, Dashboard, Projects, Services and Messages / Quotes

The floor-plan examples are illustrative only and are not construction drawings. Client quotes and journal articles are prototype content. Replace these, the team details, contact information and project descriptions with verified company information before publishing.

## Run in Visual Studio Code

1. Install [Visual Studio Code](https://code.visualstudio.com/) if it is not already installed.
2. Open the `architecture-website` folder in VS Code (`File` → `Open Folder…`).
3. In the Extensions view, install **Live Server** by Ritwick Dey.
4. In Explorer, right-click `index.html` and choose **Open with Live Server**. The site opens in your browser at a local address such as `http://127.0.0.1:5500`.
5. Use the sticky navigation and footer links to move between pages. To stop the server, use **Go Live** in the VS Code status bar.

You can also double-click `index.html` to open it with a `file://` URL. Live Server is recommended because it gives the site a consistent local origin for browser storage and avoids limitations some browsers apply to local files.

## Free hosting with GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`. It requests GitHub Pages enablement on its first run and publishes the static site whenever you push to `main` or `master`, or run the workflow manually. If GitHub blocks automatic enablement, enable Pages manually using **Settings → Pages → Build and deployment → Source: GitHub Actions**, then rerun the workflow from the **Actions** tab.

1. Sign in to GitHub as `ag-associates` and create a **public** repository named exactly `ag-associates.github.io`. A public repository is required for GitHub Pages on the free plan. This special repository name serves the site at the root URL.
2. In the new repository, leave **Add a README**, `.gitignore`, and license unchecked so it starts empty.
3. Open the website folder in VS Code, then open **Terminal → New Terminal**. Run these commands from the project root:

   ```powershell
   git init -b main
   git add .
   git commit -m "Add A.G. Associates website"
   git remote add origin https://github.com/ag-associates/ag-associates.github.io.git
   git push -u origin main
   ```

4. Open the repository’s **Actions** tab and wait for **Deploy static site to GitHub Pages** to finish successfully. The workflow requests Pages setup automatically. If that request is blocked, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**, then rerun the failed workflow. Your site address will be `https://shreyash3921.github.io/a.g.associates/`.
6. Later site updates go live after you commit and push them to `main`.

The project does not currently have a Git repository or GitHub remote, so it cannot be published to a public URL until you create the repository and push the files. The requested username and repository name were not found in a public GitHub account/repository search; confirm that `ag-associates` is your actual GitHub username and that it is available before creating the repository. This GitHub Pages setup hosts static frontend files only; it does not run Node.js, Express or MySQL.

**Before making the site public:** replace the sample email address, review all displayed business information, and replace placeholder copy and photos as appropriate. The admin page is only a browser-side demonstration with a public, hard-coded demo credential; it is not protected by GitHub Pages and must not be used for real admin access or confidential submissions. Quote and contact forms only save in each visitor’s browser and do not send enquiries to the company. Connect a secured backend before collecting real customer requests.

## Images and libraries

Bootstrap 5.3.3, Google Fonts and the architectural photography are loaded from external services, so an internet connection is needed for the complete visual experience. Images from Unsplash are placeholders; replace them with properly licensed company photography. The sample plan is a local SVG at `images/floor-plans/plan.svg`.

## First-version form and admin behavior

- Contact and quote forms validate required fields in the browser and save submissions under `ag-contact-messages` and `ag-quote-requests` in `localStorage`.
- Quote plan uploads are checked for type and size, but the file itself is **not uploaded or retained**; only its name and basic metadata are recorded.
- The demo login is `admin` / `AGdemo2026!`. Admin data, session state and uploaded project image data URLs stay in the current browser profile. Project and service changes appear in their respective public listings in that same browser.
- This is a front-end prototype, not a secure content management system. Browser storage can be edited or erased by visitors, does not synchronize between browsers, and must not be used for confidential or business-critical records. Do not publish the demo credential as a real admin account.

## Suggested production upgrade

Keep the current pages as the presentation layer, then add a Node.js/Express API and MySQL database. A practical migration can be done incrementally:

1. **Prepare the application:** move repeated header/footer markup into templates or shared components, centralize page data, add environment-specific configuration, and keep secrets out of frontend code.
2. **Build the API:** create an Express app with request validation, error handling, logging, rate limits and CORS restricted to the deployed site. Replace local form writes with `fetch()` requests and show explicit success/error states.
3. **Add MySQL:** create migrations and parameterized database queries; store project/service records and submissions in relational tables. Use a managed MySQL service, backups and least-privilege database accounts.
4. **Secure the admin panel:** use server-side authentication (secure, HttpOnly, SameSite cookies or a vetted identity provider), role checks, CSRF protections where applicable, password hashing, audit logging and server-side validation. Never rely on the demo login or `localStorage` as an access-control mechanism.
5. **Handle images:** upload through validated server endpoints to object storage or a managed media service; store the resulting URL and metadata in MySQL. Enforce file type, size and access policies on the server.
6. **Deploy:** host the frontend on a static hosting/CDN platform and the API on a managed Node.js service; configure HTTPS, environment variables, domain/DNS, monitoring and database backups.

Example future API:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET`, `POST` | `/api/projects` | List projects / create a project (admin) |
| `GET`, `PATCH`, `DELETE` | `/api/projects/:id` | Read, edit or remove a project (admin for writes) |
| `GET`, `POST` | `/api/services` | List services / create a service (admin) |
| `PATCH`, `DELETE` | `/api/services/:id` | Edit or remove a service (admin) |
| `GET`, `POST` | `/api/gallery` | Read or manage gallery items |
| `POST` | `/api/contact` | Validate and save a contact message |
| `POST` | `/api/quotes` | Validate and save a quote request |
| `POST` | `/api/admin/login` | Authenticate an administrator |

Illustrative MySQL entities: `users`, `projects`, `services`, `gallery_items`, `contact_messages`, and `quote_requests`. Store uploads in media storage rather than in database rows; reference them by URL and metadata. Define ownership, retention and privacy rules before collecting live enquiries.

## Project structure

```text
architecture-website/
├── index.html
├── about.html
├── services.html
├── projects.html
├── project-details.html
├── design.html
├── bim.html
├── floor-plans.html
├── gallery.html
├── team.html
├── testimonials.html
├── blog.html
├── contact.html
├── quote.html
├── admin/
├── css/
├── js/
└── images/
```
