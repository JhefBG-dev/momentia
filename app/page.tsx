import { Playfair_Display, Inter } from "next/font/google";
import styles from "./page.module.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const NAV_LINKS = [
  { label: "Cumpleaños", icon: "gift" },
  { label: "Aniversarios", icon: "heart" },
  { label: "Día de la Madre", icon: "flower" },
  { label: "Navidad", icon: "tree" },
] as const;

const FEATURES = [
  {
    icon: "user",
    title: "100% Personalizado",
    desc: "Cada detalle es tuyo",
  },
  {
    icon: "bolt",
    title: "Fácil y rápido",
    desc: "Crea en minutos",
  },
  {
    icon: "lock",
    title: "Acceso ilimitado",
    desc: "Guarda y comparte",
  },
  {
    icon: "heart",
    title: "Hecho con amor",
    desc: "Para quien importa",
  },
] as const;

const TRUST_ITEMS = [
  { icon: "shield", label: "Pago seguro" },
  { icon: "smile", label: "Miles de personas felices" },
  { icon: "star", label: "Experiencias inolvidables" },
] as const;

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "gift":
      return (
        <svg {...common}>
          <rect x="3.5" y="9" width="17" height="11" rx="1.5" />
          <path d="M3.5 12.5h17" />
          <path d="M12 9v11" />
          <path d="M12 9c-1.6 0-4-1-4-3.2S9.6 3 12 5c2.4-2 4-.4 4 1.8S13.6 9 12 9Z" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M12 20s-7.2-4.6-9.6-9C.7 7.6 2.4 4 6 4c2 0 3.4 1.1 4 2.2C10.6 5.1 12 4 14 4c3.6 0 5.3 3.6 3.6 7-2.4 4.4-9.6 9-9.6 9Z" />
        </svg>
      );
    case "flower":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.3" />
          <path d="M12 3.5c1.8 0 3 1.5 2.4 3.2A2.9 2.9 0 0 1 12 9.7a2.9 2.9 0 0 1-2.4-3c-.6-1.7.6-3.2 2.4-3.2Z" />
          <path d="M12 20.5c1.8 0 3-1.5 2.4-3.2A2.9 2.9 0 0 0 12 14.3a2.9 2.9 0 0 0-2.4 3c-.6 1.7.6 3.2 2.4 3.2Z" />
          <path d="M3.5 12c0-1.8 1.5-3 3.2-2.4A2.9 2.9 0 0 1 9.7 12a2.9 2.9 0 0 1-3 2.4c-1.7.6-3.2-.6-3.2-2.4Z" />
          <path d="M20.5 12c0-1.8-1.5-3-3.2-2.4A2.9 2.9 0 0 0 14.3 12a2.9 2.9 0 0 0 3 2.4c1.7.6 3.2-.6 3.2-2.4Z" />
        </svg>
      );
    case "tree":
      return (
        <svg {...common}>
          <path d="M12 3 7.5 9.5h2.2L6 15.5h3.2L5.5 21h13l-3.7-5.5H18l-3.7-6h2.2Z" />
          <path d="M12 21v-3.5" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5 20c1-3.6 3.9-5.5 7-5.5s6 1.9 7 5.5" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M12.5 3 5 13h5.5L11 21l7.5-10H13l-.5-8Z" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10.5" width="14" height="9.5" rx="1.8" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3.5 19 6v6c0 4.5-3 7.7-7 8.5-4-.8-7-4-7-8.5V6Z" />
          <path d="m9.2 12 1.9 1.9 3.7-3.9" />
        </svg>
      );
    case "smile":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.3" />
          <path d="M8.3 14c.9 1.4 2.2 2.1 3.7 2.1S14.8 15.4 15.7 14" />
          <path d="M8.7 9.7h.01" />
          <path d="M15.3 9.7h.01" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M12 3.5 14.3 9l6 .6-4.5 4 1.3 5.9L12 16.7 6.9 19.5l1.3-5.9-4.5-4 6-.6Z" />
        </svg>
      );
    case "envelope":
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="1.8" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Home() {
  return (
    <main className={`${playfair.variable} ${inter.variable} ${styles.page}`}>
      {/* glows */}
      <div className={`${styles.glow} ${styles.glowLeft}`} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glowRight}`} aria-hidden="true" />

      {/* decorative envelope, left */}
      <div className={`${styles.deco} ${styles.decoLeft}`} aria-hidden="true">
        <div className={styles.decoBlob} />
        <svg viewBox="0 0 220 220" className={styles.decoSvg}>
          <rect
            x="30"
            y="70"
            width="150"
            height="105"
            rx="10"
            fill="none"
            stroke="rgba(224,164,88,0.55)"
            strokeWidth="1.4"
          />
          <path
            d="M32 76 105 135 178 76"
            fill="none"
            stroke="rgba(224,164,88,0.55)"
            strokeWidth="1.4"
          />
          <path
            d="M105 118c-8-10-24-8-24 4 0 10 12 16 24 26 12-10 24-16 24-26 0-12-16-14-24-4Z"
            fill="rgba(255,125,151,0.55)"
          />
        </svg>
      </div>

      {/* decorative gift box, right */}
      <div className={`${styles.deco} ${styles.decoRight}`} aria-hidden="true">
        <div className={styles.decoBlob} />
        <svg viewBox="0 0 220 220" className={styles.decoSvg}>
          <rect
            x="35"
            y="95"
            width="150"
            height="90"
            rx="8"
            fill="none"
            stroke="rgba(224,164,88,0.55)"
            strokeWidth="1.4"
          />
          <path
            d="M35 120h150"
            stroke="rgba(224,164,88,0.55)"
            strokeWidth="1.4"
          />
          <path
            d="M110 95v90"
            stroke="rgba(224,164,88,0.55)"
            strokeWidth="1.4"
          />
          <path
            d="M110 95c-6-14-32-16-32-1s26 15 32 1c6 14 32 16 32 1s-26-15-32-1Z"
            fill="none"
            stroke="rgba(255,178,90,0.6)"
            strokeWidth="1.4"
          />
        </svg>
      </div>

      {/* nav */}
      <header className={styles.nav}>
        <div className={styles.brand}>
          <Icon name="envelope" size={22} />
          <span>Momentia</span>
        </div>

        <nav className={styles.navLinks}>
          {NAV_LINKS.map((item) => (
            <a href="#" key={item.label} className={styles.navLink}>
              <Icon name={item.icon} size={16} />
              {item.label}
            </a>
          ))}
        </nav>

        <button className={styles.loginBtn} type="button">
          <Icon name="user" size={15} />
          Iniciar sesión
        </button>
      </header>

      {/* hero */}
      <section className={styles.hero}>
        <span className={styles.eyebrow}>
          ✦ Para cada historia, un momento único
        </span>

        <h1 className={styles.headline}>
          Experiencias digitales
          <br />
          que <span className={styles.gradText}>se sienten</span>
        </h1>

        <p className={styles.subtitle}>
          Crea regalos personalizados para cumpleaños, aniversarios,
          <br className={styles.brDesktop} />
          Día de la Madre, Navidad y cualquier ocasión especial.
        </p>

        <ul className={styles.featureRow}>
          {FEATURES.map((f) => (
            <li key={f.title} className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <Icon name={f.icon} size={17} />
              </span>
              <span>
                <strong>{f.title}</strong>
                <em>{f.desc}</em>
              </span>
            </li>
          ))}
        </ul>

        {/* pricing */}
        <div className={styles.pricing}>
          <div className={styles.plan}>
            <div className={styles.planBadgeIcon}>
              <Icon name="envelope" size={20} />
            </div>
            <span className={styles.planName}>Basic</span>
            <span className={styles.planPrice}>$3</span>
            <p className={styles.planDesc}>
              Diseño bonito, mensaje personalizado y link activo por 90 días.
            </p>
            <a href="/create" className={`${styles.planCta} ${styles.planCtaOutline}`}>
              Elegir Basic
            </a>
          </div>

          <div className={`${styles.plan} ${styles.planPremium}`}>
            <span className={styles.planPill}>Más popular</span>
            <div className={`${styles.planBadgeIcon} ${styles.planBadgeIconPremium}`}>
              <Icon name="star" size={20} />
            </div>
            <span className={styles.planName}>Premium</span>
            <span className={styles.planPrice}>$5</span>
            <p className={styles.planDesc}>
              Más fotos, más emoción y link permanente.
            </p>
            <a href="/create" className={`${styles.planCta} ${styles.planCtaFilled}`}>
              Elegir Premium
            </a>
          </div>
        </div>
      </section>

      {/* trust bar */}
      <footer className={styles.trustBar}>
        {TRUST_ITEMS.map((t) => (
          <span className={styles.trustItem} key={t.label}>
            <Icon name={t.icon} size={15} />
            {t.label}
          </span>
        ))}
      </footer>
    </main>
  );
}