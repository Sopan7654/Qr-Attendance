# Detailed Guide: Adding Environment Variables in Vercel

Complete step-by-step instructions with screenshots descriptions.

## Prerequisites

- ✅ Your project is already deployed to Vercel (or you're in the deployment process)
- ✅ You have access to your Vercel dashboard
- ✅ You have the Firebase Service Account JSON ready

---

## Step-by-Step Instructions

### Step 1: Access Your Vercel Project

1. **Go to Vercel Dashboard**

   - Visit: https://vercel.com
   - Sign in with your GitHub account

2. **Navigate to Your Project**
   - Click on your project name (e.g., "qr-attendance-system")
   - You'll see the project dashboard with deployments

### Step 2: Open Settings

1. **Click on "Settings" Tab**

   - Located at the top navigation bar
   - You'll see: Overview | Deployments | Analytics | Settings
   - Click **"Settings"**

2. **Navigate to Environment Variables**
   - In the left sidebar, you'll see:
     - General
     - Domains
     - **Environment Variables** ← Click this
     - Git
     - Security
     - etc.

### Step 3: Add Environment Variables

You'll see a page with:

- A search bar at the top
- A table showing existing variables (if any)
- A button: **"+ Add New"** or **"Add"** button

---

## Adding Each Variable

### Variable 1: ADMIN_PASSWORD

1. **Click "+ Add New"** button (top right)

2. **Fill in the form:**

   - **Key/Name field**: Type exactly: `ADMIN_PASSWORD`
   - **Value field**: Type exactly: `admin@123`
   - **Environment dropdown**:
     - ✅ Check **Production**
     - ✅ Check **Preview**
     - ✅ Check **Development**
   - (Or click "Select All" if available)

3. **Click "Save"** button

4. **Verify**: You should see `ADMIN_PASSWORD` in the list

---

### Variable 2: SITE_URL

1. **Click "+ Add New"** again

2. **Fill in the form:**

   - **Key/Name field**: Type exactly: `SITE_URL`
   - **Value field**:
     - **For now**: Leave it **EMPTY** (we'll update after deployment)
     - **OR** if you already know your Vercel URL: `https://your-project-name.vercel.app`
   - **Environment dropdown**:
     - ✅ Check **Production**
     - ✅ Check **Preview**
     - ✅ Check **Development**

3. **Click "Save"** button

4. **Note**: After deployment, come back here and update with your actual Vercel URL

---

### Variable 3: FIREBASE_SERVICE_ACCOUNT

**⚠️ IMPORTANT: This is the most critical step!**

1. **Prepare the JSON first:**

   - Open terminal/PowerShell in your project folder
   - Run: `node prepare-vercel-env.js`
   - Copy the entire JSON output (it's one long line)

2. **Click "+ Add New"** in Vercel

3. **Fill in the form:**

   - **Key/Name field**: Type exactly: `FIREBASE_SERVICE_ACCOUNT`
   - **Value field**:
     - **Paste the entire JSON** from the script output
     - It should look like: `{"type":"service_account","project_id":"qr-attendance-47cc1",...}`
     - **Important**: It must be on ONE LINE (no line breaks)
   - **Environment dropdown**:
     - ✅ Check **Production**
     - ✅ Check **Preview**
     - ✅ Check **Development**

4. **Click "Save"** button

5. **Verify**: The value should show as a long JSON string (may be truncated in display)

---

### Variable 4: NODE_ENV

1. **Click "+ Add New"** again

2. **Fill in the form:**

   - **Key/Name field**: Type exactly: `NODE_ENV`
   - **Value field**: Type exactly: `production`
   - **Environment dropdown**:
     - ✅ Check **Production** only
     - ❌ Don't check Preview or Development (leave them unchecked)

3. **Click "Save"** button

---

## Visual Guide (What You'll See)

### Environment Variables Page Layout:

```
┌─────────────────────────────────────────────────────────┐
│  Vercel Dashboard                                        │
├─────────────────────────────────────────────────────────┤
│  [Settings] → Environment Variables                     │
│                                                          │
│  Search variables...                    [+ Add New]     │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Key                │ Value        │ Environments │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ ADMIN_PASSWORD     │ admin@123    │ All          │  │
│  │ SITE_URL           │ (empty)      │ All          │  │
│  │ FIREBASE_SERVICE...│ {...}        │ All          │  │
│  │ NODE_ENV           │ production   │ Production   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Add New Variable Form:

```
┌─────────────────────────────────────────────┐
│  Add Environment Variable                   │
├─────────────────────────────────────────────┤
│                                             │
│  Key: [________________]                    │
│                                             │
│  Value: [________________]                  │
│         (or textarea for long values)       │
│                                             │
│  Environments:                              │
│  ☐ Production                               │
│  ☐ Preview                                  │
│  ☐ Development                              │
│                                             │
│  [Cancel]  [Save]                           │
└─────────────────────────────────────────────┘
```

---

## Quick Copy-Paste Values

### For Easy Reference:

**ADMIN_PASSWORD:**

```
admin@123
```

**SITE_URL:**

```
(Leave empty for now, or use: https://your-project.vercel.app)
```

**FIREBASE_SERVICE_ACCOUNT:**

```
{"type":"service_account","project_id":"YOUR_PROJECT_ID","private_key_id":"YOUR_PRIVATE_KEY_ID","private_key":"YOUR_PRIVATE_KEY_HERE","client_email":"YOUR_SERVICE_ACCOUNT_EMAIL","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"YOUR_CERT_URL","universe_domain":"googleapis.com"}
```

**NODE_ENV:**
```

production

```

---

## After Adding All Variables

### Step 1: Verify All Variables

Check that you have exactly 4 variables:
- ✅ ADMIN_PASSWORD
- ✅ SITE_URL
- ✅ FIREBASE_SERVICE_ACCOUNT
- ✅ NODE_ENV

### Step 2: Deploy/Redeploy

1. **If deploying for the first time:**
   - Go back to "Deployments" tab
   - Click "Deploy" (if not already deployed)

2. **If updating variables:**
   - Go to "Deployments" tab
   - Find the latest deployment
   - Click the **"..."** (three dots) menu
   - Click **"Redeploy"**
   - Confirm redeployment

### Step 3: Update SITE_URL After Deployment

1. **After deployment completes:**
   - Note your Vercel URL (e.g., `https://qr-attendance-system.vercel.app`)
   - Go back to Settings → Environment Variables
   - Find `SITE_URL`
   - Click **"Edit"** (or pencil icon)
   - Update value to: `https://your-actual-url.vercel.app`
   - Click "Save"
   - **Redeploy** again (Deployments → ... → Redeploy)

---

## Troubleshooting

### Issue: Can't find Environment Variables section

**Solution:**
- Make sure you're in the **Settings** tab
- Look in the left sidebar menu
- It might be under "General" → scroll down

### Issue: FIREBASE_SERVICE_ACCOUNT value is too long

**Solution:**
- Vercel supports long values
- Use the textarea (multi-line input) if available
- Make sure it's all on one line (no actual line breaks)
- The `\n` in the JSON are escape sequences, that's fine

### Issue: Variables not working after deployment

**Solution:**
- Make sure you checked the correct environments (Production, Preview, Development)
- Redeploy after adding/updating variables
- Check deployment logs for errors

### Issue: Can't edit a variable

**Solution:**
- Click on the variable row
- Or look for "Edit" button/pencil icon
- Some Vercel interfaces show variables in a modal

---

## Verification Checklist

After adding all variables, verify:

- [ ] All 4 variables are listed
- [ ] ADMIN_PASSWORD value is `admin@123`
- [ ] SITE_URL is empty (or has your URL)
- [ ] FIREBASE_SERVICE_ACCOUNT has the long JSON string
- [ ] NODE_ENV is `production` and only checked for Production
- [ ] All variables (except NODE_ENV) are checked for all environments
- [ ] You've redeployed after adding variables

---

## Need Help?

If you encounter any issues:
1. Check Vercel deployment logs
2. Verify variable names are exact (case-sensitive)
3. Make sure you redeployed after adding variables
4. Check Firebase connection in logs

---

## Quick Reference: Variable Summary

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| ADMIN_PASSWORD | `admin@123` | All (Production, Preview, Development) |
| SITE_URL | (empty or your Vercel URL) | All |
| FIREBASE_SERVICE_ACCOUNT | (long JSON string) | All |
| NODE_ENV | `production` | Production only |

---

**That's it!** Once all variables are added and you've redeployed, your app should work on Vercel! 🚀

```
