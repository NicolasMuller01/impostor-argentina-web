import { useCallback, useState } from 'react';
import { getRandomWord } from '../data/words';
import { getHintForWord } from '../data/hints';
import { getRandomFact, FACT_CATEGORIES } from '../data/facts';
import { AVATARS } from '../assets/avatars';

export const GAME_STATES = {
  HOME: 'HOME',
  CONFIG: 'CONFIG',
  REVEAL: 'REVEAL',
  DISCUSSION: 'DISCUSSION',
  VOTING: 'VOTING',
  ELIMINATION: 'ELIMINATION',
  RESULT: 'RESULT',
  MODE_SELECT: 'MODE_SELECT',
};

export const GAME_MODES = {
  CLASSIC: 'CLASSIC',
  RANDOM_FACT: 'RANDOM_FACT',
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

const DEFAULT_FACT_CATEGORIES = [
  'geografia',
  'historia',
  'cultura',
  'naturaleza',
  'curiosidades',
  'deportes',
  'gastronomia',
  'ciencia',
];

export const useGameEngine = ({ onGameBreak } = {}) => {
  const [gameState, setGameState] = useState(GAME_STATES.HOME);
  const [gameMode, setGameMode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [factCategories, setFactCategories] = useState(DEFAULT_FACT_CATEGORIES);
  const [imposterCount, setImposterCount] = useState(1);
  const [useHints, setUseHints] = useState(true);

  const [roles, setRoles] = useState([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [secretWord, setSecretWord] = useState(null);
  const [currentHint, setCurrentHint] = useState('');
  const [eliminatedInfo, setEliminatedInfo] = useState(null);
  const [winner, setWinner] = useState(null);
  const [roundNumber, setRoundNumber] = useState(1);

  const selectGameMode = useCallback((mode) => {
    setGameMode(mode);
    setGameState(GAME_STATES.CONFIG);
  }, []);

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

  const toggleFactCategory = useCallback((categoryId) => {
    setFactCategories((prev) => {
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

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const shuffledAvatars = [...AVATARS].sort(() => Math.random() - 0.5);

    if (gameMode === GAME_MODES.CLASSIC) {
      const wordData = getRandomWord(categories);
      setSecretWord(wordData);
      setCurrentHint(useHints ? getHintForWord(wordData.categoryId, wordData.word) : '');

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
    } else if (gameMode === GAME_MODES.RANDOM_FACT) {
      const preparedRoles = [];
      let impostorAssigned = 0;

      shuffledPlayers.forEach((player, index) => {
        const isImposter = impostorAssigned < imposterCount;
        if (isImposter) impostorAssigned++;

        let factData = null;
        if (!isImposter) {
          factData = getRandomFact(factCategories);
        }

        preparedRoles.push({
          name: player,
          isImposter,
          fact: isImposter ? null : factData?.fact,
          category: factData?.category?.toUpperCase() || 'DATO RANDOM',
          icon: factData?.icon || '🇦🇷',
          hasRevealed: false,
          isEliminated: false,
          avatar: shuffledAvatars[index],
          hasSharedFact: false,
        });
      });

      setRoles(preparedRoles.sort(() => Math.random() - 0.5));
    }

    setCurrentRevealIndex(0);
    setEliminatedInfo(null);
    setWinner(null);
    setRoundNumber(1);
    setGameState(GAME_STATES.REVEAL);
    return true;
  }, [gameMode, categories, factCategories, imposterCount, players, useHints]);

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
        if (gameMode === GAME_MODES.RANDOM_FACT) {
          setGameState(GAME_STATES.DISCUSSION);
        } else {
          setGameState(GAME_STATES.VOTING);
        }
      }

      return updated;
    });
  }, [currentRevealIndex, gameMode]);

  const markFactShared = useCallback((playerName) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.name === playerName ? { ...role, hasSharedFact: true } : role
      )
    );
  }, []);

  const allFactsShared = useCallback(() => {
    return roles.every((role) => role.isEliminated || role.hasSharedFact);
  }, [roles]);

  const startVoting = useCallback(() => {
    setGameState(GAME_STATES.VOTING);
  }, []);

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
    if (gameMode === GAME_MODES.RANDOM_FACT) {
      setGameState(GAME_STATES.DISCUSSION);
    } else {
      setGameState(GAME_STATES.VOTING);
    }
  }, [onGameBreak, roles, gameMode]);

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
    setGameState(GAME_STATES.HOME);
    setGameMode(null);
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
    gameMode,
    selectGameMode,
    players,
    addPlayer,
    removePlayer,
    categories,
    toggleCategory,
    factCategories,
    toggleFactCategory,
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
    markFactShared,
    allFactsShared,
    startVoting,
  };
};