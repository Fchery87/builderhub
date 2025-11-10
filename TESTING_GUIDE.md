# BuilderHub - Critical Blockers Testing Guide

**Document Status:** Complete
**Date:** November 10, 2025
**Purpose:** Step-by-step testing instructions for all 3 critical blockers that were resolved

---

## Prerequisites

Before starting tests, ensure:

1. **Backend is running:**
   ```bash
   cd backend
   python main.py
   ```
   - Should see: `Uvicorn running on http://0.0.0.0:8001`

2. **Frontend is running:**
   ```bash
   cd frontend
   npm run dev
   ```
   - Should see: `Ready in 1.23s`

3. **Both running via root:**
   ```bash
   npm run dev  # from project root
   ```
   - Runs both backend (port 8001) and frontend (port 3000) simultaneously

---

## Test 1: Database Schema Initialization

**What was fixed:** Backend now calls InstantDB admin API on startup to actually create database schema (instead of just having it defined in Python code)

**Files involved:**
- `backend/app/database.py` - Enhanced `init_schema()` method
- `backend/main.py` - Calls `db_service.init_schema()` on startup

### Testing Steps

#### Step 1: Check Backend Logs
1. Start backend: `python main.py` (from `backend/` directory)
2. Look for these log messages indicating success:
   ```
   Task Board API starting up...
   [SUCCESS] Schema successfully initialized in InstantDB
   ```

#### Step 2: Verify in InstantDB Dashboard
1. Go to [InstantDB Admin Dashboard](https://app.instantdb.com)
2. Login with your credentials
3. Navigate to your app (ID: `16967c32-6384-4cc6-94be-c580f0ba3df8`)
4. Check **Collections** section
5. You should see:
   - ✅ `users` collection
   - ✅ `projects` collection
   - ✅ `tasks` collection

Each should have fields and indexes defined (see details below)

#### Step 3: Verify Schema Details

**Users Collection:**
- Fields: `id`, `email`, `role`, `created_at`
- Indexes: `email`

**Projects Collection:**
- Fields: `id`, `name`, `description`, `owner_id`, `created_at`
- Indexes: `owner_id`

**Tasks Collection:**
- Fields: `id`, `project_id`, `title`, `description`, `status`, `acceptance_criteria`, `assignee_id`, `created_at`, `updated_at`
- Indexes: `project_id`, `assignee_id`, `status`

### Success Criteria
✅ Schema initialization log appears on backend startup
✅ All 3 collections exist in InstantDB dashboard
✅ Collections have correct fields and indexes

---

## Test 2: Authentication Pages

**What was fixed:** Created 3 new authentication pages so users can login and signup

**Files created:**
- `frontend/src/app/auth/login/page.tsx` - Email-based login
- `frontend/src/app/auth/signup/page.tsx` - New user registration
- `frontend/src/app/auth/verify/page.tsx` - Email verification confirmation

**Navigation updated:**
- `frontend/src/components/landing-page.tsx` - Added links to auth pages
- All "Get Started" buttons now route to `/auth/signup`
- "Sign In" button routes to `/auth/login`

### Test 2A: Login Page

#### Steps
1. Navigate to: `http://localhost:3000`
2. Click **"Sign In"** button (top right or bottom section)
3. You should see login form with:
   - Email input field
   - "Continue with email" button
   - Link to signup page
4. Enter any email (e.g., `test@example.com`)
5. Click "Continue with email"
6. Should redirect to `/auth/verify` page

#### Success Criteria
✅ Login page loads without errors
✅ Email validation works
✅ Form submits and redirects to verify page
✅ URL changes to `/auth/verify`

### Test 2B: Signup Page

#### Steps
1. Navigate to: `http://localhost:3000`
2. Click **"Get Started"** button (hero section or bottom)
3. You should see signup form with:
   - Full Name input
   - Email input
   - "Create Account" button
   - Link back to login
4. Enter invalid name (less than 2 chars): `A`
5. Should see error: "Name must be at least 2 characters"
6. Enter valid name: `John Doe`
7. Enter invalid email: `notanemail`
8. Should see error: "Please enter a valid email"
9. Enter valid email: `john@example.com`
10. Click "Create Account"
11. Should see success toast and redirect to verify page

#### Success Criteria
✅ Signup page loads without errors
✅ Real-time validation works for name (min 2 chars)
✅ Real-time validation works for email format
✅ Success message appears on submit
✅ Redirects to `/auth/verify`

### Test 2C: Email Verification Page

#### Steps
1. After logging in or signing up, you should be on `/auth/verify`
2. Page should display:
   - Checkmark icon indicating success
   - The email you used (e.g., "john@example.com")
   - Instructions about checking email/spam folder
   - Link to request new magic link
3. Text should say: "Check your email at john@example.com"
4. Should display helpful spam folder warning

#### Success Criteria
✅ Verify page displays correctly
✅ Shows the correct email address
✅ Has checkmark icon indicating success
✅ Provides clear instructions
✅ Professional styling

---

## Test 3: Dashboard Connected to Real API

**What was fixed:** Dashboard now fetches real data from `/api/projects` and `/api/tasks` endpoints instead of using hardcoded mock data

**File updated:**
- `frontend/src/app/dashboard/page.tsx` - Added `useEffect` hook for data fetching

**Fixed port issue:**
- `frontend/next.config.js` - Changed default API URL from port 8000 to 8001

### Test 3A: Dashboard Loads with Mock Data Fallback

#### Steps
1. **With Backend Running:**
   - Keep backend running (`python main.py`)
   - Navigate to: `http://localhost:3000/dashboard`
   - Dashboard should load
   - Should see projects and tasks

2. **Without Backend (Test Fallback):**
   - Stop backend (Ctrl+C)
   - Refresh dashboard
   - Should still load (no white screen)
   - Should use fallback/demo data
   - Should see warning toast: "Failed to load data. Using demo data."

#### Success Criteria
✅ Dashboard loads quickly
✅ Shows projects list
✅ Shows tasks list
✅ Shows stats (total tasks, completed, in progress, etc.)
✅ Gracefully falls back when backend is unavailable

### Test 3B: Create a New Task

#### Steps
1. Ensure backend is running
2. Navigate to dashboard: `http://localhost:3000/dashboard`
3. Click **"+ New Task"** button
4. Task form should open with two tabs: "Details" and "Acceptance"
5. On Details tab:
   - **Project:** Select "Website Redesign" from dropdown
   - **Title:** Enter "Update homepage hero section"
   - **Description:** Enter "Update the hero section with new design mockups and improve copy"
   - **Assignee:** Leave as "Unassigned" (tests the Select fix)
6. **Important:** The Assignee dropdown should NOT throw an error (this was the bug we fixed)
7. Click **"Create Task"** button
8. Should see success toast: "Task Created - 'Update homepage hero section' has been created successfully."
9. Task form should close
10. Return to dashboard
11. The new task should appear in the task list

#### Success Criteria
✅ Task form opens without errors
✅ Assignee dropdown works (no "value prop that is not an empty string" error)
✅ All form fields can be filled
✅ Form validation works (title, description required)
✅ Task is created and persisted in backend
✅ New task appears in task list after creation

### Test 3C: Update Task Status

#### Steps
1. On dashboard, find a task (create one if needed)
2. Click and drag the task to a different column:
   - From "To Do" to "In Progress"
   - From "In Progress" to "Done"
3. Task should move to new column
4. Refresh the page
5. Task should remain in the updated column (proving it was persisted)

#### Success Criteria
✅ Task drag-and-drop works
✅ Task status changes visually
✅ Changes persist after refresh

### Test 3D: Verify API Calls

#### Steps
1. Open browser DevTools: Press `F12`
2. Go to **Network** tab
3. Create a new task (see Test 3B)
4. Look for POST request to `/api/tasks`
5. Click on that request
6. Check **Response** tab - should show the created task with an ID

#### Success Criteria
✅ Network tab shows POST request to `/api/tasks`
✅ Response includes task data with ID
✅ Status code is 200 (success)

---

## Test 4: Navigation Flow

**What was fixed:** Updated landing page to properly route to auth pages

**Files updated:**
- `frontend/src/components/landing-page.tsx` - All CTA buttons now link to auth pages

### Steps
1. Navigate to: `http://localhost:3000`
2. **Top right "Sign In" button:** Should go to `/auth/login`
3. **Hero section "Get Started" button:** Should go to `/auth/signup`
4. **Hero section "Sign In" button:** Should go to `/auth/login`
5. **Benefits section "Start Free Trial" button:** Should go to `/auth/signup`
6. **Bottom CTA "Get Started Now" button:** Should go to `/auth/signup`
7. **Bottom CTA "Sign In" button:** Should go to `/auth/login`

#### Success Criteria
✅ All navigation links point to correct auth pages
✅ No broken links
✅ User can easily find login/signup from homepage

---

## Quick Testing Checklist

Use this checklist to verify all fixes:

### Database Schema (Test 1)
- [ ] Backend logs show schema initialization
- [ ] Collections exist in InstantDB dashboard
- [ ] All required fields are present

### Authentication Pages (Test 2)
- [ ] Login page loads and has email validation
- [ ] Signup page loads with form validation
- [ ] Verify page displays after signup/login
- [ ] Error messages display correctly
- [ ] Navigation between auth pages works

### Dashboard & API (Test 3)
- [ ] Dashboard loads with data
- [ ] Task form opens without Select error
- [ ] Can create new task
- [ ] Can update task status
- [ ] Network tab shows API calls
- [ ] Data persists after refresh
- [ ] Fallback works when backend is down

### Navigation (Test 4)
- [ ] All "Get Started" buttons go to signup
- [ ] All "Sign In" buttons go to login
- [ ] No broken links

---

## Troubleshooting

### "Cannot GET /api/tasks"
**Problem:** Frontend trying to reach backend on wrong port
**Solution:** Ensure `frontend/next.config.js` has:
```javascript
NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
```
And backend is running on port 8001

### "Select.Item must have a value prop" Error
**Problem:** Assignee dropdown error when creating task
**Solution:** Already fixed in `frontend/src/components/task-form.tsx`
Line 302-303 should use `"unassigned"` not empty string

### Port 8001 Already in Use
**Problem:** Backend fails to start
**Solution:**
```bash
# Find process using port 8001
netstat -ano | findstr :8001

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or just change backend port in backend/main.py line 85
```

### Frontend Not Showing Auth Pages
**Problem:** Clicking auth links shows 404
**Solution:** Ensure these files exist:
- `frontend/src/app/auth/login/page.tsx`
- `frontend/src/app/auth/signup/page.tsx`
- `frontend/src/app/auth/verify/page.tsx`

And restart frontend dev server: `npm run dev`

---

## Testing Completion

Once all tests pass:

1. ✅ Database schema is initialized in InstantDB
2. ✅ Users can navigate to login/signup pages
3. ✅ Users can create accounts and tasks
4. ✅ Data persists and is retrieved from real backend
5. ✅ Frontend gracefully handles backend being unavailable

**Result:** All 3 critical blockers are resolved and the application is ~55% complete with core functionality working end-to-end.

---

## Next Steps

After testing is complete, consider:

1. **Project Management Endpoints**
   - Implement `POST /api/projects` - Create projects
   - Implement `PUT /api/projects/{id}` - Update projects
   - Implement `DELETE /api/projects/{id}` - Delete projects

2. **Real-Time Features**
   - Add InstantDB subscriptions for live updates
   - Implement presence indicators (who's viewing what)
   - Add real-time task status changes

3. **AI Features**
   - Implement acceptance criteria generation endpoint
   - Add task summarization
   - Implement smart assignment suggestions

4. **Testing & QA**
   - Write unit tests for critical functions
   - Add integration tests for API endpoints
   - Test error scenarios and edge cases

---

**Testing Guide Status:** ✅ Complete
**Last Updated:** November 10, 2025
**For Questions:** See CRITICAL_BLOCKERS_RESOLVED.md for more details
