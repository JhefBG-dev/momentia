"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type EventType = "amor" | "cumpleanos" | "aniversario" | "dia-de-la-madre" | "navidad";
type PlanType = "basic" | "premium";

type TemplateId =
  | "romantic-letter"
  | "golden-love"
  | "birthday-glow"
  | "birthday-stars"
  | "anniversary-soft"
  | "mom-bloom"
  | "xmas-warm";

type PhotoItem = {
  id: string;
  file: File;
  url: string;
  caption: string;
};

/* ─────────────────────────────────────────────
   EVENT THEMES — each event has its own palette
───────────────────────────────────────────── */
type EventTheme = {
  label: string;
  icon: string;
  accent: string;
  accentGlow: string;
  accentText: string;
  border: string;
  softBg: string;
  thumbGrad: string;
  orb1: string;
  orb2: string;
  orb3: string;
  description: string;
};

const EVENT_THEMES: Record<EventType, EventTheme> = {
  amor: {
    label: "Romance",
    icon: "♥",
    accent: "#ff3d7f",
    accentGlow: "rgba(255,61,127,0.38)",
    accentText: "#fff",
    border: "rgba(255,61,127,0.20)",
    softBg: "rgba(255,61,127,0.09)",
    thumbGrad: "linear-gradient(135deg,#5c0a28 0%,#a01048 100%)",
    orb1: "radial-gradient(circle, rgba(192,20,92,0.55) 0%, transparent 70%)",
    orb2: "radial-gradient(circle, rgba(123,0,42,0.4) 0%, transparent 70%)",
    orb3: "radial-gradient(circle, rgba(255,111,160,0.2) 0%, transparent 70%)",
    description: "Cartas, sorpresas y momentos que se sienten para siempre.",
  },
  cumpleanos: {
    label: "Cumpleaños",
    icon: "★",
    accent: "#a855f7",
    accentGlow: "rgba(168,85,247,0.38)",
    accentText: "#fff",
    border: "rgba(168,85,247,0.20)",
    softBg: "rgba(168,85,247,0.09)",
    thumbGrad: "linear-gradient(135deg,#3b0764 0%,#7e22ce 100%)",
    orb1: "radial-gradient(circle, rgba(124,58,237,0.55) 0%, transparent 70%)",
    orb2: "radial-gradient(circle, rgba(79,70,229,0.4) 0%, transparent 70%)",
    orb3: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
    description: "Celebraciones llenas de color, magia y mucha alegría.",
  },
  aniversario: {
    label: "Aniversario",
    icon: "◈",
    accent: "#f59e0b",
    accentGlow: "rgba(245,158,11,0.38)",
    accentText: "#1c1108",
    border: "rgba(245,158,11,0.20)",
    softBg: "rgba(245,158,11,0.09)",
    thumbGrad: "linear-gradient(135deg,#3d1e00 0%,#7c4a00 100%)",
    orb1: "radial-gradient(circle, rgba(146,98,0,0.55) 0%, transparent 70%)",
    orb2: "radial-gradient(circle, rgba(120,53,15,0.4) 0%, transparent 70%)",
    orb3: "radial-gradient(circle, rgba(217,119,6,0.2) 0%, transparent 70%)",
    description: "Elegante, íntimo y cargado de historia compartida.",
  },
  "dia-de-la-madre": {
    label: "Día de la Madre",
    icon: "✿",
    accent: "#ec4899",
    accentGlow: "rgba(236,72,153,0.38)",
    accentText: "#fff",
    border: "rgba(236,72,153,0.20)",
    softBg: "rgba(236,72,153,0.09)",
    thumbGrad: "linear-gradient(135deg,#500730 0%,#9d1760 100%)",
    orb1: "radial-gradient(circle, rgba(157,23,77,0.55) 0%, transparent 70%)",
    orb2: "radial-gradient(circle, rgba(131,24,83,0.4) 0%, transparent 70%)",
    orb3: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
    description: "Delicado, floral y lleno de la emoción que ella merece.",
  },
  navidad: {
    label: "Navidad",
    icon: "✦",
    accent: "#ef4444",
    accentGlow: "rgba(239,68,68,0.38)",
    accentText: "#fff",
    border: "rgba(239,68,68,0.20)",
    softBg: "rgba(239,68,68,0.09)",
    thumbGrad: "linear-gradient(135deg,#450a0a 0%,#991b1b 100%)",
    orb1: "radial-gradient(circle, rgba(153,27,27,0.55) 0%, transparent 70%)",
    orb2: "radial-gradient(circle, rgba(127,29,29,0.4) 0%, transparent 70%)",
    orb3: "radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)",
    description: "Cálida, brillante y mágica como la noche de navidad.",
  },
};

/* ─────────────────────────────────────────────
   TEMPLATES per event (2 per event max now)
───────────────────────────────────────────── */
type TemplateConfig = {
  id: TemplateId;
  name: string;
  tagline: string;
  plans: PlanType[];
  previewIcon: string;
  previewDesc: string;
};

const TEMPLATES_BY_EVENT: Record<EventType, TemplateConfig[]> = {
  amor: [
    {
      id: "romantic-letter",
      name: "Romantic Letter",
      tagline: "Una carta con pluma antigua, papiro sellado y álbum de fotos",
      plans: ["basic", "premium"],
      previewIcon: "✒",
      previewDesc: "La experiencia narrativa más romántica. Pluma que escribe, papiro que se abre, libro con tus fotos.",
    },
    {
      id: "golden-love",
      name: "Golden Love",
      tagline: "Elegante, intenso. Negro con acentos dorados",
      plans: ["premium"],
      previewIcon: "◆",
      previewDesc: "Exclusivo Premium. Estética lujosa con partículas doradas y galería cinematográfica.",
    },
  ],
  cumpleanos: [
    {
      id: "birthday-glow",
      name: "Birthday Glow",
      tagline: "Divertido, brillante y alegre para celebrar",
      plans: ["basic", "premium"],
      previewIcon: "✦",
      previewDesc: "Confeti, colores vibrantes y una experiencia llena de vida.",
    },
    {
      id: "birthday-stars",
      name: "Birthday Stars",
      tagline: "Energía visual y sensación de gran fiesta",
      plans: ["premium"],
      previewIcon: "★",
      previewDesc: "Exclusivo Premium. Estrellas y efectos especiales para un cumpleaños épico.",
    },
  ],
  aniversario: [
    {
      id: "anniversary-soft",
      name: "Anniversary Soft",
      tagline: "Romántico y elegante para una fecha inolvidable",
      plans: ["basic", "premium"],
      previewIcon: "◈",
      previewDesc: "Dorado cálido, tipografía clásica y momentos que brillan.",
    },
    {
      id: "golden-love",
      name: "Golden Love",
      tagline: "Versión premium para aniversarios especiales",
      plans: ["premium"],
      previewIcon: "◆",
      previewDesc: "Exclusivo Premium. La joya de los templates para momentos únicos.",
    },
  ],
  "dia-de-la-madre": [
    {
      id: "mom-bloom",
      name: "Bloom for Mom",
      tagline: "Floral, delicado, cálido y muy emocional",
      plans: ["basic", "premium"],
      previewIcon: "✿",
      previewDesc: "Pétalos, calidez y el amor más puro expresado en una experiencia.",
    },
    {
      id: "romantic-letter",
      name: "Carta para Mamá",
      tagline: "La carta romántica adaptada para mamá",
      plans: ["premium"],
      previewIcon: "✒",
      previewDesc: "Exclusivo Premium. La experiencia de carta, con la calidez de mamá.",
    },
  ],
  navidad: [
    {
      id: "xmas-warm",
      name: "Warm Christmas",
      tagline: "Brillo navideño, rojo intenso y acogedor",
      plans: ["basic", "premium"],
      previewIcon: "✦",
      previewDesc: "Nieve, magia navideña y el calor del hogar en una sola experiencia.",
    },
    {
      id: "golden-love",
      name: "Christmas Gold",
      tagline: "Navidad elegante con destellos dorados",
      plans: ["premium"],
      previewIcon: "◆",
      previewDesc: "Exclusivo Premium. La navidad más lujosa que alguien puede recibir.",
    },
  ],
};

/* ─────────────────────────────────────────────
   YOUTUBE VALIDATOR
───────────────────────────────────────────── */
function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch { return null; }
}

/* ─────────────────────────────────────────────
   PARTICLE CANVAS — changes color per event
───────────────────────────────────────────── */
function ParticleCanvas({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.3,
      speed: Math.random() * 0.35 + 0.08,
      drift: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.55 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.speed; p.x += p.drift; p.twinkle += 0.025;
        const a = p.alpha * (0.65 + 0.35 * Math.sin(p.twinkle));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accentRef.current + Math.round(a * 255).toString(16).padStart(2, "0");
        ctx.fill();
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4 || p.x > canvas.width + 4) p.x = Math.random() * canvas.width;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ─────────────────────────────────────────────
   SHARED UI ATOMS
───────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
      {children}
    </div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 600, color: "white", marginBottom: 18, lineHeight: 1.2 }}>
      {children}
    </h2>
  );
}
function ButtonRow({ children }: { children: React.ReactNode }) {
  return <div className="btn-row">{children}</div>;
}
function InfoBox({ children }: { children: React.ReactNode; }) {
  return (
    <div style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 13, color: "rgba(255,220,230,0.75)", lineHeight: 1.65, marginBottom: 20 }}>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="review-row">
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", paddingTop: 2 }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,0.88)", lineHeight: 1.6, fontSize: 14 }}>{value || "—"}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP BAR
───────────────────────────────────────────── */
function StepBar({ step, labels, theme }: { step: number; labels: string[]; theme: EventTheme }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${labels.length}, 1fr)`, gap: 6, marginBottom: 28 }}>
      {labels.map((label, i) => {
        const n = i + 1; const active = n === step; const done = n < step;
        return (
          <div key={label} style={{ borderRadius: 10, padding: "9px 4px", textAlign: "center", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, background: active ? theme.accent : done ? theme.softBg : "rgba(255,255,255,0.04)", color: active ? theme.accentText : done ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.28)", border: `1px solid ${active ? theme.accent : theme.border}`, boxShadow: active ? `0 0 14px ${theme.accentGlow}` : "none", transition: "all 0.4s ease" }}>
            {n}. {label}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function normalizeName(v: string) {
  return v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}
function generateShortId(n = 6) {
  const c = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: n }, () => c[Math.floor(Math.random() * c.length)]).join("");
}

const PREVIEW_DB_NAME = "momentia_preview_db";
const PREVIEW_STORE_NAME = "previews";
const PREVIEW_MANIFEST_KEY = "momentia_preview_manifest";
const NAME_MAX = 20;
const NICKNAME_MAX = 20;

function clampText(value: string, max: number) {
  return value.slice(0, max);
}

function getSongLabel(url: string) {
  const id = extractYouTubeId(url);
  return id ? "YouTube · canción seleccionada" : "";
}

function openPreviewDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(PREVIEW_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PREVIEW_STORE_NAME)) {
        db.createObjectStore(PREVIEW_STORE_NAME, { keyPath: "slug" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePreviewData(data: MomentiaPreviewData) {
  const db = await openPreviewDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PREVIEW_STORE_NAME, "readwrite");
    tx.objectStore(PREVIEW_STORE_NAME).put(data);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
  db.close();
}

async function fileToDataUrl(file: File, maxSize = 1400, quality = 0.82): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * ratio));
  const height = Math.max(1, Math.round(img.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}

/* ─────────────────────────────────────────────
   MOMENTIA PREVIEW DATA TYPE
   (the object that gets passed to the template)
───────────────────────────────────────────── */
export type MomentiaPreviewData = {
  slug: string;
  plan: PlanType;
  eventType: EventType;
  templateId: TemplateId;
  recipientName: string;
  senderName: string;
  nickname: string;
  message: string;
  letterMessage: string;
  finalMessage: string;
  relationshipStartDate: string;
  musicUrl: string;
  songLabel: string;
  isPremium: boolean;
  coverPhotoUrl: string;
  photoUrls: string[];
  photoCaptions: string[];
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */

// Pages of the wizard
type Page =
  | "select-event"        // Pick an event type
  | "select-template"     // Pick a template for that event
  | "fill-form";          // Fill the form (steps inside)

// Form steps depend on plan
// basic:   1=Plan  2=Datos  3=Fotos  4=Review
// premium: 1=Plan  2=Datos  3=Fotos  4=Frases  5=Review

export default function CreatePage() {
  // ── Wizard page ──
  const [page, setPage] = useState<Page>("select-event");

  // ── Event & template selection ──
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);

  // ── Plan & form step ──
  const [plan, setPlan] = useState<PlanType>("basic");
  const [formStep, setFormStep] = useState(1);

  // ── Form fields ──
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [startDate, setStartDate] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [finalMessage, setFinalMessage] = useState("");

  // ── Photos ──
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState("");
  const [photoError, setPhotoError] = useState("");

  const theme = selectedEvent ? EVENT_THEMES[selectedEvent] : EVENT_THEMES.amor;
  const PHOTO_MAX = plan === "basic" ? 5 : 12;

  const musicValid = useMemo(() => !!musicUrl.trim() && !!extractYouTubeId(musicUrl), [musicUrl]);

  const stepLabels = plan === "basic"
    ? ["Plan", "Datos", "Fotos", "Review"]
    : ["Plan", "Datos", "Fotos", "Frases", "Review"];
  const reviewStep = plan === "basic" ? 4 : 5;
  const frasesStep = 4;

  const canStep3 = recipientName.trim().length > 0 && senderName.trim().length > 0 && message.trim().length > 0;
  const canStep4 = photos.length >= 1;
  const canStep5 = photos.every(p => p.caption.trim().length > 0);

  useEffect(() => { return () => { photos.forEach(p => URL.revokeObjectURL(p.url)); }; }, [photos]);

  function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;
    const available = PHOTO_MAX - photos.length;
    if (available <= 0) { setPhotoError(`Máximo ${PHOTO_MAX} fotos.`); e.target.value = ""; return; }
    const mapped: PhotoItem[] = files.slice(0, available).map(file => ({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file), caption: "" }));
    const updated = [...photos, ...mapped];
    setPhotos(updated); setPhotoError("");
    if (!coverPhotoId && updated.length > 0) setCoverPhotoId(updated[0].id);
    e.target.value = "";
  }

  function removePhoto(id: string) {
    const t = photos.find(p => p.id === id); if (t) URL.revokeObjectURL(t.url);
    const updated = photos.filter(p => p.id !== id); setPhotos(updated);
    if (coverPhotoId === id) setCoverPhotoId(updated[0]?.id || "");
  }

  function updateCaption(id: string, caption: string) {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, caption } : p));
  }

  function handleSelectEvent(ev: EventType) {
    setSelectedEvent(ev); setSelectedTemplate(null); setPage("select-template");
  }

  function handleSelectTemplate(tpl: TemplateConfig) {
    setSelectedTemplate(tpl); setFormStep(1); setPlan("basic"); setPage("fill-form");
  }

  async function handleCreatePreview() {
    if (!selectedEvent || !selectedTemplate) return;

    try {
      const shortId = generateShortId();
      const safeName = normalizeName(recipientName || "momentia") || "momentia";
      const slug = `${shortId}-${safeName}`;
      const coverIndex = Math.max(0, photos.findIndex(p => p.id === coverPhotoId));
      const serializedPhotos = await Promise.all(photos.map(p => fileToDataUrl(p.file)));

      const previewData: MomentiaPreviewData = {
        slug,
        plan,
        eventType: selectedEvent,
        templateId: selectedTemplate.id,
        recipientName: recipientName.trim(),
        senderName: senderName.trim(),
        nickname: nickname.trim(),
        message: message.trim(),
        letterMessage: message.trim(),
        finalMessage: finalMessage.trim(),
        relationshipStartDate: startDate,
        musicUrl: musicValid ? musicUrl.trim() : "",
        songLabel: musicValid ? getSongLabel(musicUrl) : "",
        isPremium: plan === "premium",
        coverPhotoUrl: serializedPhotos[coverIndex] || serializedPhotos[0] || "",
        photoUrls: serializedPhotos,
        photoCaptions: plan === "premium" ? photos.map(p => p.caption.trim()) : [],
      };

      await savePreviewData(previewData);
      sessionStorage.setItem(PREVIEW_MANIFEST_KEY, JSON.stringify({ slug, updatedAt: Date.now() }));
      window.location.assign(`/p/${slug}`);
    } catch (error) {
      console.error("No se pudo crear la vista previa", error);
      alert("No se pudo crear la sorpresa. Prueba con menos fotos o imágenes más livianas.");
    }
  }

  // ── Shared styles ──
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 13,
    border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.05)",
    color: "white", fontSize: 14, outline: "none", fontFamily: "inherit", transition: "border-color 0.25s",
  };

  const primaryBtn = (disabled?: boolean): React.CSSProperties => ({
    padding: "12px 24px", borderRadius: 13, border: "none",
    background: disabled ? "rgba(255,255,255,0.08)" : theme.accent,
    color: disabled ? "rgba(255,255,255,0.3)" : theme.accentText,
    fontWeight: 700, fontSize: 14, fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : `0 0 22px ${theme.accentGlow}`,
    transition: "all 0.25s", letterSpacing: "0.02em",
  });

  const secondaryBtn: React.CSSProperties = {
    padding: "12px 18px", borderRadius: 13, border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent", color: "rgba(255,255,255,0.45)", fontWeight: 500,
    fontSize: 14, fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s",
  };

  const activeTheme = selectedEvent ? EVENT_THEMES[selectedEvent] : EVENT_THEMES.amor;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; } html, body { margin: 0; padding: 0; }

        #mom-app input::placeholder, #mom-app textarea::placeholder { color: rgba(255,255,255,0.25); }
        #mom-app input:focus, #mom-app textarea:focus { border-color: ${activeTheme.border} !important; outline: none; }
        #mom-app input[type="date"] { color-scheme: dark; }
        #mom-app input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }

        .event-card:hover { transform: translateY(-3px); }
        .template-card:hover { transform: translateY(-2px); }
        .plan-opt:hover { transform: translateY(-2px); }

        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }

        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .step-enter { animation: fadeUp 0.35s ease forwards; }

        .mom-layout { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(290px, 0.85fr); gap: 22px; align-items: start; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .photo-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .events-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .templates-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

        .btn-row { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; flex-wrap: wrap; }
        .review-row { display: grid; grid-template-columns: 130px 1fr; gap: 12px; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: start; }

        @media (max-width: 980px) { .mom-layout { grid-template-columns: 1fr; } .mom-aside { position: static !important; } }
        @media (max-width: 720px) {
          #mom-app { padding: 24px 14px 56px !important; }
          .mom-panel, .mom-aside { padding: 20px !important; border-radius: 22px !important; }
          .two-col, .photo-grid, .events-grid { grid-template-columns: 1fr; }
          .templates-grid { grid-template-columns: 1fr; }
          .review-row { grid-template-columns: 1fr; gap: 6px; }
          .btn-row > * { flex: 1; }
        }
      `}</style>

      <ParticleCanvas accent={activeTheme.accent} />

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, top: "-10%", left: "-10%", background: activeTheme.orb1, borderRadius: "50%", filter: "blur(80px)", transition: "background 1.2s ease" }} />
        <div style={{ position: "absolute", width: 500, height: 500, bottom: "-5%", right: "-5%", background: activeTheme.orb2, borderRadius: "50%", filter: "blur(70px)", transition: "background 1.2s ease" }} />
        <div style={{ position: "absolute", width: 350, height: 350, top: "40%", right: "20%", background: activeTheme.orb3, borderRadius: "50%", filter: "blur(90px)", transition: "background 1.2s ease" }} />
      </div>

      <main id="mom-app" style={{ minHeight: "100vh", background: "#0a0a0c", color: "white", fontFamily: "'DM Sans', sans-serif", padding: "40px 20px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: page === "fill-form" ? 1060 : 820, margin: "0 auto" }}>

          {/* ══════════════════════════════════════
              PAGE: SELECT EVENT
          ══════════════════════════════════════ */}
          {page === "select-event" && (
            <div className="fade-up">
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 52 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", borderRadius: 999, padding: "6px 16px", marginBottom: 22 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Momentia</span>
                </div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 600, lineHeight: 1.08, marginBottom: 16, color: "white" }}>
                  ¿Qué momento<br />quieres crear?
                </h1>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontWeight: 300, maxWidth: 520, margin: "0 auto" }}>
                  Elige el tipo de evento y te mostraremos los templates perfectos para él.
                </p>
              </div>

              {/* Events grid */}
              <div className="events-grid">
                {(Object.entries(EVENT_THEMES) as [EventType, EventTheme][]).map(([key, t]) => (
                  <button
                    key={key}
                    className="event-card"
                    type="button"
                    onClick={() => handleSelectEvent(key)}
                    style={{
                      textAlign: "left", padding: 24, borderRadius: 22, cursor: "pointer",
                      fontFamily: "inherit", color: "white",
                      border: `1px solid ${t.border}`,
                      background: `rgba(12,10,18,0.7)`,
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s",
                      position: "relative", overflow: "hidden",
                    }}
                  >
                    {/* Gradient top accent */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${t.accent}, transparent)`, borderRadius: "22px 22px 0 0" }} />

                    <div style={{ fontSize: 32, color: t.accent, marginBottom: 14, textShadow: `0 0 20px ${t.accentGlow}`, lineHeight: 1 }}>{t.icon}</div>

                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600, marginBottom: 8, lineHeight: 1.2 }}>{t.label}</div>

                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{t.description}</div>

                    <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: t.accent }}>{TEMPLATES_BY_EVENT[key].length} templates</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              PAGE: SELECT TEMPLATE
          ══════════════════════════════════════ */}
          {page === "select-template" && selectedEvent && (
            <div className="fade-up">
              {/* Breadcrumb */}
              <div style={{ marginBottom: 36 }}>
                <button type="button" onClick={() => setPage("select-event")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
                  ← Volver a eventos
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: activeTheme.softBg, border: `1px solid ${activeTheme.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: activeTheme.accent }}>
                    {activeTheme.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Evento seleccionado</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 600, color: "white" }}>{activeTheme.label}</div>
                  </div>
                </div>

                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 600, color: "white", marginBottom: 10 }}>
                  Elige el template
                </h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>
                  Cada template es una experiencia visual distinta. Habrá más próximamente.
                </p>
              </div>

              <div className="templates-grid">
                {TEMPLATES_BY_EVENT[selectedEvent].map((tpl) => (
                  <button
                    key={tpl.id + tpl.name}
                    className="template-card"
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    style={{
                      textAlign: "left", borderRadius: 24, cursor: "pointer",
                      fontFamily: "inherit", color: "white", overflow: "hidden",
                      border: `1px solid ${activeTheme.border}`,
                      background: "rgba(12,10,18,0.7)", backdropFilter: "blur(12px)",
                      transition: "all 0.3s", padding: 0,
                    }}
                  >
                    {/* Template preview hero */}
                    <div style={{ height: 180, background: activeTheme.thumbGrad, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, position: "relative", overflow: "hidden" }}>
                      {/* Premium badge */}
                      {!tpl.plans.includes("basic") && (
                        <div style={{ position: "absolute", top: 14, right: 14, fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, background: activeTheme.accent, color: activeTheme.accentText }}>
                          Solo Premium
                        </div>
                      )}
                      <div style={{ fontSize: 42, color: activeTheme.accent, textShadow: `0 0 30px ${activeTheme.accentGlow}`, lineHeight: 1 }}>{tpl.previewIcon}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.3rem", color: "rgba(255,255,255,0.7)" }}>{tpl.name}</div>
                    </div>

                    <div style={{ padding: "20px 22px 24px" }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{tpl.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 14 }}>{tpl.previewDesc}</div>
                      <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: activeTheme.accent, letterSpacing: "0.06em" }}>
                        {tpl.tagline}
                      </div>
                      <div style={{ marginTop: 16, padding: "10px 16px", borderRadius: 12, background: activeTheme.softBg, border: `1px solid ${activeTheme.border}`, fontSize: 13, fontWeight: 600, color: activeTheme.accent === "#f59e0b" ? activeTheme.accentText : "white", textAlign: "center" }}>
                        Elegir este template →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              PAGE: FILL FORM
          ══════════════════════════════════════ */}
          {page === "fill-form" && selectedEvent && selectedTemplate && (
            <div className="mom-layout">

              {/* ── MAIN PANEL ── */}
              <div className="mom-panel" style={{ borderRadius: 28, padding: "34px 30px", background: "rgba(12,10,18,0.78)", border: `1px solid ${activeTheme.border}`, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: "0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset", transition: "border-color 0.6s" }}>

                {/* Back link */}
                <button type="button" onClick={() => setPage("select-template")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
                  ← {activeTheme.label} / {selectedTemplate.name}
                </button>

                {/* Badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: `1px solid ${activeTheme.border}`, background: activeTheme.softBg, borderRadius: 999, padding: "6px 14px", marginBottom: 20, transition: "all 0.5s" }}>
                  <span style={{ fontSize: 14, color: activeTheme.accent }}>{selectedTemplate.previewIcon}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                    {activeTheme.label} · {selectedTemplate.name}
                  </span>
                </div>

                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 600, lineHeight: 1.08, marginBottom: 10, color: "white" }}>
                  Crea {selectedTemplate.name}
                </h1>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 28, lineHeight: 1.65, fontWeight: 300 }}>
                  {selectedTemplate.tagline}
                </p>

                <StepBar step={formStep} labels={stepLabels} theme={activeTheme} />

                {/* ─── STEP CONTENT ─── */}
                <div className="mom-stepbox step-enter" key={`${plan}-${formStep}`} style={{ borderRadius: 22, padding: 26, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>

                  {/* ── STEP 1: PLAN ── */}
                  {formStep === 1 && (
                    <section>
                      <SectionTitle>Elige tu plan</SectionTitle>
                      <div className="two-col">

                        {/* BASIC — only show if template supports it */}
                        {selectedTemplate.plans.includes("basic") && (
                          <button type="button" className="plan-opt" onClick={() => setPlan("basic")} style={{ textAlign: "left", padding: 20, borderRadius: 18, fontFamily: "inherit", cursor: "pointer", border: `1px solid ${plan === "basic" ? activeTheme.accent : "rgba(255,255,255,0.06)"}`, background: plan === "basic" ? activeTheme.softBg : "rgba(255,255,255,0.025)", color: "white", transition: "all 0.3s", boxShadow: plan === "basic" ? `0 0 22px ${activeTheme.accentGlow}` : "none" }}>
                            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Plan Basic</div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 600, color: plan === "basic" ? activeTheme.accent : "rgba(255,255,255,0.7)", lineHeight: 1, marginBottom: 10 }}>$3</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 14 }}>Todo lo necesario. Activo 90 días.</div>
                            {["Hasta 5 fotos", "Campos personalizados", "Link único compartible"].map(f => (
                              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: plan === "basic" ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.2)", marginBottom: 5 }}>
                                <span style={{ color: plan === "basic" ? activeTheme.accent : "rgba(255,255,255,0.15)", fontSize: 9 }}>✦</span>{f}
                              </div>
                            ))}
                          </button>
                        )}

                        {/* PREMIUM */}
                        <button type="button" className="plan-opt" onClick={() => setPlan("premium")} style={{ textAlign: "left", padding: 20, borderRadius: 18, fontFamily: "inherit", cursor: "pointer", position: "relative", overflow: "hidden", border: `1px solid ${plan === "premium" ? activeTheme.accent : "rgba(255,255,255,0.06)"}`, background: plan === "premium" ? activeTheme.softBg : "rgba(255,255,255,0.025)", color: "white", transition: "all 0.3s", boxShadow: plan === "premium" ? `0 0 28px ${activeTheme.accentGlow}` : "none", gridColumn: selectedTemplate.plans.includes("basic") ? "auto" : "1 / -1" }}>
                          {plan === "premium" && (
                            <div style={{ position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none", backgroundImage: `linear-gradient(90deg, transparent, ${activeTheme.accent}18, transparent)`, backgroundRepeat: "no-repeat", backgroundPosition: "0% 50%", backgroundSize: "200% 100%", animation: "shimmer 2.5s linear infinite" }} />
                          )}
                          <div style={{ position: "relative" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Plan Premium</div>
                              <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: plan === "premium" ? activeTheme.accent : "rgba(255,255,255,0.06)", color: plan === "premium" ? activeTheme.accentText : "rgba(255,255,255,0.35)", border: `1px solid ${plan === "premium" ? activeTheme.accent : "rgba(255,255,255,0.08)"}`, transition: "all 0.3s" }}>✦ Top</div>
                            </div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 600, color: plan === "premium" ? activeTheme.accent : "rgba(255,255,255,0.7)", lineHeight: 1, marginBottom: 10 }}>$5</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 14 }}>Álbum con frases por foto, música y link permanente.</div>
                            {["Hasta 12 fotos + frase por foto", "Música de fondo (YouTube)", "Link permanente", "Todos los campos básicos"].map(f => (
                              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: plan === "premium" ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.2)", marginBottom: 5 }}>
                                <span style={{ color: plan === "premium" ? activeTheme.accent : "rgba(255,255,255,0.15)", fontSize: 9 }}>✦</span>{f}
                              </div>
                            ))}
                          </div>
                        </button>
                      </div>
                      <ButtonRow>
                        <button type="button" style={primaryBtn(false)} onClick={() => setFormStep(2)}>Continuar →</button>
                      </ButtonRow>
                    </section>
                  )}

                  {/* ── STEP 2: DATOS ── */}
                  {formStep === 2 && (
                    <section>
                      <SectionTitle>Cuéntame sobre ustedes</SectionTitle>
                      <div className="two-col" style={{ marginBottom: 16 }}>
                        <div>
                          <Label>A quién va dedicado</Label>
                          <input value={recipientName} maxLength={NAME_MAX} onChange={e => setRecipientName(clampText(e.target.value, NAME_MAX))} placeholder="Ej: Anita" style={inputStyle} />
                          <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", marginTop: 6 }}>{recipientName.length}/{NAME_MAX}</div>
                        </div>
                        <div>
                          <Label>De quién viene</Label>
                          <input value={senderName} maxLength={NAME_MAX} onChange={e => setSenderName(clampText(e.target.value, NAME_MAX))} placeholder="Ej: Anthony" style={inputStyle} />
                          <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", marginTop: 6 }}>{senderName.length}/{NAME_MAX}</div>
                        </div>
                      </div>
                      <div className="two-col" style={{ marginBottom: 16 }}>
                        <div>
                          <Label>Apodo de tu pareja</Label>
                          <input value={nickname} maxLength={NICKNAME_MAX} onChange={e => setNickname(clampText(e.target.value, NICKNAME_MAX))} placeholder="Ej: mi amor, Nita…" style={inputStyle} />
                          <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", marginTop: 6 }}>{nickname.length}/{NICKNAME_MAX}</div>
                        </div>
                        <div>
                          <Label>Fecha de inicio de la relación</Label>
                          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ ...inputStyle, colorScheme: "dark" } as React.CSSProperties} />
                        </div>
                      </div>
                      <div style={{ marginBottom: plan === "premium" ? 16 : 0 }}>
                        <Label>Mensaje principal</Label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Escribe desde el corazón…" rows={6} maxLength={500} style={{ ...inputStyle, resize: "none" }} />
                        <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", marginTop: 6 }}>{message.length}/500</div>
                      </div>
                      <div style={{ marginBottom: plan === "premium" ? 16 : 0 }}>
                        <Label>Mensaje final</Label>
                        <textarea value={finalMessage} onChange={e => setFinalMessage(e.target.value)} placeholder="Tu cierre especial…" rows={4} maxLength={280} style={{ ...inputStyle, resize: "none" }} />
                        <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace", marginTop: 6 }}>{finalMessage.length}/280</div>
                      </div>
                      {plan === "premium" && (
                        <div>
                          <Label>Canción de fondo · YouTube</Label>
                          <input value={musicUrl} onChange={e => setMusicUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." style={inputStyle} />
                          <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.6 }}>
                            {musicUrl.trim() === "" && <span style={{ color: "rgba(255,255,255,0.28)" }}>Opcional — sin URL la carta va en silencio.</span>}
                            {musicUrl.trim() !== "" && musicValid && <span style={{ color: "#4ade80" }}>✓ Enlace válido — la música sonará en la experiencia.</span>}
                            {musicUrl.trim() !== "" && !musicValid && <span style={{ color: "#ff8080" }}>✗ No parece un link de YouTube válido.</span>}
                          </div>
                        </div>
                      )}
                      <ButtonRow>
                        <button type="button" style={secondaryBtn} onClick={() => setFormStep(1)}>← Volver</button>
                        <button type="button" style={primaryBtn(!canStep3)} disabled={!canStep3} onClick={() => setFormStep(3)}>Continuar →</button>
                      </ButtonRow>
                    </section>
                  )}

                  {/* ── STEP 3: FOTOS ── */}
                  {formStep === 3 && (
                    <section>
                      <SectionTitle>Las fotos de tu historia</SectionTitle>
                      <InfoBox>
                        {plan === "basic"
                          ? <>Sube hasta <strong>5 fotos</strong>. Elige cuál será la portada.</>
                          : <>Sube hasta <strong>12 fotos</strong>. En el siguiente paso le añadirás una frase especial a cada una.</>
                        }
                      </InfoBox>
                      <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "28px 20px", borderRadius: 18, marginBottom: 18, cursor: "pointer", border: `1.5px dashed ${activeTheme.border}`, background: activeTheme.softBg, transition: "background 0.2s" }}>
                        <span style={{ fontSize: 26, color: activeTheme.accent }}>{activeTheme.icon}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Toca para elegir fotos</span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{photos.length} de {PHOTO_MAX} subidas</span>
                        <input type="file" accept="image/*" multiple onChange={handlePhotosChange} style={{ display: "none" }} />
                      </label>
                      {photoError && <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 14, background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.16)", color: "#ffb3b3", fontSize: 13 }}>{photoError}</div>}
                      {photos.length > 0 && (
                        <div className="photo-grid">
                          {photos.map((photo, index) => {
                            const isCover = coverPhotoId === photo.id;
                            return (
                              <div key={photo.id} style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${isCover ? activeTheme.accent : "rgba(255,255,255,0.08)"}`, background: "rgba(255,255,255,0.03)", boxShadow: isCover ? `0 0 18px ${activeTheme.accentGlow}` : "none", transition: "all 0.3s" }}>
                                <div style={{ aspectRatio: "1/1", backgroundImage: `url(${photo.url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                                <div style={{ padding: 12 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>Foto {index + 1}</span>
                                    {isCover && <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 999, background: activeTheme.accent, color: activeTheme.accentText, fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>Portada</span>}
                                  </div>
                                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <button type="button" onClick={() => setCoverPhotoId(photo.id)} style={{ padding: "8px 10px", borderRadius: 10, fontSize: 11, border: `1px solid ${isCover ? activeTheme.accent : "rgba(255,255,255,0.1)"}`, background: isCover ? activeTheme.softBg : "transparent", color: "white", cursor: "pointer" }}>{isCover ? "✓ Portada" : "Usar portada"}</button>
                                    <button type="button" onClick={() => removePhoto(photo.id)} style={{ padding: "8px 10px", borderRadius: 10, fontSize: 11, border: "1px solid rgba(255,80,80,0.18)", background: "rgba(255,80,80,0.08)", color: "#ffb3b3", cursor: "pointer" }}>Eliminar</button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <ButtonRow>
                        <button type="button" style={secondaryBtn} onClick={() => setFormStep(2)}>← Volver</button>
                        <button type="button" style={primaryBtn(!canStep4)} disabled={!canStep4} onClick={() => setFormStep(plan === "basic" ? reviewStep : frasesStep)}>Continuar →</button>
                      </ButtonRow>
                    </section>
                  )}

                  {/* ── STEP 4 (premium): FRASES ── */}
                  {formStep === frasesStep && plan === "premium" && (
                    <section>
                      <SectionTitle>Una frase para cada foto</SectionTitle>
                      <InfoBox>Cada foto del álbum mostrará tu frase debajo. Escribe algo especial de ese momento. ♥</InfoBox>
                      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        {photos.map((photo, index) => (
                          <div key={photo.id} style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 16, alignItems: "start", padding: 16, borderRadius: 18, border: `1px solid ${photo.caption.trim() ? activeTheme.border : "rgba(255,255,255,0.06)"}`, background: photo.caption.trim() ? activeTheme.softBg : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                            <div style={{ aspectRatio: "1/1", borderRadius: 12, backgroundImage: `url(${photo.url})`, backgroundSize: "cover", backgroundPosition: "center", border: "1px solid rgba(255,255,255,0.08)" }} />
                            <div>
                              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Foto {index + 1} — frase</div>
                              <textarea value={photo.caption} onChange={e => updateCaption(photo.id, e.target.value)} placeholder="Escribe algo especial sobre este momento…" rows={3} maxLength={200} style={{ ...inputStyle, resize: "none", fontSize: 13 }} />
                              <div style={{ textAlign: "right", fontSize: 10, color: "rgba(255,255,255,0.22)", fontFamily: "'DM Mono', monospace", marginTop: 4 }}>{photo.caption.length}/200</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                        {photos.filter(p => p.caption.trim()).length} de {photos.length} frases escritas.
                        {!canStep5 && <span style={{ color: "#ff8080", marginLeft: 8 }}>Completa todas para continuar.</span>}
                      </div>
                      <ButtonRow>
                        <button type="button" style={secondaryBtn} onClick={() => setFormStep(3)}>← Volver</button>
                        <button type="button" style={primaryBtn(!canStep5)} disabled={!canStep5} onClick={() => setFormStep(reviewStep)}>Continuar →</button>
                      </ButtonRow>
                    </section>
                  )}

                  {/* ── REVIEW ── */}
                  {formStep === reviewStep && (
                    <section>
                      <SectionTitle>Revisa tu momento</SectionTitle>
                      <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "6px 18px", background: "rgba(255,255,255,0.02)", marginBottom: 22 }}>
                        <ReviewRow label="Template" value={selectedTemplate.name} />
                        <ReviewRow label="Plan" value={plan === "basic" ? "Basic — $3" : "Premium — $5"} />
                        <ReviewRow label="Para" value={recipientName} />
                        <ReviewRow label="De" value={senderName} />
                        <ReviewRow label="Apodo" value={nickname || "No especificado"} />
                        <ReviewRow label="Inicio" value={startDate || "No especificada"} />
                        <ReviewRow label="Mensaje" value={message.length > 90 ? message.slice(0, 90) + "…" : message} />
                        <ReviewRow label="Cierre" value={finalMessage.length > 90 ? finalMessage.slice(0, 90) + "…" : (finalMessage || "No especificado")} />
                        <ReviewRow label="Fotos" value={`${photos.length} · portada: foto ${photos.findIndex(p => p.id === coverPhotoId) + 1}`} />
                        {plan === "premium" && <>
                          <ReviewRow label="Frases" value={`${photos.filter(p => p.caption.trim()).length}/${photos.length}`} />
                          <ReviewRow label="Música" value={musicValid ? "✓ Configurada" : "Sin música"} />
                        </>}
                      </div>
                      {photos.length > 0 && (
                        <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
                          {photos.slice(0, 7).map((photo) => (
                            <div key={photo.id} style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0, backgroundImage: `url(${photo.url})`, backgroundSize: "cover", backgroundPosition: "center", border: `1px solid ${coverPhotoId === photo.id ? activeTheme.accent : "rgba(255,255,255,0.08)"}`, boxShadow: coverPhotoId === photo.id ? `0 0 10px ${activeTheme.accentGlow}` : "none" }} />
                          ))}
                          {photos.length > 7 && <div style={{ width: 52, height: 52, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>+{photos.length - 7}</div>}
                        </div>
                      )}
                      <ButtonRow>
                        <button type="button" style={secondaryBtn} onClick={() => setFormStep(plan === "basic" ? 3 : frasesStep)}>← Volver</button>
                        <button type="button" style={primaryBtn(false)} onClick={handleCreatePreview}>{activeTheme.icon} Crear mi sorpresa</button>
                      </ButtonRow>
                    </section>
                  )}

                </div>
              </div>

              {/* ── ASIDE ── */}
              <aside className="mom-aside" style={{ borderRadius: 28, padding: 24, background: "rgba(12,10,18,0.78)", border: `1px solid ${activeTheme.border}`, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: "0 24px 60px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.03) inset", alignSelf: "start", position: "sticky", top: 20, transition: "border-color 0.6s" }}>
                <div style={{ height: 200, borderRadius: 22, background: activeTheme.thumbGrad, border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 18, gap: 8, overflow: "hidden", position: "relative" }}>
                  {photos.length > 0 && <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${photos.find(p => p.id === coverPhotoId)?.url || photos[0]?.url})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.55 }} />}
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", color: activeTheme.accent, lineHeight: 1, textShadow: `0 0 40px ${activeTheme.accentGlow}`, position: "relative", zIndex: 1 }}>{selectedTemplate.previewIcon}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", position: "relative", zIndex: 1 }}>{selectedTemplate.name}</span>
                </div>
                {photos.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 16 }}>
                    {photos.slice(0, 3).map(photo => (
                      <div key={photo.id} style={{ aspectRatio: "1/1", borderRadius: 10, backgroundImage: `url(${photo.url})`, backgroundSize: "cover", backgroundPosition: "center", border: coverPhotoId === photo.id ? `1px solid ${activeTheme.accent}` : "1px solid rgba(255,255,255,0.08)", boxShadow: coverPhotoId === photo.id ? `0 0 10px ${activeTheme.accentGlow}` : "none" }} />
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px #4ade80aa" }} />
                  <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>Vista previa en vivo</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 16, lineHeight: 1.6 }}>El template real se mostrará antes del pago.</p>
                <div style={{ border: `1px solid ${activeTheme.border}`, borderRadius: 16, padding: "12px 16px", background: activeTheme.softBg }}>
                  {([
                    ["Plan", plan === "basic" ? "Basic — $3" : "Premium — $5"],
                    ["Para", recipientName || "—"],
                    ["Apodo", nickname || "—"],
                    ["Fotos", `${photos.length} / ${PHOTO_MAX}`],
                    ["Cierre", finalMessage || "—"],
                    ...(plan === "premium" ? [["Frases", `${photos.filter(p => p.caption.trim()).length}/${photos.length}`], ["Música", musicValid ? "✓" : "—"]] : []),
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} style={{ display: "grid", gridTemplateColumns: "64px minmax(0,1fr)", alignItems: "start", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12, gap: 10 }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", paddingTop: 2 }}>{k}</span>
                      <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500, textAlign: "right", overflowWrap: "anywhere", wordBreak: "break-word", minWidth: 0 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </aside>

            </div>
          )}

        </div>
      </main>
    </>
  );
}