import { useEffect, useState } from 'react';
import styles from '../styles/ThemeToggle.module.css';
import { useTheme } from '../context/ThemeContext';

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
    <button
      className={styles.themeToggle}
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle theme"
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;