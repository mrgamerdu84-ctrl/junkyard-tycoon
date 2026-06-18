import { createFileRoute, Link } from "@tanstack/react-router";

// Pour mettre à jour l'APK : upload le nouveau fichier .apk via Lovable,
// puis remplace APK_URL et APK_VERSION ci-dessous.
const APK_URL = ""; // ex: "/__l5e/assets-v1/<id>/my-taxi-world-tycoon.apk"
const APK_VERSION = "1.0.0";
const APK_DATE = "18 juin 2026";
const APK_SIZE = "—";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Télécharger My Taxi World Tycoon — APK Android" },
      { name: "description", content: "Télécharge la dernière version APK de My Taxi World Tycoon pour Android." },
      { property: "og:title", content: "Télécharger My Taxi World Tycoon" },
      { property: "og:description", content: "Dernière version APK officielle pour Android." },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const available = APK_URL.length > 0;
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0a0c10 0%, #131822 100%)",
      color: "#e5e7eb",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "32px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <Link
        to="/"
        style={{ alignSelf: "flex-start", color: "#9ca3af", textDecoration: "none", fontSize: 14 }}
      >
        ← Retour au jeu
      </Link>

      <div style={{ maxWidth: 480, width: "100%", marginTop: 24, textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 8 }}>🚕</div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 900,
          color: "#f5c542",
          letterSpacing: 1,
          margin: 0,
          textShadow: "0 2px 0 #b8860b, 0 4px 12px rgba(0,0,0,0.5)",
        }}>
          My Taxi World Tycoon
        </h1>
        <p style={{ color: "#9ca3af", margin: "8px 0 28px", fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>
          Télécharger pour Android
        </p>

        <div style={{
          background: "#1a1f2e",
          border: "1px solid #2a2f3e",
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          textAlign: "left",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "#9ca3af", fontSize: 13 }}>Version</span>
            <strong style={{ color: "#fde047" }}>{APK_VERSION}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "#9ca3af", fontSize: 13 }}>Mise à jour</span>
            <strong style={{ color: "#e5e7eb" }}>{APK_DATE}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#9ca3af", fontSize: 13 }}>Taille</span>
            <strong style={{ color: "#e5e7eb" }}>{APK_SIZE}</strong>
          </div>
        </div>

        {available ? (
          <a
            href={APK_URL}
            download
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "linear-gradient(180deg, #f5c542 0%, #e0a92a 100%)",
              color: "#1a1208",
              textDecoration: "none",
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 1,
              padding: "16px 0",
              borderRadius: 14,
              boxShadow: "0 6px 0 #8a6510, 0 12px 24px rgba(0,0,0,0.5)",
              textTransform: "uppercase",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a1208">
              <path d="M17.6 9.48l1.84-3.2c.16-.27.07-.62-.2-.78-.27-.16-.62-.07-.78.2l-1.87 3.24c-1.52-.68-3.22-1.06-5.02-1.06-1.8 0-3.5.38-5.02 1.06L4.84 5.7c-.16-.27-.51-.36-.78-.2-.27.16-.36.51-.2.78l1.84 3.2C2.8 11.36 1 14.44 1 18h22c0-3.56-1.8-6.64-4.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
            </svg>
            Télécharger l'APK
          </a>
        ) : (
          <div style={{
            background: "#1a1f2e",
            border: "1px dashed #f59e0b",
            borderRadius: 14,
            padding: 20,
            color: "#fde68a",
            fontSize: 14,
            lineHeight: 1.5,
          }}>
            ⏳ <strong>APK bientôt disponible.</strong><br/>
            La nouvelle version sera publiée sur cette page très prochainement.
          </div>
        )}

        <div style={{
          marginTop: 24,
          padding: 16,
          background: "rgba(245,197,66,0.08)",
          border: "1px solid rgba(245,197,66,0.2)",
          borderRadius: 12,
          color: "#cbd5e1",
          fontSize: 12,
          lineHeight: 1.6,
          textAlign: "left",
        }}>
          <strong style={{ color: "#fde047" }}>📲 Installation :</strong><br/>
          1. Télécharge le fichier .apk<br/>
          2. Ouvre-le depuis ton téléphone<br/>
          3. Autorise l'installation depuis sources inconnues si demandé<br/>
          4. Lance le jeu et profite !
        </div>

        <p style={{ marginTop: 32, color: "#6b7280", fontSize: 11 }}>
          Application Android — Non disponible sur iOS
        </p>
      </div>
    </div>
  );
}
