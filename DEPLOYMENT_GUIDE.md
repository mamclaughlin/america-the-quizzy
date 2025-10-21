# Deployment Guide - America the Quizzy

This guide walks you through deploying America the Quizzy to production on Vercel.

## Prerequisites Checklist

Before deploying, ensure:

- ✅ All code is committed to Git
- ✅ Local development build works (`npm run dev`)
- ✅ No linting errors (`npm run lint`)

---

## Phase 8: Deployment Tasks

### DEPLOY-01: Create Vercel Project

**Option A: Vercel Dashboard** (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository:
   - Connect GitHub/GitLab/Bitbucket if not already connected
   - Select the `americaQuizzy/america-the-quizzy` repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (or leave as default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

**Option B: Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project directory
cd america-the-quizzy

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? america-the-quizzy (or custom)
# - Directory? ./ 
# - Override settings? No
```

---

### DEPLOY-02: Configure Environment Variables

**No environment variables needed!** 

The application uses a local question bank and native fuzzy matching for grading. You can skip directly to testing the local production build.

---

### DEPLOY-03: Test Local Production Build

Before deploying to Vercel, test the production build locally:

```bash
# From america-the-quizzy directory

# Build the production bundle
npm run build

# If build succeeds, start the production server
npm run start

# Open http://localhost:3000 in your browser
```

**What to Check:**

- ✅ Build completes without errors
- ✅ No TypeScript errors
- ✅ Application loads correctly
- ✅ All fonts and styles render properly
- ✅ Film grain texture is visible
- ✅ Pages are responsive

**If Build Fails:**

- Check for TypeScript errors: `npm run type-check` (if available) or `npx tsc --noEmit`
- Check for linting errors: `npm run lint`
- Verify all imports are correct
- Ensure `.env.local` is set up (for local testing)

---

### DEPLOY-04: Deploy to Vercel

**Automatic Deployment (Recommended):**

1. Commit all changes:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Vercel automatically deploys on push to `main`
3. Monitor deployment in Vercel dashboard
4. Once complete, you'll get a deployment URL

**Manual Deployment via CLI:**

```bash
# Deploy to production
vercel --prod

# Vercel will build and deploy, then provide a URL
```

**Expected Output:**

```
✓ Production: https://america-the-quizzy.vercel.app [1m 23s]
```

---

### DEPLOY-05: Verify Application in Production

Once deployed, test the full application flow:

1. **Navigate to your production URL**
   - Example: `https://america-the-quizzy.vercel.app`

2. **Test Question Selection**
   - Configure a quiz (5 questions, Any category)
   - Click "Start Test"
   - Questions should load instantly (<100ms)
   - Verify questions appear and are relevant

3. **Test Answer Grading**
   - Answer all questions
   - Submit answers
   - Grading should be instant (<10ms)
   - Verify results display correctly with correct/incorrect feedback

4. **Check Browser Console**
   - Open DevTools → Console
   - Look for any errors or warnings
   - Verify no API errors

5. **Test Restart Flow**
   - Click "Restart Quiz"
   - Verify you return to configuration screen
   - Test starting a new quiz

**Common Issues:**

- **404 Not Found**: API routes not deployed
  - Fix: Ensure `app/api/` directory is committed
- **500 Internal Server Error**: Check Vercel function logs
  - Fix: Go to Vercel dashboard → Functions → View logs

---

### DEPLOY-06: Cross-Browser and Device Testing

Test the application on multiple browsers and devices:

**Desktop Browsers:**
- ✅ Chrome (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)

**Mobile Devices:**
- ✅ iOS Safari (iPhone)
- ✅ Chrome Mobile (Android)
- ✅ Safari (iPad)

**What to Test:**
- Form inputs work correctly
- Touch targets are at least 44x44px
- Buttons respond to taps
- Keyboard doesn't break layout on mobile
- All transitions are smooth
- Film grain texture is visible
- Fonts load correctly

**Testing Tools:**
- **BrowserStack**: [browserstack.com](https://browserstack.com) (free trial)
- **Chrome DevTools**: Responsive mode (F12 → Toggle device toolbar)
- **Your own devices**: Test on personal phones/tablets

---

### DEPLOY-07: Monitor Performance Metrics

**Run Lighthouse Audit:**

1. Open production URL in Chrome
2. Open DevTools (F12) → **Lighthouse** tab
3. Select:
   - Categories: Performance, Accessibility, Best Practices, SEO
   - Device: Desktop and Mobile (run both)
4. Click "Generate report"

**Target Scores:**
- 🟢 **Performance**: >90
- 🟢 **Accessibility**: 100
- 🟢 **Best Practices**: >90
- 🟢 **SEO**: >90

**Vercel Analytics:**

1. Go to Vercel dashboard → Your project → **Analytics**
2. Monitor:
   - **Core Web Vitals**: LCP, FID, CLS
   - **Page Load Time**: Should be <2 seconds
   - **Real User Monitoring**: Track actual user experiences

**Performance Targets:**
- **Initial Load**: <2 seconds (standard broadband)
- **UI Transitions**: <100ms perceived latency
- **Question Selection**: <100ms (local JSON)
- **Answer Grading**: <10ms (native fuzzy matching)

**If Performance is Low:**

Common optimizations:
- Enable Vercel Image Optimization (if using images)
- Check bundle size: `npm run build` (should show bundle sizes)
- Verify Tailwind CSS is purged (check CSS bundle size)
- Consider implementing OpenAI response caching (future enhancement)

---

## Post-Deployment Checklist

After completing all deployment tasks:

- ✅ Application is live at production URL
- ✅ Question selection works (instant loading)
- ✅ Answer grading works (instant results)
- ✅ Tested on multiple browsers and devices
- ✅ Lighthouse scores meet targets
- ✅ Vercel Analytics shows healthy metrics
- ✅ No console errors in production
- ✅ README updated with production URL (optional)
- ✅ Team/stakeholders notified (if applicable)

---

## Troubleshooting

### Issue: Questions Not Loading

**Symptoms:** Loading spinner stays forever, or error message appears

**Solutions:**
1. Check Vercel function logs for errors
2. Verify `citizenship_questions.json` file is deployed
3. Check network tab for 500 errors on `/api/generate-questions`

### Issue: Grading Not Working

**Symptoms:** Quiz completes but results don't load

**Solutions:**
1. Check Vercel function logs for errors
2. Check network tab for 500 errors on `/api/grade-answers`
3. Verify grading route is deployed correctly

### Issue: Slow Performance

**Symptoms:** Pages load slowly, animations stutter

**Solutions:**
1. Run Lighthouse audit to identify bottlenecks
2. Check Vercel Analytics for regional issues
3. Consider upgrading Vercel plan if on free tier with heavy traffic
4. Optimize images if any were added

### Issue: Styles Missing

**Symptoms:** Plain HTML with no styling

**Solutions:**
1. Check if `globals.css` is imported in `layout.tsx`
2. Verify Tailwind CSS built correctly (check build logs)
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## Rollback Instructions

If deployment has critical issues:

**Via Vercel Dashboard:**
1. Go to **Deployments** tab
2. Find a previous working deployment
3. Click **•••** menu → **Promote to Production**

**Via CLI:**
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

---

## Next Steps

After successful deployment:

1. **Monitor for a few days** - Check Vercel analytics and error logs
2. **Collect feedback** - Share with users and gather input
3. **Plan enhancements** - Consider features like:
   - Question bank caching
   - Progress persistence (localStorage)
   - User accounts and score tracking
   - Social sharing of results
   - Additional languages

---

## Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

---

**Congratulations! 🎉 Your app is now live!**
