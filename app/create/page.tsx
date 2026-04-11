"use client";

import { useMemo, useState, useEffect, useRef } from "react";

type EventType =
  | "amor"
  | "cumpleanos"
  | "aniversario"
  | "dia-de-la-madre"
  | "navidad";

type PlanType = "basic" | "premium";

type Template = {
  id: string;
  name: string;
  event: EventType;
  plans: PlanType[];
  preview: string;
};

type PhotoItem = {
  id: string;
  file: File;
  url: string;
};

const templates: Template[] = [
  {
    id: "romantic-pink",
    name: "Romantic Pink",
    event: "amor",
    plans: ["basic", "premium"],
    preview: "Romántico, suave y lleno de detalles delicados.",
  },
  {
    id: "golden-love",
    name: "Golden Love",
    event: "amor",
    plans: ["premium"],
    preview: "Elegante e intenso. Negro con acentos dorados.",
  },
  {
    id: "birthday-glow",
    name: "Birthday Glow",
    event: "cumpleanos",
    plans: ["basic", "premium"],
    preview: "Divertido, brillante y alegre para celebrar.",
  },
  {
    id: "birthday-stars",
    name: "Birthday Stars",
    event: "cumpleanos",
    plans: ["premium"],
    preview: "Energía visual y sensación de gran fiesta.",
  },
  {
    id: "anniversary-soft",
    name: "Anniversary Soft",
    event: "aniversario",
    plans: ["basic", "premium"],
    preview: "Romántico y elegante para una fecha inolvidable.",
  },
  {
    id: "mom-bloom",
    name: "Bloom for Mom",
    event: "dia-de-la-madre",
    plans: ["basic", "premium"],
    preview: "Floral, delicado, cálido y muy emocional.",
  },
  {
    id: "xmas-warm",
    name: "Warm Christmas",
    event: "navidad",
    plans: ["basic", "premium"],
    preview: "Brillo navideño, rojo intenso y acogedor.",
  },
];

type ThemeConfig = {
  title: string;
  subtitle: string;
  icon: string;
  orb1: string;
  orb2: string;
  orb3: string;
  accent: string;
  accentGlow: string;
  accentText: string;
  border: string;
  softBg: string;
  thumbGrad: string;
};

const themes: Record<EventType, ThemeConfig> = {
  amor: {
    title: "Crea una sorpresa romántica",
    subtitle: "Que se sienta especial desde el primer segundo.",
    icon: "♥",
    orb1: "radial-gradient(circle, #c0145c88 0%, transparent 70%)",
    orb2: "radial-gradient(circle, #7b002a66 0%, transparent 70%)",
    orb3: "radial-gradient(circle, #ff6fa033 0%, transparent 70%)",
    accent: "#ff3d7f",
    accentGlow: "rgba(255,61,127,0.35)",
    accentText: "#fff",
    border: "rgba(255,61,127,0.18)",
    softBg: "rgba(255,61,127,0.08)",
    thumbGrad: "linear-gradient(135deg,#5c0a28 0%,#a01048 100%)",
  },
  cumpleanos: {
    title: "Diseña un cumpleaños inolvidable",
    subtitle: "Color, alegría y una sorpresa que sí se recuerde.",
    icon: "★",
    orb1: "radial-gradient(circle, #7c3aed88 0%, transparent 70%)",
    orb2: "radial-gradient(circle, #4f46e566 0%, transparent 70%)",
    orb3: "radial-gradient(circle, #a855f733 0%, transparent 70%)",
    accent: "#a855f7",
    accentGlow: "rgba(168,85,247,0.35)",
    accentText: "#fff",
    border: "rgba(168,85,247,0.18)",
    softBg: "rgba(168,85,247,0.08)",
    thumbGrad: "linear-gradient(135deg,#3b0764 0%,#7e22ce 100%)",
  },
  aniversario: {
    title: "Convierte su aniversario en recuerdo",
    subtitle: "Más elegante, más íntimo, más memorable.",
    icon: "◈",
    orb1: "radial-gradient(circle, #92620088 0%, transparent 70%)",
    orb2: "radial-gradient(circle, #78350f66 0%, transparent 70%)",
    orb3: "radial-gradient(circle, #d9770633 0%, transparent 70%)",
    accent: "#f59e0b",
    accentGlow: "rgba(245,158,11,0.35)",
    accentText: "#1c1108",
    border: "rgba(245,158,11,0.18)",
    softBg: "rgba(245,158,11,0.08)",
    thumbGrad: "linear-gradient(135deg,#3d1e00 0%,#7c4a00 100%)",
  },
  "dia-de-la-madre": {
    title: "Crea un detalle precioso para mamá",
    subtitle: "Delicado, floral y lleno de emoción verdadera.",
    icon: "✿",
    orb1: "radial-gradient(circle, #9d174d88 0%, transparent 70%)",
    orb2: "radial-gradient(circle, #83185366 0%, transparent 70%)",
    orb3: "radial-gradient(circle, #ec489933 0%, transparent 70%)",
    accent: "#ec4899",
    accentGlow: "rgba(236,72,153,0.35)",
    accentText: "#fff",
    border: "rgba(236,72,153,0.18)",
    softBg: "rgba(236,72,153,0.08)",
    thumbGrad: "linear-gradient(135deg,#500730 0%,#9d1760 100%)",
  },
  navidad: {
    title: "Haz una sorpresa navideña con magia",
    subtitle: "Cálida, brillante y lista para compartir.",
    icon: "✦",
    orb1: "radial-gradient(circle, #991b1b88 0%, transparent 70%)",
    orb2: "radial-gradient(circle, #7f1d1d66 0%, transparent 70%)",
    orb3: "radial-gradient(circle, #dc262633 0%, transparent 70%)",
    accent: "#ef4444",
    accentGlow: "rgba(239,68,68,0.35)",
    accentText: "#fff",
    border: "rgba(239,68,68,0.18)",
    softBg: "rgba(239,68,68,0.08)",
    thumbGrad: "linear-gradient(135deg,#450a0a 0%,#991b1b 100%)",
  },
};

const eventOptions: [EventType, string, string][] = [
  ["amor", "♥", "Amor"],
  ["cumpleanos", "★", "Cumpleaños"],
  ["aniversario", "◈", "Aniversario"],
  ["dia-de-la-madre", "✿", "Día de la Madre"],
  ["navidad", "✦", "Navidad"],
];

function eventLabel(e: EventType) {
  return eventOptions.find(([v]) => v === e)?.[2] ?? e;
}

function ParticleCanvas({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const count = 55;
    const particles = Array.from({ length: count }, () => ({
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
      const color = accentRef.current;

      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        p.twinkle += 0.025;
        const a = p.alpha * (0.65 + 0.35 * Math.sin(p.twinkle));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          color + Math.round(a * 255).toString(16).padStart(2, "0");
        ctx.fill();

        if (p.y < -4) {
          p.y = canvas.height + 4;
          p.x = Math.random() * canvas.width;
        }

        if (p.x < -4 || p.x > canvas.width + 4) {
          p.x = Math.random() * canvas.width;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function StepBar({ step, theme }: { step: number; theme: ThemeConfig }) {
  const steps = ["Evento", "Datos", "Mensaje", "Fotos", "Estilo", "Review"];

  return (
    <div className="stepbar-grid" style={{ marginBottom: 28 }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;

        return (
          <div
            key={label}
            style={{
              borderRadius: 10,
              padding: "9px 4px",
              textAlign: "center",
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
              letterSpacing: "0.04em",
              background: active
                ? theme.accent
                : done
                ? theme.softBg
                : "rgba(255,255,255,0.04)",
              color: active
                ? theme.accentText
                : done
                ? "rgba(255,255,255,0.6)"
                : "rgba(255,255,255,0.28)",
              border: `1px solid ${active ? theme.accent : theme.border}`,
              boxShadow: active ? `0 0 14px ${theme.accentGlow}` : "none",
              transition: "all 0.4s ease",
              textTransform: "uppercase" as const,
            }}
          >
            {n}. {label}
          </div>
        );
      })}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontFamily: "'DM Mono', monospace",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="review-row">
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.38)",
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "rgba(255,255,255,0.9)",
          lineHeight: 1.6,
          fontSize: 14,
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<PlanType>("basic");
  const [eventType, setEventType] = useState<EventType>("amor");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [shortMessage, setShortMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState("");
  const [photoError, setPhotoError] = useState("");

  const theme = themes[eventType];
  const photoMin = plan === "basic" ? 3 : 5;
  const photoMax = plan === "basic" ? 5 : 12;

  const filteredTemplates = useMemo(
    () => templates.filter((t) => t.event === eventType && t.plans.includes(plan)),
    [eventType, plan]
  );

  const selectedTemplateData = filteredTemplates.find(
    (t) => t.id === selectedTemplate
  );

  const canGoStep2 = !!plan && !!eventType;
  const canGoStep3 = recipientName.trim() && senderName.trim();
  const canGoStep4 = shortMessage.trim().length > 0;
  const canGoStep5 = photos.length >= photoMin && photos.length <= photoMax;
  const canGoStep6 = !!selectedTemplate;

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const incomingFiles = Array.from(e.target.files || []);

    if (incomingFiles.length === 0) return;

    const availableSlots = photoMax - photos.length;

    if (availableSlots <= 0) {
      setPhotoError(`Tu plan permite máximo ${photoMax} fotos.`);
      e.target.value = "";
      return;
    }

    const filesToUse = incomingFiles.slice(0, availableSlots);

    const mapped = filesToUse.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));

    const updated = [...photos, ...mapped];
    setPhotos(updated);
    setPhotoError("");

    if (!coverPhotoId && updated.length > 0) {
      setCoverPhotoId(updated[0].id);
    }

    e.target.value = "";
  }

  function removePhoto(id: string) {
    const target = photos.find((photo) => photo.id === id);
    if (target) URL.revokeObjectURL(target.url);

    const updated = photos.filter((photo) => photo.id !== id);
    setPhotos(updated);

    if (coverPhotoId === id) {
      setCoverPhotoId(updated[0]?.id || "");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 13,
    border: "1px solid rgba(255,255,255,0.09)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.25s",
  };

  const primaryBtn = (disabled?: boolean): React.CSSProperties => ({
    padding: "12px 22px",
    borderRadius: 13,
    border: "none",
    background: disabled ? "rgba(255,255,255,0.08)" : theme.accent,
    color: disabled ? "rgba(255,255,255,0.3)" : theme.accentText,
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : `0 0 20px ${theme.accentGlow}`,
    transition: "all 0.25s",
    letterSpacing: "0.02em",
    width: "100%",
    maxWidth: 220,
  });

  const secondaryBtn: React.CSSProperties = {
    padding: "12px 18px",
    borderRadius: 13,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "rgba(255,255,255,0.45)",
    fontWeight: 500,
    fontSize: 14,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
    maxWidth: 180,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        html, body {
          margin: 0;
          padding: 0;
        }

        #momentia-app input::placeholder,
        #momentia-app textarea::placeholder {
          color: rgba(255,255,255,0.25);
        }

        #momentia-app input:focus,
        #momentia-app textarea:focus {
          border-color: ${theme.border} !important;
          outline: none;
        }

        .event-opt:hover { transform: translateY(-1px); }
        .plan-opt:hover { transform: translateY(-2px); }
        .template-opt:hover { transform: translateY(-2px); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .step-enter {
          animation: fadeUp 0.35s ease forwards;
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .momentia-layout {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 22px;
          align-items: start;
        }

        .stepbar-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 6px;
        }

        .event-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 26px;
        }

        .two-col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .template-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .button-row {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .review-row {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          align-items: start;
        }

        @media (max-width: 980px) {
          .momentia-layout {
            grid-template-columns: 1fr;
          }

          .momentia-aside {
            position: static !important;
            top: auto !important;
          }
        }

        @media (max-width: 720px) {
          #momentia-app {
            padding: 24px 14px 56px !important;
          }

          .momentia-main-panel,
          .momentia-aside {
            padding: 20px !important;
            border-radius: 22px !important;
          }

          .momentia-step-box {
            padding: 18px !important;
          }

          .stepbar-grid {
            grid-template-columns: 1fr;
          }

          .event-grid,
          .two-col-grid,
          .template-grid {
            grid-template-columns: 1fr;
          }

          .review-row {
            grid-template-columns: 1fr;
            gap: 6px;
          }

          .button-row {
            justify-content: stretch;
          }

          .button-row > * {
            max-width: 100% !important;
          }
        }
      `}</style>

      <ParticleCanvas accent={theme.accent} />

      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            top: "-10%",
            left: "-10%",
            background: theme.orb1,
            borderRadius: "50%",
            filter: "blur(80px)",
            transition: "background 1s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            bottom: "-5%",
            right: "-5%",
            background: theme.orb2,
            borderRadius: "50%",
            filter: "blur(70px)",
            transition: "background 1s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 350,
            height: 350,
            top: "40%",
            right: "20%",
            background: theme.orb3,
            borderRadius: "50%",
            filter: "blur(90px)",
            transition: "background 1s ease",
          }}
        />
      </div>

      <main
        id="momentia-app"
        style={{
          minHeight: "100vh",
          background: "#0a0a0c",
          color: "white",
          fontFamily: "'DM Sans', sans-serif",
          padding: "40px 20px 80px",
          position: "relative",
          zIndex: 1,
          transition: "all 0.8s ease",
        }}
      >
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div className="momentia-layout">
            <div
              className="momentia-main-panel"
              style={{
                borderRadius: 28,
                padding: "34px 30px",
                background: "rgba(12,10,18,0.78)",
                border: `1px solid ${theme.border}`,
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow:
                  "0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset",
                transition: "border-color 0.6s",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: `1px solid ${theme.border}`,
                  background: theme.softBg,
                  borderRadius: 999,
                  padding: "6px 14px",
                  marginBottom: 20,
                  transition: "all 0.5s",
                }}
              >
                <span style={{ fontSize: 14, color: theme.accent }}>
                  {theme.icon}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  Momentia Experience
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 600,
                  lineHeight: 1.08,
                  marginBottom: 10,
                  color: "white",
                  transition: "all 0.5s",
                }}
              >
                {theme.title}
              </h1>

              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 28,
                  lineHeight: 1.65,
                  fontWeight: 300,
                  transition: "all 0.5s",
                }}
              >
                {theme.subtitle}
              </p>

              <StepBar step={step} theme={theme} />

              <div
                className="momentia-step-box step-enter"
                key={step}
                style={{
                  borderRadius: 22,
                  padding: 26,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {step === 1 && (
                  <section>
                    <SectionTitle>Selecciona el evento y tu plan</SectionTitle>

                    <Label>Evento</Label>
                    <div className="event-grid">
                      {eventOptions.map(([value, icon, label]) => {
                        const active = eventType === value;
                        const t = themes[value];

                        return (
                          <button
                            key={value}
                            className="event-opt"
                            type="button"
                            onClick={() => {
                              setEventType(value);
                              setSelectedTemplate("");
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "12px 14px",
                              borderRadius: 14,
                              border: `1px solid ${
                                active ? t.accent : "rgba(255,255,255,0.07)"
                              }`,
                              background: active
                                ? t.softBg
                                : "rgba(255,255,255,0.03)",
                              color: active ? "white" : "rgba(255,255,255,0.55)",
                              fontWeight: active ? 600 : 400,
                              fontSize: 14,
                              fontFamily: "inherit",
                              cursor: "pointer",
                              textAlign: "left",
                              boxShadow: active ? `0 0 12px ${t.accentGlow}` : "none",
                              transition: "all 0.25s",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 16,
                                color: active ? t.accent : "rgba(255,255,255,0.3)",
                              }}
                            >
                              {icon}
                            </span>
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    <Label>Plan</Label>
                    <div className="two-col-grid">
                      <button
                        type="button"
                        className="plan-opt"
                        onClick={() => {
                          setPlan("basic");
                          setSelectedTemplate("");
                        }}
                        style={{
                          textAlign: "left",
                          padding: 18,
                          borderRadius: 18,
                          border: `1px solid ${
                            plan === "basic"
                              ? theme.border
                              : "rgba(255,255,255,0.06)"
                          }`,
                          background:
                            plan === "basic"
                              ? theme.softBg
                              : "rgba(255,255,255,0.025)",
                          color: "white",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.3s",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: "'DM Mono', monospace",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.35)",
                            marginBottom: 10,
                          }}
                        >
                          Plan Basic
                        </div>

                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "2rem",
                            fontWeight: 600,
                            color:
                              plan === "basic"
                                ? theme.accent
                                : "rgba(255,255,255,0.7)",
                            lineHeight: 1,
                            marginBottom: 8,
                          }}
                        >
                          $3
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.45)",
                            lineHeight: 1.6,
                          }}
                        >
                          Bonito, rápido y activo por 90 días.
                        </div>
                      </button>

                      <button
                        type="button"
                        className="plan-opt"
                        onClick={() => {
                          setPlan("premium");
                          setSelectedTemplate("");
                        }}
                        style={{
                          textAlign: "left",
                          padding: 18,
                          borderRadius: 18,
                          border: `1px solid ${
                            plan === "premium"
                              ? theme.accent
                              : "rgba(255,255,255,0.06)"
                          }`,
                          background:
                            plan === "premium"
                              ? theme.softBg
                              : "rgba(255,255,255,0.025)",
                          color: "white",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.3s",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow:
                            plan === "premium"
                              ? `0 0 28px ${theme.accentGlow}`
                              : "none",
                        }}
                      >
                        {plan === "premium" && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: 18,
                              backgroundImage: `linear-gradient(90deg, transparent, ${theme.accent}18, transparent)`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "0% 50%",
                              backgroundSize: "200% 100%",
                              animation: "shimmer 2.5s linear infinite",
                              pointerEvents: "none",
                            }}
                          />
                        )}

                        <div style={{ position: "relative" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 10,
                              flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 10,
                                fontFamily: "'DM Mono', monospace",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.35)",
                              }}
                            >
                              Plan Premium
                            </div>

                            <div
                              style={{
                                fontSize: 9,
                                fontFamily: "'DM Mono', monospace",
                                fontWeight: 500,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                padding: "3px 8px",
                                borderRadius: 999,
                                background:
                                  plan === "premium"
                                    ? theme.accent
                                    : "rgba(255,255,255,0.06)",
                                color:
                                  plan === "premium"
                                    ? theme.accentText
                                    : "rgba(255,255,255,0.35)",
                                border: `1px solid ${
                                  plan === "premium"
                                    ? theme.accent
                                    : "rgba(255,255,255,0.08)"
                                }`,
                                transition: "all 0.3s",
                              }}
                            >
                              ✦ Top
                            </div>
                          </div>

                          <div
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: "2rem",
                              fontWeight: 600,
                              color:
                                plan === "premium"
                                  ? theme.accent
                                  : "rgba(255,255,255,0.7)",
                              lineHeight: 1,
                              marginBottom: 8,
                              transition: "color 0.3s",
                            }}
                          >
                            $5
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(255,255,255,0.45)",
                              lineHeight: 1.6,
                            }}
                          >
                            Más emoción, opciones exclusivas y link permanente.
                          </div>

                          <div
                            style={{
                              marginTop: 14,
                              display: "flex",
                              flexDirection: "column",
                              gap: 5,
                            }}
                          >
                            {[
                              "Templates exclusivos",
                              "Link permanente",
                              "Galería de fotos",
                            ].map((f) => (
                              <div
                                key={f}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 7,
                                  fontSize: 11,
                                  color:
                                    plan === "premium"
                                      ? "rgba(255,255,255,0.65)"
                                      : "rgba(255,255,255,0.2)",
                                  transition: "color 0.3s",
                                }}
                              >
                                <span
                                  style={{
                                    color:
                                      plan === "premium"
                                        ? theme.accent
                                        : "rgba(255,255,255,0.15)",
                                    fontSize: 9,
                                  }}
                                >
                                  ✦
                                </span>
                                {f}
                              </div>
                            ))}
                          </div>
                        </div>
                      </button>
                    </div>

                    <ButtonRow>
                      <button
                        type="button"
                        style={primaryBtn(!canGoStep2)}
                        disabled={!canGoStep2}
                        onClick={() => setStep(2)}
                      >
                        Continuar →
                      </button>
                    </ButtonRow>
                  </section>
                )}

                {step === 2 && (
                  <section>
                    <SectionTitle>¿Para quién es este momento?</SectionTitle>

                    <div className="two-col-grid" style={{ gap: 16 }}>
                      <div>
                        <Label>Quien recibe</Label>
                        <input
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Ej: Anita"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <Label>Quien envía</Label>
                        <input
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="Ej: Anthony"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <ButtonRow>
                      <button
                        type="button"
                        style={secondaryBtn}
                        onClick={() => setStep(1)}
                      >
                        ← Volver
                      </button>
                      <button
                        type="button"
                        style={primaryBtn(!canGoStep3)}
                        disabled={!canGoStep3}
                        onClick={() => setStep(3)}
                      >
                        Continuar →
                      </button>
                    </ButtonRow>
                  </section>
                )}

                {step === 3 && (
                  <section>
                    <SectionTitle>El mensaje que lo cambia todo</SectionTitle>
                    <Label>Escribe algo especial</Label>
                    <textarea
                      value={shortMessage}
                      onChange={(e) => setShortMessage(e.target.value)}
                      placeholder="Cada palabra cuenta… escribe desde el corazón."
                      rows={6}
                      maxLength={280}
                      style={{ ...inputStyle, resize: "none" }}
                    />

                    <div
                      style={{
                        textAlign: "right",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.25)",
                        fontFamily: "'DM Mono', monospace",
                        marginTop: 6,
                      }}
                    >
                      {shortMessage.length}/280
                    </div>

                    <ButtonRow>
                      <button
                        type="button"
                        style={secondaryBtn}
                        onClick={() => setStep(2)}
                      >
                        ← Volver
                      </button>
                      <button
                        type="button"
                        style={primaryBtn(!canGoStep4)}
                        disabled={!canGoStep4}
                        onClick={() => setStep(4)}
                      >
                        Continuar →
                      </button>
                    </ButtonRow>
                  </section>
                )}

                {step === 4 && (
                  <section>
                    <SectionTitle>Agrega tus fotos favoritas</SectionTitle>

                    <p
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.38)",
                        marginBottom: 18,
                        lineHeight: 1.6,
                      }}
                    >
                      Tu plan actual permite entre {photoMin} y {photoMax} fotos.
                      Elige una portada principal para que el regalo se vea más especial.
                    </p>

                    <div
                      style={{
                        border: "1px dashed rgba(255,255,255,0.12)",
                        borderRadius: 18,
                        padding: 18,
                        background: "rgba(255,255,255,0.02)",
                        marginBottom: 18,
                      }}
                    >
                      <Label>Subir fotos</Label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotosChange}
                        style={{
                          width: "100%",
                          color: "rgba(255,255,255,0.75)",
                          fontSize: 14,
                        }}
                      />
                      <p
                        style={{
                          marginTop: 10,
                          marginBottom: 0,
                          fontSize: 12,
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        Puedes subir varias a la vez.
                      </p>
                    </div>

                    {photoError && (
                      <div
                        style={{
                          marginBottom: 16,
                          padding: "12px 14px",
                          borderRadius: 14,
                          background: "rgba(255,80,80,0.08)",
                          border: "1px solid rgba(255,80,80,0.16)",
                          color: "#ffb3b3",
                          fontSize: 13,
                        }}
                      >
                        {photoError}
                      </div>
                    )}

                    <div className="template-grid" style={{ marginTop: 10 }}>
                      {photos.map((photo, index) => {
                        const isCover = coverPhotoId === photo.id;

                        return (
                          <div
                            key={photo.id}
                            style={{
                              border: `1px solid ${
                                isCover ? theme.accent : "rgba(255,255,255,0.08)"
                              }`,
                              borderRadius: 18,
                              overflow: "hidden",
                              background: "rgba(255,255,255,0.03)",
                              boxShadow: isCover
                                ? `0 0 18px ${theme.accentGlow}`
                                : "none",
                            }}
                          >
                            <div
                              style={{
                                aspectRatio: "1 / 1",
                                backgroundImage: `url(${photo.url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />

                            <div style={{ padding: 14 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 10,
                                  marginBottom: 10,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.5)",
                                  }}
                                >
                                  Foto {index + 1}
                                </span>

                                {isCover && (
                                  <span
                                    style={{
                                      fontSize: 10,
                                      padding: "4px 8px",
                                      borderRadius: 999,
                                      background: theme.accent,
                                      color: theme.accentText,
                                      fontFamily: "'DM Mono', monospace",
                                      letterSpacing: "0.08em",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Cover
                                  </span>
                                )}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => setCoverPhotoId(photo.id)}
                                  style={{
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    background: isCover ? theme.softBg : "transparent",
                                    color: "white",
                                    fontSize: 12,
                                    cursor: "pointer",
                                  }}
                                >
                                  {isCover ? "Portada elegida" : "Usar como portada"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removePhoto(photo.id)}
                                  style={{
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,80,80,0.18)",
                                    background: "rgba(255,80,80,0.08)",
                                    color: "#ffb3b3",
                                    fontSize: 12,
                                    cursor: "pointer",
                                  }}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div
                      style={{
                        marginTop: 16,
                        fontSize: 13,
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      Has subido {photos.length} de {photoMax} fotos.
                    </div>

                    <ButtonRow>
                      <button
                        type="button"
                        style={secondaryBtn}
                        onClick={() => setStep(3)}
                      >
                        ← Volver
                      </button>
                      <button
                        type="button"
                        style={primaryBtn(!canGoStep5)}
                        disabled={!canGoStep5}
                        onClick={() => setStep(5)}
                      >
                        Continuar →
                      </button>
                    </ButtonRow>
                  </section>
                )}

                {step === 5 && (
                  <section>
                    <SectionTitle>Elige el estilo visual</SectionTitle>
                    <p
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.38)",
                        marginBottom: 20,
                        lineHeight: 1.6,
                      }}
                    >
                      Cada template está pensado para tu{" "}
                      {eventLabel(eventType).toLowerCase()}.
                    </p>

                    <div className="template-grid">
                      {filteredTemplates.map((tpl) => {
                        const active = selectedTemplate === tpl.id;

                        return (
                          <button
                            key={tpl.id}
                            type="button"
                            className="template-opt"
                            onClick={() => setSelectedTemplate(tpl.id)}
                            style={{
                              textAlign: "left",
                              border: `1px solid ${
                                active ? theme.accent : "rgba(255,255,255,0.07)"
                              }`,
                              borderRadius: 20,
                              padding: 16,
                              background: active
                                ? theme.softBg
                                : "rgba(255,255,255,0.025)",
                              color: "white",
                              cursor: "pointer",
                              fontFamily: "inherit",
                              transition: "all 0.3s",
                              boxShadow: active
                                ? `0 0 20px ${theme.accentGlow}`
                                : "none",
                            }}
                          >
                            <div
                              style={{
                                height: 110,
                                borderRadius: 14,
                                marginBottom: 14,
                                background: theme.thumbGrad,
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                color: theme.accent,
                                fontFamily: "'Cormorant Garamond', serif",
                                fontStyle: "italic",
                                fontWeight: 600,
                                letterSpacing: "0.02em",
                              }}
                            >
                              {tpl.name.split(" ")[0]}
                            </div>

                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 14,
                                marginBottom: 5,
                              }}
                            >
                              {tpl.name}
                            </div>

                            <div
                              style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.45)",
                                lineHeight: 1.5,
                              }}
                            >
                              {tpl.preview}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <ButtonRow>
                      <button
                        type="button"
                        style={secondaryBtn}
                        onClick={() => setStep(4)}
                      >
                        ← Volver
                      </button>
                      <button
                        type="button"
                        style={primaryBtn(!canGoStep6)}
                        disabled={!canGoStep6}
                        onClick={() => setStep(6)}
                      >
                        Continuar →
                      </button>
                    </ButtonRow>
                  </section>
                )}

                {step === 6 && (
                  <section>
                    <SectionTitle>Revisa tu momento</SectionTitle>

                    <div
                      style={{
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 18,
                        padding: "6px 18px",
                        background: "rgba(255,255,255,0.02)",
                        marginBottom: 22,
                      }}
                    >
                      <ReviewRow
                        label="Plan"
                        value={plan === "basic" ? "Basic — $3" : "Premium — $5"}
                      />
                      <ReviewRow label="Evento" value={eventLabel(eventType)} />
                      <ReviewRow label="Recibe" value={recipientName} />
                      <ReviewRow label="Envía" value={senderName} />
                      <ReviewRow
                        label="Template"
                        value={selectedTemplateData?.name ?? ""}
                      />
                      <ReviewRow label="Mensaje" value={shortMessage} />
                      <ReviewRow
                        label="Fotos"
                        value={`${photos.length} seleccionadas`}
                      />
                      <ReviewRow
                        label="Portada"
                        value={
                          coverPhotoId
                            ? `Foto ${
                                photos.findIndex((photo) => photo.id === coverPhotoId) + 1
                              }`
                            : "No definida"
                        }
                      />
                    </div>

                    <ButtonRow>
                      <button
                        type="button"
                        style={secondaryBtn}
                        onClick={() => setStep(5)}
                      >
                        ← Volver
                      </button>
                      <button
                        type="button"
                        style={primaryBtn(false)}
                        onClick={() =>
                          alert("Siguiente paso: generar slug, guardar datos y pago.")
                        }
                      >
                        {theme.icon} Crear mi sorpresa
                      </button>
                    </ButtonRow>
                  </section>
                )}
              </div>
            </div>

            <aside
              className="momentia-aside"
              style={{
                borderRadius: 28,
                padding: 24,
                background: "rgba(12,10,18,0.78)",
                border: `1px solid ${theme.border}`,
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow:
                  "0 24px 60px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.03) inset",
                alignSelf: "start",
                position: "sticky",
                top: 20,
                transition: "border-color 0.6s",
              }}
            >
              <div
                style={{
                  height: 210,
                  borderRadius: 22,
                  background: theme.thumbGrad,
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                  gap: 8,
                  transition: "background 0.7s",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "4rem",
                    color: theme.accent,
                    lineHeight: 1,
                    textShadow: `0 0 40px ${theme.accentGlow}`,
                    transition: "all 0.5s",
                  }}
                >
                  {theme.icon}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    textAlign: "center",
                    padding: "0 10px",
                  }}
                >
                  {eventLabel(eventType)}
                </span>
              </div>

              {photos.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  {photos.slice(0, 3).map((photo) => (
                    <div
                      key={photo.id}
                      style={{
                        aspectRatio: "1 / 1",
                        borderRadius: 12,
                        backgroundImage: `url(${photo.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border:
                          coverPhotoId === photo.id
                            ? `1px solid ${theme.accent}`
                            : "1px solid rgba(255,255,255,0.08)",
                        boxShadow:
                          coverPhotoId === photo.id
                            ? `0 0 12px ${theme.accentGlow}`
                            : "none",
                      }}
                    />
                  ))}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 5,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#4ade80",
                    display: "inline-block",
                    boxShadow: "0 0 6px #4ade80aa",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "'DM Mono', monospace",
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.06em",
                  }}
                >
                  Vista previa
                </span>
              </div>

              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: 18,
                  lineHeight: 1.6,
                }}
              >
                El template real se mostrará aquí antes del pago.
              </p>

              <div
                style={{
                  border: `1px solid ${theme.border}`,
                  borderRadius: 16,
                  padding: "12px 16px",
                  background: theme.softBg,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                {[
                  ["Plan", plan === "basic" ? "Basic — $3" : "Premium — $5"],
                  ["Recibe", recipientName || "—"],
                  ["Envía", senderName || "—"],
                  ["Template", selectedTemplateData?.name ?? "—"],
                  ["Fotos", `${photos.length}`],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "7px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      fontSize: 12,
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {k}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.75)",
                        fontWeight: 500,
                        textAlign: "right",
                        wordBreak: "break-word",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.7rem",
        fontWeight: 600,
        color: "white",
        marginBottom: 18,
        lineHeight: 1.2,
      }}
    >
      {children}
    </h2>
  );
}

function ButtonRow({ children }: { children: React.ReactNode }) {
  return <div className="button-row">{children}</div>;
}