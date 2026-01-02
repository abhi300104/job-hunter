# job-hunter

A simple static React app (Vite + Tailwind) that shows job listings.

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

Open the app at: http://localhost:5173/


3. Build for production:

```bash
npm run build
```

4. Preview the production build locally:

```bash
npm run preview
```

> Note for Windows users: if you encounter an error like "cannot be loaded because running scripts is disabled" when running `npm create` or other scripts from PowerShell, try running the commands in **Command Prompt (cmd.exe)**, or run PowerShell as Administrator and set an execution policy:
>
> ```powershell
> Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

## Project structure

- `index.html` — app entry
- `src/main.jsx` — app bootstrap
- `src/App.jsx` — main app component
- `src/components/` — UI components
- `src/data/jobs.json` — sample job data
- `src/styles/index.css` — Tailwind CSS entry

## Next steps

- Implement filters, sorting, and accessibility improvements.

---

License: MIT
