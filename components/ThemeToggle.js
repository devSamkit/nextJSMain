import { useEffect, useState } from 'react';
import styles from '../styles/ThemeToggle.module.css';
import { useTheme } from '../context/ThemeContext';
import Image from 'next/image';

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.toggleContainer}>
      <button
        className={`${styles.themeToggle} ${darkMode ? styles.dark : styles.light}`}
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle theme"
      >
        <div className={styles.slider}>
          <div className={`${styles.sliderButton} ${darkMode ? styles.sliderRight : styles.sliderLeft}`}>
            <Image
              src={darkMode ? "/moon.svg" : "/sun.svg"}
              alt={darkMode ? "Moon" : "Sun"}
              width={20}
              height={20}
            />
          </div>
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;