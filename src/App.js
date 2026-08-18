import React, { useState } from "react";

/* ---------------------------------------------------------
   API BASE
   This must match where your server.js is running.
   Change this if you used a different PORT in your .env.
--------------------------------------------------------- */
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

/* ---------------- static UI-only / demo data (not in the database) ---------------- */

const DEMO = {
  seeker: { email: "bobola@email.com", password: "password123", name: "Bobola Adewale", role: "seeker" },
  employer: { email: "hr@marvelouse.ng", password: "password123", name: "Ada Okonkwo", company: "Marvelouse Music", role: "employer" },
  admin: { email: "admin@employme.ng", password: "admin123", name: "Employme Admin", role: "admin" },
};

const DEMO_JOBS = [
  { id: 1, logo: "MM", bg: "#1155CC", company: "Marvelouse Music", loc: "Ede, Osun", type: "Full-time", applicants: 12, title: "Marketing Associate", tags: ["Social Media", "Content Writing", "Communication"], filters: ["entry", "fulltime"] },
  { id: 2, logo: "BT", bg: "#6B4FBB", company: "Baloo Travels & Tours", loc: "Ile-Ife, Osun", type: "Full-time", applicants: 7, title: "Visa Consultant (Entry-level)", tags: ["Customer Service", "Communication"], filters: ["entry", "fulltime"] },
  { id: 3, logo: "ZT", bg: "#C0392B", company: "Zenith Textiles Ltd", loc: "Lagos · Remote-friendly", type: "Contract", applicants: 24, title: "Junior Frontend Developer", tags: ["HTML", "CSS", "JavaScript", "React"], filters: ["remote", "entry"] },
  { id: 4, logo: "DL", bg: "#B7791F", company: "Ede Logistics Co.", loc: "Ede, Osun", type: "Full-time", applicants: 9, title: "Operations Assistant", tags: ["Communication", "MS Excel"], filters: ["entry", "fulltime"] },
  { id: 5, logo: "SF", bg: "#1E8E5A", company: "Sunrise Foods Nigeria", loc: "Ile-Ife, Osun", type: "Full-time", applicants: 15, title: "Store Supervisor", tags: ["Customer Service", "Team Lead"], filters: ["fulltime"] },
  { id: 6, logo: "OD", bg: "#0D3E99", company: "Osogbo Digital Hub", loc: "Osogbo, Osun", type: "Internship", applicants: 31, title: "Junior Web Developer (Internship)", tags: ["HTML", "CSS", "JavaScript", "Git"], filters: ["entry", "remote"] },
];

const DEMO_MATCHES = [
  { logo: "ZT", bg: "#C0392B", company: "Zenith Textiles Ltd", title: "Junior Frontend Developer", loc: "Lagos · Remote-friendly", type: "Contract", score: 95, strong: true, tags: ["HTML", "CSS", "JavaScript", "React"] },
  { logo: "OD", bg: "#0D3E99", company: "Osogbo Digital Hub", title: "Junior Web Developer (Internship)", loc: "Osogbo, Osun", type: "Internship", score: 82, strong: true, tags: ["HTML", "CSS", "JavaScript", "Git"] },
  { logo: "DL", bg: "#B7791F", company: "Ede Logistics Co.", title: "IT Support & Systems Assistant", loc: "Ede, Osun", type: "Full-time", score: 58, strong: false, tags: ["PHP/MySQL", "Networking"] },
];

const DEMO_APPLICATIONS = [
  { logo: "MM", bg: "#1155CC", title: "Marketing Associate", company: "Marvelouse Music · Ede", status: "shortlisted", steps: 3 },
  { logo: "BT", bg: "#6B4FBB", title: "Visa Consultant", company: "Baloo Travels & Tours · Ile-Ife", status: "viewed", steps: 2 },
  { logo: "ZT", bg: "#C0392B", title: "Junior Frontend Developer", company: "Zenith Textiles Ltd · Lagos", status: "applied", steps: 1 },
  { logo: "DL", bg: "#B7791F", title: "Operations Assistant", company: "Ede Logistics Co. · Ede", status: "viewed", steps: 2 },
];

const DEMO_MESSAGES = [
  { logo: "MM", bg: "#1155CC", from: "Marvelouse Music", text: "We'd love to schedule your interview — are you free Thursday?" },
  { logo: "BT", bg: "#6B4FBB", from: "Baloo Travels & Tours", text: "Thanks for applying — we've viewed your profile." },
  { logo: "DL", bg: "#B7791F", from: "Ede Logistics Co.", text: "Your application for Operations Assistant was viewed today." },
];

const DEMO_EMPLOYER_JOBS_INIT = [
  { title: "Marketing Associate", loc: "Ede, Osun", type: "Full-time", applicants: 12, status: "live" },
  { title: "Event Coordinator", loc: "Ede, Osun", type: "Full-time", applicants: 8, status: "live" },
  { title: "Social Media Intern", loc: "Remote", type: "Internship", applicants: 28, status: "live" },
];

const DEMO_APPLICANTS = [
  { name: "Bobola Adewale", role: "Marketing Associate", match: 92, skills: ["Social Media", "Content Writing"] },
  { name: "Folake Adebayo", role: "Marketing Associate", match: 78, skills: ["Communication", "Canva"] },
  { name: "Tobi Oladipo", role: "Event Coordinator", match: 85, skills: ["Event Planning", "Customer Service"] },
  { name: "Chioma Eze", role: "Social Media Intern", match: 71, skills: ["Instagram", "TikTok"] },
];

const DEMO_PENDING_INIT = [
  { company: "Greenfield Agro Ltd", contact: "Ibrahim Musa", phone: "+234 803…", date: "2 Aug 2026", status: "pending" },
  { company: "Osogbo Tech Labs", contact: "Amina Bello", phone: "+234 805…", date: "1 Aug 2026", status: "pending" },
  { company: "Ile-Ife Catering Co.", contact: "Yemi Ade", phone: "+234 809…", date: "31 Jul 2026", status: "pending" },
];

const STATUS_CLASS = { shortlisted: "status-green", viewed: "status-amber", applied: "status-blue", interview: "status-violet" };
const STATUS_LABEL = { shortlisted: "Shortlisted", viewed: "Viewed", applied: "Applied", interview: "Interview" };

/* ---------------- global styles (unchanged from the mockup) ---------------- */

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg); color: var(--ink); font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased; min-height: 100vh; line-height: 1.5;
    }

    :root {
      --bg: #F4F6F8; --surface: #FFFFFF; --border: #E1E6EB;
      --ink: #0B1F33; --ink-soft: #48586B; --ink-faint: #8393A3;
      --blue: #1155CC; --blue-deep: #0D3E99; --blue-soft: #E8EFFC;
      --green: #1E8E5A; --green-soft: #E6F4EC;
      --amber: #B7791F; --amber-soft: #FCF1DD;
      --red: #C0392B; --red-soft: #FBEAE8;
      --violet: #6B4FBB; --violet-soft: #EFEAFB;
      --radius-s: 8px; --radius-m: 12px; --radius-l: 16px;
      --shadow: 0 1px 2px rgba(11,31,51,0.05), 0 8px 24px -12px rgba(11,31,51,0.14);
    }

    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; }
    img { max-width: 100%; display: block; }
    :focus-visible { outline: 2.5px solid var(--blue); outline-offset: 2px; border-radius: 4px; }

    .wrap { max-width: 1120px; margin: 0 auto; padding: 0 20px; }

    /* ---- Logo ---- */
    .logo { font-weight: 800; font-size: 19px; letter-spacing: -0.01em; display: flex; align-items: center; gap: 2px; }
    .logo .dot { color: var(--blue); }

    /* ---- Buttons ---- */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600;
      transition: all .15s ease; white-space: nowrap; cursor: pointer;
    }
    .btn-primary { background: var(--blue); color: #fff; border: none; }
    .btn-primary:hover { background: var(--blue-deep); }
    .btn-outline { border: 1.5px solid var(--border); color: var(--ink); background: #fff; }
    .btn-outline:hover { border-color: var(--blue); color: var(--blue); }
    .btn-ghost { color: var(--ink-soft); background: none; border: none; }
    .btn-ghost:hover { background: var(--blue-soft); color: var(--blue-deep); }
    .btn-danger { background: var(--red-soft); color: var(--red); border: none; }
    .btn-danger:hover { background: #F6D9D6; }
    .btn-pill { border-radius: 999px; }
    .btn-sm { padding: 7px 14px; font-size: 12.5px; }
    .btn-block { width: 100%; }

    /* ---- Cards ---- */
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-m); }

    /* ---- Status pills ---- */
    .status-pill {
      font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px;
      text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; display: inline-block;
    }
    .status-green { background: var(--green-soft); color: var(--green); }
    .status-amber { background: var(--amber-soft); color: var(--amber); }
    .status-blue { background: var(--blue-soft); color: var(--blue-deep); }
    .status-violet { background: var(--violet-soft); color: var(--violet); }
    .status-red { background: var(--red-soft); color: var(--red); }

    /* ---- Avatar ---- */
    .avatar {
      border-radius: 50%; background: var(--blue); color: #fff; font-weight: 700;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    /* ---- Form ---- */
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--ink-soft); margin-bottom: 6px; }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%; padding: 11px 14px; border: 1.5px solid var(--border); border-radius: var(--radius-s);
      font-size: 14.5px; font-family: inherit; background: #fff; color: var(--ink);
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
      outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-soft);
    }
    .form-group textarea { min-height: 100px; resize: vertical; }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-hint { font-size: 12px; color: var(--ink-faint); margin-top: 5px; }
    .form-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; font-size: 13px; }
    .form-row label { display: flex; align-items: center; gap: 7px; color: var(--ink-soft); }
    .form-row a { color: var(--blue); font-weight: 600; cursor: pointer; }

    /* ---- Table ---- */
    table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    th { text-align: left; padding: 10px 12px; border-bottom: 2px solid var(--border); color: var(--ink-faint); font-weight: 600; font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; }
    td { padding: 12px; border-bottom: 1px solid var(--border); vertical-align: middle; }
    .table-wrap { overflow-x: auto; }

    /* ---- Toast ---- */
    .toast {
      position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px);
      background: var(--ink); color: #fff; padding: 12px 20px; border-radius: 999px; font-size: 14px;
      opacity: 0; transition: all .3s; z-index: 200; pointer-events: none;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    /* ===================== LANDING ===================== */
    .lp-header {
      position: sticky; top: 0; z-index: 50; background: rgba(244,246,248,0.92); backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
    }
    .lp-header-inner { display: flex; align-items: center; justify-content: space-between; height: 62px; gap: 16px; }
    .lp-nav { display: none; gap: 26px; }
    .lp-nav a { font-size: 14px; font-weight: 500; color: var(--ink-soft); cursor: pointer; }
    .lp-nav a:hover { color: var(--blue); }
    @media (min-width: 860px) { .lp-nav { display: flex; } }

    .lp-hero { padding: 56px 0 48px; }
    .lp-hero h1 { font-size: clamp(1.9rem, 4vw, 2.9rem); line-height: 1.16; margin-bottom: 16px; letter-spacing: -0.02em; }
    .lp-hero h1 span { color: var(--blue); }
    .lp-hero p { font-size: 16.5px; color: var(--ink-soft); max-width: 540px; margin-bottom: 26px; }
    .lp-hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 22px; }
    .lp-trust { font-size: 13px; color: var(--ink-faint); }

    .lp-features { padding: 12px 0 52px; }
    .lp-features-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
    @media (min-width: 760px) { .lp-features-grid { grid-template-columns: repeat(3, 1fr); } }
    .lp-feat { padding: 22px; }
    .lp-feat .ic { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; font-size: 18px; }
    .lp-feat h3 { font-size: 15.5px; font-weight: 700; margin-bottom: 6px; }
    .lp-feat p { font-size: 13.5px; color: var(--ink-soft); }

    .lp-jobs { padding: 8px 0 52px; }
    .lp-section-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 14px; margin-bottom: 22px; }
    .lp-section-head h2 { font-size: 1.5rem; letter-spacing: -0.01em; }
    .lp-section-head p { color: var(--ink-soft); font-size: 14px; max-width: 420px; }
    .lp-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
    .lp-filter {
      padding: 7px 15px; border-radius: 999px; font-size: 13px; font-weight: 600;
      background: #fff; border: 1.5px solid var(--border); color: var(--ink-soft); cursor: pointer;
    }
    .lp-filter.is-active, .lp-filter:hover { background: var(--blue-soft); border-color: var(--blue); color: var(--blue-deep); }
    .lp-jobs-grid { display: grid; gap: 14px; grid-template-columns: 1fr; }
    @media (min-width: 640px) { .lp-jobs-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1000px) { .lp-jobs-grid { grid-template-columns: repeat(3, 1fr); } }

    /* ---- Job cards ---- */
    .job-card { padding: 18px; cursor: pointer; transition: all .15s; display: flex; flex-direction: column; }
    .job-card:hover { border-color: var(--blue); box-shadow: var(--shadow); }
    .job-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .job-logo { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13.5px; color: #fff; }
    .job-title { font-size: 15.5px; font-weight: 700; margin-bottom: 2px; }
    .job-company { font-size: 13px; color: var(--ink-soft); margin-bottom: 10px; }
    .job-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; font-size: 12px; color: var(--ink-faint); }
    .job-meta span { background: var(--bg); padding: 3px 9px; border-radius: 6px; }
    .job-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
    .job-tag { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 6px; background: var(--blue-soft); color: var(--blue-deep); }
    .job-foot { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
    .job-foot .applied { font-size: 12px; color: var(--ink-faint); }

    .lp-employer { padding: 8px 0 52px; }
    .lp-employer-box { padding: 34px 30px; display: grid; gap: 24px; align-items: center; }
    @media (min-width: 800px) { .lp-employer-box { grid-template-columns: 1.2fr 0.8fr; } }
    .lp-employer-box h2 { font-size: 1.5rem; margin-bottom: 8px; letter-spacing: -0.01em; }
    .lp-employer-box p { color: var(--ink-soft); font-size: 14.5px; margin-bottom: 18px; }
    .lp-stats-row { display: flex; gap: 24px; flex-wrap: wrap; }
    .lp-stat strong { display: block; font-size: 1.5rem; color: var(--blue); }
    .lp-stat span { font-size: 12px; color: var(--ink-faint); }

    .lp-footer { border-top: 1px solid var(--border); padding: 36px 0 28px; margin-top: 20px; }
    .lp-footer-grid { display: grid; gap: 24px; grid-template-columns: 1fr; margin-bottom: 24px; }
    @media (min-width: 700px) { .lp-footer-grid { grid-template-columns: 1.4fr 1fr 1fr 1fr; } }
    .lp-footer-grid p { font-size: 13px; color: var(--ink-soft); margin-top: 8px; max-width: 260px; }
    .lp-footer-grid h4 { font-size: 12.5px; font-weight: 700; color: var(--ink-faint); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 10px; }
    .lp-footer-grid a { display: block; font-size: 13.5px; color: var(--ink-soft); padding: 4px 0; cursor: pointer; }
    .lp-footer-grid a:hover { color: var(--blue); }
    .lp-footer-bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; font-size: 12.5px; color: var(--ink-faint); padding-top: 20px; border-top: 1px solid var(--border); }

    /* ===================== AUTH ===================== */
    .auth-shell { min-height: 100vh; display: flex; flex-direction: column; }
    .auth-top { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--border); }
    .auth-top .back { font-size: 13.5px; font-weight: 500; color: var(--ink-soft); cursor: pointer; }
    .auth-top .back:hover { color: var(--blue); }
    .auth-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 36px 20px; }
    .auth-card { width: 100%; max-width: 420px; padding: 32px 30px; }
    .auth-card h1 { font-size: 1.5rem; margin-bottom: 6px; letter-spacing: -0.01em; }
    .auth-card .sub { color: var(--ink-soft); font-size: 14px; margin-bottom: 22px; }
    .role-switch { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
    .role-btn {
      padding: 12px; border-radius: var(--radius-s); border: 1.5px solid var(--border);
      text-align: center; font-weight: 600; font-size: 13.5px; color: var(--ink-soft); background: #fff; cursor: pointer;
    }
    .role-btn.is-active { border-color: var(--blue); background: var(--blue-soft); color: var(--blue-deep); }
    .role-btn small { display: block; font-weight: 500; font-size: 11px; color: var(--ink-faint); margin-top: 2px; }
    .role-btn.is-active small { color: var(--blue-deep); }
    .auth-tabs { display: flex; gap: 4px; background: var(--bg); padding: 4px; border-radius: 999px; margin-bottom: 20px; }
    .auth-tab { flex: 1; padding: 9px; border-radius: 999px; font-weight: 600; font-size: 13.5px; color: var(--ink-faint); cursor: pointer; }
    .auth-tab.is-active { background: #fff; color: var(--blue-deep); box-shadow: var(--shadow); }
    .divider { display: flex; align-items: center; gap: 12px; margin: 18px 0; font-size: 12.5px; color: var(--ink-faint); }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
    .auth-footer { text-align: center; margin-top: 18px; font-size: 13.5px; color: var(--ink-soft); }
    .auth-footer a { color: var(--blue); font-weight: 600; cursor: pointer; }
    .info-pill { margin-top: 20px; padding: 12px 14px; background: var(--blue-soft); border-radius: var(--radius-s); font-size: 12.5px; color: var(--blue-deep); }
    .msg-banner { padding: 10px 14px; border-radius: var(--radius-s); font-size: 13px; margin-bottom: 16px; }
    .msg-banner.error { background: var(--red-soft); color: var(--red); }
    .msg-banner.success { background: var(--green-soft); color: var(--green); }

    /* ===================== APP SHELL ===================== */
    .shell { display: flex; min-height: 100vh; }
    .sidebar { display: none; width: 236px; flex-shrink: 0; background: var(--surface); border-right: 1px solid var(--border); padding: 18px 12px; flex-direction: column; }
    @media (min-width: 960px) { .sidebar { display: flex; } }
    .sidebar .logo { padding: 6px 8px 24px; }
    .sidenav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .sidenav a { display: flex; align-items: center; gap: 11px; padding: 10px 11px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--ink-soft); cursor: pointer; }
    .sidenav a:hover, .sidenav a.is-active { background: var(--blue-soft); color: var(--blue-deep); font-weight: 600; }
    .sidebar-foot { margin-top: auto; padding: 14px 6px 0; border-top: 1px solid var(--border); display: flex; gap: 10px; align-items: center; }
    .sidebar-foot .avatar { width: 36px; height: 36px; font-size: 13px; }
    .sidebar-foot strong { font-size: 13.5px; display: block; }
    .sidebar-foot small { font-size: 11.5px; color: var(--ink-faint); }
    .main { flex: 1; min-width: 0; }
    .topbar {
      display: flex; align-items: center; gap: 12px; padding: 12px 20px; background: rgba(244,246,248,0.94);
      backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 30;
    }
    .topbar h1 { font-size: 15.5px; font-weight: 700; flex: 1; }
    .search-box {
      flex: 1; max-width: 400px; display: flex; align-items: center; gap: 8px; background: #fff;
      border: 1.5px solid var(--border); border-radius: 999px; padding: 8px 15px;
    }
    .search-box input { border: none; outline: none; background: transparent; flex: 1; font-size: 13.5px; font-family: inherit; }
    .topbar-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
    .content { padding: 22px 20px 40px; max-width: 1080px; width: 100%; margin: 0 auto; }
    .page-head h1 { font-size: 1.4rem; letter-spacing: -0.01em; margin-bottom: 4px; }
    .page-head p { color: var(--ink-soft); font-size: 14px; margin-bottom: 22px; }

    .stats-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
    @media (min-width: 760px) { .stats-row { grid-template-columns: repeat(4, 1fr); } }
    .stat-card { padding: 16px; }
    .stat-card strong { display: block; font-size: 1.5rem; color: var(--blue-deep); }
    .stat-card span { font-size: 12px; color: var(--ink-faint); }

    .banner { padding: 15px 18px; border-radius: var(--radius-m); margin-bottom: 22px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
    .banner.info { background: var(--blue-soft); border: 1px solid #C7DBFA; }
    .banner h3 { font-size: 14px; font-weight: 700; }
    .banner p { font-size: 12.5px; color: var(--ink-soft); }
    .progress-bar { height: 7px; background: #DDE6F1; border-radius: 999px; overflow: hidden; width: 140px; margin-top: 8px; }
    .progress-bar span { display: block; height: 100%; background: var(--blue); border-radius: 999px; transition: width .4s; }

    .section-card { padding: 20px; margin-bottom: 20px; }
    .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
    .section-head h2 { font-size: 15px; font-weight: 700; }

    .row-item { display: flex; gap: 14px; align-items: flex-start; padding: 13px 0; border-bottom: 1px solid var(--border); }
    .row-item:last-child { border-bottom: none; }
    .row-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; flex-shrink: 0; }
    .row-info { flex: 1; min-width: 0; }
    .row-info h4 { font-size: 14px; font-weight: 600; }
    .row-info p { font-size: 12.5px; color: var(--ink-soft); }
    .timeline-mini { display: flex; gap: 4px; margin-top: 7px; }
    .timeline-mini span { width: 20px; height: 4px; border-radius: 2px; background: var(--border); }
    .timeline-mini span.done { background: var(--blue); }
    .timeline-mini span.active { background: var(--amber); }

    .skills-input { display: flex; flex-wrap: wrap; gap: 8px; padding: 9px; border: 1.5px solid var(--border); border-radius: var(--radius-s); background: #fff; min-height: 46px; align-items: center; }
    .skill-chip { background: var(--blue-soft); color: var(--blue-deep); font-size: 12px; font-weight: 600; padding: 5px 9px; border-radius: 6px; display: flex; align-items: center; gap: 6px; }
    .skill-chip button { font-size: 13px; opacity: .7; cursor: pointer; }
    .skills-input input { border: none; outline: none; background: transparent; flex: 1; min-width: 100px; font-size: 13.5px; font-family: inherit; }

    .match-card { padding: 15px; margin-bottom: 10px; transition: all .15s; }
    .match-card:hover { border-color: var(--blue); box-shadow: var(--shadow); }
    .match-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .match-score { font-size: 12px; font-weight: 700; padding: 4px 9px; border-radius: 999px; }
    .match-bar { height: 6px; background: var(--border); border-radius: 3px; max-width: 120px; margin-top: 6px; }
    .match-bar span { display: block; height: 100%; background: var(--blue); border-radius: 3px; }

    .grid-2 { display: grid; gap: 20px; }
    @media (min-width: 900px) { .grid-2 { grid-template-columns: 1.2fr 0.8fr; } }

    .bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 40; background: var(--surface); border-top: 1px solid var(--border); padding: 8px 0; justify-content: space-around; }
    @media (min-width: 960px) { .bottom-nav { display: none; } }
    .bottom-nav a { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 10.5px; font-weight: 600; color: var(--ink-faint); padding: 6px 12px; cursor: pointer; }
    .bottom-nav a.is-active { color: var(--blue-deep); }
    .has-bottom-nav { padding-bottom: 66px; }
    @media (min-width: 960px) { .has-bottom-nav { padding-bottom: 0; } }
  `}</style>
);

/* ---------------- small icon components ---------------- */

function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

/* ---------------- sub-components ---------------- */

function Toast({ msg }) {
  return <div className={`toast${msg ? " show" : ""}`}>{msg}</div>;
}

/* ---- Landing page ---- */
function LandingJobCard({ job, onApply }) {
  return (
    <article className="card job-card" onClick={onApply}>
      <div className="job-top">
        <div className="job-logo" style={{ background: job.bg }}>{job.logo}</div>
        <span className="status-pill status-green">Verified</span>
      </div>
      <div className="job-title">{job.title}</div>
      <div className="job-company">{job.company}</div>
      <div className="job-meta">
        <span>📍 {job.loc}</span>
        <span>🕒 {job.type}</span>
        <span>👥 {job.applicants} applied</span>
      </div>
      <div className="job-tags">{job.tags.map((t) => <span key={t} className="job-tag">{t}</span>)}</div>
      <div className="job-foot">
        <span className="applied">{job.applicants} applicants</span>
        <span className="btn btn-primary btn-sm">Apply</span>
      </div>
    </article>
  );
}

function LandingScreen({ openAuth }) {
  const [filter, setFilter] = useState("all");
  const filters = [
    { key: "all", label: "All roles" },
    { key: "remote", label: "Remote friendly" },
    { key: "entry", label: "Entry level" },
    { key: "fulltime", label: "Full-time" },
  ];
  const filtered = filter === "all" ? DEMO_JOBS : DEMO_JOBS.filter((j) => j.filters.includes(filter));

  return (
    <div>
      {/* Header */}
      <header className="lp-header">
        <div className="wrap lp-header-inner">
          <span className="logo">Employme<span className="dot">.</span></span>
          <nav className="lp-nav">
            <a href="#jobs">Find work</a>
            <a href="#employers">For employers</a>
          </nav>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-ghost" onClick={() => openAuth("login", "seeker")}>Log in</button>
            <button className="btn btn-primary" onClick={() => openAuth("signup", "seeker")}>Sign up free</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="lp-hero">
        <div className="wrap">
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--blue-deep)", marginBottom: 10 }}>Built for Nigeria's job market</p>
          <h1>Stop refreshing your inbox. <span>Start knowing</span> where you stand.</h1>
          <p>Employme connects job seekers with verified employers directly, and shows you exactly what's happening with every application, at every stage.</p>
          <div className="lp-hero-ctas">
            <button className="btn btn-primary" onClick={() => openAuth("signup", "seeker")}>I'm job hunting</button>
            <button className="btn btn-outline" onClick={() => openAuth("signup", "employer")}>I'm hiring</button>
          </div>
          <p className="lp-trust">Joined this week by seekers in Lagos, Ede, Ile-Ife &amp; Osogbo</p>
        </div>
      </section>

      {/* Features */}
      <section className="lp-features">
        <div className="wrap lp-features-grid">
          <div className="card lp-feat">
            <div className="ic" style={{ background: "var(--blue-soft)" }}>🛡️</div>
            <h3>Verified employers only</h3>
            <p>Every company passes a document + phone check before they can post a single role. No ghost listings.</p>
          </div>
          <div className="card lp-feat">
            <div className="ic" style={{ background: "var(--amber-soft)" }}>₦</div>
            <h3>No hidden costs</h3>
            <p>Pricing is shown upfront, before you commit to anything. Job seekers are always free.</p>
          </div>
          <div className="card lp-feat">
            <div className="ic" style={{ background: "var(--violet-soft)" }}>⚡</div>
            <h3>Real-time status updates</h3>
            <p>Applied → Viewed → Shortlisted → Decision. You always know exactly where things stand.</p>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="lp-jobs" id="jobs">
        <div className="wrap">
          <div className="lp-section-head">
            <div>
              <h2>Open roles</h2>
              <p>Every listing is from an employer who completed Employme's verification process.</p>
            </div>
          </div>
          <div className="lp-filters">
            {filters.map((f) => (
              <button
                key={f.key}
                className={`lp-filter${filter === f.key ? " is-active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="lp-jobs-grid">
            {filtered.map((j) => (
              <LandingJobCard key={j.id} job={j} onApply={() => openAuth("signup", "seeker")} />
            ))}
          </div>
        </div>
      </section>

      {/* For employers */}
      <section className="lp-employer" id="employers">
        <div className="wrap">
          <div className="card lp-employer-box">
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--blue-deep)", marginBottom: 8 }}>For employers</p>
              <h2>Post a job employers actually get answered for</h2>
              <p>Complete verification once, then post roles, review skill-matched applicants, and respond — all with the same transparency job seekers see.</p>
              <button className="btn btn-primary" onClick={() => openAuth("signup", "employer")}>Start verification</button>
            </div>
            <div className="lp-stats-row">
              <div className="lp-stat"><strong>48hrs</strong><span>avg. time to verified</span></div>
              <div className="lp-stat"><strong>0</strong><span>hidden fees</span></div>
              <div className="lp-stat"><strong>3×</strong><span>faster first response</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="wrap">
          <div className="lp-footer-grid">
            <div>
              <span className="logo">Employme<span className="dot">.</span></span>
              <p>Connecting job seekers and verified employers across Nigeria — with real communication at every step.</p>
            </div>
            <div>
              <h4>Product</h4>
              <a href="#jobs">Find work</a>
              <a href="#employers">For employers</a>
            </div>
            <div>
              <h4>Trust</h4>
              <a href="#">Verification process</a>
              <a href="#">Privacy</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="mailto:hello@employme.ng">Contact</a>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span>© 2026 Employme. Built in Nigeria.</span>
            <span>hello@employme.ng</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---- Auth screen ---- */
function AuthScreen({ goToLanding, onLogin }) {
  const [authMode, setAuthMode] = useState("login");
  const [authRole, setAuthRole] = useState("seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [remember, setRemember] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isSignup = authMode === "signup";
  const isEmployer = authRole === "employer";

  function getTitle() {
    if (isSignup) return isEmployer ? "Create employer account" : "Create free account";
    return "Welcome back";
  }
  function getSub() {
    if (isSignup) return isEmployer ? "Verify once, then post roles and review candidates." : "Build your profile, apply to verified roles, and track every step.";
    return isEmployer ? "Log in to manage jobs, applicants and messages." : "Log in to see live application status and new matches.";
  }
  function getSubmitLabel() {
    if (isSignup) return isEmployer ? "Create & start verification" : "Create free account";
    return "Log in to my account";
  }
  function getInfo() {
    if (isSignup && isEmployer) return "Employer accounts require a quick document + phone check (avg 48hrs) before you can post jobs.";
    return "Job seeker accounts are always free. Employer accounts go through a quick verification step before you can post.";
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(""); setSuccessMsg("");

    if (authMode === "login") {
      // Demo login logic
      const match = Object.values(DEMO).find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password
      );
      if (match) {
        onLogin(match);
      } else {
        setErrorMsg("Incorrect email or password. Demo: bobola@email.com / password123");
      }
    } else {
      // Demo signup — create a seeker or employer session
      if (!name.trim() || !email.trim() || password.length < 8) {
        setErrorMsg("Please fill in all fields. Password must be at least 8 characters.");
        return;
      }
      setSuccessMsg("Account created! Taking you in…");
      setTimeout(() => {
        onLogin({ name, email, role: authRole, company: company || undefined });
      }, 800);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-top">
        <span className="logo" onClick={goToLanding} style={{ cursor: "pointer" }}>Employme<span className="dot">.</span></span>
        <span className="back" onClick={goToLanding}>← Back to site</span>
      </div>
      <div className="auth-main">
        <div className="card auth-card">
          <h1>{getTitle()}</h1>
          <p className="sub">{getSub()}</p>

          {/* Role switch */}
          <div className="role-switch">
            {["seeker", "employer"].map((r) => (
              <button
                key={r}
                type="button"
                className={`role-btn${authRole === r ? " is-active" : ""}`}
                onClick={() => setAuthRole(r)}
              >
                {r === "seeker" ? "Job seeker" : "Employer"}
                <small>{r === "seeker" ? "Find verified roles" : "Post & hire"}</small>
              </button>
            ))}
          </div>

          {/* Login / signup tabs */}
          <div className="auth-tabs">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                type="button"
                className={`auth-tab${authMode === m ? " is-active" : ""}`}
                onClick={() => setAuthMode(m)}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          {errorMsg && <div className="msg-banner error">{errorMsg}</div>}
          {successMsg && <div className="msg-banner success">{successMsg}</div>}

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="form-group">
                <label>Full name</label>
                <input type="text" placeholder="e.g. Bobola Adewale" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="form-group">
              <label>Email address</label>
              <input type="email" placeholder="you@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
              {isSignup && <p className="form-hint">Use at least 8 characters.</p>}
            </div>
            {isSignup && isEmployer && (
              <div className="form-group">
                <label>Company name</label>
                <input type="text" placeholder="e.g. Marvelouse Music" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            )}
            <div className="form-row">
              <label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
              <a onClick={() => alert("Password reset link would be sent to your email.\nDemo: bobola@email.com / password123")}>Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-primary btn-block">{getSubmitLabel()}</button>
          </form>

          <div className="divider">or continue with</div>
          <button type="button" className="btn btn-outline btn-block">Continue with Google</button>

          <div className="auth-footer">
            {isSignup
              ? <span>Already have an account? <a onClick={() => setAuthMode("login")}>Log in</a></span>
              : <span>New to Employme? <a onClick={() => setAuthMode("signup")}>Create an account</a></span>
            }
          </div>
          <div className="info-pill">{getInfo()}</div>
        </div>
      </div>
    </div>
  );
}

/* ---- Seeker dashboard ---- */
function SeekerDashboard({ user, goToLanding, showToast }) {
  const [section, setSection] = useState("overview");
  const [skills, setSkills] = useState(["HTML", "CSS", "JavaScript", "Communication"]);
  const [skillInput, setSkillInput] = useState("");
  const [pfName, setPfName] = useState(user.name || "Bobola Adewale");
  const [pfHeadline, setPfHeadline] = useState("");
  const [pfExperience, setPfExperience] = useState("");
  const [pfEducation, setPfEducation] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  function profilePct() {
    let pct = 20;
    if (skills.length >= 3) pct += 25;
    if (pfExperience.trim().length > 20) pct += 25;
    if (pfEducation.trim().length > 10) pct += 20;
    if (pfHeadline.trim()) pct += 10;
    return Math.min(100, pct);
  }

  function addSkill(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = skillInput.trim();
      if (v && !skills.includes(v)) setSkills([...skills, v]);
      setSkillInput("");
    }
  }

  function saveProfile(e) {
    e.preventDefault();
    setProfileSaved(true);
    showToast("Profile saved successfully");
  }

  const navItems = [
    { key: "overview", label: "Dashboard" },
    { key: "jobs", label: "Browse jobs" },
    { key: "applications", label: "Applications" },
    { key: "profile", label: "Profile & CV" },
    { key: "messages", label: "Messages" },
  ];
  const bottomNav = [
    { key: "overview", label: "Home" },
    { key: "jobs", label: "Jobs" },
    { key: "applications", label: "Apps" },
    { key: "profile", label: "Profile" },
  ];

  const avi = initials(pfName);

  return (
    <div className="has-bottom-nav">
      <div className="shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <span className="logo" onClick={goToLanding} style={{ cursor: "pointer" }}>Employme<span className="dot">.</span></span>
          <nav className="sidenav">
            {navItems.map((n) => (
              <a key={n.key} className={section === n.key ? "is-active" : ""} onClick={() => setSection(n.key)}>{n.label}</a>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{avi}</div>
            <div><strong>{pfName}</strong><small>Job seeker</small></div>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="topbar">
            <div className="search-box">
              <span>🔍</span>
              <input type="search" placeholder="Search roles, companies…" />
            </div>
            <div className="topbar-actions">
              <button className="btn btn-ghost btn-sm" onClick={goToLanding}>Log out</button>
            </div>
          </header>

          <div className="content">

            {/* Overview */}
            {section === "overview" && (
              <div>
                <div className="page-head">
                  <h1>Welcome back, {pfName.split(" ")[0]}</h1>
                  <p>Here's what's happening with your job search.</p>
                </div>
                <div className="card banner info">
                  <div>
                    <h3>Complete your profile</h3>
                    <p>Add skills, experience and education — complete profiles get matched to more roles.</p>
                    <div className="progress-bar"><span style={{ width: profilePct() + "%" }} /></div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setSection("profile")}>Complete profile</button>
                </div>
                <div className="stats-row">
                  <div className="card stat-card"><strong>5</strong><span>Active applications</span></div>
                  <div className="card stat-card"><strong>12</strong><span>New matches this week</span></div>
                  <div className="card stat-card"><strong>2</strong><span>Awaiting response</span></div>
                  <div className="card stat-card"><strong>1</strong><span>Interview scheduled</span></div>
                </div>
                <div className="grid-2">
                  <div className="card section-card">
                    <div className="section-head"><h2>Your applications</h2><button className="btn btn-ghost btn-sm" onClick={() => setSection("applications")}>View all</button></div>
                    {DEMO_APPLICATIONS.slice(0, 3).map((a, i) => (
                      <div key={i} className="row-item">
                        <div className="row-icon" style={{ background: a.bg }}>{a.logo}</div>
                        <div className="row-info">
                          <h4>{a.title}</h4><p>{a.company}</p>
                          <div className="timeline-mini">
                            {[1, 2, 3, 4].map((step) => (
                              <span key={step} className={step < a.steps ? "done" : step === a.steps ? "active" : ""} />
                            ))}
                          </div>
                        </div>
                        <span className={`status-pill ${STATUS_CLASS[a.status]}`}>{STATUS_LABEL[a.status]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="card section-card">
                    <div className="section-head"><h2>Messages</h2><span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--red)" }}>3 unread</span></div>
                    {DEMO_MESSAGES.map((m, i) => (
                      <div key={i} className="row-item">
                        <div className="row-icon" style={{ background: m.bg, width: 38, height: 38, fontSize: 12 }}>{m.logo}</div>
                        <div className="row-info"><h4>{m.from}</h4><p>{m.text}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card section-card">
                  <div className="section-head"><h2>New matches for you</h2><button className="btn btn-ghost btn-sm" onClick={() => setSection("jobs")}>Browse all</button></div>
                  {DEMO_MATCHES.map((m, i) => (
                    <div key={i} className="card match-card">
                      <div className="match-top">
                        <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                          <div className="row-icon" style={{ background: m.bg }}>{m.logo}</div>
                          <div><strong style={{ fontSize: 13.5 }}>{m.company}</strong> <span className="status-pill status-green" style={{ marginLeft: 6, fontSize: 10 }}>Verified</span></div>
                        </div>
                        <span className={`match-score ${m.strong ? "status-green" : "status-amber"}`}>{m.score}% match</span>
                      </div>
                      <h4 style={{ fontSize: 14.5, margin: "6px 0 3px" }}>{m.title}</h4>
                      <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginBottom: 9 }}>📍 {m.loc} · 🕒 {m.type}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 11 }}>
                        {m.tags.map((t) => <span key={t} className="job-tag">{t}</span>)}
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => showToast("Application submitted! Track it in Applications.")}>Apply</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile */}
            {section === "profile" && (
              <div>
                <div className="page-head">
                  <h1>Your profile &amp; CV</h1>
                  <p>Employers only see this after you apply. Keep it complete for better matches.</p>
                </div>
                <div className="card section-card">
                  <form onSubmit={saveProfile}>
                    <div className="form-group"><label>Full name</label><input type="text" value={pfName} onChange={(e) => setPfName(e.target.value)} /></div>
                    <div className="form-group"><label>Headline / desired role</label><input type="text" placeholder="e.g. Marketing graduate · Content &amp; Social Media" value={pfHeadline} onChange={(e) => setPfHeadline(e.target.value)} /></div>
                    <div className="form-group">
                      <label>Skills <span style={{ fontWeight: 400, color: "var(--ink-faint)" }}>(press Enter to add)</span></label>
                      <div className="skills-input">
                        {skills.map((s, i) => (
                          <span key={i} className="skill-chip">
                            {s} <button type="button" onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}>×</button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="Add a skill…"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={addSkill}
                        />
                      </div>
                    </div>
                    <div className="form-group"><label>Work experience</label><textarea placeholder="Role, company, dates, key achievements…" value={pfExperience} onChange={(e) => setPfExperience(e.target.value)} /></div>
                    <div className="form-group"><label>Education</label><textarea placeholder="Degree, institution, year…" value={pfEducation} onChange={(e) => setPfEducation(e.target.value)} /></div>
                    <button type="submit" className="btn btn-primary">Save profile</button>
                    {profileSaved && <span style={{ marginLeft: 12, fontSize: 13, color: "var(--green)" }}>✓ Saved</span>}
                  </form>
                </div>
              </div>
            )}

            {/* Applications */}
            {section === "applications" && (
              <div>
                <div className="page-head"><h1>All applications</h1><p>Track status in real time — applied, viewed, shortlisted, decision.</p></div>
                <div className="card section-card">
                  {DEMO_APPLICATIONS.map((a, i) => (
                    <div key={i} className="row-item">
                      <div className="row-icon" style={{ background: a.bg }}>{a.logo}</div>
                      <div className="row-info">
                        <h4>{a.title}</h4><p>{a.company}</p>
                        <div className="timeline-mini">
                          {[1, 2, 3, 4].map((step) => (
                            <span key={step} className={step < a.steps ? "done" : step === a.steps ? "active" : ""} />
                          ))}
                        </div>
                      </div>
                      <span className={`status-pill ${STATUS_CLASS[a.status]}`}>{STATUS_LABEL[a.status]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Browse jobs */}
            {section === "jobs" && (
              <div>
                <div className="page-head"><h1>Browse jobs</h1><p>Only verified employers. Matched to your skills when profile is complete.</p></div>
                {DEMO_MATCHES.map((m, i) => (
                  <div key={i} className="card match-card">
                    <div className="match-top">
                      <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                        <div className="row-icon" style={{ background: m.bg }}>{m.logo}</div>
                        <div><strong style={{ fontSize: 13.5 }}>{m.company}</strong> <span className="status-pill status-green" style={{ marginLeft: 6, fontSize: 10 }}>Verified</span></div>
                      </div>
                      <span className={`match-score ${m.strong ? "status-green" : "status-amber"}`}>{m.score}% match</span>
                    </div>
                    <h4 style={{ fontSize: 14.5, margin: "6px 0 3px" }}>{m.title}</h4>
                    <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginBottom: 9 }}>📍 {m.loc} · 🕒 {m.type}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 11 }}>
                      {m.tags.map((t) => <span key={t} className="job-tag">{t}</span>)}
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => showToast("Application submitted! Track it in Applications.")}>Apply</button>
                  </div>
                ))}
              </div>
            )}

            {/* Messages */}
            {section === "messages" && (
              <div>
                <div className="page-head"><h1>Messages</h1><p>Chat directly with verified employers about your applications.</p></div>
                <div className="card section-card">
                  {DEMO_MESSAGES.map((m, i) => (
                    <div key={i} className="row-item">
                      <div className="row-icon" style={{ background: m.bg, width: 38, height: 38, fontSize: 12 }}>{m.logo}</div>
                      <div className="row-info"><h4>{m.from}</h4><p>{m.text}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {bottomNav.map((n) => (
          <a key={n.key} className={section === n.key ? "is-active" : ""} onClick={() => setSection(n.key)}>{n.label}</a>
        ))}
      </nav>
    </div>
  );
}

/* ---- Employer dashboard ---- */
function EmployerDashboard({ user, goToLanding, showToast }) {
  const [section, setSection] = useState("overview");
  const [employerJobs, setEmployerJobs] = useState(DEMO_EMPLOYER_JOBS_INIT);
  const [jobTitle, setJobTitle] = useState("");
  const [jobLoc, setJobLoc] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [jobSkills, setJobSkills] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  const navItems = [
    { key: "overview", label: "Dashboard" },
    { key: "jobs", label: "My job posts" },
    { key: "post", label: "Post a job" },
    { key: "applicants", label: "Applicants" },
    { key: "messages", label: "Messages" },
  ];
  const bottomNav = [
    { key: "overview", label: "Home" },
    { key: "jobs", label: "Jobs" },
    { key: "post", label: "Post" },
    { key: "applicants", label: "Applicants" },
  ];

  function postJob(e) {
    e.preventDefault();
    const newJob = { title: jobTitle, loc: jobLoc, type: jobType, applicants: 0, status: "live" };
    setEmployerJobs([newJob, ...employerJobs]);
    showToast(`"${jobTitle}" published! Skill-matched candidates will appear in Applicants.`);
    setJobTitle(""); setJobLoc(""); setJobType("Full-time"); setJobSkills(""); setJobDesc("");
    setSection("jobs");
  }

  const avi = initials(user.name || "AO");

  return (
    <div className="has-bottom-nav">
      <div className="shell">
        <aside className="sidebar">
          <span className="logo" onClick={goToLanding} style={{ cursor: "pointer" }}>Employme<span className="dot">.</span></span>
          <nav className="sidenav">
            {navItems.map((n) => (
              <a key={n.key} className={section === n.key ? "is-active" : ""} onClick={() => setSection(n.key)}>{n.label}</a>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{avi}</div>
            <div><strong>{user.name || "Ada Okonkwo"}</strong><small>Employer</small></div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <h1>Employer workspace</h1>
            <button className="btn btn-primary btn-sm" onClick={() => setSection("post")}>+ Post a job</button>
            <button className="btn btn-ghost btn-sm" onClick={goToLanding}>Log out</button>
          </header>

          <div className="content">

            {/* Overview */}
            {section === "overview" && (
              <div>
                <div className="page-head">
                  <h1>Hello, {(user.name || "Ada").split(" ")[0]}</h1>
                  <p>Manage your verified listings and review skill-matched candidates.</p>
                </div>
                <div className="card banner info">
                  <div><h3>✓ Company verified</h3><p>Passed document &amp; phone checks. You can post roles for free.</p></div>
                  <span className="status-pill status-green">Verified</span>
                </div>
                <div className="stats-row">
                  <div className="card stat-card"><strong>{employerJobs.length}</strong><span>Active job posts</span></div>
                  <div className="card stat-card"><strong>48</strong><span>Total applicants</span></div>
                  <div className="card stat-card"><strong>12</strong><span>Awaiting review</span></div>
                  <div className="card stat-card"><strong>2</strong><span>Interviews this week</span></div>
                </div>
                <div className="card section-card">
                  <div className="section-head"><h2>Your active jobs</h2><button className="btn btn-ghost btn-sm" onClick={() => setSection("jobs")}>View all</button></div>
                  {employerJobs.map((j, i) => (
                    <div key={i} className="row-item">
                      <div className="row-info"><h4>{j.title}</h4><p>📍 {j.loc} · {j.type} · {j.applicants} applicants</p></div>
                      <span className="status-pill status-green">{j.status}</span>
                      <button className="btn btn-outline btn-sm" onClick={() => setSection("applicants")}>View applicants</button>
                    </div>
                  ))}
                </div>
                <div className="card section-card">
                  <div className="section-head"><h2>Top matched applicants</h2><button className="btn btn-ghost btn-sm" onClick={() => setSection("applicants")}>View all</button></div>
                  {DEMO_APPLICANTS.slice(0, 3).map((a, i) => (
                    <div key={i} className="row-item">
                      <div className="avatar" style={{ width: 42, height: 42 }}>{initials(a.name)}</div>
                      <div className="row-info">
                        <h4>{a.name}</h4>
                        <p>Applied for <strong>{a.role}</strong> · {a.match}% skill match</p>
                        <div>{a.skills.map((s) => <span key={s} className="job-tag">{s}</span>)}</div>
                        <div className="match-bar"><span style={{ width: a.match + "%" }} /></div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => showToast("Candidate shortlisted")}>Shortlist</button>
                        <button className="btn btn-outline btn-sm" onClick={() => showToast("Message sent (demo)")}>Message</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My job posts */}
            {section === "jobs" && (
              <div>
                <div className="page-head"><h1>My job posts</h1><p>All listings from your verified company.</p></div>
                <div className="card section-card">
                  {employerJobs.map((j, i) => (
                    <div key={i} className="row-item">
                      <div className="row-info"><h4>{j.title}</h4><p>📍 {j.loc} · {j.type} · {j.applicants} applicants</p></div>
                      <span className="status-pill status-green">{j.status}</span>
                      <button className="btn btn-outline btn-sm" onClick={() => setSection("applicants")}>View applicants</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post a job */}
            {section === "post" && (
              <div>
                <div className="page-head"><h1>Post a new job</h1><p>Free · verified badge included · no subscription.</p></div>
                <div className="card section-card">
                  <form onSubmit={postJob}>
                    <div className="form-group"><label>Job title</label><input type="text" placeholder="e.g. Marketing Associate" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} /></div>
                    <div className="form-row-2">
                      <div className="form-group"><label>Location</label><input type="text" placeholder="e.g. Ede, Osun" required value={jobLoc} onChange={(e) => setJobLoc(e.target.value)} /></div>
                      <div className="form-group">
                        <label>Employment type</label>
                        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                          <option>Full-time</option>
                          <option>Contract</option>
                          <option>Internship</option>
                          <option>Part-time</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group"><label>Required skills (comma-separated)</label><input type="text" placeholder="e.g. Social Media, Content Writing" value={jobSkills} onChange={(e) => setJobSkills(e.target.value)} /></div>
                    <div className="form-group"><label>Job description</label><textarea placeholder="Describe the role, responsibilities…" required value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} /></div>
                    <button type="submit" className="btn btn-primary">Publish job · Free</button>
                  </form>
                </div>
              </div>
            )}

            {/* Applicants */}
            {section === "applicants" && (
              <div>
                <div className="page-head"><h1>Applicants</h1><p>Skill-matched candidates for your open roles.</p></div>
                <div className="card section-card">
                  {DEMO_APPLICANTS.map((a, i) => (
                    <div key={i} className="row-item">
                      <div className="avatar" style={{ width: 42, height: 42 }}>{initials(a.name)}</div>
                      <div className="row-info">
                        <h4>{a.name}</h4>
                        <p>Applied for <strong>{a.role}</strong> · {a.match}% skill match</p>
                        <div>{a.skills.map((s) => <span key={s} className="job-tag">{s}</span>)}</div>
                        <div className="match-bar"><span style={{ width: a.match + "%" }} /></div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => showToast("Candidate shortlisted")}>Shortlist</button>
                        <button className="btn btn-outline btn-sm" onClick={() => showToast("Message sent (demo)")}>Message</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {section === "messages" && (
              <div>
                <div className="page-head"><h1>Messages</h1><p>Conversations with candidates.</p></div>
                <div className="card section-card">
                  <div className="row-item">
                    <div className="avatar" style={{ background: "#1155CC" }}>BA</div>
                    <div className="row-info"><h4>Bobola Adewale</h4><p>Re: Marketing Associate — "I'd be free Thursday afternoon."</p></div>
                    <button className="btn btn-outline btn-sm" onClick={() => showToast("Message sent (demo)")}>Reply</button>
                  </div>
                  <div className="row-item">
                    <div className="avatar" style={{ background: "#6B4FBB" }}>TO</div>
                    <div className="row-info"><h4>Tobi Oladipo</h4><p>Re: Event Coordinator — "Thank you for shortlisting me."</p></div>
                    <button className="btn btn-outline btn-sm" onClick={() => showToast("Message sent (demo)")}>Reply</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        {bottomNav.map((n) => (
          <a key={n.key} className={section === n.key ? "is-active" : ""} onClick={() => setSection(n.key)}>{n.label}</a>
        ))}
      </nav>
    </div>
  );
}

/* ---- Admin dashboard ---- */
function AdminDashboard({ goToLanding, showToast }) {
  const [section, setSection] = useState("overview");
  const [pending, setPending] = useState(DEMO_PENDING_INIT);

  const navItems = [
    { key: "overview", label: "Overview" },
    { key: "verifications", label: "Verifications" },
    { key: "users", label: "Users" },
    { key: "jobs", label: "Jobs" },
    { key: "reports", label: "Reports" },
  ];
  const bottomNav = [
    { key: "overview", label: "Home" },
    { key: "verifications", label: "Verify" },
    { key: "users", label: "Users" },
    { key: "jobs", label: "Jobs" },
  ];

  function approve(i) {
    const updated = [...pending];
    updated[i] = { ...updated[i], status: "verified" };
    setPending(updated);
    showToast(`${pending[i].company} approved & verified`);
  }
  function reject(i) {
    const updated = [...pending];
    updated[i] = { ...updated[i], status: "rejected" };
    setPending(updated);
    showToast(`${pending[i].company} rejected`);
  }

  function PendingTable({ withPhone }) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Company</th><th>Contact</th>
              {withPhone && <th>Phone</th>}
              <th>Submitted</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((p, i) => (
              <tr key={i}>
                <td><strong>{p.company}</strong></td>
                <td>{p.contact}</td>
                {withPhone && <td>{p.phone}</td>}
                <td>{p.date}</td>
                <td>
                  <span className={`status-pill status-${p.status === "pending" ? "amber" : p.status === "verified" ? "green" : "red"}`}>{p.status}</span>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm" style={{ marginRight: 6 }} onClick={() => approve(i)}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => reject(i)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="has-bottom-nav">
      <div className="shell">
        <aside className="sidebar">
          <span className="logo" onClick={goToLanding} style={{ cursor: "pointer" }}>Employme<span className="dot">.</span></span>
          <nav className="sidenav">
            {navItems.map((n) => (
              <a key={n.key} className={section === n.key ? "is-active" : ""} onClick={() => setSection(n.key)}>{n.label}</a>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>AD</div>
            <div><strong>Admin</strong><small>Platform</small></div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <h1>Admin control panel</h1>
            <button className="btn btn-ghost btn-sm" onClick={goToLanding}>Log out</button>
          </header>

          <div className="content">

            {section === "overview" && (
              <div>
                <div className="page-head"><h1>Platform overview</h1><p>Employme admin — verifications, users, jobs and health.</p></div>
                <div className="stats-row">
                  <div className="card stat-card"><strong>1,248</strong><span>Job seekers</span></div>
                  <div className="card stat-card"><strong>86</strong><span>Verified employers</span></div>
                  <div className="card stat-card"><strong>{pending.filter((p) => p.status === "pending").length}</strong><span>Pending verifications</span></div>
                  <div className="card stat-card"><strong>312</strong><span>Active job posts</span></div>
                </div>
                <div className="card section-card">
                  <div className="section-head"><h2>Pending employer verifications</h2><button className="btn btn-ghost btn-sm" onClick={() => setSection("verifications")}>View all</button></div>
                  <PendingTable withPhone={false} />
                </div>
                <div className="card section-card">
                  <div className="section-head"><h2>Recent activity</h2></div>
                  <div className="row-item"><div className="row-info"><p>✓ Zenith Textiles Ltd verified · 2 hours ago</p></div></div>
                  <div className="row-item"><div className="row-info"><p>📝 New job: Junior Frontend Developer · Lagos · 3 hours ago</p></div></div>
                  <div className="row-item"><div className="row-info"><p>👤 14 new job seekers signed up today</p></div></div>
                </div>
              </div>
            )}

            {section === "verifications" && (
              <div>
                <div className="page-head"><h1>Employer verifications</h1><p>Document + phone checks before any job post goes live.</p></div>
                <div className="card section-card"><PendingTable withPhone={true} /></div>
              </div>
            )}

            {section === "users" && (
              <div>
                <div className="page-head"><h1>Users</h1><p>Job seekers and employers on the platform.</p></div>
                <div className="card section-card">
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th></tr></thead>
                      <tbody>
                        <tr><td>Bobola Adewale</td><td>bobola@email.com</td><td>Seeker</td><td>Jul 2026</td><td><span className="status-pill status-green">Active</span></td></tr>
                        <tr><td>Ada Okonkwo</td><td>hr@marvelouse.ng</td><td>Employer</td><td>Jun 2026</td><td><span className="status-pill status-green">Verified</span></td></tr>
                        <tr><td>Folake A.</td><td>folake@email.com</td><td>Seeker</td><td>Jul 2026</td><td><span className="status-pill status-green">Active</span></td></tr>
                        <tr><td>Baloo Travels</td><td>ops@baloo.ng</td><td>Employer</td><td>May 2026</td><td><span className="status-pill status-green">Verified</span></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {section === "jobs" && (
              <div>
                <div className="page-head"><h1>Job posts</h1><p>All live and closed listings.</p></div>
                <div className="card section-card">
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Title</th><th>Company</th><th>Location</th><th>Applicants</th><th>Status</th></tr></thead>
                      <tbody>
                        <tr><td>Marketing Associate</td><td>Marvelouse Music</td><td>Ede</td><td>12</td><td><span className="status-pill status-green">Live</span></td></tr>
                        <tr><td>Junior Frontend Developer</td><td>Zenith Textiles</td><td>Lagos</td><td>24</td><td><span className="status-pill status-green">Live</span></td></tr>
                        <tr><td>Visa Consultant</td><td>Baloo Travels</td><td>Ile-Ife</td><td>7</td><td><span className="status-pill status-green">Live</span></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {section === "reports" && (
              <div>
                <div className="page-head"><h1>Reports &amp; flags</h1><p>User reports on listings or accounts.</p></div>
                <div className="card section-card"><p style={{ color: "var(--ink-soft)", fontSize: 14 }}>No open reports. Last cleared: yesterday.</p></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        {bottomNav.map((n) => (
          <a key={n.key} className={section === n.key ? "is-active" : ""} onClick={() => setSection(n.key)}>{n.label}</a>
        ))}
      </nav>
    </div>
  );
}

/* ---------------- main app ---------------- */

function App() {
  // screen: "landing" | "auth" | "seeker" | "employer" | "admin"
  const [screen, setScreen] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [authInitMode, setAuthInitMode] = useState("login");
  const [authInitRole, setAuthInitRole] = useState("seeker");
  const [toastMsg, setToastMsg] = useState("");

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2700);
  }

  function openAuth(mode, role) {
    setAuthInitMode(mode);
    setAuthInitRole(role);
    setScreen("auth");
  }

  function handleLogin(user) {
    setCurrentUser(user);
    setScreen(user.role);
  }

  function goToLanding() {
    setCurrentUser(null);
    setScreen("landing");
  }

  return (
    <>
      <GlobalStyles />

      {screen === "landing" && (
        <LandingScreen openAuth={openAuth} />
      )}

      {screen === "auth" && (
        <AuthScreen
          goToLanding={goToLanding}
          onLogin={handleLogin}
          initMode={authInitMode}
          initRole={authInitRole}
        />
      )}

      {screen === "seeker" && currentUser && (
        <SeekerDashboard user={currentUser} goToLanding={goToLanding} showToast={showToast} />
      )}

      {screen === "employer" && currentUser && (
        <EmployerDashboard user={currentUser} goToLanding={goToLanding} showToast={showToast} />
      )}

      {screen === "admin" && (
        <AdminDashboard goToLanding={goToLanding} showToast={showToast} />
      )}

      <Toast msg={toastMsg} />
    </>
  );
}

export default App;