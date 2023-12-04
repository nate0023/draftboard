import React from 'react';
import playerData from '../data/players.json';

const { useState, useContext } = require('react');

const PlayerContext = React.createContext();

export function usePlayerContext() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }) {
  const [players, setPlayers] = useState(playerData);

  return <PlayerContext.Provider value={{ players, setPlayers }}>{children}</PlayerContext.Provider>;
}
