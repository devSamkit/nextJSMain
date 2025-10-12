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

    // Generate stars for 3D effect
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000, // Spread stars across a wider virtual space
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 1000 + 1, // Depth from 1 to 1001
        speed: Math.random() * 0.5 + 0.1, // Even slower speed of movement towards camera
        alpha: Math.random(),
        alphaChange: Math.random() * 0.02 + 0.005,
        prevX: 0, // For trail effect
        prevY: 0,
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
          velocityX = (Math.random() - 0.5) * 12; // Wider range of horizontal movement
          velocityY = Math.random() * 6 + 3; // Stronger downward movement
          break;
        case 1: // right
          startX = canvas.width + 20;
          startY = Math.random() * canvas.height;
          velocityX = -(Math.random() * 6 + 3); // Stronger leftward movement
          velocityY = (Math.random() - 0.5) * 12; // Wider range of vertical movement
          break;
        case 2: // bottom
          startX = Math.random() * canvas.width;
          startY = canvas.height + 20;
          velocityX = (Math.random() - 0.5) * 12; // Wider range of horizontal movement
          velocityY = -(Math.random() * 6 + 3); // Stronger upward movement
          break;
        case 3: // left
          startX = -20;
          startY = Math.random() * canvas.height;
          velocityX = Math.random() * 6 + 3; // Stronger rightward movement
          velocityY = (Math.random() - 0.5) * 12; // Wider range of vertical movement
          break;
      }

      shootingStars.push({
        x: startX,
        y: startY,
        velocityX: velocityX,
        velocityY: velocityY,
        length: Math.random() * 60 + 20,
        life: 1.0,
        decay: Math.random() * 0.06 + 0.08, // Much faster decay - dies in ~7-12 frames (~0.1-0.2 seconds)
        brightness: Math.random() * 0.5 + 0.5,
        age: 0, // Track how long the shooting star has existed
        fadeInDuration: 3, // Faster fade in over first 3 frames
      });
    }

    function animate() {
      parallax.x += (mouse.x - parallax.x) * 0.08; // More responsive parallax
      parallax.y += (mouse.y - parallax.y) * 0.08;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (darkMode) {
        gradient.addColorStop(0, "#2c1810");
        gradient.addColorStop(1, "#1a1a1a");
      } else {
        gradient.addColorStop(0, "#f0f0f0");
        gradient.addColorStop(1, "#ffffff");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Store previous position for trail effect
        star.prevX = star.x / star.z * canvas.width / 2 + canvas.width / 2;
        star.prevY = star.y / star.z * canvas.height / 2 + canvas.height / 2;

        // Move star towards camera
        star.z -= star.speed;

        // Reset star when it gets too close
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = 1000;
          star.speed = Math.random() * 0.5 + 0.1; // Consistent slower speed
        }

        // Calculate 3D perspective projection
        const perspective = 500; // Focal length
        const projectedX = star.x / star.z * perspective + canvas.width / 2;
        const projectedY = star.y / star.z * perspective + canvas.height / 2;

        // Add parallax effect based on mouse position
        const parallaxStrength = (1000 - star.z) / 1000 * 120; // Much stronger parallax effect
        const offsetX = parallax.x * parallaxStrength;
        const offsetY = parallax.y * parallaxStrength;

        const finalX = projectedX + offsetX;
        const finalY = projectedY + offsetY;

        // Only draw stars that are within screen bounds
        if (finalX >= 0 && finalX <= canvas.width && finalY >= 0 && finalY <= canvas.height) {
          // Calculate star size based on distance (closer = bigger)
          const starSize = (1000 - star.z) / 1000 * 3 + 0.5;
          
          // Calculate brightness based on distance and twinkling
          star.alpha += star.alphaChange;
          if (star.alpha <= 0.3 || star.alpha >= 1) star.alphaChange = -star.alphaChange;
          
          const brightness = Math.min(((1000 - star.z) / 1000) * star.alpha, 1);
          
          // Draw star trail for fast-moving stars
          if (star.z < 200 && star.prevX && star.prevY) {
            const gradient = ctx.createLinearGradient(finalX, finalY, star.prevX + offsetX, star.prevY + offsetY);
            gradient.addColorStop(0, `rgba(${darkMode ? '255, 255, 255' : '50, 50, 50'}, ${brightness})`);
            gradient.addColorStop(1, `rgba(${darkMode ? '255, 255, 255' : '50, 50, 50'}, 0)`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = starSize * 0.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(finalX, finalY);
            ctx.lineTo(star.prevX + offsetX, star.prevY + offsetY);
            ctx.stroke();
          }

          // Draw the star
          ctx.fillStyle = `rgba(${darkMode ? '255, 255, 255' : '0, 0, 0'}, ${brightness})`;
          ctx.beginPath();
          ctx.arc(finalX, finalY, starSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Randomly create shooting stars
      if (Math.random() < 0.0002) { // Much rarer - roughly every 5-10 seconds
        createShootingStar();
      }

      // Animate shooting stars
      shootingStars.forEach((shootingStar, index) => {
        shootingStar.x += shootingStar.velocityX;
        shootingStar.y += shootingStar.velocityY;
        shootingStar.life -= shootingStar.decay;
        shootingStar.age++;

        if (shootingStar.life > 0) {
          const gradient = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x - shootingStar.velocityX * shootingStar.length,
            shootingStar.y - shootingStar.velocityY * shootingStar.length
          );
          
          // Add fade-in effect for the first few frames
          const fadeInMultiplier = shootingStar.age < shootingStar.fadeInDuration 
            ? shootingStar.age / shootingStar.fadeInDuration 
            : 1;
          
          const alpha = shootingStar.life * shootingStar.brightness * fadeInMultiplier;
          const color = darkMode ? '255, 255, 255' : '120, 120, 120';
          
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