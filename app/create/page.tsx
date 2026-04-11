export default function CreatePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "12px" }}>
          Crear sorpresa
        </h1>

        <p style={{ opacity: 0.8, marginBottom: "32px" }}>
          Completa estos datos para preparar tu Momentia.
        </p>

        <form style={{ display: "grid", gap: "16px" }}>
          <input placeholder="Nombre de quien recibe" style={inputStyle} />
          <input placeholder="Nombre de quien envía" style={inputStyle} />

          <select style={inputStyle}>
            <option>Cumpleaños</option>
            <option>Aniversario</option>
            <option>Día de la Madre</option>
            <option>Navidad</option>
            <option>Amor</option>
          </select>

          <textarea
            placeholder="Escribe tu mensaje"
            rows={5}
            style={inputStyle}
          />

          <button type="button" style={buttonStyle}>
            Continuar
          </button>
        </form>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #2a2a2a",
  background: "#111",
  color: "white",
  fontSize: "1rem",
};

const buttonStyle: React.CSSProperties = {
  padding: "14px 18px",
  borderRadius: "12px",
  border: "none",
  background: "white",
  color: "black",
  fontWeight: 600,
  cursor: "pointer",
};