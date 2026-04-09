import React from "react";

/**
 * ErrorBoundary — Componente de classe que captura erros em seus filhos.
 *
 * Error Boundaries DEVEM ser componentes de classe porque usam os lifecycle
 * methods getDerivedStateFromError e componentDidCatch, que não existem em
 * hooks (não há equivalente funcional em React até o momento).
 *
 * Props:
 *   - fallback: ReactNode ou função (recebe { error, resetError })
 *   - onError: callback opcional para logging/telemetria
 *   - level: "page" | "section" | "widget" — controla o estilo do fallback padrão
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Chamado durante a fase de RENDER quando um erro é lançado por um filho.
   * Atualiza o state para exibir o fallback na próxima renderização.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Chamado durante a fase de COMMIT — ideal para side effects como
   * logging, envio para serviço de monitoramento (Sentry, DataDog, etc).
   */
  componentDidCatch(error, errorInfo) {
    console.error(
      `[ErrorBoundary/${this.props.level || "default"}]`,
      error,
      errorInfo.componentStack
    );
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Se o fallback é uma função, passa error e resetError para ela
      if (typeof this.props.fallback === "function") {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.resetError,
        });
      }

      // Se o fallback é um elemento React estático
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback padrão
      return (
        <DefaultFallback
          error={this.state.error}
          resetError={this.resetError}
          level={this.props.level}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Fallback padrão — exibido quando nenhum fallback customizado é fornecido.
 * Adapta o visual conforme o nível (page, section, widget).
 */
function DefaultFallback({ error, resetError, level = "section" }) {
  const styles = {
    page: {
      container: {
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        textAlign: "center",
      },
      icon: "💥",
      title: "Algo deu errado nesta página",
    },
    section: {
      container: {
        padding: 32,
        textAlign: "center",
        background: "#fef2f2",
        borderRadius: 10,
        border: "1px solid #fecaca",
        margin: "16px 0",
      },
      icon: "⚠️",
      title: "Erro nesta seção",
    },
    widget: {
      container: {
        padding: 16,
        textAlign: "center",
        background: "#fff7ed",
        borderRadius: 8,
        border: "1px solid #fed7aa",
      },
      icon: "🔧",
      title: "Widget indisponível",
    },
  };

  const s = styles[level] || styles.section;

  return (
    <div style={s.container}>
      <span style={{ fontSize: 48, marginBottom: 12, display: "block" }}>
        {s.icon}
      </span>
      <h3 style={{ fontSize: 18, color: "#991b1b", marginBottom: 8 }}>
        {s.title}
      </h3>
      <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
        {error?.message || "Erro desconhecido"}
      </p>
      <button
        onClick={resetError}
        style={{
          padding: "8px 20px",
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Tentar novamente
      </button>
    </div>
  );
}

export default ErrorBoundary;
