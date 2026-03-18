import { useCallback, useState } from 'react';
import { getRandomWord } from '../data/words';
import { getHintForWord } from '../data/hints';
import { AVATARS } from '../assets/avatars';

export const GAME_STATES = {
  HOME: 'HOME',
  CONFIG: 'CONFIG',
  REVEAL: 'REVEAL',
  VOTING: 'VOTING',
  ELIMINATION: 'ELIMINATION',
  RESULT: 'RESULT',
};

const DEFAULT_CATEGORIES = [
  'comidas',
  'lugares',
  'jerga',
  'cultura_pop',
  'musica',
  'deportes',
  'personajes',
  'tradiciones',
  'animales',
];

export const useGameEngine = ({ onGameBreak } = {}) => {
  const [gameState, setGameState] = useState(GAME_STATES.CONFIG);
  const [players, setPlayers] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [imposterCount, setImposterCount] = useState(1);
  const [useHints, setUseHints] = useState(true);

  const [roles, setRoles] = useState([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [secretWord, setSecretWord] = useState(null);
  const [currentHint, setCurrentHint] = useState('');
  const [eliminatedInfo, setEliminatedInfo] = useState(null);
  const [winner, setWinner] = useState(null);
  const [roundNumber, setRoundNumber] = useState(1);

  const addPlayer = useCallback((name) => {
    const clean = name.trim();
    if (!clean || players.includes(clean) || players.length >= AVATARS.length) {
      return false;
    }
    setPlayers((prev) => [...prev, clean]);
    return true;
  }, [players]);

  const removePlayer = useCallback((name) => {
    setPlayers((prev) => prev.filter((player) => player !== name));
  }, []);

  const toggleCategory = useCallback((categoryId) => {
    setCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.length > 1 ? prev.filter((id) => id !== categoryId) : prev;
      }
      return [...prev, categoryId];
    });
  }, []);

  const startGame = useCallback(() => {
    if (players.length < 3) {
      return false;
    }

    const wordData = getRandomWord(categories);
    setSecretWord(wordData);
    setCurrentHint(useHints ? getHintForWord(wordData.categoryId, wordData.word) : '');

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const shuffledAvatars = [...AVATARS].sort(() => Math.random() - 0.5);

    const preparedRoles = shuffledPlayers.map((player, index) => ({
      name: player,
      isImposter: index < imposterCount,
      word: index < imposterCount ? 'Eres el Impostor' : wordData.word,
      category: wordData.category.toUpperCase(),
      hasRevealed: false,
      isEliminated: false,
      avatar: shuffledAvatars[index],
    }));

    setRoles(preparedRoles.sort(() => Math.random() - 0.5));
    setCurrentRevealIndex(0);
    setEliminatedInfo(null);
    setWinner(null);
    setRoundNumber(1);
    setGameState(GAME_STATES.REVEAL);
    return true;
  }, [categories, imposterCount, players, useHints]);

  const nextReveal = useCallback(() => {
    setRoles((prev) => {
      const updated = [...prev];
      if (updated[currentRevealIndex]) {
        updated[currentRevealIndex] = { ...updated[currentRevealIndex], hasRevealed: true };
      }

      const nextIndex = updated.findIndex(
        (role, index) => index > currentRevealIndex && !role.isEliminated,
      );

      if (nextIndex !== -1) {
        setCurrentRevealIndex(nextIndex);
      } else {
        setGameState(GAME_STATES.VOTING);
      }

      return updated;
    });
  }, [currentRevealIndex]);

  const votePlayer = useCallback((playerName) => {
    const found = roles.find((role) => role.name === playerName);
    if (!found || found.isEliminated) {
      return;
    }

    setEliminatedInfo({ name: playerName, isImposter: found.isImposter });
    setRoles((prev) =>
      prev.map((role) => (role.name === playerName ? { ...role, isEliminated: true } : role)),
    );
    setGameState(GAME_STATES.ELIMINATION);
  }, [roles]);

  const confirmElimination = useCallback(async () => {
    const activePlayers = roles.filter((role) => !role.isEliminated);
    const activeImposters = activePlayers.filter((role) => role.isImposter);
    const activeCitizens = activePlayers.filter((role) => !role.isImposter);

    if (activeImposters.length === 0) {
      setWinner('CITIZENS');
      if (onGameBreak) {
        await onGameBreak();
      }
      setGameState(GAME_STATES.RESULT);
      return;
    }

    if (activeImposters.length >= activeCitizens.length) {
      setWinner('IMPOSTERS');
      if (onGameBreak) {
        await onGameBreak();
      }
      setGameState(GAME_STATES.RESULT);
      return;
    }

    setRoundNumber((prev) => prev + 1);
    setGameState(GAME_STATES.VOTING);
  }, [onGameBreak, roles]);

  const resetGame = useCallback(() => {
    setGameState(GAME_STATES.CONFIG);
    setRoles([]);
    setCurrentRevealIndex(0);
    setSecretWord(null);
    setRoundNumber(1);
    setEliminatedInfo(null);
    setWinner(null);
  }, []);

  const goHome = useCallback(() => {
    setGameState(GAME_STATES.CONFIG);
    setPlayers([]);
    setRoles([]);
    setEliminatedInfo(null);
    setSecretWord(null);
    setWinner(null);
    setRoundNumber(1);
  }, []);

  return {
    gameState,
    setGameState,
    players,
    addPlayer,
    removePlayer,
    categories,
    toggleCategory,
    imposterCount,
    setImposterCount,
    useHints,
    setUseHints,
    roles,
    startGame,
    currentRevealIndex,
    nextReveal,
    votePlayer,
    eliminatedInfo,
    confirmElimination,
    winner,
    roundNumber,
    currentHint,
    secretWord,
    resetGame,
    goHome,
  };
};

