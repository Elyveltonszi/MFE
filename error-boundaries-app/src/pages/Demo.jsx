import React, { useState } from "react";

/**
 * Página didática: demonstra erro em event handler vs erro em render.
 *
 * IMPORTANTE: Error Boundaries NÃO capturam erros em:
 *   - Event handlers (onClick, onChange, etc.)
 *   - Código assíncrono (setTimeout, fetch, async/await)
 *   - Server-side rendering
 *   - Erros no próprio ErrorBoundary
 *
 * Para event handlers, usamos try/catch tradicional.
 */
const DemoPage = () => {
  const [eventError, setEventError] = useState(null);

  /**
   * Demonstração: erro em event handler.
   * Error Boundaries NÃO capturam isso — precisa de try/catch.
   */
  const handleClickWithError = () => {
    try {
      // Simula chamada a uma API que falha
      const data = JSON.parse("{ invalid json }");
      console.log(data);
    } catch (err) {
      setEventError(err.message);
    }
  };

  /**
   * Demonstração: erro em render.
   * Esse SIM é capturado pelo Error Boundary. O componente BuggyRender
   * lança erro durante a fase de render quando ativado.
   */
  const [activateBug, setActivateBug] = useState(false);

  if (activateBug) {
    throw new Error(
      "Erro durante render — este erro É capturado pelo Error Boundary!"
    );
  }

  return (
    <div style={{ padding: "8px 0" }}>
      <h2 style={{ fontSize: 24, color: "#1f2937", marginBottom: 4 }}>
        🧪 Laboratório de Error Boundaries
      </h2>
      <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 15 }}>
        Entenda quando Error Boundaries funcionam e quando não funcionam.
      </p>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }}>
        {/* ------- Erro em Event Handler ------- */}
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ color: "#b45309", marginBottom: 8 }}>
            ❌ Erro em Event Handler
          </h3>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
            Error Boundaries <strong>não capturam</strong> erros em event handlers.
            Usamos <code>try/catch</code> tradicional.
          </p>

          <button
            onClick={handleClickWithError}
            style={{
              padding: "10px 20px",
              background: "#f59e0b",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Disparar erro em onClick
          </button>

          {eventError && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: "#fef3c7",
                borderRadius: 6,
                border: "1px solid #fde68a",
              }}
            >
              <strong style={{ color: "#92400e" }}>Erro capturado por try/catch:</strong>
              <p style={{ fontSize: 13, color: "#78350f", marginTop: 4 }}>
                {eventError}
              </p>
              <button
                onClick={() => setEventError(null)}
                style={{
                  marginTop: 8,
                  padding: "4px 12px",
                  background: "#d97706",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Limpar
              </button>
            </div>
          )}
        </div>

        {/* ------- Erro em Render ------- */}
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ color: "#dc2626", marginBottom: 8 }}>
            ✅ Erro durante Render
          </h3>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
            Error Boundaries <strong>capturam</strong> erros durante a renderização.
            Clique para lançar um erro que será pego pelo boundary desta página.
          </p>

          <button
            onClick={() => setActivateBug(true)}
            style={{
              padding: "10px 20px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Disparar erro em render
          </button>
        </div>
      </div>

      {/* ------- Info Box ------- */}
      <div
        style={{
          marginTop: 32,
          padding: 24,
          background: "#eff6ff",
          borderRadius: 10,
          border: "1px solid #bfdbfe",
        }}
      >
        <h3 style={{ color: "#1e40af", marginBottom: 12 }}>
          📖 Quando Error Boundaries NÃO capturam erros:
        </h3>
        <ul style={{ fontSize: 14, color: "#1e3a5f", lineHeight: 2, paddingLeft: 20 }}>
          <li>
            <strong>Event handlers</strong> — use <code>try/catch</code> dentro do handler
          </li>
          <li>
            <strong>Código assíncrono</strong> — <code>setTimeout</code>, <code>fetch</code>,
            Promises
          </li>
          <li>
            <strong>Server-side rendering</strong> — Error Boundaries são client-only
          </li>
          <li>
            <strong>Erros no próprio Error Boundary</strong> — use um boundary pai
          </li>
        </ul>

        <h3 style={{ color: "#1e40af", marginBottom: 12, marginTop: 20 }}>
          📖 Quando Error Boundaries CAPTURAM erros:
        </h3>
        <ul style={{ fontSize: 14, color: "#1e3a5f", lineHeight: 2, paddingLeft: 20 }}>
          <li>Erros durante a fase de <strong>render</strong></li>
          <li>Erros em <strong>lifecycle methods</strong> (componentDidMount, etc.)</li>
          <li>Erros em <strong>constructors</strong> de componentes filhos</li>
        </ul>
      </div>
    </div>
  );
};

export default DemoPage;
