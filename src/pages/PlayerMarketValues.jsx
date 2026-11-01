import { useState, useMemo } from "react";
import "../App.css";

/* ─────────── Flag helper ─────────── */
const FLAGS = {
    Argentina: "🇦🇷", Brazil: "🇧🇷", France: "🇫🇷",
    England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Spain: "🇪🇸", Germany: "🇩🇪", Portugal: "🇵🇹",
};

/* ─────────── Position badge colors ─────────── */
const POSITION_COLORS = {
    Forward: { bg: "#fef3c7", color: "#b45309", border: "#fcd34d" },
    Midfielder: { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
    Defender: { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
    Goalkeeper: { bg: "#ede9fe", color: "#5b21b6", border: "#c4b5fd" },
};

/* ─────────── Market Value Data ─────────── */
const MARKET_DATA = [
    // Argentina
    {
        id: 1, name: "Lionel Messi", team: "Argentina", position: "Forward",
        club: "Inter Miami CF", clubLogo: "🏟️",
        marketValue: 25, currency: "€", trend: "down",
        age: 37, nationality: "Argentine",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Lionel_Messi_20180626.jpg/440px-Lionel_Messi_20180626.jpg",
    },
    {
        id: 2, name: "Julián Álvarez", team: "Argentina", position: "Forward",
        club: "Atlético de Madrid", clubLogo: "🔴",
        marketValue: 90, currency: "€", trend: "up",
        age: 24, nationality: "Argentine",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Juli%C3%A1n_%C3%81lvarez_2022.jpg/440px-Juli%C3%A1n_%C3%81lvarez_2022.jpg",
    },
    {
        id: 3, name: "Rodrigo De Paul", team: "Argentina", position: "Midfielder",
        club: "Atlético de Madrid", clubLogo: "🔴",
        marketValue: 40, currency: "€", trend: "stable",
        age: 30, nationality: "Argentine", photo: "",
    },
    {
        id: 4, name: "Emiliano Martínez", team: "Argentina", position: "Goalkeeper",
        club: "Aston Villa", clubLogo: "🟣",
        marketValue: 30, currency: "€", trend: "up",
        age: 32, nationality: "Argentine", photo: "",
    },
    // Brazil
    {
        id: 5, name: "Vinícius Júnior", team: "Brazil", position: "Forward",
        club: "Real Madrid", clubLogo: "⚪",
        marketValue: 200, currency: "€", trend: "up",
        age: 24, nationality: "Brazilian",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Vinicius_Jr_2021.jpg/440px-Vinicius_Jr_2021.jpg",
    },
    {
        id: 6, name: "Rodrygo", team: "Brazil", position: "Forward",
        club: "Real Madrid", clubLogo: "⚪",
        marketValue: 120, currency: "€", trend: "up",
        age: 23, nationality: "Brazilian",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Rodrygo_Goes_2021.jpg/440px-Rodrygo_Goes_2021.jpg",
    },
    {
        id: 7, name: "Bruno Guimarães", team: "Brazil", position: "Midfielder",
        club: "Newcastle United", clubLogo: "⚫",
        marketValue: 80, currency: "€", trend: "up",
        age: 26, nationality: "Brazilian", photo: "",
    },
    {
        id: 8, name: "Alisson Becker", team: "Brazil", position: "Goalkeeper",
        club: "Liverpool FC", clubLogo: "🔴",
        marketValue: 40, currency: "€", trend: "stable",
        age: 32, nationality: "Brazilian", photo: "",
    },
    // France
    {
        id: 9, name: "Kylian Mbappé", team: "France", position: "Forward",
        club: "Real Madrid", clubLogo: "⚪",
        marketValue: 180, currency: "€", trend: "up",
        age: 25, nationality: "French",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-06-11_Russia-Finland_%28cropped%29.jpg/440px-2019-06-11_Russia-Finland_%28cropped%29.jpg",
    },
    {
        id: 10, name: "Antoine Griezmann", team: "France", position: "Midfielder",
        club: "Atlético de Madrid", clubLogo: "🔴",
        marketValue: 20, currency: "€", trend: "down",
        age: 33, nationality: "French", photo: "",
    },
    {
        id: 11, name: "Eduardo Camavinga", team: "France", position: "Midfielder",
        club: "Real Madrid", clubLogo: "⚪",
        marketValue: 100, currency: "€", trend: "up",
        age: 21, nationality: "French", photo: "",
    },
    {
        id: 12, name: "Mike Maignan", team: "France", position: "Goalkeeper",
        club: "AC Milan", clubLogo: "🔴",
        marketValue: 45, currency: "€", trend: "up",
        age: 29, nationality: "French", photo: "",
    },
    // England
    {
        id: 13, name: "Jude Bellingham", team: "England", position: "Midfielder",
        club: "Real Madrid", clubLogo: "⚪",
        marketValue: 180, currency: "€", trend: "up",
        age: 21, nationality: "English",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Jude_Bellingham_2023.jpg/440px-Jude_Bellingham_2023.jpg",
    },
    {
        id: 14, name: "Harry Kane", team: "England", position: "Forward",
        club: "Bayern Munich", clubLogo: "🔴",
        marketValue: 100, currency: "€", trend: "stable",
        age: 31, nationality: "English", photo: "",
    },
    {
        id: 15, name: "Bukayo Saka", team: "England", position: "Forward",
        club: "Arsenal FC", clubLogo: "🔴",
        marketValue: 150, currency: "€", trend: "up",
        age: 23, nationality: "English", photo: "",
    },
    {
        id: 16, name: "Declan Rice", team: "England", position: "Midfielder",
        club: "Arsenal FC", clubLogo: "🔴",
        marketValue: 100, currency: "€", trend: "stable",
        age: 25, nationality: "English", photo: "",
    },
    // Spain
    {
        id: 17, name: "Lamine Yamal", team: "Spain", position: "Forward",
        club: "FC Barcelona", clubLogo: "🔵",
        marketValue: 250, currency: "€", trend: "up",
        age: 17, nationality: "Spanish",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Lamine_Yamal_2024.jpg/440px-Lamine_Yamal_2024.jpg",
    },
    {
        id: 18, name: "Rodri", team: "Spain", position: "Midfielder",
        club: "Manchester City", clubLogo: "🔵",
        marketValue: 120, currency: "€", trend: "stable",
        age: 28, nationality: "Spanish", photo: "",
    },
    {
        id: 19, name: "Pedri", team: "Spain", position: "Midfielder",
        club: "FC Barcelona", clubLogo: "🔵",
        marketValue: 90, currency: "€", trend: "up",
        age: 22, nationality: "Spanish", photo: "",
    },
    {
        id: 20, name: "Unai Simón", team: "Spain", position: "Goalkeeper",
        club: "Athletic Bilbao", clubLogo: "🔴",
        marketValue: 30, currency: "€", trend: "stable",
        age: 27, nationality: "Spanish", photo: "",
    },
    // Germany
    {
        id: 21, name: "Jamal Musiala", team: "Germany", position: "Midfielder",
        club: "Bayern Munich", clubLogo: "🔴",
        marketValue: 150, currency: "€", trend: "up",
        age: 21, nationality: "German", photo: "",
    },
    {
        id: 22, name: "Florian Wirtz", team: "Germany", position: "Midfielder",
        club: "Bayer Leverkusen", clubLogo: "🔴",
        marketValue: 130, currency: "€", trend: "up",
        age: 21, nationality: "German", photo: "",
    },
    {
        id: 23, name: "Joshua Kimmich", team: "Germany", position: "Defender",
        club: "Bayern Munich", clubLogo: "🔴",
        marketValue: 70, currency: "€", trend: "stable",
        age: 29, nationality: "German", photo: "",
    },
    {
        id: 24, name: "Manuel Neuer", team: "Germany", position: "Goalkeeper",
        club: "Bayern Munich", clubLogo: "🔴",
        marketValue: 8, currency: "€", trend: "down",
        age: 38, nationality: "German", photo: "",
    },
    // Portugal
    {
        id: 25, name: "Cristiano Ronaldo", team: "Portugal", position: "Forward",
        club: "Al Nassr FC", clubLogo: "🟡",
        marketValue: 15, currency: "€", trend: "down",
        age: 39, nationality: "Portuguese",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/440px-Cristiano_Ronaldo_2018.jpg",
    },
    {
        id: 26, name: "Bruno Fernandes", team: "Portugal", position: "Midfielder",
        club: "Manchester United", clubLogo: "🔴",
        marketValue: 60, currency: "€", trend: "stable",
        age: 30, nationality: "Portuguese", photo: "",
    },
    {
        id: 27, name: "Bernardo Silva", team: "Portugal", position: "Midfielder",
        club: "Manchester City", clubLogo: "🔵",
        marketValue: 80, currency: "€", trend: "stable",
        age: 30, nationality: "Portuguese", photo: "",
    },
    {
        id: 28, name: "Diogo Costa", team: "Portugal", position: "Goalkeeper",
        club: "FC Porto", clubLogo: "🔵",
        marketValue: 35, currency: "€", trend: "up",
        age: 25, nationality: "Portuguese", photo: "",
    },
];

const TEAMS = ["All", "Argentina", "Brazil", "France", "England", "Spain", "Germany", "Portugal"];
const POSITIONS = ["All", "Forward", "Midfielder", "Defender", "Goalkeeper"];
const SORT_OPTIONS = [
    { label: "Value (High → Low)", value: "value_desc" },
    { label: "Value (Low → High)", value: "value_asc" },
    { label: "Name (A → Z)", value: "name_asc" },
    { label: "Age (Youngest)", value: "age_asc" },
];

function TrendIcon({ trend }) {
    if (trend === "up") return <span style={{ color: "#10b981", fontWeight: 700, fontSize: "16px" }}>▲</span>;
    if (trend === "down") return <span style={{ color: "#ef4444", fontWeight: 700, fontSize: "16px" }}>▼</span>;
    return <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: "16px" }}>●</span>;
}

function formatValue(val) {
    if (val >= 100) return `€${val}M`;
    return `€${val}M`;
}

function PlayerCard({ player }) {
    const posStyle = POSITION_COLORS[player.position] || {};
    const initials = player.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className="mv-card">
            {/* Header strip */}
            <div className="mv-card-header">
                <div className="mv-avatar">
                    {player.photo ? (
                        <img src={player.photo} alt={player.name} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                    ) : null}
                    <div className="mv-avatar-fallback" style={{ display: player.photo ? "none" : "flex" }}>
                        {initials}
                    </div>
                </div>
                <div className="mv-card-meta">
                    <h3 className="mv-player-name">{player.name}</h3>
                    <p className="mv-nationality">
                        <span className="mv-flag">{FLAGS[player.team]}</span> {player.nationality} · Age {player.age}
                    </p>
                </div>
            </div>

            {/* Info rows */}
            <div className="mv-info-grid">
                <div className="mv-info-item">
                    <span className="mv-info-label">Position</span>
                    <span className="mv-position-badge" style={{
                        background: posStyle.bg,
                        color: posStyle.color,
                        border: `1px solid ${posStyle.border}`
                    }}>
                        {player.position}
                    </span>
                </div>
                <div className="mv-info-item">
                    <span className="mv-info-label">National Team</span>
                    <span className="mv-info-value">{FLAGS[player.team]} {player.team}</span>
                </div>
                <div className="mv-info-item">
                    <span className="mv-info-label">Current Club</span>
                    <span className="mv-info-value">{player.clubLogo} {player.club}</span>
                </div>
            </div>

            {/* Value footer */}
            <div className="mv-value-row">
                <div>
                    <p className="mv-value-label">Market Value</p>
                    <p className="mv-value-amount">{formatValue(player.marketValue)}</p>
                </div>
                <div className="mv-trend-box">
                    <TrendIcon trend={player.trend} />
                    <span className="mv-trend-label">
                        {player.trend === "up" ? "Rising" : player.trend === "down" ? "Falling" : "Stable"}
                    </span>
                </div>
            </div>
        </div>
    );
}

function StatsSummary({ data }) {
    const total = data.reduce((s, p) => s + p.marketValue, 0);
    const highest = data.reduce((max, p) => p.marketValue > max.marketValue ? p : max, data[0] || {});
    const avgAge = data.length ? Math.round(data.reduce((s, p) => s + p.age, 0) / data.length) : 0;
    return (
        <div className="mv-stats-bar">
            <div className="mv-stat-chip">
                <span className="mv-stat-icon">👥</span>
                <div>
                    <p className="mv-stat-val">{data.length}</p>
                    <p className="mv-stat-lbl">Players</p>
                </div>
            </div>
            <div className="mv-stat-chip">
                <span className="mv-stat-icon">💰</span>
                <div>
                    <p className="mv-stat-val">€{total}M</p>
                    <p className="mv-stat-lbl">Total Value</p>
                </div>
            </div>
            <div className="mv-stat-chip">
                <span className="mv-stat-icon">⭐</span>
                <div>
                    <p className="mv-stat-val">{highest.name ? formatValue(highest.marketValue) : "—"}</p>
                    <p className="mv-stat-lbl">Highest Value</p>
                </div>
            </div>
            <div className="mv-stat-chip">
                <span className="mv-stat-icon">🎂</span>
                <div>
                    <p className="mv-stat-val">{avgAge}</p>
                    <p className="mv-stat-lbl">Avg. Age</p>
                </div>
            </div>
        </div>
    );
}

function PlayerMarketValues() {
    const [search, setSearch] = useState("");
    const [team, setTeam] = useState("All");
    const [position, setPosition] = useState("All");
    const [sortBy, setSortBy] = useState("value_desc");
    const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

    const filtered = useMemo(() => {
        let data = [...MARKET_DATA];
        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.club.toLowerCase().includes(q) ||
                p.team.toLowerCase().includes(q)
            );
        }
        if (team !== "All") data = data.filter(p => p.team === team);
        if (position !== "All") data = data.filter(p => p.position === position);

        data.sort((a, b) => {
            if (sortBy === "value_desc") return b.marketValue - a.marketValue;
            if (sortBy === "value_asc") return a.marketValue - b.marketValue;
            if (sortBy === "name_asc") return a.name.localeCompare(b.name);
            if (sortBy === "age_asc") return a.age - b.age;
            return 0;
        });
        return data;
    }, [search, team, position, sortBy]);

    return (
        <div className="mv-page">
            {/* ── Hero Banner ── */}
            <div className="mv-hero">
                <div className="mv-hero-content">
                    <div className="mv-hero-badge">💎 MARKET VALUES</div>
                    <h1 className="mv-hero-title">Player Market Values</h1>
                    <p className="mv-hero-sub">
                        Explore estimated transfer market values for top World Cup players across all nations.
                    </p>
                </div>
                <div className="mv-hero-deco">
                    <div className="mv-ball">⚽</div>
                </div>
            </div>

            {/* ── Stats Summary ── */}
            <StatsSummary data={filtered} />

            {/* ── Controls ── */}
            <div className="mv-controls">
                {/* Search */}
                <div className="mv-search-wrapper">
                    <span className="mv-search-icon">🔍</span>
                    <input
                        id="mv-search"
                        className="mv-search"
                        type="text"
                        placeholder="Search player, club, or team…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="mv-clear-btn" onClick={() => setSearch("")}>✕</button>
                    )}
                </div>

                <div className="mv-filters">
                    {/* Team filter */}
                    <select id="mv-team-filter" className="mv-select" value={team} onChange={e => setTeam(e.target.value)}>
                        {TEAMS.map(t => <option key={t} value={t}>{t === "All" ? "🌍 All Teams" : `${FLAGS[t]} ${t}`}</option>)}
                    </select>

                    {/* Position filter */}
                    <select id="mv-pos-filter" className="mv-select" value={position} onChange={e => setPosition(e.target.value)}>
                        {POSITIONS.map(p => <option key={p} value={p}>{p === "All" ? "🎯 All Positions" : p}</option>)}
                    </select>

                    {/* Sort */}
                    <select id="mv-sort" className="mv-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>

                    {/* View mode toggle */}
                    <div className="mv-view-toggle">
                        <button id="mv-grid-view" className={`mv-toggle-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Grid View">⊞</button>
                        <button id="mv-table-view" className={`mv-toggle-btn ${viewMode === "table" ? "active" : ""}`} onClick={() => setViewMode("table")} title="Table View">☰</button>
                    </div>
                </div>
            </div>

            {/* ── Results Count ── */}
            <p className="mv-result-count">
                Showing <strong>{filtered.length}</strong> of <strong>{MARKET_DATA.length}</strong> players
            </p>

            {/* ── No Results ── */}
            {filtered.length === 0 && (
                <div className="mv-empty">
                    <div className="mv-empty-icon">🔍</div>
                    <p>No players match your filters.</p>
                    <button className="mv-reset-btn" onClick={() => { setSearch(""); setTeam("All"); setPosition("All"); }}>
                        Reset Filters
                    </button>
                </div>
            )}

            {/* ── Grid View ── */}
            {viewMode === "grid" && filtered.length > 0 && (
                <div className="mv-grid">
                    {filtered.map(p => <PlayerCard key={p.id} player={p} />)}
                </div>
            )}

            {/* ── Table View ── */}
            {viewMode === "table" && filtered.length > 0 && (
                <div className="mv-table-wrapper">
                    <table className="mv-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Player</th>
                                <th>Nation</th>
                                <th>Position</th>
                                <th>Club</th>
                                <th>Age</th>
                                <th>Market Value</th>
                                <th>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => {
                                const posStyle = POSITION_COLORS[p.position] || {};
                                const initials = p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                                return (
                                    <tr key={p.id} className="mv-table-row">
                                        <td className="mv-rank">{i + 1}</td>
                                        <td>
                                            <div className="mv-table-player">
                                                <div className="mv-table-avatar">
                                                    {p.photo
                                                        ? <img src={p.photo} alt={p.name} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                                                        : null
                                                    }
                                                    <div className="mv-avatar-fallback-sm" style={{ display: p.photo ? "none" : "flex" }}>{initials}</div>
                                                </div>
                                                <span className="mv-table-name">{p.name}</span>
                                            </div>
                                        </td>
                                        <td>{FLAGS[p.team]} {p.team}</td>
                                        <td>
                                            <span className="mv-position-badge" style={{
                                                background: posStyle.bg,
                                                color: posStyle.color,
                                                border: `1px solid ${posStyle.border}`
                                            }}>{p.position}</span>
                                        </td>
                                        <td>{p.clubLogo} {p.club}</td>
                                        <td>{p.age}</td>
                                        <td className="mv-table-value">{formatValue(p.marketValue)}</td>
                                        <td><TrendIcon trend={p.trend} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PlayerMarketValues;
