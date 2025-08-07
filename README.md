# AuthBookingApp - MicroFrontends Demo Project with Module Federation

This repository demonstrates a modern **MicroFrontends architecture** using **Webpack Module Federation** in Angular. The project is structured to allow independent development, deployment, and sharing of features across multiple applications. It also showcases integration with shared NPM packages.

---

## 🏗️ Project Structure

- **projects/auth-mfe**  
  Microfrontend for authentication (register, login, profile, etc.)

- **projects/\_shell-app**  
  The host shell application that loads remote microfrontends.

- **projects/ui-lib-components**  
  Shared UI components (e.g., loading spinner) published as an NPM package.

- **projects/auth-host-app**  
  (If present) Another host or remote for authentication features.

---

## ✅ What’s Ready

- **Module Federation** is set up for sharing and consuming remote modules between the shell and microfrontends.
- **Authentication Microfrontend** (`auth-mfe`) with:
  - Register and Profile pages
  - Dynamic forms with validation
  - Error handling and loading states
- **Shared UI Library** (`ui-lib-components`) as an NPM package, used by both shell and remotes.
- **Shell Application** loads remote modules at runtime.
- **TypeScript best practices**: explicit access modifiers, modular code, and clear structure.

---

## 🧪 Testing: SPECs in This Project

This project follows Angular’s standard testing approach using Jasmine and Karma.  
**Each major component, service, and utility has its own `.spec.ts` file** for unit testing.

### Where to find the specs:

- **Component Specs:**  
  Located next to each component, e.g.  
  `projects/auth-mfe/src/app/components/dynamic-form/dynamic-form.component.spec.ts`  
  `projects/auth-mfe/src/app/pages/register/register.component.spec.ts`

- **Service Specs:**  
  Located next to each service, e.g.  
  `projects/auth-mfe/src/app/services/auth.service.spec.ts`

- **Utility/Validator Specs:**  
  Located next to each utility, e.g.  
  `projects/auth-mfe/src/app/shared/Validators/password-match/passwords-match.validator.spec.ts`

### How to run all tests

```bash
npm run test
```

This will execute all `.spec.ts` files across the workspace and show results in the terminal and browser.

### What is covered

- **Component rendering and interaction**
- **Form validation logic**
- **Service logic and HTTP calls (with mocks)**
- **Error handling and edge cases**

### How to add new specs

1. Create a new file with the `.spec.ts` extension next to your component/service.
2. Use Jasmine’s `describe` and `it` blocks to write your tests.
3. Run `npm run test` to verify.

---

## 🚀 How to Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build shared libraries (if needed):**

   ```bash
   npm run build ui-lib-components
   ```

3. **Start microfrontends and shell:**

   ```bash
   # In separate terminals:
   npm run start auth-mfe
   npm run start _shell-app
   ```

4. **Open the shell app** in your browser (usually at `http://localhost:4200`).

---

## 🧩 What You Can Do Next

- **Add more microfrontends:**  
  Create new feature apps (e.g., booking, dashboard) and expose them via Module Federation.

- **Publish and consume more NPM packages:**  
  Share utilities, services, or UI components across all apps.

- **Implement authentication flows:**  
  Add login, logout, and token management.

- **Enhance dynamic loading:**  
  Load remotes based on user roles or routes.

- **CI/CD integration:**  
  Automate builds and deployments for each microfrontend.

- **SSR/SSG support:**  
  Add server-side rendering for better SEO and performance.

---

## 🛣️ Future Development Ideas

- **User Dashboard Microfrontend**
- **Booking Management Microfrontend**
- **Notifications/Toasts as a shared package**
- **Theming and design system integration**
- **End-to-end tests for cross-app flows**
- **Performance monitoring and analytics**

---

## 🤝 Contributing

Feel free to fork, open issues, or submit pull requests!  
This project is a playground for learning and experimenting with MicroFrontends and Module Federation in Angular.

---

## 📚 References

- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Angular CLI Module Federation Plugin](https://github.com/angular-architects/module-federation-plugin)
- [MicroFrontends Architecture](https://micro-frontends.org/)

---
