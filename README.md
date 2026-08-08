# Amit Das — portfolio site

A single-page portfolio with a light/dark toggle, a gated resume download
(email OTP verification), a free downloadable roadmap, and a guidance/contact
form that emails you.

## 1. Add your two PDFs

Before deploying, add these two files to the **root** of this folder
(same level as `index.html`):

- `resume.pdf` — your actual resume
- `roadmap.pdf` — the free study roadmap you want to give away

You can delete `PUT_RESUME_HERE.txt` and `PUT_ROADMAP_HERE.txt` once you've
added the real files.

## 2. Fill in your real links

Open `index.html` and replace:
- `YOUR-LINKEDIN-HANDLE` (appears twice) with your actual LinkedIn username
- `YOUR-GITHUB-HANDLE` with your actual GitHub username

## 3. Set up email sending (Resend)

The OTP emails and guidance-form emails are sent using
[Resend](https://resend.com) — it has a free tier (100 emails/day) and is the
simplest option to wire into Vercel.

1. Sign up at resend.com (free)
2. Get your API key from the dashboard
3. For `FROM_EMAIL`, you can use `onboarding@resend.dev` to start (works
   immediately, no domain setup needed). Later, you can verify your own
   domain in Resend to send from your own address.

## 4. Push this to GitHub

```
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

(Create the empty repo on GitHub first, then run the commands above from
inside this folder.)

## 5. Deploy on Vercel

1. Go to vercel.com, sign in with GitHub
2. Click "Add New" → "Project"
3. Select this repository
4. Framework preset: choose **Other** (this is a plain HTML/JS project, not
   Next.js)
5. Before clicking Deploy, open **Environment Variables** and add:

   | Key | Value |
   |---|---|
   | `RESEND_API_KEY` | your key from Resend |
   | `FROM_EMAIL` | `onboarding@resend.dev` (or your verified domain email) |
   | `OWNER_EMAIL` | `amitdasgupta254@gmail.com` |
   | `OTP_SECRET` | any long random string you make up, e.g. `x7Kp9...` |

6. Click **Deploy**

Your site will be live at `your-project.vercel.app` within a minute.

## 6. Making changes later

Every time you want to update something:

```
# edit files locally, then:
git add .
git commit -m "describe what you changed"
git push
```

Vercel automatically redeploys within about a minute. No dashboard steps
needed after the first deploy.

## 7. Custom domain (optional, later)

In the Vercel dashboard → your project → Settings → Domains, add your own
domain and follow the DNS instructions shown. Works on the free plan.

## How the resume gate works

- Visitor fills in name, email, purpose, optional mobile
- A 6-digit code is emailed to them, and a notification email (with their
  details) is sent to you — this is your download log, check your inbox
- They enter the code, which is verified using a signed token (no database
  needed)
- On success, `resume.pdf` downloads automatically

Note: the gate gives you clean lead capture and logging, but `resume.pdf`
is still a real static file, so anyone with the direct URL could technically
access it without going through the form. This is standard for this type of
lead-gated download and not usually a real-world concern for a resume.
