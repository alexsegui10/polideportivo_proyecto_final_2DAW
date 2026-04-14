import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>IA Gateway Next - Emotiva Poli</h1>
      <p>Servidor de recomendaciones con RAG + Round Robin + Fallback.</p>
      <ul>
        <li>POST /api/recommend</li>
        <li>GET /api/status</li>
      </ul>
    </main>
  );
}
