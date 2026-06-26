export default function OfflinePage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#1e293b",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "3rem 2rem",
          maxWidth: 400,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📡</div>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          You&apos;re Offline
        </h1>
        <p
          style={{
            color: "#64748b",
            fontSize: "0.95rem",
            lineHeight: 1.6,
          }}
        >
          ToolCraft tools you&apos;ve visited before should still work
          offline.
        </p>
        <p
          style={{
            color: "#64748b",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginTop: "0.5rem",
          }}
        >
          Reconnect to discover new tools.
        </p>
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              padding: "0.25rem 0.75rem",
              background: "#f1f5f9",
              borderRadius: 6,
              fontSize: "0.85rem",
              color: "#475569",
            }}
          >
            Image Compressor
          </span>
          <span
            style={{
              padding: "0.25rem 0.75rem",
              background: "#f1f5f9",
              borderRadius: 6,
              fontSize: "0.85rem",
              color: "#475569",
            }}
          >
            PDF Merger
          </span>
          <span
            style={{
              padding: "0.25rem 0.75rem",
              background: "#f1f5f9",
              borderRadius: 6,
              fontSize: "0.85rem",
              color: "#475569",
            }}
          >
            JSON Formatter
          </span>
          <span
            style={{
              padding: "0.25rem 0.75rem",
              background: "#f1f5f9",
              borderRadius: 6,
              fontSize: "0.85rem",
              color: "#475569",
            }}
          >
            Markdown Editor
          </span>
        </div>
      </div>
    </div>
  );
}
