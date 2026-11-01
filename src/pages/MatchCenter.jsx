import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const countryFlags = {
    "Argentina": "🇦🇷",
    "Brazil": "🇧🇷",
    "France": "🇫🇷",
    "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Spain": "🇪🇸",
    "Germany": "🇩🇪",
    "Portugal": "🇵🇹",
    "Belgium": "🇧🇪",
    "Netherlands": "🇳🇱",
    "Colombia": "🇨🇴",
    "Italy": "🇮🇹",
    "Uruguay": "🇺🇾",
    "Croatia": "🇭🇷",
    "Morocco": "🇲🇦",
    "Japan": "🇯🇵",
    "USA": "🇺🇸",
    "Mexico": "🇲🇽",
    "Canada": "🇨🇦"
};

// Rich World Cup 2026 Match Schedule Dataset with Match Stages
const SAMPLE_MATCHES = [
    {
        id: "m1",
        stage: "Group Stage",
        group: "Group A",
        date: "2026-06-11",
        time: "18:00 EST",
        stadium: "Estadio Azteca, Mexico City",
        status: "completed",
        teamA: "Mexico",
        teamB: "USA",
        scoreA: 3,
        scoreB: 1,
        stats: { possessionA: 54, possessionB: 46, shotsA: 14, shotsB: 9, foulsA: 11, foulsB: 14 }
    },
    {
        id: "m2",
        stage: "Group Stage",
        group: "Group A",
        date: "2026-06-12",
        time: "20:00 EST",
        stadium: "MetLife Stadium, New York",
        status: "live",
        liveMinute: "68'",
        teamA: "Argentina",
        teamB: "Brazil",
        scoreA: 2,
        scoreB: 1,
        stats: { possessionA: 58, possessionB: 42, shotsA: 16, shotsB: 11, foulsA: 9, foulsB: 12 }
    },
    {
        id: "m3",
        stage: "Group Stage",
        group: "Group B",
        date: "2026-06-12",
        time: "22:00 EST",
        stadium: "SoFi Stadium, Los Angeles",
        status: "live",
        liveMinute: "41'",
        teamA: "France",
        teamB: "Germany",
        scoreA: 1,
        scoreB: 0,
        stats: { possessionA: 51, possessionB: 49, shotsA: 8, shotsB: 7, foulsA: 6, foulsB: 8 }
    },
    {
        id: "m4",
        stage: "Group Stage",
        group: "Group B",
        date: "2026-06-13",
        time: "16:00 EST",
        stadium: "BC Place, Vancouver",
        status: "upcoming",
        teamA: "Spain",
        teamB: "Netherlands",
        scoreA: null,
        scoreB: null,
        stats: { possessionA: 50, possessionB: 50, shotsA: 0, shotsB: 0, foulsA: 0, foulsB: 0 }
    },
    {
        id: "m5",
        stage: "Group Stage",
        group: "Group C",
        date: "2026-06-14",
        time: "19:00 EST",
        stadium: "Hard Rock Stadium, Miami",
        status: "upcoming",
        teamA: "England",
        teamB: "Belgium",
        scoreA: null,
        scoreB: null,
        stats: { possessionA: 50, possessionB: 50, shotsA: 0, shotsB: 0, foulsA: 0, foulsB: 0 }
    },
    {
        id: "m6",
        stage: "Round of 32",
        group: "Knockout Stage",
        date: "2026-06-28",
        time: "21:00 EST",
        stadium: "AT&T Stadium, Dallas",
        status: "upcoming",
        teamA: "Portugal",
        teamB: "Colombia",
        scoreA: null,
        scoreB: null,
        stats: { possessionA: 50, possessionB: 50, shotsA: 0, shotsB: 0, foulsA: 0, foulsB: 0 }
    },
    {
        id: "m7",
        stage: "Group Stage",
        group: "Group D",
        date: "2026-06-10",
        time: "17:00 EST",
        stadium: "Mercedes-Benz Stadium, Atlanta",
        status: "completed",
        teamA: "Croatia",
        teamB: "Morocco",
        scoreA: 2,
        scoreB: 0,
        stats: { possessionA: 56, possessionB: 44, shotsA: 11, shotsB: 8, foulsA: 10, foulsB: 13 }
    },
    {
        id: "m8",
        stage: "Quarter-Final",
        group: "Knockout Stage",
        date: "2026-07-04",
        time: "20:00 EST",
        stadium: "Lumen Field, Seattle",
        status: "upcoming",
        teamA: "Japan",
        teamB: "Uruguay",
        scoreA: null,
        scoreB: null,
        stats: { possessionA: 50, possessionB: 50, shotsA: 0, shotsB: 0, foulsA: 0, foulsB: 0 }
    }
];

function MatchCenter() {
    const [matches, setMatches] = useState(SAMPLE_MATCHES);
    const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'live', 'upcoming', 'completed'
    const [groupFilter, setGroupFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMatchModal, setSelectedMatchModal] = useState(null);

    // Try fetching live matches from backend API if available
    useEffect(() => {
        axios.get("http://localhost:5000/api/worldcup/matches")
            .then((res) => {
                if (res.data && res.data.matches && res.data.matches.length > 0) {
                    const mapped = res.data.matches.map((m, idx) => ({
                        id: m.id || `api_${idx}`,
                        stage: m.stage || "Group Stage",
                        group: m.group || `Group ${String.fromCharCode(65 + (idx % 8))}`,
                        date: m.utcDate ? m.utcDate.split("T")[0] : "2026-06-15",
                        time: m.utcDate ? `${m.utcDate.split("T")[1].substring(0, 5)} EST` : "20:00 EST",
                        stadium: m.venue || "FIFA World Cup Stadium",
                        status: m.status === "IN_PLAY" ? "live" : m.status === "FINISHED" ? "completed" : "upcoming",
                        liveMinute: m.status === "IN_PLAY" ? "65'" : null,
                        teamA: m.homeTeam?.name || "Team A",
                        teamB: m.awayTeam?.name || "Team B",
                        scoreA: m.score?.fullTime?.home ?? (m.status === "FINISHED" ? 2 : null),
                        scoreB: m.score?.fullTime?.away ?? (m.status === "FINISHED" ? 1 : null),
                        stats: { possessionA: 55, possessionB: 45, shotsA: 12, shotsB: 9, foulsA: 10, foulsB: 11 }
                    }));
                    setMatches(mapped);
                }
            })
            .catch((err) => {
                console.log("Using sample matches data:", err.message);
            });
    }, []);

    // Filter matches
    const filteredMatches = matches.filter(match => {
        const matchesStatus = statusFilter === "all" || match.status === statusFilter;
        const matchesGroup = groupFilter === "All" || match.group === groupFilter;
        const matchesDate = !dateFilter || match.date === dateFilter;

        const query = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            match.teamA.toLowerCase().includes(query) ||
            match.teamB.toLowerCase().includes(query) ||
            match.stadium.toLowerCase().includes(query) ||
            match.group.toLowerCase().includes(query) ||
            match.stage.toLowerCase().includes(query);

        return matchesStatus && matchesGroup && matchesDate && matchesSearch;
    });

    const groupsList = ["All", "Group A", "Group B", "Group C", "Group D", "Group E", "Group F", "Group G", "Group H", "Knockout Stage"];

    return (
        <div className="match-center-container">
            {/* HEADER */}
            <div className="match-center-header">
                <h1>⚽ FIFA World Cup 2026 - Match Schedule & Details</h1>
                <p>ম্যাচ শিডিউল, রিয়েল-টাইম লাইভ স্কোর, গ্রুপ বিন্যাস ও পারফরম্যান্স বিশ্লেষণ ড্যাশবোর্ড</p>
            </div>

            {/* MEGA STATUS FILTER TABS */}
            <div className="mega-status-tabs">
                <button
                    className={`tab-btn ${statusFilter === "all" ? "active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                >
                    🌐 All Matches ({matches.length})
                </button>
                <button
                    className={`tab-btn live-tab ${statusFilter === "live" ? "active" : ""}`}
                    onClick={() => setStatusFilter("live")}
                >
                    <span className="live-dot-sm"></span> 🔴 Live ({matches.filter(m => m.status === "live").length})
                </button>
                <button
                    className={`tab-btn ${statusFilter === "upcoming" ? "active" : ""}`}
                    onClick={() => setStatusFilter("upcoming")}
                >
                    ⏰ Upcoming ({matches.filter(m => m.status === "upcoming").length})
                </button>
                <button
                    className={`tab-btn ${statusFilter === "completed" ? "active" : ""}`}
                    onClick={() => setStatusFilter("completed")}
                >
                    🏁 Completed ({matches.filter(m => m.status === "completed").length})
                </button>
            </div>

            {/* TOOLBAR FILTERS (GROUP, DATE, SEARCH BAR) */}
            <div className="match-toolbar-card">
                <div className="toolbar-item">
                    <label>🏆 Filter by Group / Stage:</label>
                    <select
                        className="group-select"
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
                    >
                        {groupsList.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                <div className="toolbar-item">
                    <label>📅 Filter by Date:</label>
                    <input
                        type="date"
                        className="date-picker-input"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                    {dateFilter && (
                        <button className="clear-date-btn" onClick={() => setDateFilter("")}>
                            ✕ Reset Date
                        </button>
                    )}
                </div>

                <div className="toolbar-item search-item">
                    <label>🔍 Team / Venue / Stage Search:</label>
                    <input
                        type="text"
                        className="match-search-input"
                        placeholder="Search team, stadium, or stage..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* MATCH CARDS LIST GRID */}
            <div className="matches-grid">
                {filteredMatches.map((match) => (
                    <div className={`match-card ${match.status}`} key={match.id}>
                        {/* MATCH CARD HEADER (STAGE & LIVE BADGE) */}
                        <div className="match-card-top">
                            <div className="stage-group-box">
                                <span className="stage-badge">{match.stage}</span>
                                <span className="group-badge">{match.group}</span>
                            </div>

                            {/* LIVE / UPCOMING / FT BADGE */}
                            {match.status === "live" && (
                                <span className="status-badge live">
                                    <span className="live-dot-sm pulse-dot"></span> 🔴 LIVE {match.liveMinute}
                                </span>
                            )}
                            {match.status === "upcoming" && (
                                <span className="status-badge upcoming">
                                    ⏰ Upcoming
                                </span>
                            )}
                            {match.status === "completed" && (
                                <span className="status-badge completed">
                                    🏁 FT (Final)
                                </span>
                            )}
                        </div>

                        {/* MATCH DATE & TIME BANNER */}
                        <div className="match-time-banner">
                            <span>📅 {match.date} • {match.time}</span>
                        </div>

                        {/* TEAMS FACEOFF SCORE SECTION */}
                        <div className="match-faceoff-body">
                            {/* TEAM A */}
                            <div className="team-cell-side">
                                <span className="team-flag-lg">{countryFlags[match.teamA] || "🚩"}</span>
                                <span className="team-name-title">{match.teamA}</span>
                            </div>

                            {/* SCORE OR VS DISPLAY */}
                            <div className="match-score-box">
                                {match.status === "upcoming" ? (
                                    <span className="vs-text">VS</span>
                                ) : (
                                    <span className="score-num">
                                        {match.scoreA} - {match.scoreB}
                                    </span>
                                )}
                            </div>

                            {/* TEAM B */}
                            <div className="team-cell-side right">
                                <span className="team-name-title">{match.teamB}</span>
                                <span className="team-flag-lg">{countryFlags[match.teamB] || "🚩"}</span>
                            </div>
                        </div>

                        {/* STADIUM VENUE & DETAILS FOOTER */}
                        <div className="match-card-footer">
                            <span className="stadium-text" title={match.stadium}>
                                🏟️ {match.stadium}
                            </span>
                            <button
                                className="details-btn"
                                onClick={() => setSelectedMatchModal(match)}
                            >
                                Stats & Details 📊
                            </button>
                        </div>
                    </div>
                ))}

                {filteredMatches.length === 0 && (
                    <div className="no-matches-box">
                        <span>🔍</span>
                        <h3>কোনো ম্যাচ পাওয়া যায়নি</h3>
                        <p>অনুগ্রহ করে ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
                    </div>
                )}
            </div>

            {/* MATCH STATS MODAL */}
            {selectedMatchModal && (
                <div className="modal-overlay" onClick={() => setSelectedMatchModal(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📊 Match Details & Key Statistics</h3>
                            <button className="modal-close-btn" onClick={() => setSelectedMatchModal(null)}>✕</button>
                        </div>

                        <div className="modal-info-bar">
                            <span>🏆 {selectedMatchModal.stage} ({selectedMatchModal.group})</span>
                            <span>📍 {selectedMatchModal.stadium}</span>
                        </div>

                        <div className="modal-teams-banner">
                            <div className="team-side">
                                <span>{countryFlags[selectedMatchModal.teamA] || "🚩"}</span>
                                <h4>{selectedMatchModal.teamA}</h4>
                            </div>

                            <div className="modal-score">
                                {selectedMatchModal.status === "upcoming" ? "VS" : `${selectedMatchModal.scoreA} - ${selectedMatchModal.scoreB}`}
                            </div>

                            <div className="team-side">
                                <span>{countryFlags[selectedMatchModal.teamB] || "🚩"}</span>
                                <h4>{selectedMatchModal.teamB}</h4>
                            </div>
                        </div>

                        <div className="modal-stats-list">
                            <div className="modal-stat-item">
                                <span>{selectedMatchModal.stats.possessionA}%</span>
                                <span>Ball Possession</span>
                                <span>{selectedMatchModal.stats.possessionB}%</span>
                            </div>
                            <div className="modal-stat-item">
                                <span>{selectedMatchModal.stats.shotsA}</span>
                                <span>Total Shots</span>
                                <span>{selectedMatchModal.stats.shotsB}</span>
                            </div>
                            <div className="modal-stat-item">
                                <span>{selectedMatchModal.stats.foulsA}</span>
                                <span>Fouls Committed</span>
                                <span>{selectedMatchModal.stats.foulsB}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MatchCenter;
