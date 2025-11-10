# Troubleshooting Guide

## Issue: Build/Dev Server Not Starting

### Error: `.next/trace` Permission Denied

**Cause:** Windows file permissions or the Next.js process is still running and locking files.

### Solution 1: Kill Existing Processes (Recommended)

```bash
# Windows - Kill Next.js dev server
taskkill /F /IM node.exe

# Then try dev server again
cd frontend
npm run dev
```

### Solution 2: Clean Cache Completely

```bash
# Kill any running processes first
taskkill /F /IM node.exe

# Remove Node cache
cd frontend
rm -rf .next
rm -rf node_modules/.cache

# Reinstall and start fresh
npm install
npm run dev
```

### Solution 3: Use Different Port

If port 3000 is in use:

```bash
PORT=3001 npm run dev
# Then access at http://localhost:3001
```

### Solution 4: Full Clean Slate

```bash
# Kill all node processes
taskkill /F /IM node.exe

# Remove everything
cd frontend
rm -rf .next node_modules

# Reinstall
npm install

# Run dev
npm run dev
```

---

## Issue: Components Not Displaying

### Possible Causes

1. **Page not wrapped with AppShell**
   - Solution: Wrap your page content with `<AppShell>`

2. **Components not imported**
   - Solution: Check imports are correct
   ```tsx
   import { AppShell } from "@/components/app-shell";
   import { DashboardCards } from "@/components/dashboard-cards";
   ```

3. **Styling not loaded**
   - Solution: Ensure `src/app/globals.css` is imported in layout.tsx
   ```tsx
   import "./globals.css";
   ```

4. **Dark mode not working**
   - Solution: Ensure ThemeProvider wraps the app
   ```tsx
   import { ThemeProvider } from "@/hooks/use-theme";
   <ThemeProvider>{children}</ThemeProvider>
   ```

---

## Issue: Lint Errors After Using New Components

### Check Imports

Make sure you're importing from correct paths:

```typescript
// ✅ Correct
import { AppShell } from "@/components/app-shell";
import { DashboardCards } from "@/components/dashboard-cards";

// ❌ Wrong
import { AppShell } from "./app-shell";
import { DashboardCards } from "./dashboard-cards";
```

### Verify Props

Check that you're passing required props:

```typescript
// ✅ Correct
<AppShell currentPath="/dashboard">
  {children}
</AppShell>

// ❌ Wrong
<AppShell>
  {children}
</AppShell>
```

### Run Lint

```bash
npm run lint
```

If there are errors, fix them before building.

---

## Issue: Page Routes Not Found

### Problem: Routes like `/dashboard` don't work

**Solution:** Make sure you have created the necessary route files:

```
src/app/
├── page.tsx                    (home page)
├── layout.tsx                  (root layout)
├── globals.css
└── dashboard/
    └── page.tsx                (dashboard page - create if missing)
```

Create dashboard page:

```bash
# Create dashboard directory
mkdir -p src/app/dashboard

# Create page.tsx
cat > src/app/dashboard/page.tsx << 'EOF'
"use client";

import { AppShell } from "@/components/app-shell";
import { DashboardCards, TaskCounter } from "@/components/dashboard-cards";

export default function DashboardPage() {
  const stats = [
    { title: "Total Tasks", value: 48 },
    { title: "Completed", value: 32 },
  ];

  return (
    <AppShell currentPath="/dashboard">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardCards stats={stats} />
      </div>
    </AppShell>
  );
}
EOF
```

---

## Issue: TypeScript Errors

### Type 'X' is not assignable to type 'Y'

**Solution:** Check your component props match the interface:

```typescript
// ✅ Correct
const stats: StatCardProps[] = [
  {
    title: "Total",
    value: 48,
    trend: { value: 5, isPositive: true }
  }
];

// ❌ Wrong
const stats = [
  {
    title: "Total",
    value: "48",  // Should be number
    trend: { value: "5", isPositive: "true" }  // Wrong types
  }
];
```

---

## Issue: Tailwind Classes Not Applied

### Dark Mode Not Working

**Check:**
1. Is `dark:` class on html element?
2. Is ThemeProvider wrapping the app?
3. Are you using correct dark variants?

```tsx
// ✅ Correct
<div className="bg-white dark:bg-slate-950">
  {children}
</div>

// ❌ Wrong
<div className="bg-white dark-bg-slate-950">
  {children}
</div>
```

### Classes Not Applying at All

**Solution:**
1. Restart dev server: `npm run dev`
2. Clear cache: `rm -rf .next`
3. Check `tailwind.config.ts` includes all template paths

---

## Checklist: Getting Started

- [ ] Kill any existing Node processes: `taskkill /F /IM node.exe`
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to: `http://localhost:3000`
- [ ] Check console for errors
- [ ] Run lint: `npm run lint`
- [ ] Review components in browser DevTools
- [ ] Test dark mode toggle
- [ ] Test on mobile (resize browser)

---

## Quick Reference: Commands

```bash
# Start development
npm run dev              # Dev server on port 3000

# Code quality
npm run lint            # Check for linting errors
npm run build           # Build for production

# Clean up
rm -rf .next            # Remove Next.js cache
rm -rf node_modules     # Remove dependencies (rarely needed)
npm install             # Reinstall dependencies

# Stop dev server
Ctrl+C                  # In terminal
taskkill /F /IM node.exe  # Force kill Node process
```

---

## Getting Help

1. **Check documentation**
   - Read `MODERNIZATION_GUIDE.md`
   - Review `INTEGRATION_EXAMPLES.md`

2. **Common issues**
   - Process still running? Kill with `taskkill /F /IM node.exe`
   - Cache issues? Delete `.next` folder
   - Import errors? Check paths use `@/components/`

3. **Verify setup**
   ```bash
   npm run lint    # Should pass
   npm run dev     # Should start
   ```

---

## FAQ

**Q: Why is build failing with permission error?**
A: Windows file locks. Kill Node processes: `taskkill /F /IM node.exe`

**Q: Components not showing on page?**
A: Check page is wrapped with `<AppShell>` and imports are correct

**Q: Dark mode not switching?**
A: Ensure `<ThemeProvider>` wraps app in `layout.tsx`

**Q: Port 3000 already in use?**
A: Use different port: `PORT=3001 npm run dev`

**Q: TypeScript errors?**
A: Check prop types match interfaces in component files

**Q: Lint failing?**
A: Run `npm run lint` and fix reported issues

---

## Additional Resources

- Next.js Docs: https://nextjs.org/docs
- Shadcn/ui Docs: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com
- React Docs: https://react.dev

---

**Last Updated:** 2024
**Status:** Complete
