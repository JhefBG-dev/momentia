"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type RomanticLetterData = {
  recipientName?: string;
  senderName?: string;
  nickname?: string;
  message?: string;
  shortMessage?: string;
  letterMessage?: string;
  finalMessage?: string;
  relationshipStartDate?: string;
  coverPhotoUrl?: string;
  photoUrls?: string[];
  musicUrl?: string;
  isPremium?: boolean;
  plan?: "basic" | "premium";
  photoCaptions?: string[];
  slug?: string;
};

type Scene =
  | "intro"
  | "sealed"
  | "opening"
  | "writing-letter"
  | "relationship-time"
  | "memory-book"
  | "final-message";

type TurnDirection = "next" | "prev" | null;

const PREVIEW_STORAGE_KEY = "momentia_preview";

const FREE_FALLBACK_CAPTIONS = [
  "Cada recuerdo contigo tiene algo mío que nunca quiero perder.",
  "A tu lado hasta lo sencillo termina sintiéndose especial.",
  "Esta foto guarda un instante, pero también guarda lo que sentí contigo.",
  "Qué bonito es volver aquí y recordar que existió un nosotros así de real.",
  "Si pudiera volver a un momento, probablemente elegiría uno contigo.",
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

function looksLikeLink(value?: string) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return false;
  return (
    text.startsWith("http://") ||
    text.startsWith("https://") ||
    text.includes("youtube.com") ||
    text.includes("youtu.be") ||
    text.includes("watch?v=") ||
    text.includes("playlist=") ||
    text.includes("www.")
  );
}

function normalizeText(value?: string) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function safeText(value: string | undefined, fallback: string) {
  const cleaned = normalizeText(value);
  if (!cleaned) return fallback;
  if (looksLikeLink(cleaned)) return fallback;
  return cleaned;
}

function sanitizeCaption(value: string | undefined, musicUrl?: string) {
  const cleaned = normalizeText(value);
  if (!cleaned) return "";
  if (looksLikeLink(cleaned)) return "";
  if (musicUrl && cleaned === normalizeText(musicUrl)) return "";
  return cleaned;
}

function getSlugFromPathname() {
  if (typeof window === "undefined") return "";
  const parts = window.location.pathname.split("/").filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] || "");
}

function readStoredPreview(): RomanticLetterData | null {
  if (typeof window === "undefined") return null;

  const slug = getSlugFromPathname();
  const rawExact = slug ? window.sessionStorage.getItem(`${PREVIEW_STORAGE_KEY}:${slug}`) : null;
  const rawGeneric = window.sessionStorage.getItem(PREVIEW_STORAGE_KEY);
  const candidates = [rawExact, rawGeneric].filter(Boolean) as string[];

  for (const raw of candidates) {
    try {
      const parsed = JSON.parse(raw) as RomanticLetterData | null;
      if (!parsed) continue;

      if (slug) {
        if (parsed.slug === slug) return parsed;
        continue;
      }

      return parsed;
    } catch {
      // ignore broken session data
    }
  }

  return null;
}

function buildYouTubeEmbed(url: string) {
  const id = extractYouTubeId(url);
  if (!id) return "";

  const origin = typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : "";
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1${origin ? `&origin=${origin}` : ""}`;
}

/* ─────────────────────────────────────────────
   TYPEWRITER HOOK
───────────────────────────────────────────── */
function useTypewriter(text: string, speed = 78) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);

    return () => window.clearInterval(id);
  }, [text, speed]);

  return { text: displayed, done };
}

/* ─────────────────────────────────────────────
   BACKGROUND: stars + heart rain
───────────────────────────────────────────── */
function RomanticBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        left: `${(i * 17 + 9) % 98}%`,
        top: `${(i * 23 + 5) % 94}%`,
        size: 1 + (i % 3),
        delay: `${(i % 7) * 0.35}s`,
        duration: `${2.8 + (i % 5) * 0.7}s`,
        opacity: 0.12 + (i % 4) * 0.06,
      })),
    []
  );

  const hearts = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: `${(i * 9 + 6) % 100}%`,
        size: 12 + (i % 5) * 6,
        delay: `${(i % 8) * 0.82}s`,
        duration: `${8.4 + (i % 6) * 1.15}s`,
        opacity: 0.08 + (i % 4) * 0.05,
        drift: i % 2 === 0 ? 18 : -22,
      })),
    []
  );

  return (
    <>
      {stars.map((s, i) => (
        <div
          key={`star-${i}`}
          style={{
            position: "fixed",
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff7fb",
            opacity: s.opacity,
            animation: `romTwinkle ${s.duration} ease-in-out ${s.delay} infinite`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {hearts.map((h, i) => (
        <div
          key={`heart-${i}`}
          style={{
            position: "fixed",
            left: h.left,
            top: "-10%",
            fontSize: h.size,
            lineHeight: 1,
            color: `rgba(255, 182, 205, ${h.opacity})`,
            textShadow: "0 0 18px rgba(255, 110, 170, 0.18)",
            animation: `romHeartRain ${h.duration} linear ${h.delay} infinite`,
            transform: `translateX(${h.drift}px)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          ♥
        </div>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   GOLD QUILL + INK PARTICLES
───────────────────────────────────────────── */
function GoldQuill({ x, y, size = 82 }: { x: number; y: number; size?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - size * 0.36,
        top: y - size * 0.82,
        width: size,
        height: size * 1.42,
        transform: "rotate(-17deg)",
        pointerEvents: "none",
        zIndex: 14,
        filter: "drop-shadow(0 10px 16px rgba(40,24,10,0.3))",
        transition: "left 0.08s linear, top 0.08s linear",
      }}
    >
      <svg viewBox="0 0 110 150" width="100%" height="100%">
        <defs>
          <linearGradient id="goldFeather" x1="0%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#fff0aa" />
            <stop offset="18%" stopColor="#ffd862" />
            <stop offset="56%" stopColor="#f2aa1f" />
            <stop offset="100%" stopColor="#c56a0b" />
          </linearGradient>
          <linearGradient id="goldFeatherShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd053" />
            <stop offset="100%" stopColor="#8d4306" />
          </linearGradient>
          <linearGradient id="silverNib" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="28%" stopColor="#d0d2d7" />
            <stop offset="62%" stopColor="#969ba6" />
            <stop offset="100%" stopColor="#5a5f68" />
          </linearGradient>
          <linearGradient id="ringMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8d5934" />
            <stop offset="45%" stopColor="#d9b08f" />
            <stop offset="100%" stopColor="#68412a" />
          </linearGradient>
        </defs>

        <path d="M96 20C67 18 41 36 26 59c-11 17-14 36-7 55c5 13 19 22 33 21c21-2 39-15 49-34c13-24 12-51-5-81Z" fill="url(#goldFeather)" />
        <path d="M93 22C63 30 35 46 21 67c-11 16-12 35-5 50c3 7 12 14 20 16c-9-7-12-15-10-26c3-16 18-34 34-48c18-15 34-25 44-42Z" fill="url(#goldFeatherShadow)" opacity="0.24" />

        {[
          "M73 23C67 34 59 42 46 53",
          "M82 32C70 42 58 56 41 67",
          "M86 45C71 58 58 72 38 81",
          "M84 60C70 74 54 86 32 94",
          "M78 76C64 89 49 100 28 107",
          "M68 92C57 103 44 112 24 119",
          "M58 107C47 117 37 124 20 129",
          "M76 36C83 40 89 47 92 58",
          "M80 50C87 57 90 64 90 76",
          "M77 66C84 73 86 81 85 92",
        ].map((d, i) => (
          <path key={i} d={d} stroke="rgba(137,72,10,0.38)" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        ))}

        <path d="M24 128C39 111 55 94 70 75C80 62 90 46 101 30" stroke="#f7efe6" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M24 128C39 111 55 94 70 75C80 62 90 46 101 30" stroke="rgba(101,75,52,0.28)" strokeWidth="7.5" strokeLinecap="round" opacity="0.28" />

        <path d="M9 139L24 121L34 131L18 149Z" fill="url(#silverNib)" />
        <path d="M10 139L17 145L24 137" stroke="rgba(30,20,15,0.55)" strokeWidth="1.8" fill="none" />
        <ellipse cx="15.5" cy="141" rx="1.8" ry="4.2" fill="#19120e" opacity="0.82" />

        <path d="M18 121C19 113 26 109 34 111C37 112 39 114 40 117C41 120 40 124 37 127L34 131Z" fill="url(#ringMetal)" />
        <path d="M24 112C31 108 39 109 44 114C47 117 48 122 46 126L39 131L34 124Z" fill="url(#ringMetal)" />
      </svg>
    </div>
  );
}

function InkParticles({ x, y, seed }: { x: number; y: number; seed: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        dx: (i - 3) * 4,
        dy: -4 - (i % 3) * 5,
        size: 2 + (i % 3),
        delay: `${i * 0.03}s`,
      })),
    []
  );

  return (
    <div key={seed} style={{ position: "absolute", left: x - 6, top: y - 4, pointerEvents: "none", zIndex: 13 }}>
      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(241, 186, 64, 0.92)" : "rgba(255, 233, 154, 0.82)",
            boxShadow: "0 0 10px rgba(255, 204, 102, 0.35)",
            animation: `romInkSpark 0.55s ease-out ${p.delay} both`,
            transform: `translate(${p.dx}px, ${p.dy}px)`,
          }}
        />
      ))}
    </div>
  );
}

function WritingStage({
  text,
  done,
  variant,
}: {
  text: string;
  done: boolean;
  variant: "intro" | "letter";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastCharRef = useRef<HTMLSpanElement>(null);
  const [quillXY, setQuillXY] = useState({ x: 34, y: 46 });
  const [sparkSeed, setSparkSeed] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current || !lastCharRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const charRect = lastCharRef.current.getBoundingClientRect();
    setQuillXY({
      x: charRect.left - parentRect.left + charRect.width * 0.55,
      y: charRect.top - parentRect.top,
    });
  }, [text]);

  useEffect(() => {
    if (!text) return;
    setSparkSeed((prev) => prev + 1);
  }, [text.length]);

  const chars = text.split("");

  const textStyle: React.CSSProperties =
    variant === "intro"
      ? {
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
          lineHeight: 1.48,
          color: "rgba(255,242,246,0.97)",
          textShadow: "0 2px 28px rgba(196,98,124,0.22)",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }
      : {
          fontFamily: "'Great Vibes', cursive",
          fontSize: "clamp(1.55rem, 3vw, 2.34rem)",
          lineHeight: 2.02,
          color: "#5b2f1d",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        textAlign: variant === "intro" ? "center" : "left",
        minHeight: variant === "intro" ? 160 : 240,
      }}
    >
      {!done && (
        <>
          <InkParticles x={quillXY.x + 6} y={quillXY.y + 24} seed={sparkSeed} />
          <GoldQuill x={quillXY.x} y={quillXY.y} size={variant === "intro" ? 78 : 70} />
        </>
      )}
      <div style={textStyle}>
        {chars.map((char, i) => {
          const isLast = i === chars.length - 1;
          if (char === "\n") return <br key={i} />;
          return (
            <span key={i} ref={isLast ? lastCharRef : null}>
              {char}
            </span>
          );
        })}
        {!done && <span style={{ animation: "romBlink 1s infinite" }}>|</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANTIQUE PAPER / LETTER
───────────────────────────────────────────── */
function AntiquePaperShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 780,
        margin: "0 auto",
        padding: "clamp(16px, 3vw, 28px)",
        borderRadius: 30,
        background:
          "linear-gradient(180deg, rgba(60, 10, 26, 0.54) 0%, rgba(37, 7, 18, 0.72) 100%)",
        border: "1px solid rgba(255, 220, 228, 0.08)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {children}
    </div>
  );
}

function SealedLetter({ onOpen }: { onOpen: () => void }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
      <div
        style={{
          position: "relative",
          borderRadius: 30,
          padding: "clamp(20px, 4vw, 38px)",
          background:
            "radial-gradient(circle at 18% 16%, rgba(255,255,255,0.08) 0%, transparent 24%), linear-gradient(145deg, #ead4a6 0%, #ddb974 15%, #f6ebc6 34%, #ead09a 56%, #d7b06d 100%)",
          border: "1px solid rgba(125, 88, 40, 0.28)",
          boxShadow: "0 34px 60px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(255,255,255,0.24)",
          overflow: "hidden",
          minHeight: 380,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(128,88,40,0.07) 0 1px, transparent 1px 82px), linear-gradient(180deg, rgba(128,88,40,0.05) 0 1px, transparent 1px 32px)", opacity: 0.34 }} />
        <div style={{ position: "absolute", inset: 14, borderRadius: 22, border: "1px solid rgba(126,85,36,0.12)" }} />
        <div style={{ position: "absolute", top: -16, left: 24, right: 24, height: 36, borderRadius: "50%", background: "linear-gradient(180deg, #d4a46e 0%, #945822 45%, #6e4118 100%)", boxShadow: "0 8px 14px rgba(0,0,0,0.18)" }} />
        <div style={{ position: "absolute", bottom: -16, left: 24, right: 24, height: 36, borderRadius: "50%", background: "linear-gradient(180deg, #d4a46e 0%, #945822 45%, #6e4118 100%)", boxShadow: "0 -8px 14px rgba(0,0,0,0.18)" }} />

        <div style={{ position: "relative", zIndex: 2, minHeight: 310, display: "grid", placeItems: "center", textAlign: "center" }}>
          <div>
            <p
              style={{
                margin: "0 0 20px",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.25rem, 3vw, 1.8rem)",
                lineHeight: 1.84,
                color: "#6d4423",
              }}
            >
              Hay cartas que no se leen.
              <br />
              Se sienten.
            </p>

            <button
              onClick={onOpen}
              style={{
                position: "relative",
                width: 118,
                height: 118,
                borderRadius: "50%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 36% 28%, #ea7f84 0%, #c33d46 38%, #8f1e28 68%, #6b1017 100%)",
                  boxShadow: "0 12px 24px rgba(120,20,20,0.36), inset 0 2px 0 rgba(255,200,200,0.28), inset 0 -2px 0 rgba(0,0,0,0.22)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  inset: "18%",
                  borderRadius: "50%",
                  border: "1px solid rgba(255, 210, 210, 0.28)",
                  display: "grid",
                  placeItems: "center",
                  color: "rgba(255,238,238,0.92)",
                  fontFamily: "'Cinzel', serif",
                  fontSize: 11,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                }}
              >
                <div>
                  <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 4 }}>♥</div>
                  <div>Abrir</div>
                </div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LetterPaper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 920,
        margin: "0 auto",
        position: "relative",
        background:
          "radial-gradient(ellipse at 14% 16%, rgba(215,185,135,0.34) 0%, transparent 28%), radial-gradient(ellipse at 88% 86%, rgba(180,140,80,0.22) 0%, transparent 26%), linear-gradient(168deg, #fdf4dd 0%, #f4e3b4 14%, #faf0cc 30%, #f1ddb0 48%, #f6e9c0 68%, #ebd38a 100%)",
        borderRadius: 24,
        border: "1px solid rgba(150,105,55,0.24)",
        boxShadow: "0 26px 62px rgba(0,0,0,0.36), 0 4px 16px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.78), inset 0 0 90px rgba(120,80,35,0.07)",
        padding: "clamp(28px, 5vw, 58px) clamp(22px, 4vw, 44px) clamp(28px, 5vw, 42px) clamp(24px, 5vw, 78px)",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 13 }, (_, i) => (
        <div
          key={`h-${i}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${10 + i * 7.1}%`,
            height: 1,
            background: `rgba(155,105,45,${0.045 + (i % 3) * 0.016})`,
          }}
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`v-${i}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${14 + i * 11}%`,
            width: 1,
            background: `rgba(155,105,45,${0.025 + (i % 2) * 0.018})`,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 48, top: 0, bottom: 0, width: 1, background: "rgba(192,78,86,0.18)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, boxShadow: "inset 22px 0 24px rgba(110,72,36,0.05), inset -12px -20px 28px rgba(120,80,35,0.06)" }} />
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, height: 14, borderRadius: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.34), transparent)" }} />
      <div style={{ position: "absolute", width: 50, height: 42, top: "8%", right: "8%", borderRadius: "60% 40%", background: "radial-gradient(circle, rgba(150,105,45,0.10) 0%, transparent 70%)", transform: "rotate(22deg)" }} />
      <div style={{ position: "absolute", width: 36, height: 24, bottom: "13%", left: "12%", borderRadius: "50%", background: "radial-gradient(circle, rgba(160,110,50,0.08) 0%, transparent 70%)" }} />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

function PhotoMat({ src, alt }: { src?: string; alt: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: 280,
        aspectRatio: "4 / 3",
        borderRadius: 22,
        padding: 14,
        background: "linear-gradient(180deg, #fbf7f0 0%, #efe4d2 100%)",
        border: "1px solid rgba(145, 104, 72, 0.18)",
        boxShadow: "0 18px 38px rgba(80,50,35,0.14), inset 0 1px 0 rgba(255,255,255,0.7)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: src
            ? `linear-gradient(180deg, rgba(250,244,236,0.42), rgba(235,225,208,0.54)), url(${src}) center/cover no-repeat`
            : "linear-gradient(180deg, #f0e6d8, #e2d5c0)",
          filter: src ? "blur(16px) saturate(0.9)" : "none",
          transform: "scale(1.08)",
          opacity: src ? 0.42 : 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          borderRadius: 16,
          background: "rgba(213, 195, 168, 0.3)",
          border: "1px solid rgba(145, 104, 72, 0.12)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              display: "block",
              background: "rgba(245, 238, 226, 0.94)",
            }}
          />
        ) : (
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "rgba(140,95,68,0.5)",
            }}
          >
            Sin foto
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   KEY SLIDER
───────────────────────────────────────────── */
function KeySlider({ label, onUnlock }: { label: string; onUnlock: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const startX = useRef(0);
  const startP = useRef(0);
  const TRACK = 320;
  const THUMB = 74;
  const MAX = TRACK - THUMB - 8;

  function onDown(e: React.PointerEvent<HTMLDivElement>) {
    if (unlocked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    startX.current = e.clientX;
    startP.current = progress;
  }

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || unlocked) return;
    const next = Math.max(0, Math.min(1, startP.current + (e.clientX - startX.current) / MAX));
    setProgress(next);
    if (next >= 0.93) {
      setUnlocked(true);
      setDragging(false);
      window.setTimeout(onUnlock, 320);
    }
  }

  function onUp() {
    if (!unlocked) setProgress(0);
    setDragging(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "1.14rem",
          color: "rgba(255,235,240,0.86)",
          margin: 0,
          textAlign: "center",
        }}
      >
        Desliza la llave — {label}
      </p>

      <div
        style={{
          width: "min(100%, 320px)",
          height: 64,
          borderRadius: 999,
          position: "relative",
          border: "1px solid rgba(255,225,232,0.14)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
          boxShadow: "inset 0 2px 14px rgba(0,0,0,0.22), 0 12px 26px rgba(0,0,0,0.16)",
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 4,
            bottom: 4,
            width: `calc(${progress * 100}% - 8px + ${THUMB / 2}px)`,
            borderRadius: 999,
            background: "linear-gradient(90deg, rgba(232,185,84,0.42), rgba(232,185,84,0.06))",
            transition: dragging ? "none" : "width .25s ease",
          }}
        />

        <span
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "'Cinzel', serif",
            fontSize: 9,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "rgba(255,225,232,0.44)",
          }}
        >
          {unlocked ? "Abierto" : "Desliza ▶"}
        </span>

        <div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          style={{
            position: "absolute",
            left: 4 + progress * MAX,
            top: 4,
            bottom: 4,
            width: THUMB,
            borderRadius: 999,
            background: "linear-gradient(135deg, #f7dc87 0%, #d8a53c 45%, #9c6720 100%)",
            boxShadow: unlocked ? "0 0 24px rgba(236,200,128,0.56)" : "0 8px 18px rgba(100,70,18,0.3)",
            cursor: unlocked ? "default" : "grab",
            display: "grid",
            placeItems: "center",
            touchAction: "none",
            transition: dragging ? "none" : "left .25s ease",
          }}
        >
          <svg viewBox="0 0 36 36" width="33" height="33">
            <circle cx="12" cy="14" r="8" fill="none" stroke="rgba(70,44,10,0.85)" strokeWidth="3" />
            <circle cx="12" cy="14" r="4" fill="rgba(70,44,10,0.55)" />
            <rect x="18" y="13" width="15" height="3.5" rx="1.5" fill="rgba(70,44,10,0.85)" />
            <rect x="29" y="16.5" width="3.5" height="5" rx="1" fill="rgba(70,44,10,0.85)" />
            <rect x="23.5" y="16.5" width="3.5" height="4" rx="1" fill="rgba(70,44,10,0.85)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function RomanticLetter({ data }: { data?: RomanticLetterData }) {
  const [scene, setScene] = useState<Scene>("intro");
  const [bookUnlocked, setBookUnlocked] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [musicBootKey, setMusicBootKey] = useState(0);
  const [storedData, setStoredData] = useState<RomanticLetterData | null>(null);
  const [turnDirection, setTurnDirection] = useState<TurnDirection>(null);
  const [isTurning, setIsTurning] = useState(false);

  useEffect(() => {
    setStoredData(readStoredPreview());
  }, []);

  const source = storedData ?? data ?? {};
  const isPremium = source.isPremium ?? source.plan === "premium";
  const musicUrl = safeText(source.musicUrl, "");

  const recipient = safeText(source.recipientName, "Mi amor");
  const sender = safeText(source.senderName, "Alguien especial");
  const nickname = safeText(source.nickname, recipient);

  const defaultLetterMessage = `${nickname},\n\nNo quería que esto se sintiera como cualquier mensaje. Quería que tuviera pausa, intención y ternura.\n\nGracias por existir en mi vida, por los recuerdos, por tu forma de quedarte en mí incluso en las cosas pequeñas.\n\nHay personas que simplemente pasan... y hay personas como tú, que dejan hogar.`;

  const letterMessage = safeText(source.letterMessage || source.message || source.shortMessage, defaultLetterMessage);

  const finalBodyMessage = useMemo(() => {
    const candidate = normalizeText(source.finalMessage);
    if (!candidate) {
      return "Gracias por formar parte de mi vida y por volver más bonito todo lo que siento cuando estoy contigo.";
    }
    if (/^con amor\b/i.test(candidate) || looksLikeLink(candidate)) {
      return "Gracias por formar parte de mi vida y por volver más bonito todo lo que siento cuando estoy contigo.";
    }
    return candidate;
  }, [source.finalMessage]);

  const introLine = `Para ti, ${recipient}… con todo mi corazón.`;

  const photos = useMemo(
    () => (source.photoUrls || []).filter((url): url is string => Boolean(normalizeText(url))),
    [source.photoUrls]
  );

  const coverPhoto = normalizeText(source.coverPhotoUrl) || photos[0] || "";

  const cleanedCaptions = useMemo(
    () => (source.photoCaptions || []).map((caption) => sanitizeCaption(caption, musicUrl)),
    [source.photoCaptions, musicUrl]
  );

  const currentCaption = useMemo(() => {
    const candidate = cleanedCaptions[galleryIndex];
    if (isPremium && candidate) return candidate;
    return FREE_FALLBACK_CAPTIONS[galleryIndex % FREE_FALLBACK_CAPTIONS.length];
  }, [cleanedCaptions, galleryIndex, isPremium]);

  const photoSrc = photos[galleryIndex] || coverPhoto || "";

  const daysTogether = useMemo(() => {
    const raw = normalizeText(source.relationshipStartDate);
    if (!raw) return null;
    const start = new Date(raw);
    if (Number.isNaN(start.getTime())) return null;
    return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
  }, [source.relationshipStartDate]);

  const musicEmbedUrl = useMemo(() => buildYouTubeEmbed(musicUrl), [musicUrl]);

  const introTyping = useTypewriter(scene === "intro" ? introLine : "", 88);
  const letterTyping = useTypewriter(scene === "writing-letter" ? letterMessage : "", 46);

  useEffect(() => {
    if (scene !== "opening") return;
    const t = window.setTimeout(() => setScene("writing-letter"), 1250);
    return () => window.clearTimeout(t);
  }, [scene]);

  function activateMusic() {
    if (!musicEmbedUrl) return;
    setMusicEnabled(true);
    setMusicBootKey((prev) => prev + 1);
  }

  function goTo(next: Scene) {
    activateMusic();
    setScene(next);
  }

  function turnPage(direction: Exclude<TurnDirection, null>) {
    if (!photos.length || isTurning) return;
    setIsTurning(true);
    setTurnDirection(direction);

    window.setTimeout(() => {
      setGalleryIndex((prev) => {
        if (direction === "next") return (prev + 1) % photos.length;
        return (prev - 1 + photos.length) % photos.length;
      });
    }, 220);

    window.setTimeout(() => {
      setIsTurning(false);
      setTurnDirection(null);
    }, 760);
  }

  function restart() {
    setScene("intro");
    setBookUnlocked(false);
    setGalleryIndex(0);
    setTurnDirection(null);
    setIsTurning(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 18% 10%, rgba(154, 20, 64, 0.40) 0%, transparent 34%), radial-gradient(ellipse at 88% 84%, rgba(110, 10, 42, 0.30) 0%, transparent 30%), linear-gradient(180deg, #120109 0%, #1e0410 36%, #2c0717 66%, #120109 100%)",
        color: "#f5e8ee",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Great+Vibes&display=swap');
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }

        @keyframes romFadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes romTwinkle { 0%, 100% { opacity: 0.16; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.25); } }
        @keyframes romBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes romPulse { 0%, 100% { box-shadow: 0 0 0 rgba(220,130,155,0.10); } 50% { box-shadow: 0 0 28px rgba(220,130,155,0.22); } }
        @keyframes romHeartbeat { 0%,100% { transform: scale(1); } 25% { transform: scale(1.10); } 50% { transform: scale(1); } 75% { transform: scale(1.05); } }
        @keyframes romHeartRain {
          0% { transform: translate3d(0, -12vh, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(28px, 115vh, 0) rotate(22deg); opacity: 0; }
        }
        @keyframes romInkSpark {
          0% { opacity: 0; transform: translate(0, 0) scale(0.4); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translate(0, -18px) scale(1.3); }
        }
        @keyframes romPageFlipNext {
          0% { transform: rotateY(0deg); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: rotateY(-178deg); opacity: 0; }
        }
        @keyframes romPageFlipPrev {
          0% { transform: rotateY(0deg); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: rotateY(178deg); opacity: 0; }
        }

        .rom-scene { animation: romFadeUp 0.75s ease both; }
        .rom-shell {
          position: relative;
          z-index: 2;
          max-width: 1120px;
          margin: 0 auto;
          padding: clamp(24px, 4vw, 40px) 16px clamp(54px, 7vw, 76px);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .rom-card {
          border-radius: 36px;
          padding: clamp(18px, 3vw, 32px);
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,210,225,0.08);
          box-shadow: 0 20px 64px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
        }
        .rom-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,210,225,0.12);
          color: rgba(255,235,242,0.88);
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .rom-btn {
          border: 1px solid rgba(255,210,225,0.2);
          background: rgba(255,255,255,0.07);
          color: #fff0f5;
          padding: 13px 24px;
          border-radius: 999px;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: .14em;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
          transition: all 0.25s;
        }
        .rom-btn:hover { background: rgba(255,255,255,0.13); box-shadow: 0 0 18px rgba(220,130,155,0.2); }
        .music-orb {
          position: fixed;
          right: 18px;
          top: 18px;
          z-index: 50;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 1px solid rgba(255,210,225,0.22);
          background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.04) 45%, rgba(180,40,75,0.4) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffdde8;
          font-size: 18px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.32);
          backdrop-filter: blur(10px);
          transition: all 0.25s;
        }
        .music-orb.active { animation: romPulse 2.8s ease-in-out infinite; }

        .time-stage {
          max-width: 920px;
          margin: 0 auto;
          padding: clamp(18px, 3vw, 26px);
          border-radius: 30px;
          background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,220,232,0.1);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 26px 52px rgba(0,0,0,0.16);
        }
        .time-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(260px, 0.92fr);
          gap: 18px;
          align-items: stretch;
        }
        .time-copy,
        .time-count-card {
          border-radius: 26px;
          position: relative;
          overflow: hidden;
        }
        .time-copy {
          padding: clamp(24px, 4vw, 40px);
          background: radial-gradient(circle at 20% 16%, rgba(255,255,255,0.08), transparent 30%), linear-gradient(145deg, rgba(84,16,36,0.92), rgba(58,8,24,0.92));
          border: 1px solid rgba(255,210,225,0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .time-count-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(180deg, rgba(255,248,236,0.12), rgba(255,255,255,0.05));
          border: 1px solid rgba(255,220,232,0.14);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .time-days-box {
          border-radius: 22px;
          padding: 24px 20px;
          text-align: center;
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
          border: 1px solid rgba(255,220,232,0.14);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .book-closed {
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          position: relative;
          border-radius: 34px;
          overflow: hidden;
          background: linear-gradient(145deg, #6a1028 0%, #7f152f 35%, #4e0d23 100%);
          border: 1px solid rgba(255,220,232,0.12);
          box-shadow: 0 36px 70px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .book-closed::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 35%, rgba(255,255,255,0.06), transparent 28%), linear-gradient(90deg, rgba(255,255,255,0.04), transparent 16%, transparent 84%, rgba(0,0,0,0.15));
          pointer-events: none;
        }
        .book-closed-spine {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: clamp(18px, 3vw, 28px);
          background: linear-gradient(180deg, rgba(40,5,16,0.46), rgba(0,0,0,0.22), rgba(40,5,16,0.46));
          box-shadow: inset -1px 0 0 rgba(255,255,255,0.06), inset -9px 0 18px rgba(0,0,0,0.18);
        }
        .book-cover-inner {
          position: relative;
          min-height: 430px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(34px, 5vw, 54px) 26px;
          color: #ffeaee;
          text-align: center;
        }
        .book-cover-title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          line-height: 1.1;
          margin: 0 0 14px;
          text-shadow: 0 4px 18px rgba(0,0,0,0.18);
        }
        .book-cover-gold {
          color: #f2d7ad;
          text-shadow: 0 0 12px rgba(255,216,140,0.18);
        }
        .book-emblem {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          margin-bottom: 18px;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 30% 28%, #f7e09a 0%, #d5a438 48%, #8f5a15 100%);
          box-shadow: 0 12px 28px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,244,200,0.55);
          border: 1px solid rgba(255,234,185,0.28);
        }
        .book-emblem-inner {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 1px solid rgba(98,58,14,0.32);
          color: rgba(86,48,14,0.94);
          font-size: 30px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.45);
        }

        .memory-book {
          width: 100%;
          max-width: 1020px;
          margin: 0 auto;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid rgba(160,110,80,0.16);
          box-shadow: 0 24px 56px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08);
          background: linear-gradient(180deg, #cab08c 0%, #bfa47f 100%);
          padding: clamp(12px, 2vw, 16px);
        }
        .memory-book-inner {
          position: relative;
          border-radius: 26px;
          overflow: hidden;
          background: linear-gradient(180deg, #fdf7eb 0%, #f0dfc2 100%);
          box-shadow: inset 0 0 0 1px rgba(141,105,75,0.14), inset 0 18px 22px rgba(255,255,255,0.18);
        }
        .memory-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          perspective: 1600px;
        }
        .memory-page {
          position: relative;
          min-width: 0;
          min-height: 560px;
          padding: clamp(18px, 3vw, 32px);
          overflow: hidden;
        }
        .memory-left {
          border-right: 1px solid rgba(140,95,68,0.14);
          box-shadow: inset -18px 0 22px rgba(110,72,36,0.04);
        }
        .memory-lines::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(140,95,55,0.1) 0 1px, transparent 1px 50px);
          opacity: 0.5;
          pointer-events: none;
        }
        .memory-center-shadow {
          position: absolute;
          top: 0;
          bottom: 0;
          left: calc(50% - 18px);
          width: 36px;
          background: radial-gradient(ellipse at center, rgba(104,72,44,0.12) 0%, rgba(104,72,44,0.05) 34%, transparent 72%);
          pointer-events: none;
          z-index: 2;
        }
        .memory-content {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 18px;
          min-width: 0;
        }
        .memory-quote {
          border-radius: 22px;
          padding: clamp(20px, 3vw, 28px);
          background: linear-gradient(180deg, rgba(252,244,229,0.76), rgba(244,231,209,0.88));
          border: 1px solid rgba(130,90,65,0.1);
          min-height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 18px 28px rgba(84,56,32,0.08);
        }
        .memory-quote p,
        .paper-text,
        .final-text {
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .book-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: auto;
          align-items: center;
        }
        .book-nav {
          border: 1px solid rgba(140,95,70,0.25);
          background: rgba(255,255,255,0.7);
          color: #6e4238;
          padding: 11px 15px;
          border-radius: 14px;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: .12em;
          text-transform: uppercase;
          transition: background 0.2s, transform 0.2s;
          box-shadow: 0 6px 14px rgba(84,56,32,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
        }
        .book-nav:hover { background: rgba(255,255,255,0.88); transform: translateY(-1px); }
        .book-close {
          margin-left: auto;
          background: linear-gradient(180deg, #7d1d35, #641528);
          color: #fff0f5;
          border-color: rgba(255,205,220,0.2);
          box-shadow: 0 8px 18px rgba(72,14,30,0.24), inset 0 1px 0 rgba(255,220,232,0.16);
        }
        .book-close:hover { background: linear-gradient(180deg, #8c203b, #70172d); }
        .page-turn-sheet {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 52%;
          right: 0;
          z-index: 5;
          pointer-events: none;
          background: linear-gradient(180deg, #fdf7eb 0%, #f2e1c5 100%);
          box-shadow: 0 12px 26px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(141,105,75,0.12), inset -18px 0 20px rgba(110,72,36,0.08);
          border-left: 1px solid rgba(140,95,68,0.10);
          opacity: 0;
        }
        .page-turn-sheet.next {
          transform-origin: left center;
          animation: romPageFlipNext 0.74s cubic-bezier(.2,.58,.2,1) forwards;
        }
        .page-turn-sheet.prev {
          right: auto;
          left: 0;
          transform-origin: right center;
          animation: romPageFlipPrev 0.74s cubic-bezier(.2,.58,.2,1) forwards;
        }

        @media (max-width: 920px) {
          .time-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 880px) {
          .memory-grid { grid-template-columns: 1fr; }
          .memory-left { border-right: none; border-bottom: 1px solid rgba(140,95,68,0.14); }
          .memory-center-shadow { display: none; }
          .memory-page { min-height: auto; }
          .page-turn-sheet { width: 100%; }
          .page-turn-sheet.next { right: 0; }
          .page-turn-sheet.prev { left: 0; }
        }
        @media (max-width: 560px) {
          .rom-card { border-radius: 24px; }
          .book-actions > * { flex: 1 1 calc(50% - 10px); }
          .book-close { flex-basis: 100%; margin-left: 0; }
          .music-orb { width: 46px; height: 46px; right: 12px; top: 12px; }
          .book-cover-inner { min-height: 360px; }
        }
      `}</style>

      {musicEmbedUrl && musicEnabled && (
        <iframe
          key={`${musicBootKey}-${musicEmbedUrl}`}
          src={musicEmbedUrl}
          title="Momentia Music"
          allow="autoplay; encrypted-media"
          style={{ position: "fixed", width: 0, height: 0, opacity: 0, border: "none", pointerEvents: "none" }}
        />
      )}

      {musicEmbedUrl && (
        <button
          className={`music-orb ${musicEnabled ? "active" : ""}`}
          onClick={() => {
            if (!musicEnabled) {
              activateMusic();
            } else {
              setMusicEnabled(false);
            }
          }}
          title={musicEnabled ? "Silenciar" : "Activar música"}
        >
          {musicEnabled ? "♪" : "♩"}
        </button>
      )}

      <RomanticBackground />

      <div className="rom-shell">
        {scene === "intro" && (
          <section className="rom-scene rom-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}>
              <span className="rom-pill">✒ Romantic Letter</span>
            </div>

            <div style={{ position: "relative", minHeight: 200, marginBottom: 18 }}>
              <WritingStage text={introTyping.text} done={introTyping.done} variant="intro" />
            </div>

            <p
              style={{
                maxWidth: 640,
                margin: "0 auto 6px",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "1.08rem",
                color: "rgba(255,222,232,0.72)",
                lineHeight: 1.85,
              }}
            >
              Hay palabras que solo merecen escribirse despacio.
            </p>

            {introTyping.done && (
              <div style={{ marginTop: 28 }}>
                <div style={{ marginBottom: 20, fontSize: 36, animation: "romHeartbeat 2s ease-in-out infinite", color: "#ffb5c8" }}>♥</div>
                <button className="rom-btn" onClick={() => goTo("sealed")}>
                  Abrir carta →
                </button>
              </div>
            )}
          </section>
        )}

        {scene === "sealed" && (
          <section className="rom-scene rom-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}>
              <span className="rom-pill">♥ Carta sellada</span>
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(1.45rem, 3.5vw, 2.2rem)",
                color: "rgba(255,235,242,0.9)",
                marginBottom: 28,
                lineHeight: 1.45,
              }}
            >
              Un mensaje especial te espera…
            </h2>
            <AntiquePaperShell>
              <SealedLetter onOpen={() => goTo("opening")} />
            </AntiquePaperShell>
          </section>
        )}

        {scene === "opening" && (
          <section className="rom-scene rom-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}>
              <span className="rom-pill">♥ Desplegando…</span>
            </div>
            <AntiquePaperShell>
              <LetterPaper>
                <p
                  className="paper-text"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.2rem, 2.8vw, 1.7rem)",
                    lineHeight: 1.85,
                    color: "#6b4023",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Hay palabras que no nacieron para decirse deprisa…
                </p>
              </LetterPaper>
            </AntiquePaperShell>
          </section>
        )}

        {scene === "writing-letter" && (
          <section className="rom-scene rom-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}>
              <span className="rom-pill">✒ Tu dedicatoria</span>
            </div>

            <LetterPaper>
              <p
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: "clamp(1.7rem, 3vw, 2.24rem)",
                  color: "#7a4a38",
                  marginBottom: 14,
                  lineHeight: 1.2,
                }}
              >
                {nickname},
              </p>
              <WritingStage text={letterTyping.text} done={letterTyping.done} variant="letter" />
            </LetterPaper>

            {letterTyping.done && (
              <div style={{ marginTop: 26 }}>
                <button className="rom-btn" onClick={() => goTo("relationship-time")}>
                  Seguir leyendo ♥
                </button>
              </div>
            )}
          </section>
        )}

        {scene === "relationship-time" && (
          <section className="rom-scene rom-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}>
              <span className="rom-pill">✦ Nuestro tiempo</span>
            </div>

            <div style={{ fontSize: 40, marginBottom: 16, animation: "romHeartbeat 2s ease-in-out infinite", color: "#ffb5c8" }}>♥</div>

            <div className="time-stage">
              <div className="time-grid">
                <div className="time-copy">
                  <div style={{ maxWidth: 560, margin: "0 auto" }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,220,232,0.58)", marginBottom: 14 }}>
                      Lo que construimos
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontStyle: "italic",
                        fontSize: "clamp(2.1rem, 5vw, 3.8rem)",
                        fontWeight: 600,
                        margin: "0 0 14px",
                        lineHeight: 1.12,
                        color: "rgba(255,240,245,0.96)",
                      }}
                    >
                      Gracias por formar parte
                      <br />
                      de mi vida
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "'Cormorant Garamond', serif",
                        fontStyle: "italic",
                        fontSize: "clamp(1.08rem, 2.2vw, 1.3rem)",
                        color: "rgba(255,225,235,0.74)",
                        lineHeight: 1.9,
                      }}
                    >
                      Cada día contigo me deja una sensación rara y bonita: como si el tiempo, por un momento,
                      hubiera decidido tratarme bien.
                    </p>
                  </div>
                </div>

                <div className="time-count-card">
                  {daysTogether !== null ? (
                    <>
                      <div className="time-days-box">
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(2.4rem, 5vw, 4.3rem)", color: "#ffe9f1", lineHeight: 1 }}>
                          {daysTogether.toLocaleString()}
                        </div>
                        <div style={{ marginTop: 10, fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,220,232,0.58)" }}>
                          días contigo
                        </div>
                      </div>

                      <p style={{ margin: "16px 8px 0", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.02rem", lineHeight: 1.8, color: "rgba(255,230,238,0.76)" }}>
                        Y aunque el número crezca, lo que más me importa es cómo se siente haberte vivido.
                      </p>
                    </>
                  ) : (
                    <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.2rem", color: "rgba(255,225,235,0.76)", lineHeight: 1.85 }}>
                      Y gracias por hacer más bonito todo lo que vivo.
                    </p>
                  )}

                  <div style={{ marginTop: 18 }}>
                    <button className="rom-btn" onClick={() => goTo("memory-book")}>
                      Abrir libro de recuerdos →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {scene === "memory-book" && (
          <section className="rom-scene rom-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}>
              <span className="rom-pill">♥ Nuestros recuerdos</span>
            </div>

            {!bookUnlocked ? (
              <div className="book-closed">
                <div className="book-closed-spine" />
                <div className="book-cover-inner">
                  <div className="book-emblem">
                    <div className="book-emblem-inner">♥</div>
                  </div>
                  <h2 className="book-cover-title book-cover-gold">Nuestros recuerdos</h2>
                  <p
                    style={{
                      maxWidth: 560,
                      lineHeight: 1.9,
                      color: "rgba(255,233,238,0.84)",
                      margin: "0 0 28px",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                    }}
                  >
                    Hay fotos que no solo guardan un momento, también guardan el temblor bonito de haberlo vivido.
                  </p>
                  <KeySlider label={`Te amo, ${nickname}`} onUnlock={() => setBookUnlocked(true)} />
                </div>
              </div>
            ) : (
              <div className="memory-book">
                <div className="memory-book-inner">
                  <div className="memory-center-shadow" />
                  {isTurning && turnDirection && <div className={`page-turn-sheet ${turnDirection}`} />}

                  <div className="memory-grid">
                    <div className="memory-page memory-left memory-lines" style={{ background: "linear-gradient(180deg,#fdf8ef 0%,#f2e4ca 100%)" }}>
                      <div className="memory-content">
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#8a6050" }}>
                          Foto favorita
                        </div>

                        <PhotoMat src={photoSrc} alt={`Recuerdo ${galleryIndex + 1}`} />
                      </div>
                    </div>

                    <div className="memory-page memory-lines" style={{ background: "linear-gradient(180deg,#fef9f0 0%,#f5ead8 100%)" }}>
                      <div className="memory-content">
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#8a6050" }}>
                          Página {Math.min(galleryIndex + 1, Math.max(photos.length, 1))}
                          {photos.length > 1 ? ` de ${photos.length}` : ""}
                        </div>

                        <div className="memory-quote">
                          <p
                            style={{
                              margin: 0,
                              lineHeight: 1.92,
                              fontFamily: "'Cormorant Garamond', serif",
                              fontStyle: "italic",
                              fontSize: "clamp(1.18rem, 2.25vw, 1.46rem)",
                              color: "#6e4840",
                              maxWidth: 430,
                            }}
                          >
                            {currentCaption}
                          </p>
                        </div>

                        <div className="book-actions">
                          {photos.length > 1 && (
                            <>
                              <button className="book-nav" onClick={() => turnPage("prev")} disabled={isTurning}>
                                ← Anterior
                              </button>
                              <button className="book-nav" onClick={() => turnPage("next")} disabled={isTurning}>
                                Siguiente →
                              </button>
                            </>
                          )}
                          <button className="book-nav book-close" onClick={() => goTo("final-message")}>
                            Ir al cierre ♥
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {scene === "final-message" && (
          <section className="rom-scene rom-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 20 }}>
              <span className="rom-pill">♥ Mensaje final</span>
            </div>
            <div style={{ fontSize: 38, marginBottom: 24, animation: "romHeartbeat 2s ease-in-out infinite", color: "#ffb5c8" }}>♥</div>

            <LetterPaper>
              <p
                className="final-text"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  lineHeight: 2,
                  color: "#5c3018",
                  whiteSpace: "pre-wrap",
                  marginBottom: 26,
                }}
              >
                {finalBodyMessage}
              </p>
              <p
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
                  color: "#7a4428",
                  textAlign: "right",
                  marginRight: 8,
                }}
              >
                Con amor, {sender} ♥
              </p>
            </LetterPaper>

            <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center", opacity: 0.3, margin: "28px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(220,160,180,0.5)" }} />
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: ".18em", color: "rgba(220,160,180,0.7)" }}>FIN</span>
              <div style={{ flex: 1, height: 1, background: "rgba(220,160,180,0.5)" }} />
            </div>

            <button className="rom-btn" onClick={restart}>
              Volver al inicio ♥
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
