import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowLeft,
  FaBullhorn,
  FaEyeSlash,
  FaHandshake,
  FaShieldHalved,
  FaSkull,
  FaTrophy,
  FaTriangleExclamation,
  FaUserSecret,
  FaComments,
} from 'react-icons/fa6';
import { FaRandom } from 'react-icons/fa';
import './App.css';
import './styles/animations.css';
import { CATEGORIES } from './data/words';
import { FACT_CATEGORIES } from './data/facts';
import { AVATARS } from './assets/avatars';
import samidViale from './assets/samid_viale.png';
import image1 from './assets/image1.png';
import image2 from './assets/image2.png';
import { GAME_STATES, GAME_MODES, useGameEngine } from './hooks/useGameEngine';
import { PageTransition, StaggerContainer, StaggerItem } from './components/PageTransition';
import { Button3D, GlowButton } from './components/ui/Button3D';
import { Card3D } from './components/ui/Card3D';
import { useConfetti } from './components/effects/ConfettiEffect';
import { FloatingParticles, FloatingIcon, PulseGlow } from './components/effects/FloatingParticles';
import { Tooltip } from './components/ui/Tooltip';

function GameHeader({ subtitle, onBack, dark = false }) {
  return (
    <header className={`game-header ${dark ? 'dark' : ''}`}>
      <div className="flag-stripe" />
      <div className="game-header-inner">
        <button type="button" className="header-back" onClick={onBack} disabled={!onBack} aria-label="Volver">
          {onBack ? <FaArrowLeft /> : null}
        </button>
        <div className="header-title">
          <p>EL IMPOSTOR</p>
          <h1>ARGENTINO</h1>
          {subtitle ? <span>{subtitle}</span> : null}
        </div>
        <div className="header-back spacer" />
      </div>
    </header>
  );
}

function ModeSelectScreen({ gameEngine }) {
  const { selectGameMode } = gameEngine;

  return (
    <section className="screen mode-select-screen">
      <FloatingParticles count={15} className="screen-particles" />
      <motion.div 
        className="panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="mode-hero"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="mode-hero-content">
            <FloatingIcon icon={<img src={image1} alt="Impostor" />} size={50}>
              </FloatingIcon>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Elegi el modo de juego
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Cada modo tiene sus propias reglas y mecanicas
            </motion.p>
          </div>
        </motion.div>

        <StaggerContainer delay={0.2} stagger={0.1}>
          <div className="mode-cards">
            <StaggerItem>
              <motion.button
                type="button"
                className="mode-card classic-mode"
                onClick={() => selectGameMode(GAME_MODES.CLASSIC)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="mode-card-icon">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaUserSecret />
                  </motion.div>
                </div>
                <h3>Modo Clasico</h3>
                <p>El original: Un jugador es el impostor y debe adivinar la palabra secreta mientras los demas la conocen.</p>
                <ul className="mode-features">
                  <li>Palabra secreta para civiles</li>
                  <li>Impostor recibe pista</li>
                  <li>Votacion por sospechoso</li>
                </ul>
                <span className="mode-tag">Original</span>
              </motion.button>
            </StaggerItem>

            <StaggerItem>
              <motion.button
                type="button"
                className="mode-card fact-mode"
                onClick={() => selectGameMode(GAME_MODES.RANDOM_FACT)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="mode-card-icon">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <FaRandom />
                  </motion.div>
                </div>
                <h3>Dato Random</h3>
                <p>Cada jugador recibe un dato real de Argentina. El impostor debe inventar un dato convincente para no ser descubierto.</p>
                <ul className="mode-features">
                  <li>Datos reales de Argentina</li>
                  <li>Impostor inventa su dato</li>
                  <li>Detecta al mentiroso</li>
                </ul>
                <span className="mode-tag new">Nuevo</span>
              </motion.button>
            </StaggerItem>
          </div>
        </StaggerContainer>

        <motion.div 
          className="mode-info-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4>Como funciona Dato Random?</h4>
          <div className="mode-info-steps">
            {[1, 2, 3, 4].map((num, idx) => (
              <motion.div 
                key={num}
                className="mode-info-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
              >
                <motion.span 
                  className="step-number"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                >
                  {num}
                </motion.span>
                <p>{['Cada jugador NO impostor recibe un dato real de Argentina', 'El impostor debe inventar un dato que suene creible', 'Todos comparten su dato en la ronda de discusion', 'Voten al jugador que crean que esta mintiendo'][idx]}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ConfigScreen({ gameEngine, onHome }) {
  const {
    gameMode,
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
    startGame,
  } = gameEngine;

  const [playerInput, setPlayerInput] = useState('');
  const [error, setError] = useState('');
  const canStart = players.length >= 3;

  const categoryOptions = useMemo(
    () =>
      Object.values(CATEGORIES).map((category) => ({
        id: category.id,
        name: category.name,
        icon: category.icon,
      })),
    [],
  );

  const factCategoryOptions = useMemo(
    () =>
      Object.values(FACT_CATEGORIES).map((category) => ({
        id: category.id,
        name: category.name,
        icon: category.icon,
      })),
    [],
  );

  const activeCategories = gameMode === GAME_MODES.RANDOM_FACT ? factCategories : categories;
  const activeToggle = gameMode === GAME_MODES.RANDOM_FACT ? toggleFactCategory : toggleCategory;
  const activeCategoryOptions = gameMode === GAME_MODES.RANDOM_FACT ? factCategoryOptions : categoryOptions;

  const addPlayerSafe = useCallback(() => {
    if (!playerInput.trim()) {
      return;
    }

    const added = addPlayer(playerInput);
    if (!added) {
      setError(`Nombre repetido o maximo ${AVATARS.length} jugadores.`);
      return;
    }

    setPlayerInput('');
    setError('');
  }, [addPlayer, playerInput]);

  const handleStart = useCallback(() => {
    const ok = startGame();
    if (!ok) {
      setError('Se necesitan minimo 3 jugadores para arrancar.');
    }
  }, [startGame]);

  const modeLabel = gameMode === GAME_MODES.RANDOM_FACT ? 'Dato Random' : 'Clasico';

  return (
    <section className="screen config-screen">
      <motion.div 
        className="panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="config-hero" 
          style={{ backgroundImage: `url(${image1})` }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="config-hero-mask" />
          <div className="config-hero-content">
            <motion.img 
              src={image1} 
              alt="Impostor" 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div>
              <p className="hero-eyebrow">Previa de partida</p>
              <h3>Arma la mesa y que arranque el bardo</h3>
              <motion.span 
                className="mode-badge"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {modeLabel}
              </motion.span>
            </div>
          </div>
          <div className="config-hero-pills">
            <motion.span
              key={players.length}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
            >
              {players.length} jugadores
            </motion.span>
            <motion.span
              key={activeCategories.length}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
            >
              {activeCategories.length} categorias
            </motion.span>
            <span>{imposterCount} impostor(es)</span>
          </div>
        </motion.div>

        <div className="panel-title-row">
          <h3>Configurar partida</h3>
          <motion.button 
            type="button" 
            className="ghost-btn" 
            onClick={onHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Limpiar
          </motion.button>
        </div>

        <div className="config-block">
          <h4>Jugadores</h4>
          <div className="players-list">
            <AnimatePresence>
              {players.map((player, idx) => (
                <motion.div 
                  className="player-chip" 
                  key={player}
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <span>{player}</span>
                  <motion.button 
                    type="button" 
                    onClick={() => removePlayer(player)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    x
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div 
            className="add-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.input
              value={playerInput}
              onChange={(event) => setPlayerInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  addPlayerSafe();
                }
              }}
              placeholder="Nombre del jugador"
              whileFocus={{ scale: 1.01, boxShadow: '0 0 0 3px rgba(38, 148, 232, 0.2)' }}
            />
            <motion.button 
              type="button" 
              className="secondary-btn" 
              onClick={addPlayerSafe}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Agregar
            </motion.button>
          </motion.div>
        </div>

        {gameMode === GAME_MODES.CLASSIC && (
          <motion.div 
            className="split-grid config-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inner-card">
              <h4>Impostores</h4>
              <div className="chip-row">
                {[1, 2, 3].map((count) => (
                  <motion.button
                    type="button"
                    key={count}
                    className={`chip-btn ${imposterCount === count ? 'active' : ''}`}
                    onClick={() => setImposterCount(count)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {count}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="inner-card">
              <h4>Pistas</h4>
              <div className="chip-row">
                <motion.button
                  type="button"
                  className={`chip-btn ${useHints ? 'active' : ''}`}
                  onClick={() => setUseHints(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Si
                </motion.button>
                <motion.button
                  type="button"
                  className={`chip-btn ${!useHints ? 'danger' : ''}`}
                  onClick={() => setUseHints(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  No
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {gameMode === GAME_MODES.RANDOM_FACT && (
          <motion.div 
            className="split-grid config-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inner-card">
              <h4>Impostores</h4>
              <div className="chip-row">
                {[1, 2, 3].map((count) => (
                  <motion.button
                    type="button"
                    key={count}
                    className={`chip-btn ${imposterCount === count ? 'active' : ''}`}
                    onClick={() => setImposterCount(count)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {count}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="inner-card info-card">
              <h4>Dato Real</h4>
              <p className="info-text">Los jugadores reciben datos reales de Argentina</p>
            </div>
          </motion.div>
        )}

        <div className="config-block">
          <h4>{gameMode === GAME_MODES.RANDOM_FACT ? 'Categorias de Datos' : 'Categorias'}</h4>
          <StaggerContainer stagger={0.05}>
            <div className="category-grid">
              {activeCategoryOptions.map((category) => (
                <StaggerItem key={category.id}>
                  <motion.button
                    type="button"
                    className={`category-card ${activeCategories.includes(category.id) ? 'selected' : ''}`}
                    onClick={() => activeToggle(category.id)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span
                      animate={activeCategories.includes(category.id) ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {category.icon}
                    </motion.span>
                    <strong>{category.name}</strong>
                  </motion.button>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>

        <AnimatePresence>
          {!!error && (
            <motion.p 
              className="error-line"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <GlowButton onClick={handleStart} pulse={canStart} disabled={!canStart}>
          <FaBullhorn /> Empezar partida
        </GlowButton>
      </motion.div>
    </section>
  );
}

function RevealScreen({ gameEngine }) {
  const { roles, currentRevealIndex, nextReveal, setGameState, roundNumber, useHints, currentHint, gameMode } = gameEngine;
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasSeenWord, setHasSeenWord] = useState(false);
  const [showRoundInfo, setShowRoundInfo] = useState(false);
  const [roundStartData, setRoundStartData] = useState({ starter: '', direction: '' });

  const currentPlayer = roles[currentRevealIndex];
  if (!currentPlayer) {
    return null;
  }

  const activeRoles = roles.filter((role) => !role.isEliminated);
  const remainingActiveToReveal = activeRoles.filter(
    (role) => !role.hasRevealed && role.name !== currentPlayer.name,
  );

  const handleNext = () => {
    if (!hasSeenWord) {
      return;
    }

    if (remainingActiveToReveal.length === 0) {
      const starter = activeRoles[Math.floor(Math.random() * activeRoles.length)].name;
      const direction = Math.random() > 0.5 ? 'Hacia la derecha' : 'Hacia la izquierda';
      setRoundStartData({ starter, direction });
      setShowRoundInfo(true);
      return;
    }

    setIsRevealed(false);
    setHasSeenWord(false);
    nextReveal();
  };

  const isRandomFactMode = gameMode === GAME_MODES.RANDOM_FACT;

  if (showRoundInfo) {
    return (
      <section className="screen reveal-screen">
        <motion.div 
          className="panel round-start-panel dramatic-panel"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p 
            className="pill"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FaShieldHalved /> Arranca la ronda
          </motion.p>
          <p className="round-start-kicker">Banca un toque y miren esto</p>
          <motion.h3 
            className="round-start-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Quien abre la ronda
          </motion.h3>
          <motion.div 
            className="starter-spotlight"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <p className="round-start-label">Empieza</p>
            <h4>{roundStartData.starter}</h4>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {roundStartData.direction}
            </motion.span>
          </motion.div>
          <motion.div 
            className="round-start-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="round-start-card">
              <p className="round-start-label">Regla</p>
              <strong>{isRandomFactMode ? 'Comparte tu dato sin revelar si es real' : 'Hablen sin decir la palabra secreta'}</strong>
            </div>
            <div className="round-start-card">
              <p className="round-start-label">Sentido</p>
              <strong>{roundStartData.direction}</strong>
            </div>
          </motion.div>
          <motion.p 
            className="round-start-tip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isRandomFactMode 
              ? 'Cada jugador cuenta su dato. El impostor debe inventar uno convincente.'
              : 'Describan la palabra sin decirla. El impostor tiene que chamuyar.'}
          </motion.p>
          <GlowButton onClick={() => setGameState(isRandomFactMode ? GAME_STATES.DISCUSSION : GAME_STATES.VOTING)}>
            <FaHandshake /> {isRandomFactMode ? 'Empezar discusion' : 'Empezar ronda'}
          </GlowButton>
        </motion.div>
      </section>
    );
  }

  const getCardStyle = () => {
    if (isRandomFactMode) {
      return currentPlayer.isImposter && isRevealed ? 'imposter' : 'citizen';
    }
    return currentPlayer.isImposter && isRevealed ? 'imposter' : 'citizen';
  };

  return (
    <section className="screen reveal-screen">
      <motion.div 
        className="panel reveal-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.p 
          className="instruction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Turno de <strong>{currentPlayer.name.toUpperCase()}</strong>. Que nadie mire la pantalla.
        </motion.p>
        <motion.p 
          className="category-badge"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isRandomFactMode ? (
            <>
              {currentPlayer.icon} {currentPlayer.category}
            </>
          ) : (
            `Categoria: ${currentPlayer.category}`
          )}
        </motion.p>

        {gameMode === GAME_MODES.CLASSIC && (
          <motion.div 
            className={`hint-card ${useHints && currentPlayer.isImposter && isRevealed ? '' : 'placeholder'}`}
            animate={{ scale: isRevealed && useHints && currentPlayer.isImposter ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {useHints && currentPlayer.isImposter && isRevealed ? (
              <>
                <strong>Pista:</strong> {currentHint}
              </>
            ) : (
              <span className="hint-empty">Pista reservada</span>
            )}
          </motion.div>
        )}

        <motion.div
          className={`reveal-card-3d reveal-card-3d-${getCardStyle()}`}
          onClick={() => {
            setIsRevealed((prev) => {
              const next = !prev;
              if (next) {
                setHasSeenWord(true);
              }
              return next;
            });
          }}
          initial={false}
          animate={{ 
            rotateY: isRevealed ? 180 : 0,
            scale: isRevealed ? 0.98 : 1
          }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
          whileHover={{ scale: isRevealed ? 0.98 : 1.02 }}
          whileTap={{ scale: 0.96 }}
        >
          <div className="reveal-card-3d-face reveal-card-3d-front">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="reveal-card-icon">👁️</span>
            </motion.div>
            <span className="reveal-card-hint">Toca para revelar</span>
          </div>
          
          <div className="reveal-card-3d-face reveal-card-3d-back">
            <span className="reveal-card-role">
              {currentPlayer.isImposter ? '👹 Impostor' : '✅ Ciudadano'}
            </span>
            {!isRandomFactMode ? (
              <>
                <h4 className="reveal-card-word">
                  {currentPlayer.isImposter ? 'Adivina la palabra...' : currentPlayer.word}
                </h4>
                {useHints && currentPlayer.isImposter && currentHint && (
                  <span className="reveal-card-hint-text">💡 {currentHint}</span>
                )}
              </>
            ) : (
              <>
                {currentPlayer.isImposter ? (
                  <>
                    <h4 className="reveal-card-word">Inventa un dato</h4>
                    <span className="reveal-card-hint-text">Que suene convinente de Argentina</span>
                  </>
                ) : (
                  <>
                    <h4 className="reveal-card-fact">{currentPlayer.fact}</h4>
                  </>
                )}
              </>
            )}
          </div>
        </motion.div>

        <motion.button 
          type="button" 
          className="secondary-btn" 
          onClick={handleNext} 
          disabled={!hasSeenWord}
          whileHover={hasSeenWord ? { scale: 1.02 } : {}}
          whileTap={hasSeenWord ? { scale: 0.98 } : {}}
        >
          Confirmar vista
        </motion.button>

        <motion.p 
          className="round-pill"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Ronda {roundNumber}
        </motion.p>
      </motion.div>
    </section>
  );
}

function DiscussionScreen({ gameEngine }) {
  const { roles, markFactShared, startVoting, roundNumber } = gameEngine;
  const [sharedPlayers, setSharedPlayers] = useState(new Set());

  const activePlayers = roles.filter((role) => !role.isEliminated);

  const handleShareFact = (playerName) => {
    setSharedPlayers((prev) => new Set([...prev, playerName]));
    markFactShared(playerName);
  };

  const canStartVoting = sharedPlayers.size === activePlayers.length;
  const progressPercent = (sharedPlayers.size / activePlayers.length) * 100;

  return (
    <section className="screen discussion-screen">
      <motion.div 
        className="panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="panel-title-row">
          <h3><FaComments /> Discusion - Ronda {roundNumber}</h3>
        </div>

        <motion.p 
          className="discussion-instruction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Cada jugador comparte su dato. Cuando todos terminen, pasen a votacion.
        </motion.p>

        <StaggerContainer stagger={0.08}>
          <div className="discussion-grid">
            {activePlayers.map((player) => {
              const hasShared = sharedPlayers.has(player.name);
              return (
                <StaggerItem key={player.name}>
                  <motion.div
                    className={`discussion-card ${hasShared ? 'shared' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.img 
                      src={player.avatar} 
                      alt={player.name} 
                      className="discussion-avatar"
                      animate={hasShared ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="discussion-info">
                      <strong>{player.name}</strong>
                      <AnimatePresence mode="wait">
                        {hasShared ? (
                          <motion.span 
                            className="fact-badge"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            {player.icon || '🇦🇷'} Dato compartido
                          </motion.span>
                        ) : (
                          <motion.span 
                            className="pending-badge"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Pendiente
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {!hasShared && (
                      <motion.button
                        type="button"
                        className="share-btn"
                        onClick={() => handleShareFact(player.name)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Compartir
                      </motion.button>
                    )}
                  </motion.div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>

        <div className="discussion-progress">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span>{sharedPlayers.size} de {activePlayers.length} compartieron</span>
        </div>

        <GlowButton onClick={startVoting} disabled={!canStartVoting} pulse={canStartVoting}>
          <FaHandshake /> Ir a votacion
        </GlowButton>
      </motion.div>
    </section>
  );
}

function VotingScreen({ gameEngine }) {
  const { roles, votePlayer, roundNumber, gameMode } = gameEngine;

  const isRandomFactMode = gameMode === GAME_MODES.RANDOM_FACT;

  return (
    <section className="screen voting-screen">
      <motion.div 
        className="panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="panel-title-row">
          <h3>Votacion - Ronda {roundNumber}</h3>
          {isRandomFactMode && (
            <motion.span 
              className="mode-indicator"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Detecta al mentiroso
            </motion.span>
          )}
        </div>

        {isRandomFactMode && (
          <motion.p 
            className="voting-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Vota al jugador que creas que invento su dato. El impostor no tiene un dato real de Argentina.
          </motion.p>
        )}

        <StaggerContainer stagger={0.05}>
          <div className="portrait-grid">
            {roles.map((player) => (
              <StaggerItem key={player.name}>
                <motion.div 
                  className={`portrait-card ${player.isEliminated ? 'eliminated' : ''}`}
                  whileHover={player.isEliminated ? {} : { scale: 1.02, y: -4 }}
                  whileTap={player.isEliminated ? {} : { scale: 0.98 }}
                >
                  <motion.img 
                    src={player.avatar} 
                    alt={player.name}
                    animate={player.isEliminated ? { filter: 'grayscale(100%)' } : {}}
                  />
                  <div>
                    <strong>{player.name}</strong>
                    <small>{player.isEliminated ? 'Eliminado' : 'Activo'}</small>
                  </div>
                  <motion.button
                    type="button"
                    className="secondary-btn"
                    disabled={player.isEliminated}
                    onClick={() => votePlayer(player.name)}
                    whileHover={player.isEliminated ? {} : { scale: 1.05 }}
                    whileTap={player.isEliminated ? {} : { scale: 0.95 }}
                  >
                    {player.isEliminated ? 'Fuera' : 'Votar'}
                  </motion.button>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </motion.div>
    </section>
  );
}

function EliminationScreen({ gameEngine }) {
  const { eliminatedInfo, confirmElimination, roles, gameMode } = gameEngine;

  if (!eliminatedInfo) {
    return null;
  }

  const eliminatedPlayer = roles.find((role) => role.name === eliminatedInfo.name);
  const isImposter = eliminatedInfo.isImposter;
  const alivePlayers = roles.filter((role) => !role.isEliminated).length;
  const isRandomFactMode = gameMode === GAME_MODES.RANDOM_FACT;

  return (
    <section className="screen elimination-screen">
      <motion.div 
        className={`panel elimination-panel dramatic-panel ${isImposter ? 'danger' : 'safe'}`}
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <motion.div 
          className="elimination-glow"
          animate={isImposter ? {
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.p 
          className={`pill ${isImposter ? 'danger' : ''}`}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isImposter ? <FaSkull /> : <FaTriangleExclamation />} Eliminacion
        </motion.p>
        <motion.div 
          className="elimination-player"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          {eliminatedPlayer?.avatar ? (
            <motion.img 
              src={eliminatedPlayer.avatar} 
              alt={eliminatedPlayer.name}
              animate={{ 
                scale: [1, 1.05, 1],
                filter: isImposter ? ['grayscale(0%)', 'grayscale(0%)'] : ['grayscale(0%)', 'grayscale(30%)']
              }}
              transition={{ duration: 0.5 }}
            />
          ) : null}
          <p className="elimination-kicker">Se fue de la mesa</p>
          <motion.h3
            animate={isImposter ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {eliminatedInfo.name.toUpperCase()}
          </motion.h3>
        </motion.div>
        <motion.p 
          className="elimination-result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          {isImposter 
            ? (isRandomFactMode ? 'Estaba mintiendo.' : 'Era el impostor.') 
            : (isRandomFactMode ? 'Su dato era real.' : 'Era un ciudadano inocente.')}
        </motion.p>
        <motion.p 
          className="elimination-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {isImposter
            ? 'Gran votacion. Le cortaron el juego al infiltrado.'
            : 'Se equivocaron. El impostor sigue entre ustedes.'}
        </motion.p>
        <motion.div 
          className="elimination-meta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span>{alivePlayers} siguen en juego</span>
          <span>{isImposter ? 'Ventaja ciudadana' : 'Sigue la tension'}</span>
        </motion.div>
        <GlowButton onClick={confirmElimination} pulse>
          Continuar
        </GlowButton>
      </motion.div>
    </section>
  );
}

function ResultScreen({ gameEngine }) {
  const { winner, roles, secretWord, resetGame, roundNumber, gameMode } = gameEngine;
  const confettiFiredRef = useRef(false);
  const { fireArgentina, fireImposter } = useConfetti();
  
  const isCitizensWinner = winner === 'CITIZENS';
  const imposters = roles.filter((role) => role.isImposter);
  const backupWord = roles.find((role) => !role.isImposter)?.word;
  const displayWord = secretWord?.word || backupWord || '???';
  const eliminatedCount = roles.filter((role) => role.isEliminated).length;
  const isRandomFactMode = gameMode === GAME_MODES.RANDOM_FACT;

  useEffect(() => {
    if (!confettiFiredRef.current) {
      confettiFiredRef.current = true;
      if (isCitizensWinner) {
        fireArgentina();
      } else {
        fireImposter();
      }
    }
  }, [isCitizensWinner, fireArgentina, fireImposter]);

  return (
    <section className={`screen result-screen ${isCitizensWinner ? '' : 'dark'}`}>
      <FloatingParticles count={isCitizensWinner ? 30 : 0} className="result-particles" />
      <motion.div 
        className="panel result-panel dramatic-panel"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <motion.div 
          className={`result-hero ${isCitizensWinner ? 'citizens' : 'imposters'}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isCitizensWinner ? (
            <div className="citizen-win">
              <motion.div 
                className="citizen-cup"
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <FaTrophy />
                </motion.div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Ganaron los ciudadanos
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                La mesa detecto al infiltrado a tiempo.
              </motion.p>
            </div>
          ) : (
            <div className="impostor-win">
              <motion.img 
                src={samidViale} 
                alt="Impostor ganador"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                El chamuyo fue perfecto: el impostor sobrevivio.
              </motion.p>
            </div>
          )}
        </motion.div>
        <motion.p 
          className="result-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {isCitizensWinner ? 'Vamos Argentina' : 'Gano el impostor'}
        </motion.p>
        <motion.div 
          className="result-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="result-stat">
            <span>Ronda final</span>
            <strong>{roundNumber}</strong>
          </div>
          <div className="result-stat">
            <span>Eliminados</span>
            <strong>{eliminatedCount}</strong>
          </div>
        </motion.div>

        <StaggerContainer delay={0.9} stagger={0.1}>
          {imposters.map((imposter) => (
            <StaggerItem key={imposter.name}>
              <motion.div 
                className="imposter-row"
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <span><FaUserSecret /></span>
                <p>{imposter.name.toUpperCase()}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {!isRandomFactMode && (
          <motion.p 
            className="secret-word"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Palabra secreta: {displayWord.toUpperCase()}
          </motion.p>
        )}

        <motion.div 
          className="result-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <GlowButton onClick={resetGame} pulse>
            Revancha
          </GlowButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

function App() {
  const gameEngine = useGameEngine();

  let screen = null;
  let subtitle = '';
  let darkHeader = false;
  let backHandler = gameEngine.goHome;
  let isDramatic = false;

  if (gameEngine.gameState === GAME_STATES.HOME) {
    screen = <ModeSelectScreen gameEngine={gameEngine} />;
    subtitle = '';
    backHandler = null;
  } else if (gameEngine.gameState === GAME_STATES.CONFIG) {
    screen = <ConfigScreen gameEngine={gameEngine} onHome={gameEngine.goHome} />;
    subtitle = 'Configuracion';
  } else if (gameEngine.gameState === GAME_STATES.REVEAL) {
    screen = <RevealScreen gameEngine={gameEngine} />;
    subtitle = gameEngine.roundNumber > 1 ? `Ronda ${gameEngine.roundNumber}` : 'Tu palabra secreta';
    backHandler = null;
  } else if (gameEngine.gameState === GAME_STATES.DISCUSSION) {
    screen = <DiscussionScreen gameEngine={gameEngine} />;
    subtitle = 'Discusion';
    backHandler = null;
  } else if (gameEngine.gameState === GAME_STATES.VOTING) {
    screen = <VotingScreen gameEngine={gameEngine} />;
    subtitle = 'Votacion';
    backHandler = null;
  } else if (gameEngine.gameState === GAME_STATES.ELIMINATION) {
    screen = <EliminationScreen gameEngine={gameEngine} />;
    subtitle = 'Eliminacion';
    backHandler = null;
    isDramatic = true;
  } else if (gameEngine.gameState === GAME_STATES.RESULT) {
    screen = <ResultScreen gameEngine={gameEngine} />;
    subtitle = 'Partida finalizada';
    darkHeader = gameEngine.winner === 'IMPOSTERS';
    isDramatic = true;
  }

  return (
    <div className="phone-viewport">
      <main className="app-shell">
        <GameHeader subtitle={subtitle} onBack={backHandler} dark={darkHeader} />
        <PageTransition stateKey={gameEngine.gameState} dramatic={isDramatic}>
          {screen}
        </PageTransition>
      </main>
    </div>
  );
}

export default App;