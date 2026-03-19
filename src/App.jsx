import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
} from 'react-icons/fa6';
import './App.css';
import { CATEGORIES } from './data/words';
import { AVATARS } from './assets/avatars';
import samidViale from './assets/samid_viale.png';
import mainRoom from './assets/main_room.jpg';
import mateIcon from './assets/mate_icon.png';
import loadingVideo from './assets/animacion-completa.mp4';
import { GAME_STATES, useGameEngine } from './hooks/useGameEngine';

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

function ConfigScreen({ gameEngine, onHome }) {
  const {
    players,
    addPlayer,
    removePlayer,
    categories,
    toggleCategory,
    imposterCount,
    setImposterCount,
    useHints,
    setUseHints,
    startGame,
  } = gameEngine;

  const [playerInput, setPlayerInput] = useState('');
  const [error, setError] = useState('');

  const categoryOptions = useMemo(
    () =>
      Object.values(CATEGORIES).map((category) => ({
        id: category.id,
        name: category.name,
        icon: category.icon,
      })),
    [],
  );

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

  return (
    <section className="screen config-screen">
      <div className="panel">
        <div className="config-hero" style={{ backgroundImage: `url(${mainRoom})` }}>
          <div className="config-hero-mask" />
          <div className="config-hero-content">
            <img src={mateIcon} alt="Mate" />
            <div>
              <p className="hero-eyebrow">Previa de partida</p>
              <h3>Arma la mesa y que arranque el bardo</h3>
            </div>
          </div>
          <div className="config-hero-pills">
            <span>{players.length} jugadores</span>
            <span>{categories.length} categorias</span>
            <span>{imposterCount} impostor(es)</span>
          </div>
        </div>

        <div className="panel-title-row">
          <h3>Configurar partida</h3>
          <button type="button" className="ghost-btn" onClick={onHome}>
            Limpiar
          </button>
        </div>

        <div className="config-block">
          <h4>Jugadores</h4>
          <div className="players-list">
            {players.map((player) => (
              <div className="player-chip" key={player}>
                <span>{player}</span>
                <button type="button" onClick={() => removePlayer(player)}>
                  x
                </button>
              </div>
            ))}
          </div>

          <div className="add-row">
            <input
              value={playerInput}
              onChange={(event) => setPlayerInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  addPlayerSafe();
                }
              }}
              placeholder="Nombre del jugador"
            />
            <button type="button" className="secondary-btn" onClick={addPlayerSafe}>
              Agregar
            </button>
          </div>
        </div>

        <div className="split-grid config-block">
          <div className="inner-card">
            <h4>Impostores</h4>
            <div className="chip-row">
              {[1, 2, 3].map((count) => (
                <button
                  type="button"
                  key={count}
                  className={`chip-btn ${imposterCount === count ? 'active' : ''}`}
                  onClick={() => setImposterCount(count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="inner-card">
            <h4>Pistas</h4>
            <div className="chip-row">
              <button
                type="button"
                className={`chip-btn ${useHints ? 'active' : ''}`}
                onClick={() => setUseHints(true)}
              >
                Si
              </button>
              <button
                type="button"
                className={`chip-btn ${!useHints ? 'danger' : ''}`}
                onClick={() => setUseHints(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>

        <div className="config-block">
          <h4>Categorias</h4>
          <div className="category-grid">
            {categoryOptions.map((category) => (
              <button
                type="button"
                key={category.id}
                className={`category-card ${categories.includes(category.id) ? 'selected' : ''}`}
                onClick={() => toggleCategory(category.id)}
              >
                <span>{category.icon}</span>
                <strong>{category.name}</strong>
              </button>
            ))}
          </div>
        </div>

        {!!error && <p className="error-line">{error}</p>}

        <button type="button" className="primary-btn" onClick={handleStart}>
          <FaBullhorn /> Empezar partida
        </button>
      </div>
    </section>
  );
}

function RevealScreen({ gameEngine }) {
  const { roles, currentRevealIndex, nextReveal, setGameState, roundNumber, useHints, currentHint } = gameEngine;
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

  if (showRoundInfo) {
    return (
      <section className="screen reveal-screen">
        <div className="panel round-start-panel dramatic-panel">
          <p className="pill"><FaShieldHalved /> Arranca la ronda</p>
          <p className="round-start-kicker">Banca un toque y miren esto</p>
          <h3 className="round-start-title">Quien abre la ronda</h3>
          <div className="starter-spotlight">
            <p className="round-start-label">Empieza</p>
            <h4>{roundStartData.starter}</h4>
            <span>{roundStartData.direction}</span>
          </div>
          <div className="round-start-grid">
            <div className="round-start-card">
              <p className="round-start-label">Regla</p>
              <strong>Hablen sin decir la palabra secreta</strong>
            </div>
            <div className="round-start-card">
              <p className="round-start-label">Sentido</p>
              <strong>{roundStartData.direction}</strong>
            </div>
          </div>
          <p className="round-start-tip">Describan la palabra sin decirla. El impostor tiene que chamuyar.</p>
          <button type="button" className="primary-btn" onClick={() => setGameState(GAME_STATES.VOTING)}>
            <FaHandshake /> Empezar ronda
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="screen reveal-screen">
      <div className="panel reveal-panel">
        <p className="instruction">
          Turno de <strong>{currentPlayer.name.toUpperCase()}</strong>. Que nadie mire la pantalla.
        </p>
        <p className="category-badge">Categoria: {currentPlayer.category}</p>

        <div className={`hint-card ${useHints && currentPlayer.isImposter && isRevealed ? '' : 'placeholder'}`}>
          {useHints && currentPlayer.isImposter && isRevealed ? (
            <>
              <strong>Pista:</strong> {currentHint}
            </>
          ) : (
            <span className="hint-empty">Pista reservada</span>
          )}
        </div>

        <button
          type="button"
          className={`reveal-card ${isRevealed ? 'holding' : ''} ${currentPlayer.isImposter && isRevealed ? 'imposter' : ''}`}
          onClick={() => {
            setIsRevealed((prev) => {
              const next = !prev;
              if (next) {
                setHasSeenWord(true);
              }
              return next;
            });
          }}
        >
          {!isRevealed ? (
            <>
              <p className="small">Click para revelar</p>
              <h4><FaEyeSlash /></h4>
            </>
          ) : (
            <>
              <p className="small">{currentPlayer.isImposter ? 'Sos el impostor' : 'Sos inocente'}</p>
              <h4>{currentPlayer.isImposter ? 'Adivina la palabra' : currentPlayer.word}</h4>
            </>
          )}
        </button>

        <button type="button" className="secondary-btn" onClick={handleNext} disabled={!hasSeenWord}>
          Confirmar vista
        </button>

        <p className="round-pill">Ronda {roundNumber}</p>
      </div>
    </section>
  );
}

function VotingScreen({ gameEngine }) {
  const { roles, votePlayer, setGameState, roundNumber } = gameEngine;

  return (
    <section className="screen voting-screen">
      <div className="panel">
        <div className="panel-title-row">
          <h3>Votacion - Ronda {roundNumber}</h3>
          <button type="button" className="ghost-btn" onClick={() => setGameState(GAME_STATES.REVEAL)}>
            Volver
          </button>
        </div>

        <div className="portrait-grid">
          {roles.map((player) => (
            <div className={`portrait-card ${player.isEliminated ? 'eliminated' : ''}`} key={player.name}>
              <img src={player.avatar} alt={player.name} />
              <div>
                <strong>{player.name}</strong>
                <small>{player.isEliminated ? 'Eliminado' : 'Activo'}</small>
              </div>
              <button
                type="button"
                className="secondary-btn"
                disabled={player.isEliminated}
                onClick={() => votePlayer(player.name)}
              >
                {player.isEliminated ? 'Fuera' : 'Votar'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EliminationScreen({ gameEngine }) {
  const { eliminatedInfo, confirmElimination, roles } = gameEngine;

  if (!eliminatedInfo) {
    return null;
  }

  const eliminatedPlayer = roles.find((role) => role.name === eliminatedInfo.name);
  const isImposter = eliminatedInfo.isImposter;
  const alivePlayers = roles.filter((role) => !role.isEliminated).length;

  return (
    <section className="screen elimination-screen">
      <div className={`panel elimination-panel dramatic-panel ${isImposter ? 'danger' : 'safe'}`}>
        <div className="elimination-glow" />
        <p className={`pill ${isImposter ? 'danger' : ''}`}>
          {isImposter ? <FaSkull /> : <FaTriangleExclamation />} Eliminacion
        </p>
        <div className="elimination-player">
          {eliminatedPlayer?.avatar ? <img src={eliminatedPlayer.avatar} alt={eliminatedPlayer.name} /> : null}
          <p className="elimination-kicker">Se fue de la mesa</p>
          <h3>{eliminatedInfo.name.toUpperCase()}</h3>
        </div>
        <p className="elimination-result">{isImposter ? 'Era el impostor.' : 'Era un ciudadano inocente.'}</p>
        <p className="elimination-text">
          {isImposter
            ? 'Gran votacion. Le cortaron el juego al infiltrado.'
            : 'Se equivocaron. El impostor sigue entre ustedes.'}
        </p>
        <div className="elimination-meta">
          <span>{alivePlayers} siguen en juego</span>
          <span>{isImposter ? 'Ventaja ciudadana' : 'Sigue la tension'}</span>
        </div>
        <button type="button" className="primary-btn" onClick={confirmElimination}>
          Continuar
        </button>
      </div>
    </section>
  );
}

function ResultScreen({ gameEngine }) {
  const { winner, roles, secretWord, resetGame, roundNumber } = gameEngine;
  const isCitizensWinner = winner === 'CITIZENS';
  const imposters = roles.filter((role) => role.isImposter);
  const backupWord = roles.find((role) => !role.isImposter)?.word;
  const displayWord = secretWord?.word || backupWord || '???';
  const eliminatedCount = roles.filter((role) => role.isEliminated).length;

  return (
    <section className={`screen result-screen ${isCitizensWinner ? '' : 'dark'}`}>
      <div className="panel result-panel dramatic-panel">
        <div className={`result-hero ${isCitizensWinner ? 'citizens' : 'imposters'}`}>
          {isCitizensWinner ? (
            <div className="citizen-win">
              <div className="citizen-cup">
                <FaTrophy />
              </div>
              <h3>Ganaron los ciudadanos</h3>
              <p>La mesa detecto al infiltrado a tiempo.</p>
            </div>
          ) : (
            <div className="impostor-win">
              <img src={samidViale} alt="Impostor ganador" />
              <p>El chamuyo fue perfecto: el impostor sobrevivio.</p>
            </div>
          )}
        </div>
        <p className="result-title">{isCitizensWinner ? 'Vamos Argentina' : 'Gano el impostor'}</p>
        <div className="result-summary">
          <div className="result-stat">
            <span>Ronda final</span>
            <strong>{roundNumber}</strong>
          </div>
          <div className="result-stat">
            <span>Eliminados</span>
            <strong>{eliminatedCount}</strong>
          </div>
        </div>

        {imposters.map((imposter) => (
          <div className="imposter-row" key={imposter.name}>
            <span><FaUserSecret /></span>
            <p>{imposter.name.toUpperCase()}</p>
          </div>
        ))}

        <p className="secret-word">Palabra secreta: {displayWord.toUpperCase()}</p>

        <div className="result-actions">
          <button type="button" className="primary-btn" onClick={resetGame}>
            Revancha
          </button>
        </div>
      </div>
    </section>
  );
}

function LoadingSplash() {
  return (
    <section className="screen loading-screen">
      <video className="loading-video" src={loadingVideo} autoPlay muted playsInline preload="auto" />
      <div className="loading-mask" />
      <div className="loading-badge">
        <img src={mateIcon} alt="Mate" />
        <p>Cargando partida...</p>
      </div>
    </section>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const gameEngine = useGameEngine();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3600);
    return () => clearTimeout(timer);
  }, []);

  let screen = <ConfigScreen gameEngine={gameEngine} onHome={gameEngine.goHome} />;
  let subtitle = 'Configuracion';
  let darkHeader = false;
  let backHandler = gameEngine.goHome;

  if (gameEngine.gameState === GAME_STATES.REVEAL) {
    screen = <RevealScreen gameEngine={gameEngine} />;
    subtitle = gameEngine.roundNumber > 1 ? `Ronda ${gameEngine.roundNumber}` : 'Tu palabra secreta';
    backHandler = null;
  } else if (gameEngine.gameState === GAME_STATES.VOTING) {
    screen = <VotingScreen gameEngine={gameEngine} />;
    subtitle = 'Votacion';
    backHandler = null;
  } else if (gameEngine.gameState === GAME_STATES.ELIMINATION) {
    screen = <EliminationScreen gameEngine={gameEngine} />;
    subtitle = 'Eliminacion';
    backHandler = null;
  } else if (gameEngine.gameState === GAME_STATES.RESULT) {
    screen = <ResultScreen gameEngine={gameEngine} />;
    subtitle = 'Partida finalizada';
    darkHeader = gameEngine.winner === 'IMPOSTERS';
    backHandler = gameEngine.goHome;
  }

  if (showSplash) {
    return (
      <div className="phone-viewport">
        <LoadingSplash />
      </div>
    );
  }

  return (
    <div className="phone-viewport">
      <main className="app-shell">
        <GameHeader subtitle={subtitle} onBack={backHandler} dark={darkHeader} />
        <div key={gameEngine.gameState} className="screen-transition">
          {screen}
        </div>
      </main>
    </div>
  );
}

export default App;
