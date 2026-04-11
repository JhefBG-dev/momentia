"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type RomanticLetterData = {
  recipientName: string;
  senderName: string;
  nickname?: string;
  shortMessage?: string;
  letterMessage?: string;
  finalMessage?: string;
  relationshipStartDate?: string;
  coverPhotoUrl?: string;
  photoUrls?: string[];
  musicUrl?: string;
  isPremium?: boolean;
  photoCaptions?: string[];
};

type RomanticLetterProps = {
  data: RomanticLetterData;
};

type Scene =
  | "intro"
  | "sealed"
  | "seal-message"
  | "flip"
  | "writing-letter"
  | "relationship-time"
  | "memory-book"
  | "final-message";

const DEFAULT_MUSIC_URL =
  "https://www.youtube.com/watch?v=cTn_NRZRIa8&list=RDcTn_NRZRIa8";

export default function RomanticLetter({ data }: RomanticLetterProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [bookUnlocked, setBookUnlocked] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const recipient = data.recipientName?.trim() || "Mi amor";
  const sender = data.senderName?.trim() || "Alguien especial";
  const nickname = data.nickname?.trim() || recipient;

  const introLine = `Gracias por ser la curita en mi corazón, ${recipient}`;
  const letterMessage =
    data.letterMessage?.trim() ||
    data.shortMessage?.trim() ||
    `Gracias por existir, por acompañarme y por volver más bonito todo lo que vivo contigo.`;
  const finalMessage =
    data.finalMessage?.trim() ||
    `Gracias por formar parte de mi vida y por darle luz a mis días.`;

  const photos = (data.photoUrls || []).filter(Boolean);
  const coverPhoto = data.coverPhotoUrl || photos[0] || "";

  const genericFreeCaption =
    "Cada recuerdo contigo se siente como un lugar al que siempre quiero volver.";
  const currentCaption =
    data.isPremium && data.photoCaptions?.[galleryIndex]
      ? data.photoCaptions[galleryIndex]
      : genericFreeCaption;

  const introTyping = useTypewriter(scene === "intro" ? introLine : "", 90);
  const letterTyping = useTypewriter(
    scene === "writing-letter" ? letterMessage : "",
    55
  );

  const daysTogether = useMemo(() => {
    if (!data.relationshipStartDate) return null;
    const start = new Date(data.relationshipStartDate);
    if (Number.isNaN(start.getTime())) return null;
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, [data.relationshipStartDate]);

  const youtubeId = useMemo(() => {
    return extractYouTubeId(data.musicUrl || DEFAULT_MUSIC_URL);
  }, [data.musicUrl]);

  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0`
    : "";

  useEffect(() => {
    if (scene !== "flip") return;
    const timer = window.setTimeout(() => {
      setScene("writing-letter");
    }, 1350);
    return () => window.clearTimeout(timer);
  }, [scene]);

  function handleSealClick() {
    setScene("seal-message");
    window.setTimeout(() => {
      setScene("flip");
    }, 1800);
  }

  function nextPhoto() {
    if (!photos.length) return;
    setGalleryIndex((prev) => (prev + 1) % photos.length);
  }

  function prevPhoto() {
    if (!photos.length) return;
    setGalleryIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }

  function restartExperience() {
    setScene("intro");
    setBookUnlocked(false);
    setGalleryIndex(0);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        color: "#f8efe7",
        background:
          "radial-gradient(circle at 18% 18%, rgba(170,51,93,0.30) 0%, rgba(170,51,93,0) 28%), radial-gradient(circle at 82% 12%, rgba(226,160,122,0.18) 0%, rgba(226,160,122,0) 24%), radial-gradient(circle at 75% 80%, rgba(121,37,74,0.28) 0%, rgba(121,37,74,0) 28%), linear-gradient(180deg, #13050d 0%, #250814 42%, #3d0b1d 72%, #18050d 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Great+Vibes&display=swap');

        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes softFloat {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 rgba(226,130,152,0.12); }
          50% { box-shadow: 0 0 32px rgba(226,130,152,0.24); }
        }

        @keyframes twinkle {
          0%,100% { opacity: 0.18; transform: scale(1); }
          50% { opacity: 0.62; transform: scale(1.18); }
        }

        @keyframes paperTurn {
          0% { transform: rotateY(0deg) scale(1); opacity: 1; }
          35% { transform: rotateY(90deg) scale(0.98); opacity: 0.88; }
          100% { transform: rotateY(180deg) scale(1); opacity: 1; }
        }

        @keyframes blinkCaret {
          0%,50% { opacity: 1; }
          51%,100% { opacity: 0; }
        }

        @keyframes lineGlow {
          0%,100% { opacity: .35; }
          50% { opacity: .8; }
        }

        .rom-shell {
          position: relative;
          z-index: 2;
          max-width: 940px;
          margin: 0 auto;
          min-height: 100vh;
          padding: 34px 16px 70px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .scene-card {
          animation: fadeUp .75s ease;
          border-radius: 30px;
          padding: 28px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,215,225,0.10);
          box-shadow:
            0 18px 60px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
        }

        .ornament-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,215,225,0.12);
          color: rgba(255,233,238,0.88);
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .music-orb {
          position: fixed;
          right: 18px;
          top: 18px;
          z-index: 50;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 1px solid rgba(255,215,225,0.20);
          background:
            radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.04) 45%, rgba(171,43,82,0.35) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffe1ea;
          font-size: 18px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.32);
          backdrop-filter: blur(10px);
        }

        .music-orb.active {
          animation: pulseGlow 2.6s ease-in-out infinite;
        }

        .ambient-star {
          position: absolute;
          color: rgba(255,213,223,0.45);
          animation: twinkle 2.6s ease-in-out infinite;
          pointer-events: none;
        }

        .floating-heart {
          position: absolute;
          color: rgba(255,180,200,0.18);
          animation: softFloat 4s ease-in-out infinite;
          pointer-events: none;
        }

        .paper-lines::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0 42px,
              rgba(145,95,74,0.08) 42px 43px
            );
          opacity: .65;
          pointer-events: none;
        }

        .cursor {
          display: inline-block;
          animation: blinkCaret 1s infinite;
        }

        .memory-book {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          border-radius: 26px;
          overflow: hidden;
          border: 1px solid rgba(255,225,205,0.10);
          box-shadow: 0 20px 50px rgba(0,0,0,0.36);
        }

        .memory-book.open {
          animation: fadeUp .65s ease;
        }

        .book-open-grid {
          display: grid;
          grid-template-columns: 1.05fr .95fr;
        }

        .book-page {
          min-height: 540px;
          padding: 24px;
          background:
            linear-gradient(180deg, #fff8ef 0%, #f4e8d5 100%);
          color: #68453c;
          position: relative;
        }

        .book-page.left {
          border-right: 1px solid rgba(120,84,68,0.12);
        }

        .photo-frame {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(122,84,70,0.12);
          box-shadow: 0 12px 24px rgba(80,50,42,0.10);
          background-size: cover;
          background-position: center;
          background-color: rgba(190,160,150,0.16);
        }

        .nav-btn {
          border: 1px solid rgba(122,84,70,0.18);
          background: rgba(255,255,255,0.58);
          color: #6f473f;
          padding: 11px 14px;
          border-radius: 14px;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .main-btn {
          border: 1px solid rgba(255,215,225,0.18);
          background: rgba(255,255,255,0.08);
          color: #fff0f4;
          padding: 13px 22px;
          border-radius: 999px;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: .14em;
          text-transform: uppercase;
          backdrop-filter: blur(6px);
        }

        .main-btn:hover {
          background: rgba(255,255,255,0.14);
        }

        @media (max-width: 860px) {
          .book-open-grid {
            grid-template-columns: 1fr;
          }
          .book-page.left {
            border-right: none;
            border-bottom: 1px solid rgba(120,84,68,0.12);
          }
        }

        @media (max-width: 560px) {
          .scene-card {
            padding: 18px;
            border-radius: 22px;
          }
        }
      `}</style>

      {embedUrl && musicEnabled && (
        <iframe
          src={embedUrl}
          title="Momentia Music"
          allow="autoplay"
          style={{
            position: "fixed",
            width: 0,
            height: 0,
            opacity: 0,
            pointerEvents: "none",
            border: "none",
          }}
        />
      )}

      <button
        className={`music-orb ${musicEnabled ? "active" : ""}`}
        onClick={() => setMusicEnabled((v) => !v)}
        title={musicEnabled ? "Silenciar ambiente" : "Activar ambiente"}
      >
        {musicEnabled ? "♪" : "♩"}
      </button>

      <BackgroundRomance />

      <div className="rom-shell">
        {scene === "intro" && (
          <section className="scene-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 18 }}>
              <span className="ornament-pill">Romantic Letter</span>
            </div>

            <div style={{ position: "relative", minHeight: 240 }}>
              <WritingStage
                text={introTyping.text}
                fullText={introLine}
                done={introTyping.done}
                variant="intro"
              />
            </div>

            <p
              style={{
                maxWidth: 680,
                margin: "12px auto 0",
                lineHeight: 1.9,
                color: "rgba(255,225,232,0.72)",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.1rem",
                fontStyle: "italic",
              }}
            >
              Hay palabras que solo merecen escribirse despacio.
            </p>

            {introTyping.done && (
              <div style={{ marginTop: 26 }}>
                <button
                  className="main-btn"
                  onClick={() => setScene("sealed")}
                >
                  Ver carta
                </button>
              </div>
            )}
          </section>
        )}

        {scene === "sealed" && (
          <section className="scene-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 18 }}>
              <span className="ornament-pill">Papiro sellado</span>
            </div>

            <AnimatedParchment
              mode="sealed"
              overlayText=""
              onSealClick={handleSealClick}
            />
          </section>
        )}

        {scene === "seal-message" && (
          <section className="scene-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 18 }}>
              <span className="ornament-pill">Papiro abierto</span>
            </div>

            <AnimatedParchment
              mode="message"
              overlayText={"Hay palabras que no nacieron\npara decirse deprisa"}
            />
          </section>
        )}

        {scene === "flip" && (
          <section className="scene-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 18 }}>
              <span className="ornament-pill">Volteando pergamino</span>
            </div>

            <div
              style={{
                animation: "paperTurn 1.2s ease forwards",
                transformStyle: "preserve-3d",
              }}
            >
              <AnimatedParchment mode="flip" overlayText="" />
            </div>
          </section>
        )}

        {scene === "writing-letter" && (
          <section className="scene-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 18 }}>
              <span className="ornament-pill">Tu dedicatoria</span>
            </div>

            <div
              style={{
                maxWidth: 860,
                margin: "0 auto",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "relative",
                  minHeight: 430,
                  padding: "38px 28px 34px 28px",
                  borderRadius: 24,
                  overflow: "hidden",
                  background:
                    "linear-gradient(170deg, #fff7ec 0%, #f6ead7 54%, #ead6b5 100%)",
                  border: "1px solid rgba(139,98,76,0.18)",
                  boxShadow:
                    "0 22px 60px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.58)",
                }}
                className="paper-lines"
              >
                <div
                  style={{
                    position: "absolute",
                    left: 58,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    background: "rgba(183,76,96,0.18)",
                  }}
                />

                <div style={{ paddingLeft: 24 }}>
                  <p
                    style={{
                      fontFamily: "'Great Vibes', cursive",
                      fontSize: "clamp(1.6rem, 3vw, 2rem)",
                      color: "#7b4a3c",
                      marginBottom: 18,
                    }}
                  >
                    {nickname},
                  </p>

                  <WritingStage
                    text={letterTyping.text}
                    fullText={letterMessage}
                    done={letterTyping.done}
                    variant="letter"
                  />
                </div>
              </div>
            </div>

            {letterTyping.done && (
              <div style={{ marginTop: 24 }}>
                <button
                  className="main-btn"
                  onClick={() => setScene("relationship-time")}
                >
                  Seguir leyendo
                </button>
              </div>
            )}
          </section>
        )}

        {scene === "relationship-time" && (
          <section className="scene-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 18 }}>
              <span className="ornament-pill">Nuestro tiempo</span>
            </div>

            <div
              style={{
                fontSize: 42,
                marginBottom: 10,
                color: "#ffb5c7",
              }}
            >
              ♥
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 6vw, 3.4rem)",
                fontStyle: "italic",
                fontWeight: 600,
                lineHeight: 1.25,
                marginBottom: 16,
              }}
            >
              Gracias por formar parte
              <br />
              de mi vida
            </h2>

            {daysTogether !== null ? (
              <div
                style={{
                  display: "inline-block",
                  padding: "22px 34px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,225,232,0.14)",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "clamp(2rem, 5vw, 3.6rem)",
                    color: "#ffe8ee",
                    lineHeight: 1,
                  }}
                >
                  {daysTogether.toLocaleString()}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "'Cinzel', serif",
                    fontSize: 11,
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "rgba(255,225,232,0.68)",
                  }}
                >
                  días contigo
                </div>
              </div>
            ) : (
              <p
                style={{
                  maxWidth: 620,
                  margin: "0 auto 24px",
                  lineHeight: 1.85,
                  color: "rgba(255,225,232,0.76)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "1.18rem",
                }}
              >
                Y gracias por hacer más bonito todo lo que vivo.
              </p>
            )}

            <button
              className="main-btn"
              onClick={() => setScene("memory-book")}
            >
              Abrir libro de recuerdos
            </button>
          </section>
        )}

        {scene === "memory-book" && (
          <section className="scene-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 18 }}>
              <span className="ornament-pill">Nuestros recuerdos</span>
            </div>

            {!bookUnlocked ? (
              <div className="memory-book">
                <div
                  style={{
                    minHeight: 420,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "38px 22px",
                    background:
                      "linear-gradient(145deg, #531124 0%, #6d1830 40%, #43101d 100%)",
                    color: "#ffe7ee",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 18,
                      top: 0,
                      bottom: 0,
                      width: 14,
                      background: "rgba(0,0,0,0.20)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 38,
                      marginBottom: 14,
                      color: "#ffbfd0",
                    }}
                  >
                    ♥
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(2rem, 6vw, 3rem)",
                      fontStyle: "italic",
                      marginBottom: 12,
                    }}
                  >
                    Nuestros recuerdos
                  </h2>
                  <p
                    style={{
                      maxWidth: 560,
                      lineHeight: 1.85,
                      color: "rgba(255,231,238,0.82)",
                      marginBottom: 24,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.1rem",
                    }}
                  >
                    Hay fotos que no solo guardan un momento, también guardan lo que sentimos.
                  </p>

                  <KeySlider
                    label={`Te amo ${nickname}`}
                    onUnlock={() => setBookUnlocked(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="memory-book open">
                <div className="book-open-grid">
                  <div className="book-page left">
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 11,
                        letterSpacing: ".14em",
                        textTransform: "uppercase",
                        color: "#906359",
                        marginBottom: 12,
                      }}
                    >
                      Foto favorita
                    </div>

                    <div
                      className="photo-frame"
                      style={{
                        backgroundImage: `url(${photos[galleryIndex] || coverPhoto})`,
                      }}
                    />

                    <p
                      style={{
                        marginTop: 16,
                        lineHeight: 1.9,
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.2rem",
                        fontStyle: "italic",
                        color: "#7a554b",
                      }}
                    >
                      {currentCaption}
                    </p>
                  </div>

                  <div className="book-page">
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 11,
                        letterSpacing: ".14em",
                        textTransform: "uppercase",
                        color: "#906359",
                        marginBottom: 12,
                      }}
                    >
                      Página {Math.min(galleryIndex + 1, Math.max(photos.length, 1))}
                    </div>

                    <div
                      style={{
                        minHeight: 220,
                        borderRadius: 20,
                        padding: 20,
                        background: "rgba(120,86,72,0.05)",
                        border: "1px solid rgba(120,86,72,0.10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 18,
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          lineHeight: 1.95,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontStyle: "italic",
                          fontSize: "1.24rem",
                          color: "#6e4a41",
                        }}
                      >
                        {data.isPremium
                          ? currentCaption
                          : "Hay fotos que no solo guardan recuerdos, también guardan latidos."}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button className="nav-btn" onClick={prevPhoto}>
                        ← Anterior
                      </button>
                      <button className="nav-btn" onClick={nextPhoto}>
                        Siguiente →
                      </button>
                      <button
                        className="nav-btn"
                        onClick={() => setScene("final-message")}
                      >
                        Cerrar libro ♥
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {scene === "final-message" && (
          <section className="scene-card" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: 18 }}>
              <span className="ornament-pill">Mensaje final</span>
            </div>

            <div
              style={{
                maxWidth: 860,
                margin: "0 auto 22px",
                position: "relative",
                padding: "42px 28px 34px 28px",
                borderRadius: 24,
                overflow: "hidden",
                background:
                  "linear-gradient(170deg, #fff7ec 0%, #f6ead7 54%, #ead6b5 100%)",
                border: "1px solid rgba(139,98,76,0.18)",
                boxShadow:
                  "0 22px 60px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.58)",
              }}
              className="paper-lines"
            >
              <div
                style={{
                  position: "absolute",
                  left: 58,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  background: "rgba(183,76,96,0.18)",
                }}
              />
              <div style={{ paddingLeft: 24 }}>
                <p
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    lineHeight: 2.0,
                    color: "#6b4034",
                    whiteSpace: "pre-wrap",
                    marginBottom: 24,
                  }}
                >
                  {finalMessage}
                </p>

                <p
                  style={{
                    textAlign: "right",
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    color: "#8b4e3f",
                    marginRight: 8,
                  }}
                >
                  Con amor, {sender}
                </p>
              </div>
            </div>

            <button className="main-btn" onClick={restartExperience}>
              Volver a empezar
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

function BackgroundRomance() {
  return (
    <>
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={`star-${i}`}
          className="ambient-star"
          style={{
            left: `${(i * 13) % 96}%`,
            top: `${(i * 29) % 94}%`,
            animationDelay: `${(i % 7) * 0.35}s`,
            fontSize: `${10 + (i % 4) * 3}px`,
          }}
        >
          ✦
        </span>
      ))}

      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={`heart-${i}`}
          className="floating-heart"
          style={{
            left: `${8 + i * 9}%`,
            top: `${12 + (i % 5) * 16}%`,
            animationDelay: `${i * 0.45}s`,
            fontSize: `${14 + (i % 3) * 5}px`,
          }}
        >
          ♥
        </span>
      ))}
    </>
  );
}

function AnimatedParchment({
  mode,
  overlayText,
  onSealClick,
}: {
  mode: "sealed" | "message" | "flip";
  overlayText: string;
  onSealClick?: () => void;
}) {
  const showSeal = mode === "sealed";
  const showText = mode === "message";
  const showFlipFace = mode === "flip";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 760,
        margin: "0 auto",
        perspective: 1200,
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: 380,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 680,
          }}
        >
          <div style={rollerStyle("top")} />
          <div
            style={{
              margin: "-8px 18px",
              minHeight: 250,
              background:
                "linear-gradient(180deg, #fdf3df 0%, #f2dec0 55%, #e6c89f 100%)",
              border: "1px solid rgba(140,98,69,0.22)",
              boxShadow:
                "inset 0 0 36px rgba(155,105,72,0.10), 0 12px 30px rgba(0,0,0,0.18)",
              position: "relative",
              overflow: "hidden",
              borderRadius: 18,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.35), transparent 28%), radial-gradient(circle at 78% 75%, rgba(125,77,52,0.08), transparent 30%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                clipPath:
                  "polygon(0 0, 98% 0, 100% 7%, 99% 14%, 100% 22%, 98% 30%, 100% 41%, 98% 52%, 100% 61%, 98% 72%, 100% 86%, 98% 100%, 0 100%, 2% 90%, 0 78%, 2% 68%, 0 58%, 2% 47%, 0 35%, 2% 24%, 0 12%, 2% 0)",
                borderRadius: 18,
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "28px 34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {showText ? (
                <p
                  style={{
                    whiteSpace: "pre-line",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.3rem, 3vw, 2rem)",
                    lineHeight: 1.8,
                    color: "#744837",
                  }}
                >
                  {overlayText}
                </p>
              ) : showFlipFace ? (
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.15rem, 2.6vw, 1.8rem)",
                    lineHeight: 1.8,
                    color: "#744837",
                    opacity: 0.72,
                  }}
                >
                  Preparando tu dedicatoria...
                </p>
              ) : null}
            </div>

            {showSeal && (
              <button
                onClick={onSealClick}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 116,
                  height: 116,
                  borderRadius: "50%",
                  border: "4px solid rgba(255,235,226,0.26)",
                  background:
                    "radial-gradient(circle at 32% 28%, #e88a7c 0%, #bb544f 52%, #8e2d35 100%)",
                  boxShadow:
                    "0 12px 26px rgba(118,35,40,0.38), inset 0 2px 0 rgba(255,221,211,0.22)",
                  cursor: "pointer",
                  color: "#fff6f2",
                  display: "grid",
                  placeItems: "center",
                  padding: 0,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, lineHeight: 1 }}>♥</div>
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: "'Cinzel', serif",
                      fontSize: 10,
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Abrir
                  </div>
                </div>
              </button>
            )}
          </div>
          <div style={rollerStyle("bottom")} />
        </div>
      </div>
    </div>
  );
}

function rollerStyle(position: "top" | "bottom"): React.CSSProperties {
  return {
    height: 42,
    borderRadius: 999,
    background:
      "linear-gradient(180deg, #cfaa81 0%, #a1734f 48%, #c89f75 100%)",
    border: "1px solid rgba(100,67,45,0.24)",
    boxShadow:
      position === "top"
        ? "0 6px 12px rgba(79,48,26,0.18), inset 0 2px 0 rgba(255,255,255,0.18)"
        : "0 -6px 12px rgba(79,48,26,0.18), inset 0 -2px 0 rgba(255,255,255,0.18)",
  };
}

function WritingStage({
  text,
  fullText,
  done,
  variant,
}: {
  text: string;
  fullText: string;
  done: boolean;
  variant: "intro" | "letter";
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const [quillPos, setQuillPos] = useState({ left: 22, top: 8 });

  useLayoutEffect(() => {
    if (!containerRef.current || !activeCharRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const charRect = activeCharRef.current.getBoundingClientRect();

    setQuillPos({
      left: charRect.left - parentRect.left + charRect.width * 0.7,
      top: charRect.top - parentRect.top - 42,
    });
  }, [text, variant]);

  const chars = text.split("");

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        maxWidth: variant === "intro" ? 820 : "100%",
        margin: variant === "intro" ? "0 auto" : undefined,
        textAlign: variant === "intro" ? "center" : "left",
        minHeight: variant === "intro" ? 160 : 220,
      }}
    >
      <AntiqueQuill
        style={{
          position: "absolute",
          left: quillPos.left,
          top: quillPos.top,
          zIndex: 8,
        }}
      />

      <div
        style={
          variant === "intro"
            ? {
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontStyle: "italic",
                fontSize: "clamp(2rem, 5vw, 3.15rem)",
                lineHeight: 1.55,
                color: "rgba(255,238,242,0.96)",
                textShadow: "0 2px 28px rgba(196,98,124,0.22)",
                whiteSpace: "pre-wrap",
              }
            : {
                fontFamily: "'Great Vibes', cursive",
                fontSize: "clamp(1.55rem, 3vw, 2.15rem)",
                lineHeight: 2.1,
                color: "#60372d",
                whiteSpace: "pre-wrap",
              }
        }
      >
        {chars.map((char, index) => {
          const isLast = index === chars.length - 1;
          if (char === "\n") {
            return <br key={`br-${index}`} />;
          }
          return (
            <span
              key={index}
              ref={isLast ? activeCharRef : null}
              style={{
                position: "relative",
              }}
            >
              {char}
            </span>
          );
        })}
        {!done && <span className="cursor">|</span>}
      </div>

      {variant === "intro" && fullText && (
        <div
          style={{
            position: "absolute",
            left: "8%",
            right: "8%",
            bottom: 6,
            height: 1,
            background:
              "linear-gradient(90deg, rgba(210,130,145,0.0), rgba(210,130,145,0.55), rgba(210,130,145,0.0))",
            animation: "lineGlow 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

function AntiqueQuill({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: 82,
        height: 82,
        pointerEvents: "none",
        transform: "rotate(-18deg)",
        filter: "drop-shadow(0 8px 16px rgba(85,45,35,0.18))",
        ...style,
      }}
    >
      <svg viewBox="0 0 120 160" width="100%" height="100%">
        <defs>
          <linearGradient id="featherFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7e8d4" />
            <stop offset="50%" stopColor="#d8b28f" />
            <stop offset="100%" stopColor="#9a6b4e" />
          </linearGradient>
          <linearGradient id="featherStem" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8a5a42" />
            <stop offset="100%" stopColor="#462619" />
          </linearGradient>
        </defs>

        <path
          d="M88 8 C49 20, 18 58, 17 102 C16 122, 31 134, 48 123 C83 101, 103 56, 88 8 Z"
          fill="url(#featherFill)"
          stroke="#aa7a61"
          strokeWidth="2"
        />
        <path
          d="M76 22 C63 34, 47 51, 36 79"
          stroke="#d6b190"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M71 31 C59 43, 46 62, 34 90"
          stroke="#d6b190"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M65 40 C52 53, 40 73, 30 103"
          stroke="#d6b190"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M46 121 L16 156"
          stroke="url(#featherStem)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M13 159 L18 146 L28 154 Z" fill="#25110a" />
        <ellipse cx="15" cy="157" rx="2.2" ry="3.2" fill="#1a0d08" opacity="0.65" />
      </svg>
    </div>
  );
}

function KeySlider({
  label,
  onUnlock,
}: {
  label: string;
  onUnlock: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const startXRef = useRef(0);
  const startProgressRef = useRef(0);

  const TRACK_WIDTH = 300;
  const THUMB_WIDTH = 72;
  const MAX = TRACK_WIDTH - THUMB_WIDTH - 8;

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (unlocked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    startXRef.current = e.clientX;
    startProgressRef.current = progress;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || unlocked) return;
    const dx = e.clientX - startXRef.current;
    const next = Math.max(0, Math.min(1, startProgressRef.current + dx / MAX));
    setProgress(next);
    if (next >= 0.93) {
      setUnlocked(true);
      setDragging(false);
      window.setTimeout(onUnlock, 360);
    }
  }

  function handlePointerUp() {
    if (!unlocked) setProgress(0);
    setDragging(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "1.16rem",
          color: "rgba(255,231,238,0.85)",
        }}
      >
        Desliza la llave — {label}
      </p>

      <div
        style={{
          width: TRACK_WIDTH,
          height: 62,
          borderRadius: 999,
          position: "relative",
          border: "1px solid rgba(255,225,232,0.14)",
          background: "rgba(255,255,255,0.08)",
          boxShadow: "inset 0 2px 12px rgba(0,0,0,0.18)",
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 4,
            bottom: 4,
            width: `calc(${progress * 100}% - 8px + ${THUMB_WIDTH / 2}px)`,
            borderRadius: 999,
            background:
              "linear-gradient(90deg, rgba(235,193,114,0.42), rgba(235,193,114,0.05))",
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
            fontSize: 10,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "rgba(255,225,232,0.45)",
          }}
        >
          {unlocked ? "Abierto" : "Desliza"}
        </span>

        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            position: "absolute",
            left: 4 + progress * MAX,
            top: 4,
            bottom: 4,
            width: THUMB_WIDTH,
            borderRadius: 999,
            background:
              "linear-gradient(135deg, #ecc980 0%, #c79739 45%, #9e6d19 100%)",
            boxShadow: unlocked
              ? "0 0 22px rgba(236,201,128,0.58)"
              : "0 8px 18px rgba(97,70,18,0.28)",
            cursor: unlocked ? "default" : "grab",
            display: "grid",
            placeItems: "center",
            touchAction: "none",
            transition: dragging ? "none" : "left .25s ease",
          }}
        >
          <svg viewBox="0 0 36 36" width="34" height="34">
            <circle
              cx="12"
              cy="14"
              r="8"
              fill="none"
              stroke="rgba(76,49,10,0.85)"
              strokeWidth="3"
            />
            <circle cx="12" cy="14" r="4" fill="rgba(76,49,10,0.55)" />
            <rect
              x="18"
              y="13"
              width="15"
              height="3.5"
              rx="1.5"
              fill="rgba(76,49,10,0.85)"
            />
            <rect
              x="29"
              y="16.5"
              width="3.5"
              height="5"
              rx="1"
              fill="rgba(76,49,10,0.85)"
            />
            <rect
              x="23.5"
              y="16.5"
              width="3.5"
              height="4"
              rx="1"
              fill="rgba(76,49,10,0.85)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function useTypewriter(text: string, speed = 55) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    if (!text) return;

    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(timer);
        setDone(true);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [text, speed]);

  return { text: displayed, done };
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}