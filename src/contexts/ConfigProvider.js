import React from "react";
const { useState, useContext } = require("react");

const ConfigContext = React.createContext();

export function useConfig() {
  return useContext(ConfigContext);
}

export function ConfigProvider({ children }) {
  const [settings, setSettings] = useState({ playerCount: '5', qbCount: '1', rbCount: '2', wrCount: '3'});
  
  return (
    <ConfigContext.Provider value={{ settings, setSettings }}>
      {children}
    </ConfigContext.Provider>
  );
};

