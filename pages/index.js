import Head from "next/head";
import Starfield from "../components/Starfield";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Foxtako</title>
        <meta name="description" content="Foxtako - Portfolio and Projects" />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content="Foxtako - Portfolio & Projects" />
        <meta
          property="og:description"
          content="I build cool things for the web. Check out my projects."
        />
        <meta property="og:image" content="/foxtako-logo.png" />
        <meta property="og:type" content="website" />
      </Head>

      <main style={styles.main}>
        <Starfield />
        <div style={styles.content}>
          <Image
            src="/foxtako-logo.png"
            alt="Foxtako Logo"
            width={200}
            height={200}
            style={styles.logo}
          />
          <h1 style={styles.title}>Hey, I'm Samkit</h1>
          <p style={styles.subtitle}>I build cool things for the web.</p>

          <div style={styles.links}>
            <a
              href="https://github.com/devSamkit"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.linkButton}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/jsamkit"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.linkButton}
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com/samkitjain__"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.linkButton}
            >
              Instagram
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

const styles = {
  main: { position: "relative", height: "100vh", width: "100%", overflow: "hidden" },
  content: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#fff",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  logo: {
    marginBottom: "1rem",
    filter: "drop-shadow(0 0 20px rgba(255, 140, 0, 0.6))", // orange glow
  },
  title: { fontSize: "3rem", marginBottom: "1rem" },
  subtitle: { fontSize: "1.25rem", marginBottom: "2rem", color: "#aaa" },
  links: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
  linkButton: {
    padding: "0.5rem 1rem",
    borderRadius: "9999px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.3s ease",
  },
};
