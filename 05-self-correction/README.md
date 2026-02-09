# Exercise 05: Self-Correction Test

This exercise demonstrates how Claude Code handles debugging and self-correction.

## What This Is

A React component that fetches posts from the JSONPlaceholder API and displays their titles.

**Features:**
- Fetches from `https://jsonplaceholder.typicode.com/posts`
- Loading state while fetching
- Error handling with user-friendly messages
- Displays all 100 posts with numbered titles

## How to Test

### Step 1: Test the Working Version

**Open the file in your browser:**
```bash
# From the repository root
open 05-self-correction/index.html
# Or on Linux
xdg-open 05-self-correction/index.html
```

**What you should see:**
1. Brief "Loading posts..." message
2. Then a list of 100 posts with titles
3. No errors in the browser console

---

### Step 2: Introduce the Bug (Coming Next)

After confirming the working version, we'll:
1. Introduce a typo in the URL (`posts` → `psts`)
2. See the error that occurs
3. Debug and identify the issue
4. Fix it
5. Verify the fix worked

---

## What to Observe (For Assignment)

### Self-Correction Behavior:

**Can it catch its own mistakes?**
- Does Claude notice when the fetch fails?
- Can it read error messages from the browser?

**How does it debug?**
- Does it check the console?
- Does it trace the error back to the source?
- Does it understand what went wrong?

**How does it fix the issue?**
- Does it identify the specific problem (typo)?
- Does it make the minimal fix needed?
- Does it avoid breaking other things?

**Does it verify the fix?**
- Does it test after fixing?
- Does it confirm the data loads correctly?

---

## Technical Details

- **React:** 18 (loaded from CDN)
- **No Build Tools:** Runs directly in browser
- **API:** JSONPlaceholder (free fake API for testing)
- **Error Handling:** Try-catch with user-friendly messages
- **States:** Loading, Error, Success

---

## Current Status

✅ **Working version created** (correct URL)
⏳ **Bug not yet introduced** (will happen after testing)

---

*This exercise demonstrates real-world debugging: introducing a bug, identifying it, fixing it, and verifying the fix.*
