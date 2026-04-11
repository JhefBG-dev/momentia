export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "black",
        color: "white",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "12px" }}>
        Momentia 💖
      </h1>

      <p style={{ maxWidth: "600px", marginBottom: "32px" }}>
        Regalos digitales personalizados para cumpleaños, aniversarios, Día de la
        Madre, Navidad y momentos especiales.
      </p>

      <div
        style={{
          display: "grid",
          gap: "20px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        {/* BASIC */}
        <div
          style={{
            border: "1px solid #333",
            borderRadius: "16px",
            padding: "20px",
            background: "#111",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
            Basic — $3
          </h2>

          <p style={{ marginBottom: "16px" }}>
            Mensaje personalizado, diseño bonito y link activo por 90 días.
          </p>

          <a href="/create">
            <button
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Comprar Basic
            </button>
          </a>
        </div>

        {/* PREMIUM */}
        <div
          style={{
            border: "1px solid #333",
            borderRadius: "16px",
            padding: "20px",
            background: "#111",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
            Premium — $5
          </h2>

          <p style={{ marginBottom: "16px" }}>
            Más fotos, más emoción y link permanente.
          </p>

          <a href="/create">
            <button
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Comprar Premium
            </button>
          </a>
        </div>
      </div>
    </main>
  );
}