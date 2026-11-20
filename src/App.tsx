import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Code2,
  Database,
  ExternalLink,
  FileCode2,
  Folder,
  GitBranch,
  Globe,
  LayoutGrid,
  Lock,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Package,
  Play,
  Plus,
  Rocket,
  Search,
  Server,
  Settings,
  Share,
  Sparkles,
  Terminal,
  Users,
  X,
  Zap,
} from "lucide-react";

const HERO_CHIPS = [
  "Build a habit tracker app",
  "Create a personal website",
  "Make a multiplayer game",
  "Build an AI chatbot",
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "Build with Agent",
    body: "Describe what you want and watch Agent 3 plan, code, test and fix it in a real workspace.",
    accent: "orange",
  },
  {
    icon: Server,
    title: "Deploy in seconds",
    body: "Every app gets a real URL, a database and hosting. Ship to production without leaving the editor.",
    accent: "blue",
  },
  {
    icon: Users,
    title: "Build together",
    body: "Invite teammates into the same workspace. Multiplayer editing, comments and shared history.",
    accent: "green",
  },
];

const AGENT_STEPS = [
  "Reading the request",
  "Planning the file structure",
  "Writing components",
  "Installing dependencies",
  "Running the dev server",
];

const FILES = [
  { name: "src", type: "dir", depth: 0 },
  { name: "components", type: "dir", depth: 1 },
  { name: "App.tsx", type: "file", depth: 2, active: true },
  { name: "Hero.tsx", type: "file", depth: 2 },
  { name: "Tracker.tsx", type: "file", depth: 2 },
  { name: "styles.css", type: "file", depth: 2 },
  { name: "main.tsx", type: "file", depth: 1 },
  { name: "index.html", type: "file", depth: 0 },
  { name: "package.json", type: "file", depth: 0 },
  { name: "replit.nix", type: "file", depth: 0 },
];

const CODE_LINES: [string, string][][] = [
  [["kw", "import"], ["plain", " { useState } "], ["kw", "from"], ["str", ' "react"'], ["plain", ";"]],
  [["kw", "import"], ["plain", " { Hero, Tracker } "], ["kw", "from"], ["str", ' "./components"'], ["plain", ";"]],
  [["plain", ""]],
  [["kw", "export default function"], ["fn", " App"], ["plain", "() {"]],
  [["plain", "  "], ["kw", "const"], ["plain", " [habits, setHabits] = "], ["fn", "useState"], ["plain", "([]);"]],
  [["plain", ""]],
  [["plain", "  "], ["kw", "return"], ["plain", " ("]],
  [["plain", "    <"], ["tag", "main"], ["plain", ' className="app"'], ["plain", ">"]],
  [["plain", "      <"], ["tag", "Hero"], ["plain", " />"]],
  [["plain", "      <"], ["tag", "Tracker"], ["plain", " habits={habits} onChange={setHabits} />"]],
  [["plain", "    </"], ["tag", "main"], ["plain", ">"]],
  [["plain", "  );"]],
  [["plain", "}"]],
];

function ReplitLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect x="2" y="3" width="13" height="12" rx="3.4" fill="#F26207" />
      <rect x="15" y="3" width="15" height="12" rx="3.4" fill="#F9A03F" />
      <rect x="2" y="15" width="13" height="14" rx="3.4" fill="#F26207" />
      <rect x="15" y="15" width="15" height="14" rx="3.4" fill="#FBD9BE" />
      <rect x="15" y="15" width="7" height="7" fill="#F26207" />
    </svg>
  );
}

function PhoneMock() {
  return (
    <div className="rp-phone">
      <span className="rp-phone-notch" />
      <div className="rp-phone-screen">
        <div className="rp-phone-head">
          <div><span>Good morning</span><b>Today</b></div>
          <span className="rp-phone-avatar">A</span>
        </div>
        <div className="rp-phone-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#2a2a2e" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="url(#rp-ring)" strokeWidth="8" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="74" transform="rotate(-90 50 50)" />
            <defs>
              <linearGradient id="rp-ring" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#F26207" />
                <stop offset="1" stopColor="#F9A03F" />
              </linearGradient>
            </defs>
          </svg>
          <div><b>3/5</b><span>habits</span></div>
        </div>
        <div className="rp-phone-list">
          {[["Morning run", true], ["Read 20 pages", true], ["Meditate", true], ["Drink water", false], ["Journal", false]].map(([l, done]) => (
            <div key={String(l)} className={done ? "done" : ""}>
              <span>{done ? <Check size={9} /> : null}</span>{l}
            </div>
          ))}
        </div>
        <div className="rp-phone-tab"><span className="on">Today</span><span>Stats</span><span>You</span></div>
      </div>
    </div>
  );
}

function Workspace({ prompt, onBack }: { prompt: string; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "agent"; text: string }[]>([{ role: "user", text: prompt }]);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [toast, setToast] = useState<string | null>(null);
  const [filesOpen, setFilesOpen] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = AGENT_STEPS.map((_, i) => window.setTimeout(() => setStep(i + 1), 640 * (i + 1)));
    timers.push(
      window.setTimeout(() => {
        setDone(true);
        setMessages((m) => [
          ...m,
          { role: "agent", text: "Your habit tracker is running. I built a mobile-first interface with streaks, a weekly chart and local persistence. Want me to add notifications or an account system?" },
        ]);
      }, 640 * AGENT_STEPS.length + 600),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, done]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2300);
    return () => window.clearTimeout(t);
  }, [toast]);

  function send() {
    if (!value.trim()) return;
    const text = value.trim();
    setValue("");
    setMessages((m) => [...m, { role: "user", text }]);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "agent", text: "Done — I updated the app and the preview reloaded. Everything is still responsive. Anything else you'd like to add?" }]);
    }, 1200);
  }

  return (
    <div className="rp-ws">
      <header className="rp-ws-top">
        <button className="rp-ws-back" onClick={onBack} aria-label="Back"><ArrowLeft size={14} /></button>
        <div className="rp-ws-brand"><ReplitLogo size={17} /> <span>replit</span></div>
        <span className="rp-ws-sep" />
        <button className="rp-ws-project">habit-tracker <ChevronDown size={11} /></button>
        <span className="rp-ws-branch"><GitBranch size={11} /> main</span>
        <div className="rp-ws-actions">
          <button className="rp-ws-ghost" onClick={() => setToast("Workspace link copied")}><Share size={12} /> Share</button>
          <button className="rp-ws-run" onClick={() => setToast("App is already running on port 3000")}><Play size={11} fill="currentColor" /> Run</button>
          <button className="rp-ws-deploy" onClick={() => setToast("Deploying to production…")}><Rocket size={12} /> Deploy</button>
        </div>
      </header>

      <div className="rp-ws-body">
        <aside className={`rp-files ${filesOpen ? "open" : ""}`}>
          <div className="rp-files-head">
            <span>Files</span>
            <div>
              <button aria-label="New file"><Plus size={13} /></button>
              <button aria-label="Search"><Search size={13} /></button>
              <button className="rp-files-x" onClick={() => setFilesOpen(false)} aria-label="Close"><X size={13} /></button>
            </div>
          </div>
          <div className="rp-files-list">
            {FILES.map((f) => (
              <button key={f.name + f.depth} className={`${f.active ? "on" : ""} ${f.type}`} style={{ paddingLeft: 10 + f.depth * 14 }}>
                {f.type === "dir" ? <Folder size={12} /> : <FileCode2 size={12} />} {f.name}
              </button>
            ))}
          </div>
          <div className="rp-files-foot">
            <span><Package size={11} /> Packages</span>
            <span><Database size={11} /> Database</span>
            <span><Settings size={11} /> Tools</span>
          </div>
        </aside>

        <main className="rp-editor">
          <div className="rp-tabs">
            <button className="rp-tab on"><FileCode2 size={11} /> App.tsx <i>●</i></button>
            <button className="rp-tab"><FileCode2 size={11} /> styles.css</button>
            <button className="rp-tab-more"><Plus size={13} /></button>
            <div className="rp-tabs-right">
              <button onClick={() => setFilesOpen(true)} aria-label="Files"><Folder size={13} /></button>
              <button aria-label="More"><MoreHorizontal size={14} /></button>
            </div>
          </div>
          <div className="rp-editor-area">
            <pre className="rp-code">
              {CODE_LINES.map((line, i) => (
                <div key={i} className="rp-line">
                  <span className="rp-ln">{i + 1}</span>
                  <span>
                    {line.map(([kind, text], j) => (
                      <span key={j} className={`rp-${kind}`}>{text || " "}</span>
                    ))}
                  </span>
                </div>
              ))}
            </pre>
            <div className="rp-editor-preview">
              <div className="rp-preview-bar">
                <div className="rp-preview-tabs">
                  <button className={tab === "preview" ? "on" : ""} onClick={() => setTab("preview")}><LayoutGrid size={11} /> Preview</button>
                  <button className={tab === "code" ? "on" : ""} onClick={() => setTab("code")}><Code2 size={11} /> Code</button>
                </div>
                <div className="rp-preview-url"><Lock size={8} /> habit-tracker.replit.app</div>
                <button onClick={() => setToast("Opening in a new tab — demo only")} aria-label="Open"><ExternalLink size={11} /></button>
              </div>
              <div className="rp-preview-body">
                {done ? <PhoneMock /> : (
                  <div className="rp-preview-loading">
                    <span className="rp-spinner" />
                    <p>Starting the dev server…</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="rp-console">
            <div className="rp-console-head"><span><Terminal size={11} /> Shell</span><span>Output</span><span>Problems</span></div>
            <div className="rp-console-body">
              <p><span className="rp-prompt">~/habit-tracker</span> npm run dev</p>
              {done ? (
                <>
                  <p className="rp-ok">✓ VITE v6.2.0 ready in 412 ms</p>
                  <p className="rp-dim">➜ Local: http://localhost:3000/</p>
                  <p className="rp-dim">➜ press h + enter to show help</p>
                </>
              ) : (
                <p className="rp-dim">installing dependencies…</p>
              )}
            </div>
          </div>
        </main>

        <aside className="rp-agent">
          <div className="rp-agent-head">
            <span className="rp-agent-title"><Sparkles size={13} /> Agent</span>
            <span className="rp-agent-mode">Agent 3</span>
            <button aria-label="History"><MessageSquare size={13} /></button>
          </div>
          <div className="rp-agent-scroll" ref={scroller}>
            {messages.map((m, i) => (
              <div key={i} className={`rp-msg ${m.role}`}>
                {m.role === "agent" && <span className="rp-msg-ai"><Sparkles size={11} /></span>}
                <div className="rp-msg-bubble">{m.text}</div>
              </div>
            ))}
            {!done && (
              <div className="rp-agent-build">
                <div className="rp-agent-build-head"><span className="rp-spinner sm" /> Working <span>~20s</span></div>
                {AGENT_STEPS.map((s, i) => (
                  <div key={s} className={i < step ? "done" : i === step ? "active" : ""}>
                    <span>{i < step ? <Check size={8} /> : i === step ? <i /> : null}</span>{s}
                  </div>
                ))}
              </div>
            )}
            {done && (
              <div className="rp-agent-done">
                <div><Check size={11} /> Task complete</div>
                <span>6 files changed · 2m 14s</span>
                <div className="rp-agent-actions">
                  <button onClick={() => setToast("Reverted to the previous checkpoint")}>Undo</button>
                  <button onClick={() => setToast("Diff view — demo only")}>View diff</button>
                </div>
              </div>
            )}
          </div>
          <div className="rp-agent-composer">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={2}
              placeholder="Ask Agent to build or change something…"
            />
            <div className="rp-agent-tools">
              <button aria-label="Attach"><Plus size={14} /></button>
              <span className="rp-agent-chip"><Zap size={10} /> Turbo</span>
              <span className="rp-agent-model">Agent 3 <ChevronDown size={9} /></span>
              <button className="rp-agent-send" onClick={send} disabled={!value.trim()} aria-label="Send"><ArrowUp size={13} /></button>
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div className="rp-toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <Check size={13} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<"home" | "workspace">("home");
  const [prompt, setPrompt] = useState("");
  const [sent, setSent] = useState("");
  const [menu, setMenu] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2300);
    return () => window.clearTimeout(t);
  }, [toast]);

  function build(text?: string) {
    const p = (text ?? prompt).trim();
    if (!p) return;
    setSent(p);
    setPrompt("");
    setView("workspace");
  }

  if (view === "workspace") {
    return <Workspace prompt={sent} onBack={() => setView("home")} />;
  }

  return (
    <div className="rp">
      <header className="rp-header">
        <button className="rp-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <ReplitLogo size={25} /> <span>replit</span>
        </button>
        <nav className="rp-nav">
          {[
            { l: "Product", items: ["Agent", "Workspaces", "Deployments", "Design"] },
            { l: "Solutions", items: ["Startups", "Enterprise", "Education", "Agencies"] },
            { l: "Resources", items: ["Docs", "Blog", "Community", "Changelog"] },
          ].map((n) => (
            <div key={n.l} className="rp-nav-item">
              <button onClick={() => setOpenNav(openNav === n.l ? null : n.l)}>{n.l} <ChevronDown size={11} /></button>
              {openNav === n.l && (
                <div className="rp-dropdown">
                  {n.items.map((i) => <a key={i} href="#features" onClick={() => setOpenNav(null)}>{i}</a>)}
                </div>
              )}
            </div>
          ))}
          <a href="#pricing">Pricing</a>
          <a href="#enterprise">Enterprise</a>
        </nav>
        <div className="rp-header-actions">
          <button className="rp-login" onClick={() => setView("workspace")}>Log in</button>
          <button className="rp-start" onClick={() => document.getElementById("rp-ask")?.focus()}>Start building</button>
          <button className="rp-menu-btn" onClick={() => setMenu(!menu)} aria-label="Menu">{menu ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        {menu && (
          <div className="rp-mobile-menu">
            {["Product", "Solutions", "Resources", "Pricing", "Enterprise"].map((l) => (
              <a key={l} href="#features" onClick={() => setMenu(false)}>{l}</a>
            ))}
            <button className="rp-start" onClick={() => { setMenu(false); document.getElementById("rp-ask")?.focus(); }}>Start building</button>
          </div>
        )}
      </header>

      <main>
        <section className="rp-hero">
          <div className="rp-hero-glow" aria-hidden />
          <div className="rp-hero-grid" aria-hidden />
          <motion.span className="rp-hero-badge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Sparkles size={12} /> Agent 3 is here — build full apps from a prompt
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}>
            Build software fast
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }}>
            Turn your ideas into apps and sites with AI. Describe it, watch it build, then ship it to the world.
          </motion.p>

          <motion.div className="rp-composer" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.18 }}>
            <textarea
              id="rp-ask"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); build(); } }}
              rows={3}
              placeholder="Describe the app or site you want to build…"
            />
            <div className="rp-composer-foot">
              <button className="rp-plus" onClick={() => setToast("Attach an image or file — demo only")} aria-label="Attach"><Plus size={17} /></button>
              <div className="rp-composer-tags">
                <span><Sparkles size={10} /> Agent 3</span>
                <span><Globe size={10} /> Public</span>
              </div>
              <button className="rp-send" onClick={() => build()} disabled={!prompt.trim()} aria-label="Start building"><ArrowUp size={15} /></button>
            </div>
          </motion.div>

          <div className="rp-chips">
            {HERO_CHIPS.map((c) => (
              <button key={c} onClick={() => setPrompt(`Build ${c.toLowerCase()}`)}>{c}</button>
            ))}
          </div>

          <motion.div className="rp-hero-demo" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <div className="rp-demo-window">
              <div className="rp-demo-top">
                <div className="rp-demo-dots"><i /><i /><i /></div>
                <span className="rp-demo-url"><Lock size={8} /> habit-tracker.replit.app</span>
                <span className="rp-demo-share"><Share size={10} /></span>
              </div>
              <div className="rp-demo-body">
                <aside className="rp-demo-side">
                  <div className="rp-demo-brand"><ReplitLogo size={13} /> replit</div>
                  <div className="rp-demo-file on"><FileCode2 size={10} /> App.tsx</div>
                  <div className="rp-demo-file"><FileCode2 size={10} /> Hero.tsx</div>
                  <div className="rp-demo-file"><FileCode2 size={10} /> Tracker.tsx</div>
                  <div className="rp-demo-file"><FileCode2 size={10} /> styles.css</div>
                  <div className="rp-demo-console"><Terminal size={10} /> Shell</div>
                </aside>
                <div className="rp-demo-preview"><PhoneMock /></div>
                <aside className="rp-demo-agent">
                  <div className="rp-demo-agent-head"><Sparkles size={10} /> Agent</div>
                  <div className="rp-demo-user">Build a habit tracker with streaks and a weekly chart.</div>
                  <div className="rp-demo-ai"><span>✓</span> Created 6 files and started the dev server.</div>
                  <div className="rp-demo-ai"><span>✓</span> Added local persistence and a 7-day chart.</div>
                  <div className="rp-demo-typing"><i /><i /><i /></div>
                  <div className="rp-demo-input">Add a reminder for 8am…</div>
                </aside>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="rp-logos">
          <span>Trusted by teams at</span>
          <div>
            {["Google", "Coinbase", "Anthropic", "Shopify", "Stripe", "Figma"].map((l) => <b key={l}>{l}</b>)}
          </div>
        </section>

        <section className="rp-features" id="features">
          <div className="rp-section-head">
            <span className="rp-eyebrow">One workspace</span>
            <h2>From idea to production,<br />all in one place.</h2>
            <p>Replit is the fastest way to go from a sentence to a deployed product — with real infrastructure behind it.</p>
          </div>
          <div className="rp-feature-grid">
            {FEATURES.map((f) => (
              <article key={f.title} className={`rp-feature ${f.accent}`}>
                <span className="rp-feature-icon"><f.icon size={18} /></span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                <div className="rp-feature-art" aria-hidden>
                  {f.accent === "orange" && (
                    <div className="rp-art-agent">
                      <div className="rp-art-line"><span className="ok">✓</span> Planned 4 components</div>
                      <div className="rp-art-line"><span className="ok">✓</span> Wrote App.tsx</div>
                      <div className="rp-art-line active"><i /> Installing packages…</div>
                    </div>
                  )}
                  {f.accent === "blue" && (
                    <div className="rp-art-deploy">
                      <div><Globe size={13} /><span>habit-tracker.replit.app</span><b>Live</b></div>
                      <div className="rp-art-bar"><i /></div>
                      <small>Build completed in 38s</small>
                    </div>
                  )}
                  {f.accent === "green" && (
                    <div className="rp-art-team">
                      <div className="rp-art-avatars"><span>AM</span><span>JK</span><span>SR</span><span>+4</span></div>
                      <p>3 people editing now</p>
                      <div className="rp-art-cursor"><span>JK</span> Nice, the chart works!</div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rp-split" id="enterprise">
          <div className="rp-split-copy">
            <span className="rp-eyebrow">Replit for work</span>
            <h2>Ship internal tools<br />without the backlog.</h2>
            <p>Give every team the ability to build the software they need. Centralized billing, SSO, private deployments and audit logs included.</p>
            <div className="rp-split-points">
              {["Deploy behind your own VPC", "SOC 2 Type II and SSO/SAML", "Shared component libraries", "Usage analytics and controls"].map((p) => (
                <span key={p}><Check size={12} /> {p}</span>
              ))}
            </div>
            <button className="rp-ghost-btn" onClick={() => setToast("Sales contact — demo only")}>Talk to sales <ArrowRight size={13} /></button>
          </div>
          <div className="rp-split-visual">
            <div className="rp-admin">
              <div className="rp-admin-head"><b>Workspace overview</b><span>This month</span></div>
              <div className="rp-admin-stats">
                <div><span>Active apps</span><b>128</b><i>+12</i></div>
                <div><span>Deployments</span><b>1,402</b><i>+8%</i></div>
                <div><span>Builders</span><b>64</b><i>+4</i></div>
              </div>
              <div className="rp-admin-chart">
                {[36, 52, 44, 68, 58, 76, 62, 84, 72, 90, 78, 96].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
              </div>
              <div className="rp-admin-row"><span className="rp-admin-dot" /> All systems operational</div>
            </div>
          </div>
        </section>

        <section className="rp-pricing" id="pricing">
          <span className="rp-eyebrow">Pricing</span>
          <h2>Start building for free.</h2>
          <p className="rp-pricing-sub">Upgrade when you need more compute, privacy or seats.</p>
          <div className="rp-plans">
            {[
              { name: "Starter", price: "$0", note: "forever", features: ["Public apps", "Agent 3 basic", "1 GB storage", "Community support"], cta: "Start building" },
              { name: "Core", price: "$25", note: "per month", features: ["Private apps", "Agent 3 full", "Autoscale deployments", "Custom domains", "Priority support"], cta: "Get Core", featured: true },
              { name: "Teams", price: "$40", note: "per seat / month", features: ["Everything in Core", "Shared workspaces", "SSO/SAML", "Audit logs", "Centralized billing"], cta: "Talk to sales" },
            ].map((p) => (
              <div key={p.name} className={`rp-plan ${p.featured ? "featured" : ""}`}>
                {p.featured && <span className="rp-plan-badge">Most popular</span>}
                <h3>{p.name}</h3>
                <div className="rp-plan-price"><b>{p.price}</b><span>{p.note}</span></div>
                <ul>{p.features.map((f) => <li key={f}><Check size={12} /> {f}</li>)}</ul>
                <button className={p.featured ? "rp-start" : "rp-login"} onClick={() => setView("workspace")}>{p.cta}</button>
              </div>
            ))}
          </div>
        </section>

        <section className="rp-cta">
          <ReplitLogo size={40} />
          <h2>Build software fast</h2>
          <p>Join millions of builders turning ideas into real products.</p>
          <button className="rp-start big" onClick={() => document.getElementById("rp-ask")?.focus()}>Start building <ArrowRight size={14} /></button>
        </section>
      </main>

      <footer className="rp-footer">
        <div className="rp-footer-brand">
          <div className="rp-brand"><ReplitLogo size={20} /> <span>replit</span></div>
          <p>Build software fast.</p>
          <span>© 2026 Replit, Inc.</span>
        </div>
        {[
          { h: "Product", l: ["Agent", "Workspaces", "Deployments", "Design", "Mobile"] },
          { h: "Solutions", l: ["Startups", "Enterprise", "Education", "Agencies", "Creators"] },
          { h: "Resources", l: ["Docs", "Blog", "Community", "Templates", "Changelog"] },
          { h: "Company", l: ["About", "Careers", "Press", "Security", "Contact"] },
        ].map((c) => (
          <div key={c.h} className="rp-footer-col">
            <p>{c.h}</p>
            {c.l.map((x) => <a key={x} href="#footer">{x}</a>)}
          </div>
        ))}
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div className="rp-toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <Check size={13} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
