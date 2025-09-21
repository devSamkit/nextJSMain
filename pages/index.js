export default function Home() {
  return (
    <main style={styles.main}>
      <h1 style={styles.title}>Hey, I'm Samkit</h1>
      <p style={styles.subtitle}>I build cool things for the web.</p>

      <div style={styles.links}>
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="/blog">Blog</a>
      </div>
    </main>
  );
}

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    color: "#aaa",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
    fontSize: "1rem",
  },
};
