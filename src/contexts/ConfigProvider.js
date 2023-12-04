import React, { useEffect } from 'react';
const { useState, useContext } = require('react');

const ConfigContext = React.createContext();

export function useConfig() {
  return useContext(ConfigContext);
}

export function ConfigProvider({ children }) {
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [settings, setSettings] = useState(
    () =>
      JSON.parse(localStorage.getItem('draft-settings')) ?? {
        playerCount: '10',
        roundCount: '16',
        timerValue: '00:30',
        snakeDraft: true
      }
  );

  useEffect(() => {
    localStorage.setItem('draft-settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <ConfigContext.Provider value={{ settings, setSettings, isVideoPlayerOpen, setIsVideoPlayerOpen }}>
      {children}
    </ConfigContext.Provider>
  );
}
