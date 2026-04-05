import React, { useState, useEffect } from 'react';
import { generateRandomization } from './utils/randomizeLogic';
import { valMaps, valComps } from './utils/data';

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
  const [mode, setMode] = useState('Agents');
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [results, setResults] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);

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

  const handleRandomize = () => {
    setResults([]);
    setSelectedMap(null);
    setTimeout(() => {
      const res = generateRandomization(mode, players);
      const generatedMap = valMaps[Math.floor(Math.random() * valMaps.length)];
      setResults(res);
      setSelectedMap(generatedMap);

      // Discord Webhook Dispatch
      const webhookUrl = "https://discord.com/api/webhooks/1485656369955602585/w-6IAeR3QGPEYb5cVsreQ0ba6E5cVFgJFUPUAHhPBPlRxiazliNspXg6kNPlImG93a0z";

      const fields = res.map(r => ({
        name: `👤 ${r.player}`,
        value: r.agent ? `**Agent:** ${r.agent}\n**Role:** ${r.role}` : `**Role:** ${r.role}`,
        inline: true
      }));

      // Add map information safely
      fields.push({ name: "🗺️ Map", value: `**${generatedMap}**`, inline: false });

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

  return (
    <div className="app-container">
      {/* Background Watermark */}
      <div className="bg-watermark">V</div>

      <div className="left-panel">
        <header>
          <div className="val-badge">VALORANT</div>
          <h1>AGENT SELECT</h1>
        </header>

        <div className="controls-panel">
          <div className="settings-row">
            <CustomSelect
              label="MODE"
              value={mode}
              onChange={(newMode) => { setMode(newMode); setResults([]); setSelectedMap(null); }}
              options={[
                { value: 'Agents', label: 'Agents & Roles' },
                { value: 'Roles', label: 'Roles Only' }
              ]}
            />
          </div>

          <div className="players-section">
            <label>PARTY ({players.length}/5) {players.length === 5 ? <span className="meta-tag strict">COMPETITIVE</span> : <span className="meta-tag chaos">UNRATED</span>}</label>
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

          <button className="randomize-btn" onClick={handleRandomize} disabled={players.length === 0}>
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

      <div className="right-panel">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedMap && (
              <div className="theater-section delay-6">
                <div className="theater-label">MAP</div>
                <div className="theater-card">
                  <div className="theater-name">{selectedMap}</div>
                </div>
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

      <a href="https://github.com/BeastNectus" target="_blank" rel="noopener noreferrer" className="dev-credit">
        DEVELOPED BY {"</JOHN>"}
      </a>
    </div>
  );
}

export default App;
