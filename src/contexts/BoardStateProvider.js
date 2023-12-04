import React from 'react';
import { useConfig } from '../contexts/ConfigProvider';
const { useState, useContext, useEffect } = require('react');

const BoardStateContext = React.createContext();

export function useBoardState() {
  return useContext(BoardStateContext);
}

export function BoardStateProvider({ children }) {
  const { settings } = useConfig();
  const [board, setBoard] = useState([]);
  const [boardStatus, setBoardStatus] = useState('waiting_to_start');
  const [pickCount, setPickCount] = useState(1);
  const [maxPickAmount, setMaxPickAmount] = useState(null);
  const [recentDraftedPlayer, setRecentDraftedPlayer] = useState({ firstName: 'Current' });

  useEffect(() => {
    setMaxPickAmount(+settings.playerCount * +settings.roundCount);
  }, [settings.playerCount, settings.roundCount]);

  useEffect(() => {
    const boardState = JSON.parse(localStorage.getItem('board'));
    if (boardState && boardState.length > 0) {
      setBoard(boardState);
      setPickCount(boardState.length);
      if (boardState[0].firstName !== 'Current') setBoardStatus('in_progress');
    } else {
      setBoard([{ firstName: 'Current' }]);
    }
  }, []);

  useEffect(() => {
    if (board.length > 0) {
      localStorage.setItem('board', JSON.stringify(board));
    }
  }, [board]);

  const makePlayerPick = (pick, drafteeName, pickNumber) => {
    if (boardStatus !== 'completed') {
      board[pickNumber - 1] = {
        firstName: pick.first,
        lastName: pick.last,
        position: pick.position,
        team: pick.team,
        bye: pick.bye,
        drafteeName: drafteeName,
        pickNumber: pickNumber,
      };
      board[pickNumber] = { firstName: 'Current' };
      setBoard([...board]);
      setPickCount(pickCount + 1);
      setRecentDraftedPlayer(pick);
      if (pickCount >= maxPickAmount) {
        setBoardStatus('completed');
      }
    }
  };
  const undoPlayerPick = () => {
    if (pickCount > 1) {
      board.splice(board.length - 2, 1);
      setBoard([...board]);
      setPickCount(pickCount - 1);
    }
  };
  const resetBoard = () => {
    setPickCount(1);
    setBoard([{ firstName: 'Current' }]);
    setBoardStatus('waiting_to_start');
    setRecentDraftedPlayer({ firstName: 'Current' });
  };

  return (
    <BoardStateContext.Provider
      value={{
        board,
        setBoard,
        makePlayerPick,
        undoPlayerPick,
        resetBoard,
        pickCount,
        setPickCount,
        boardStatus,
        setBoardStatus,
        recentDraftedPlayer,
        setRecentDraftedPlayer,
        maxPickAmount,
      }}>
      {children}
    </BoardStateContext.Provider>
  );
}
