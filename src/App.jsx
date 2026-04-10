import React, { useState, useEffect } from 'react';
import { generateRandomization, generateMCRandomization } from './utils/randomizeLogic';
import { valMaps, valComps, squadGames, valModes, mcData } from './utils/data';

const CustomSelect = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="custom-select-container" onMouseLeave={() => setIsOpen(false)}>
      <label>{label}</label>
      <div className={`custom-select ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{options.find(opt => opt.value === value).label}</span>
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map(opt => (
            <div
              key={opt.value}
              className={`custom-option ${value === opt.value ? 'selected' : ''}`}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('Valorant');

  const [mode, setMode] = useState('Agents');
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [results, setResults] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const [selectedGame, setSelectedGame] = useState(null);
  const [gamesList, setGamesList] = useState(squadGames);
  const [newGame, setNewGame] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelOffset, setReelOffset] = useState(0);
  const [reelList, setReelList] = useState([]);

  const [mcResult, setMcResult] = useState(null);
  const [isMcSpinning, setIsMcSpinning] = useState(false);
  const [mcPlayers, setMcPlayers] = useState([]);
  const [mcNewPlayer, setMcNewPlayer] = useState('');
  const [mcResults, setMcResults] = useState([]);
  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (players.length >= 5) return;
    if (newPlayer && !players.includes(newPlayer)) {
      setPlayers([...players, newPlayer]);
      setNewPlayer('');
    }
  };

  const handleRemovePlayer = (p) => {
    setPlayers(players.filter(player => player !== p));
  };

  const handleRandomizeValorant = () => {
    setResults([]);
    setSelectedMap(null);
    setSelectedMode(null);
    setTimeout(() => {
      const res = generateRandomization(mode, players);
      const generatedMap = valMaps[Math.floor(Math.random() * valMaps.length)];
      const generatedMode = valModes[Math.floor(Math.random() * valModes.length)];

      setResults(res);
      setSelectedMap(generatedMap);
      setSelectedMode(generatedMode);

      // Discord Webhook Dispatch
      const webhookUrl = "https://discord.com/api/webhooks/1485656369955602585/w-6IAeR3QGPEYb5cVsreQ0ba6E5cVFgJFUPUAHhPBPlRxiazliNspXg6kNPlImG93a0z";

      const fields = res.map(r => ({
        name: `👤 ${r.player}`,
        value: r.agent
          ? `**Agent:** ${r.agent}\n**Role:** ${r.role}\n**Pistol:** ${r.pistolWeapon}\n**Main:** ${r.mainWeapon}`
          : `**Role:** ${r.role}\n**Pistol:** ${r.pistolWeapon}\n**Main:** ${r.mainWeapon}`,
        inline: true
      }));

      fields.push({ name: "🗺️ Map", value: `**${generatedMap}**`, inline: true });
      fields.push({ name: "🎮 Mode", value: `**${generatedMode}**`, inline: true });

      const payload = {
        username: "ValoDraft",
        avatar_url: "https://img.icons8.com/color/512/valorant.png",
        embeds: [{
          title: "Valorant Team Composition",
          color: 16729685,
          fields: fields,
          footer: { text: "ValoDraft by </John>" },
          timestamp: new Date().toISOString()
        }]
      };

      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.error("Discord webhook failed", err));

    }, 50);
  };

  const handleAddGame = (e) => {
    e.preventDefault();
    if (newGame && !gamesList.includes(newGame)) {
      setGamesList([...gamesList, newGame]);
      setNewGame('');
    }
  };

  const handleRemoveGame = (g) => {
    setGamesList(gamesList.filter(game => game !== g));
  };

  const handleClearGames = () => {
    setGamesList([]);
  };

  const handleGameRandomize = () => {
    if (gamesList.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedGame(null);

    // Create a long ribbon (repeated list) for the reel effect
    const repeatCount = 10;
    const fullRibbon = [];
    for (let i = 0; i < repeatCount; i++) {
      fullRibbon.push(...[...gamesList].sort(() => Math.random() - 0.5));
    }

    const finalGameIndex = Math.floor(Math.random() * gamesList.length);
    const finalGame = gamesList[finalGameIndex];

    // Calculate the target game in the Ribbon (somewhere at the end)
    // We want to land on the 'finalGame' in the last repetition
    const totalItems = fullRibbon.length;
    const targetItemIndex = (repeatCount - 2) * gamesList.length + fullRibbon.slice((repeatCount - 2) * gamesList.length).findIndex(g => g === finalGame);

    setReelList(fullRibbon);

    // Small timeout to allow state to react before animating
    setTimeout(() => {
      const itemHeight = 120; // Matches CSS
      const targetOffset = targetItemIndex * itemHeight;
      setReelOffset(targetOffset);

      // Wait for animation to finish (matching CSS transition duration)
      setTimeout(() => {
        setSelectedGame(finalGame);
        setIsSpinning(false);
        // Reset offset for next time (instantly)
        setReelOffset(0);
        setReelList([]);
      }, 4000);
    }, 50);
  };

  const handleAddMcPlayer = (e) => {
    e.preventDefault();
    if (mcPlayers.length >= 8) return;
    if (mcNewPlayer && !mcPlayers.includes(mcNewPlayer)) {
      setMcPlayers([...mcPlayers, mcNewPlayer]);
      setMcNewPlayer('');
    }
  };

  const handleRemoveMcPlayer = (p) => {
    setMcPlayers(mcPlayers.filter(player => player !== p));
  };

  const handleRandomizeMagicChess = () => {
    if (mcPlayers.length === 0 || isMcSpinning) return;
    setIsMcSpinning(true);
    setMcResults([]);
    setTimeout(() => {
      const allResults = mcPlayers.map(player => ({
        player,
        ...generateMCRandomization()
      }));
      setMcResults(allResults);
      setIsMcSpinning(false);

      // Discord Webhook Dispatch for Magic Chess
      const webhookUrl = "https://discord.com/api/webhooks/1491834914188824717/K4m02Eoti_KkEfwpcxu-sJ9VBcHfdrjuTQRRZTCR8tMVsSuelnHD7QSfQrosLBZYuAwR";
      const payload = {
        username: "MagicDraft",
        avatar_url: "https://img.icons8.com/color/512/mobile-legends.png",
        embeds: [{
          title: "Magic Chess GoGo Draft",
          color: 3447003,
          fields: allResults.map(res => ({
            name: `👤 ${res.player}`,
            value: `**Commander:** ${res.commander}\n**Faction:** ${res.faction}\n**Role:** ${res.role}`,
            inline: true
          })),
          footer: { text: "MagicDraft by </John>" },
          timestamp: new Date().toISOString()
        }]
      };
      fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .catch(err => console.error("Discord webhook failed", err));
    }, 1500);
  };

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      {/* Background Watermark */}
      <div className="bg-watermark">{activeTab === 'Valorant' ? 'V' : 'G'}</div>

      <div className="top-nav" style={{ position: 'absolute', top: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: '30px', padding: '20px', zIndex: 10 }}>
        <button
          style={{ background: 'transparent', border: 'none', color: activeTab === 'Valorant' ? '#ff4655' : '#888', fontSize: '1.2rem', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', cursor: 'pointer', transition: 'color 0.2s', borderBottom: activeTab === 'Valorant' ? '3px solid #ff4655' : '3px solid transparent', paddingBottom: '5px' }}
          onClick={() => setActiveTab('Valorant')}
        >VALORANT SQUAD</button>
        <button
          style={{ background: 'transparent', border: 'none', color: activeTab === 'MagicChess' ? '#ff4655' : '#888', fontSize: '1.2rem', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', cursor: 'pointer', transition: 'color 0.2s', borderBottom: activeTab === 'MagicChess' ? '3px solid #ff4655' : '3px solid transparent', paddingBottom: '5px' }}
          onClick={() => setActiveTab('MagicChess')}
        >MAGIC CHESS</button>
        <button
          style={{ background: 'transparent', border: 'none', color: activeTab === 'Game' ? '#ff4655' : '#888', fontSize: '1.2rem', fontFamily: "'Oswald', sans-serif", letterSpacing: '2px', cursor: 'pointer', transition: 'color 0.2s', borderBottom: activeTab === 'Game' ? '3px solid #ff4655' : '3px solid transparent', paddingBottom: '5px' }}
          onClick={() => setActiveTab('Game')}
        >GAME ROULETTE</button>
      </div>

      {activeTab === 'Valorant' && (
        <>
          <div className="left-panel" style={{ marginTop: '40px' }}>
            <header>
              <div className="val-badge">VALORANT</div>
              <h1>AGENT SELECT</h1>
            </header>

            <div className="controls-panel">
              <div className="settings-row">
                <CustomSelect
                  label="MODE"
                  value={mode}
                  onChange={(newMode) => { setMode(newMode); setResults([]); setSelectedMap(null); setSelectedMode(null); }}
                  options={[
                    { value: 'Agents', label: 'Agents & Roles' },
                    { value: 'Roles', label: 'Roles Only' }
                  ]}
                />
              </div>

              <div className="players-section">
                <label>PARTY ({players.length}/5) <span className="meta-tag strict">COMPETITIVE</span></label>
                <form className="player-input-row" onSubmit={handleAddPlayer}>
                  <input
                    type="text"
                    placeholder={players.length >= 5 ? "Party full (Max 5)" : "Player name..."}
                    value={newPlayer}
                    onChange={(e) => setNewPlayer(e.target.value)}
                    disabled={players.length >= 5}
                  />
                  <button type="submit" className="btn-add" disabled={players.length >= 5}>+</button>
                </form>

                <div className="player-tags">
                  {players.map(p => (
                    <div key={p} className="player-tag">
                      {p}
                      <button type="button" onClick={() => handleRemovePlayer(p)} aria-label="Remove player">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              <button className="randomize-btn" onClick={handleRandomizeValorant} disabled={players.length === 0}>
                <span className="btn-text">LOCK IN</span>
                <span className="btn-glow"></span>
              </button>
            </div>

            <div className="meta-chances-panel">
              <label>COMP PROBABILITIES</label>
              <div className="meta-chances-list">
                {[...valComps].sort((a, b) => b.weight - a.weight).map((meta, i) => (
                  <div key={i} className="meta-chance-row">
                    <span className="meta-chance-label">{meta.label}</span>
                    <span className="meta-chance-number">{meta.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-panel" style={{ marginTop: '40px' }}>
            {results.length > 0 ? (
              <div className="results-container">
                <div className="results-header">TEAM COMPOSITION</div>
                <div className="results-grid">
                  {results.map((res, idx) => (
                    <div key={idx} className={`result-card delay-${idx}`}>
                      <div className="card-inner">
                        <div className="player-name">{res.player}</div>
                        <div className="assignment-details">
                          <div className="role-text">{res.role}</div>
                          {res.agent && <div className="agent-text">{res.agent}</div>}
                          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div className="weapon-text" style={{ fontSize: '0.8rem', color: '#ff4655', fontWeight: 'bold' }}>🔫 PISTOL: {res.pistolWeapon}</div>
                            <div className="weapon-text" style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>⚔️ MAIN: {res.mainWeapon}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {(selectedMap || selectedMode) && (
                  <div className="extra-info-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px', marginTop: '20px' }}>
                    {selectedMap && (
                      <div className="theater-section delay-6">
                        <div className="theater-label">MAP</div>
                        <div className="theater-card" style={{ height: '100%', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div className="theater-name">{selectedMap}</div>
                        </div>
                      </div>
                    )}
                    {selectedMode && (
                      <div className="theater-section delay-7">
                        <div className="theater-label">MODE</div>
                        <div className="theater-card" style={{ height: '100%', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div className="theater-name" style={{ color: '#ff4655', fontSize: '1.5rem' }}>{selectedMode}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">⏳</div>
                <div>IN QUEUE...</div>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'MagicChess' && (
        <>
          <div className="left-panel" style={{ marginTop: '40px' }}>
            <header>
              <div className="val-badge" style={{ color: '#00ccff' }}>MAGIC CHESS</div>
              <h1>SYNERGY DRAFT</h1>
            </header>

            <div className="controls-panel" style={{ borderColor: '#0066ff' }}>
              <div className="players-section">
                <label>LOBBY ({mcPlayers.length}/8) <span className="meta-tag strict" style={{ background: 'rgba(0,102,255,0.2)', color: '#00ccff' }}>BATTLE ROYALE</span></label>
                <form className="player-input-row" onSubmit={handleAddMcPlayer}>
                  <input
                    type="text"
                    placeholder={mcPlayers.length >= 8 ? "Lobby full (Max 8)" : "Player name..."}
                    value={mcNewPlayer}
                    onChange={(e) => setMcNewPlayer(e.target.value)}
                    disabled={mcPlayers.length >= 8}
                    style={{ borderColor: '#0044cc' }}
                  />
                  <button type="submit" className="btn-add" disabled={mcPlayers.length >= 8} style={{ background: '#0066ff' }}>+</button>
                </form>

                <div className="player-tags">
                  {mcPlayers.map(p => (
                    <div key={p} className="player-tag" style={{ borderColor: '#0044cc' }}>
                      {p}
                      <button type="button" onClick={() => handleRemoveMcPlayer(p)} aria-label="Remove player">&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              <button className="randomize-btn" onClick={handleRandomizeMagicChess} style={{ background: '#0066ff' }} disabled={mcPlayers.length === 0 || isMcSpinning}>
                <span className="btn-text">{isMcSpinning ? 'SHUFFLING...' : 'DRAFT BUILD'}</span>
                <span className="btn-glow"></span>
              </button>
            </div>
          </div>

          <div className="right-panel" style={{ marginTop: '40px' }}>
            {mcResults.length > 0 ? (
              <div className="results-container">
                <div className="results-header" style={{ color: '#00ccff' }}>DRAFT RESULTS</div>
                <div className="results-grid">
                  {mcResults.map((res, idx) => (
                    <div key={idx} className={`result-card delay-${idx}`} style={{ borderLeftColor: '#0066ff' }}>
                      <div className="card-inner">
                        <div className="player-name">{res.player}</div>
                        <div className="assignment-details">
                          <div className="role-text" style={{ color: '#00ccff' }}>{res.commander}</div>
                          <div className="agent-text" style={{ fontSize: '1.2rem' }}>{res.faction}</div>
                          <div className="weapon-text" style={{ fontSize: '0.9rem', color: '#fff', marginTop: '4px' }}>🛡️ {res.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ opacity: 0.1 }}>
                {isMcSpinning ? 'SEARCHING REALMS...' : 'WAITING FOR LOBBY...'}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'Game' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', gap: '40px', marginTop: '60px' }}>
          <header style={{ textAlign: 'center', alignItems: 'center' }}>
            <div className="val-badge" style={{ color: '#888' }}>SQUAD UP</div>
            <h1 style={{ fontSize: '4rem', marginTop: '10px' }}>WHAT ARE WE PLAYING?</h1>
          </header>

          <div className="players-section" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <form className="player-input-row" onSubmit={handleAddGame} style={{ justifyContent: 'center', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Add a game..."
                value={newGame}
                onChange={(e) => setNewGame(e.target.value)}
                style={{ width: '70%' }}
              />
              <button type="submit" className="btn-add">+</button>
            </form>

            <div className="player-tags" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              {gamesList.map(g => (
                <div key={g} className="player-tag">
                  {g}
                  <button type="button" onClick={() => handleRemoveGame(g)} aria-label="Remove game">&times;</button>
                </div>
              ))}
            </div>
            {gamesList.length > 0 && (
              <button
                onClick={handleClearGames}
                style={{ background: 'transparent', border: 'none', color: '#888', textDecoration: 'underline', fontSize: '0.8rem', marginTop: '10px', cursor: 'pointer', fontFamily: "'Oswald', sans-serif", letterSpacing: '1px' }}
              >
                CLEAR ALL
              </button>
            )}
            {gamesList.length === 0 && <div style={{ color: '#888', marginTop: '10px' }}>Add games to start roulette!</div>}
          </div>

          <button
            className="randomize-btn"
            onClick={handleGameRandomize}
            style={{ width: '350px', padding: '1.5rem', fontSize: '2rem' }}
            disabled={gamesList.length === 0 || isSpinning}
          >
            <span className="btn-text">{isSpinning ? 'SPINNING...' : 'SPIN ROULETTE'}</span>
          </button>

          <div className="reel-viewport">
            <div className="reel-indicator"></div>
            {isSpinning ? (
              <div
                className="reel-strip"
                style={{
                  transform: `translateY(-${reelOffset}px)`,
                  transition: `transform 4s cubic-bezier(0.15, 0, 0.15, 1)`
                }}
              >
                {reelList.map((game, i) => (
                  <div key={i} className="reel-item">{game}</div>
                ))}
              </div>
            ) : selectedGame ? (
              <div className="theater-card delay-0" style={{ width: '100%', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.4s ease forwards' }}>
                <div className="theater-name" style={{ fontSize: '3rem', color: '#ff4655' }}>
                  {selectedGame}
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ opacity: 0.1, fontSize: '1.2rem' }}>
                PUSH START TO SPIN REEL
              </div>
            )}
          </div>
        </div>
      )}

      <a href="https://github.com/BeastNectus" target="_blank" rel="noopener noreferrer" className="dev-credit">
        DEVELOPED BY {"</JOHN>"}
      </a>
    </div>
  );
}

export default App;
