import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let stars = [];
    let animationFrame;
    let mouse = { x: 0, y: 0 }; // Track mouse position
    let parallax = { x: 0, y: 0 }; // Smooth movement effect

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // Mouse movement listener
    window.addEventListener("mousemove", (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
    });

    // Generate stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        velocity: Math.random() * 0.15 + 0.05,
        alpha: Math.random(),
        alphaChange: Math.random() * 0.02 + 0.005,
        depth: Math.random() * 0.6 + 0.4, // parallax depth
      });
    }

    function animate() {
      // Smoothly interpolate parallax position
      parallax.x += (mouse.x - parallax.x) * 0.05;
      parallax.y += (mouse.y - parallax.y) * 0.05;

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#0a001a");
      gradient.addColorStop(1, "#000814");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Twinkle
        star.alpha += star.alphaChange;
        if (star.alpha <= 0 || star.alpha >= 1) {
          star.alphaChange = -star.alphaChange;
        }

        // Move stars downward
        star.y += star.velocity;
        if (star.y > canvas.height) star.y = 0;

        // Apply parallax shift (closer stars move more)
        const offsetX = parallax.x * star.depth * 20;
        const offsetY = parallax.y * star.depth * 20;

        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main style={styles.main}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.content}>
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
      </div>
    </main>
  );
}

const styles = {
  main: {
    position: "relative",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
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
    userSelect: "none",
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
