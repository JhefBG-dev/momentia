type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SurprisePage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #000000 0%, #120014 45%, #220022 100%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          width: "100%",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "24px",
          padding: "40px 24px",
          background: "rgba(255,255,255,0.04)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
        }}
      >
        <p style={{ opacity: 0.75, marginBottom: "8px" }}>Momentia ✨</p>

        <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>
          Para {slug} 💖
        </h1>

        <p style={{ fontSize: "1.2rem", lineHeight: 1.6, marginBottom: "24px" }}>
          Este es un recuerdo digital creado especialmente para ti.
        </p>

        <div
          style={{
            borderRadius: "18px",
            padding: "20px",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.8 }}>
            “Hoy no quería darte algo común.
            <br />
            Quería darte un momento.”
          </p>
        </div>
      </div>
    </main>
  );
}