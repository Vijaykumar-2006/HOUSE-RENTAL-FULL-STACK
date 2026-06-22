# Homely: House Rental Dashboard - Version Control & Deployment Guide

This guide will walk you through the process of setting up version control using **Git**, publishing your project to **GitHub**, and deploying it live on the cloud using **Vercel** to create a portfolio-ready project for your placement evaluations.

---

## Part 1: Version Control using Git & GitHub

### Step 1: Install Git (If not already installed)
1. Download Git from [git-scm.com](https://git-scm.com/downloads) and install it.
2. Verify the installation by opening your terminal (PowerShell, Command Prompt, or Git Bash) and typing:
   ```bash
   git --version
   ```

### Step 2: Initialize Git in your project folder
1. Open terminal inside your project directory (`d:\FS`):
   ```bash
   # Navigate to the folder (if needed)
   cd d:\FS
   ```
2. Initialize a local Git repository:
   ```bash
   git init
   ```
3. (Optional but recommended) Create a `.gitignore` file to ignore unnecessary files. For this static site project, we don't have large dependencies, but it is good practice:
   ```bash
   echo "node_modules/" > .gitignore
   echo ".DS_Store" >> .gitignore
   ```

### Step 3: Stage and Commit your files
1. Add all files to the staging area:
   ```bash
   git add .
   ```
2. Create your first commit:
   ```bash
   git commit -m "feat: Initial commit of Homely House Rental Dashboard with HTML, CSS, and JS"
   ```

### Step 4: Publish to GitHub
1. Log in to your [GitHub Account](https://github.com).
2. Click the **New** button (or "+" icon in the top-right corner) to create a new repository.
3. Configure your repository settings:
   - **Repository name**: `house-rental-dashboard` (or any name you prefer)
   - **Description**: Professional House Rental Dashboard web application.
   - **Publicity**: Public (mandatory so your professors and recruiters can access it).
   - **Do NOT** check "Add a README file", "Add .gitignore", or "Choose a license" (as we already initialized them locally).
   - Click **Create repository**.
4. In your terminal, run the commands displayed on GitHub to link and push your local repository:
   ```bash
   # Set the default branch name to main
   git branch -M main

   # Link your local repo to your remote GitHub repository
   # (Replace USERNAME and REPO-NAME with your actual details)
   git remote add origin https://github.com/USERNAME/REPO-NAME.git

   # Push your code to GitHub
   git push -u origin main
   ```

---

## Part 2: Cloud Deployment on Vercel

Vercel provides free, instant cloud hosting with continuous deployment (every time you push changes to GitHub, Vercel rebuilds and updates your site automatically).

### Option A: Deployment via Vercel Web Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com) and sign up/log in using your **GitHub account**.
2. Once logged in, click the **Add New...** button and select **Project**.
3. You will see a list of your GitHub repositories. Click **Import** next to your `house-rental-dashboard` repository.
4. On the configuration page:
   - Keep the default settings (Framework Preset: **Other**, Build Command: empty, Output Directory: empty).
   - Click **Deploy**.
5. Wait 10-15 seconds. You will see a congratulations screen and a preview snapshot of your live webpage!
6. Click on the snapshot to visit your live webpage URL (e.g., `house-rental-dashboard-five.vercel.app`).

### Option B: Deployment via Vercel CLI (Terminal)
If you prefer deploying directly from your command line:
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Log in to your Vercel account from terminal:
   ```bash
   vercel login
   ```
3. Start the deployment wizard from your project directory (`d:\FS`):
   ```bash
   vercel
   ```
4. Follow the prompt questions:
   - *Set up and deploy "d:\FS"?* **Yes**
   - *Which scope...?* **(Select your account name)**
   - *Link to existing project?* **No**
   - *What's your project's name?* `house-rental-dashboard`
   - *In which directory is your code located?* `./`
   - *Want to modify settings?* **No**
5. Once deployment completes, Vercel will output a Production URL. To publish to production:
   ```bash
   vercel --prod
   ```

---

## Part 3: Customizing the Code for Submission

Before submitting the assignment, ensure you open the project files and replace the student information placeholders:
1. Open `index.html`:
   - Line 32: Replace `YOUR_NAME` with your actual name.
   - Line 36: Replace `YOUR_REGISTER_NO` with your college register number.
   - Line 468: Replace `YOUR_NAME` and `YOUR_REGISTER_NO` in the footer credits.
2. Commit and push the changes:
   ```bash
   git add .
   git commit -m "docs: Update student credentials in header and footer"
   git push origin main
   ```
Vercel will detect this push and automatically update your live site!
