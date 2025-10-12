import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Starfield() {
  const canvasRef = useRef(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let stars = [];
    let shootingStars = [];
    let animationFrame;
    let mouse = { x: 0, y: 0 };
    let parallax = { x: 0, y: 0 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("mousemove", (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
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
        depth: Math.random() * 0.6 + 0.4,
      });
    }

    // Function to create a shooting star
    function createShootingStar() {
      const startSide = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let startX, startY, velocityX, velocityY;
      
      switch (startSide) {
        case 0: // top
          startX = Math.random() * canvas.width;
          startY = -20;
          velocityX = (Math.random() - 0.5) * 8;
          velocityY = Math.random() * 4 + 2;
          break;
        case 1: // right
          startX = canvas.width + 20;
          startY = Math.random() * canvas.height;
          velocityX = -(Math.random() * 4 + 2);
          velocityY = (Math.random() - 0.5) * 8;
          break;
        case 2: // bottom
          startX = Math.random() * canvas.width;
          startY = canvas.height + 20;
          velocityX = (Math.random() - 0.5) * 8;
          velocityY = -(Math.random() * 4 + 2);
          break;
        case 3: // left
          startX = -20;
          startY = Math.random() * canvas.height;
          velocityX = Math.random() * 4 + 2;
          velocityY = (Math.random() - 0.5) * 8;
          break;
      }

      shootingStars.push({
        x: startX,
        y: startY,
        velocityX: velocityX,
        velocityY: velocityY,
        length: Math.random() * 60 + 20,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.01,
        brightness: Math.random() * 0.5 + 0.5,
      });
    }

    function animate() {
      parallax.x += (mouse.x - parallax.x) * 0.05;
      parallax.y += (mouse.y - parallax.y) * 0.05;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (darkMode) {
        gradient.addColorStop(0, "#0a001a");
        gradient.addColorStop(1, "#000814");
      } else {
        gradient.addColorStop(0, "#f0f0f0");
        gradient.addColorStop(1, "#ffffff");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.alpha += star.alphaChange;
        if (star.alpha <= 0 || star.alpha >= 1) star.alphaChange = -star.alphaChange;

        star.y += star.velocity;
        if (star.y > canvas.height) star.y = 0;

        const offsetX = parallax.x * star.depth * 20;
        const offsetY = parallax.y * star.depth * 20;

        ctx.fillStyle = `rgba(${darkMode ? '255, 255, 255' : '0, 0, 0'}, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Randomly create shooting stars
      if (Math.random() < 0.001) { // Very low probability each frame
        createShootingStar();
      }

      // Animate shooting stars
      shootingStars.forEach((shootingStar, index) => {
        shootingStar.x += shootingStar.velocityX;
        shootingStar.y += shootingStar.velocityY;
        shootingStar.life -= shootingStar.decay;

        if (shootingStar.life > 0) {
          const gradient = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x - shootingStar.velocityX * shootingStar.length,
            shootingStar.y - shootingStar.velocityY * shootingStar.length
          );
          
          const alpha = shootingStar.life * shootingStar.brightness;
          const color = darkMode ? '255, 255, 255' : '100, 100, 100';
          
          gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
          gradient.addColorStop(1, `rgba(${color}, 0)`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - shootingStar.velocityX * shootingStar.length,
            shootingStar.y - shootingStar.velocityY * shootingStar.length
          );
          ctx.stroke();
        } else {
          shootingStars.splice(index, 1);
        }
      });

      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    />
  );
}