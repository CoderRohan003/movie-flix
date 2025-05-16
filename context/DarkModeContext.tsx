import React, { createContext, useContext, useState } from 'react';

const lightColors = {
  background: '#ffffff',
  text: '#000000',
  secondaryText: '#444444',
  card: '#f0f0f0',
  border: '#ccc',
  arrow: '#000',
};

const darkColors = {
  background: '#121212',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  card: '#333333',
  border: '#444444',
  arrow: '#ffffff',
};

const ColorContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
  colors: lightColors,
});

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const colors = darkMode ? darkColors : lightColors;

  return (
    <ColorContext.Provider value={{ darkMode, toggleDarkMode, colors }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => useContext(ColorContext);
