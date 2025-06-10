
import { createContext, useContext, useEffect, useState } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings, updateSettings } = useUserSettings();
  const [isDarkMode, setIsDarkMode] = useState(settings.dark_mode);

  useEffect(() => {
    setIsDarkMode(settings.dark_mode);
  }, [settings.dark_mode]);

  useEffect(() => {
    // Aplicar o tema ao documento
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    updateSettings({ dark_mode: newDarkMode });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
