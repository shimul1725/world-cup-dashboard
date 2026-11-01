import { useState, useEffect } from "react";
import axios from "axios";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from "chart.js";
import "../App.css";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

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
    "USA": "🇺🇸"
};

// Fallback Key Players Map
const keyPlayersMap = {
    "Argentina": { name: "Lionel Messi", role: "Forward", goals: 13, assist: 8, rating: 9.7, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Lionel_Messi_20180626.jpg/440px-Lionel_Messi_20180626.jpg" },
    "Brazil": { name: "Vinícius Júnior", role: "Forward", goals: 11, assist: 7, rating: 9.4, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Vinicius_Jr_2021.jpg/440px-Vinicius_Jr_2021.jpg" },
    "France": { name: "Kylian Mbappé", role: "Forward", goals: 14, assist: 6, rating: 9.8, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-06-11_Russia-Finland_%28cropped%29.jpg/440px-2019-06-11_Russia-Finland_%28cropped%29.jpg" },
    "England": { name: "Jude Bellingham", role: "Midfielder", goals: 10, assist: 7, rating: 9.5, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Jude_Bellingham_2023.jpg/440px-Jude_Bellingham_2023.jpg" },
    "Spain": { name: "Lamine Yamal", role: "Forward", goals: 9, assist: 10, rating: 9.6, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Lamine_Yamal_2024.jpg/440px-Lamine_Yamal_2024.jpg" },
    "Germany": { name: "Jamal Musiala", role: "Midfielder", goals: 9, assist: 6, rating: 9.3, photo: "" },
    "Portugal": { name: "Cristiano Ronaldo", role: "Forward", goals: 11, assist: 3, rating: 9.1, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/440px-Cristiano_Ronaldo_2018.jpg" },
    "Netherlands": { name: "Virgil van Dijk", role: "Defender", goals: 3, assist: 2, rating: 8.9, photo: "" },
    "Belgium": { name: "Kevin De Bruyne", role: "Midfielder", goals: 7, assist: 12, rating: 9.2, photo: "" }
};

// Fallback Teams List
const DEFAULT_TEAMS = [
    { team: "Argentina", ranking: 1, attack: 88, midfield: 87, defense: 86, goals: 13, pos: 88, cre: 86, phy: 84, tac: 88, avgGoals: "2.4", cleanSheets: "60%", passAcc: "88%", form: ["W", "W", "W", "D", "W"], h2hWins: 12, h2hDraws: 6, h2hLosses: 8, h2hGoals: 34 },
    { team: "Brazil", ranking: 5, attack: 89, midfield: 85, defense: 84, goals: 11, pos: 84, cre: 88, phy: 85, tac: 84, avgGoals: "2.1", cleanSheets: "50%", passAcc: "86%", form: ["W", "W", "D", "L", "W"], h2hWins: 8, h2hDraws: 6, h2hLosses: 12, h2hGoals: 28 },
    { team: "France", ranking: 2, attack: 90, midfield: 86, defense: 85, goals: 14, pos: 85, cre: 89, phy: 88, tac: 86, avgGoals: "2.6", cleanSheets: "55%", passAcc: "87%", form: ["W", "D", "W", "W", "W"], h2hWins: 10, h2hDraws: 4, h2hLosses: 7, h2hGoals: 31 },
    { team: "England", ranking: 4, attack: 86, midfield: 86, defense: 85, goals: 12, pos: 86, cre: 84, phy: 86, tac: 85, avgGoals: "2.2", cleanSheets: "58%", passAcc: "86%", form: ["W", "D", "L", "W", "W"], h2hWins: 7, h2hDraws: 4, h2hLosses: 10, h2hGoals: 24 },
    { team: "Spain", ranking: 3, attack: 87, midfield: 89, defense: 84, goals: 11, pos: 91, cre: 90, phy: 81, tac: 87, avgGoals: "2.3", cleanSheets: "62%", passAcc: "91%", form: ["W", "W", "W", "W", "D"], h2hWins: 9, h2hDraws: 5, h2hLosses: 6, h2hGoals: 27 },
    { team: "Germany", ranking: 11, attack: 86, midfield: 87, defense: 82, goals: 10, pos: 87, cre: 86, phy: 84, tac: 83, avgGoals: "2.0", cleanSheets: "45%", passAcc: "88%", form: ["W", "W", "W", "D", "L"], h2hWins: 9, h2hDraws: 5, h2hLosses: 7, h2hGoals: 29 },
    { team: "Portugal", ranking: 8, attack: 87, midfield: 86, defense: 83, goals: 12, pos: 85, cre: 87, phy: 83, tac: 84, avgGoals: "2.2", cleanSheets: "48%", passAcc: "86%", form: ["W", "W", "L", "W", "W"], h2hWins: 8, h2hDraws: 4, h2hLosses: 8, h2hGoals: 26 }
];

function Compare() {
    const [teams, setTeams] = useState(DEFAULT_TEAMS);
    const [team1, setTeam1] = useState(DEFAULT_TEAMS[0]);
    const [team2, setTeam2] = useState(DEFAULT_TEAMS[1]);
    const [winner, setWinner] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [details, setDetails] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        axios.get("http://127.0.0.1:5050/teams")
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    const merged = response.data.map((t, idx) => {
                        const fallback = DEFAULT_TEAMS.find(dt => dt.team.toLowerCase() === t.team?.toLowerCase()) || DEFAULT_TEAMS[idx % DEFAULT_TEAMS.length];
                        return {
                            ...t,
                            pos: t.pos || fallback.pos || 85,
                            cre: t.cre || fallback.cre || 85,
                            phy: t.phy || fallback.phy || 84,
                            tac: t.tac || fallback.tac || 85,
                            avgGoals: t.avgGoals || fallback.avgGoals || "2.1",
                            cleanSheets: t.cleanSheets || fallback.cleanSheets || "50%",
                            passAcc: t.passAcc || fallback.passAcc || "86%",
                            form: t.form || fallback.form || ["W", "W", "D", "W", "W"],
                            h2hWins: t.h2hWins !== undefined ? t.h2hWins : fallback.h2hWins,
                            h2hDraws: t.h2hDraws !== undefined ? t.h2hDraws : fallback.h2hDraws,
                            h2hLosses: t.h2hLosses !== undefined ? t.h2hLosses : fallback.h2hLosses,
                            h2hGoals: t.h2hGoals !== undefined ? t.h2hGoals : fallback.h2hGoals
                        };
                    });
                    setTeams(merged);
                    setTeam1(merged[0]);
                    setTeam2(merged[1]);
                }
            })
            .catch((err) => {
                console.log("Using default comparison teams:", err.message);
            })
            .finally(() => {
                setPageLoading(false);
            });
    }, []);

    const predictWinner = async () => {
        setLoading(true);
        setError("");
        setWinner("");
        setDetails(null);

        try {
            const res1 = await axios.post("http://127.0.0.1:5050/predict", {
                ranking: team1.ranking, attack: team1.attack, midfield: team1.midfield, defense: team1.defense, goals: team1.goals
            });
            const res2 = await axios.post("http://127.0.0.1:5050/predict", {
                ranking: team2.ranking, attack: team2.attack, midfield: team2.midfield, defense: team2.defense, goals: team2.goals
            });

            const conf1 = res1.data.confidence || 75;
            const conf2 = res2.data.confidence || 70;

            setDetails({
                team1Result: res1.data.prediction,
                team1Confidence: conf1,
                team2Result: res2.data.prediction,
                team2Confidence: conf2
            });

            if (res1.data.prediction === "High Chance" && res2.data.prediction === "Low Chance") {
                setWinner(team1.team);
            } else if (res2.data.prediction === "High Chance" && res1.data.prediction === "Low Chance") {
                setWinner(team2.team);
            } else if (conf1 > conf2) {
                setWinner(team1.team);
            } else if (conf2 > conf1) {
                setWinner(team2.team);
            } else {
                setWinner("Equal Match / Draw");
            }
        } catch (err) {
            // Local fallback prediction algorithm
            const score1 = (team1.attack * 0.35 + team1.midfield * 0.35 + team1.defense * 0.30) - (team1.ranking * 0.5);
            const score2 = (team2.attack * 0.35 + team2.midfield * 0.35 + team2.defense * 0.30) - (team2.ranking * 0.5);

            const conf1 = Math.round(Math.min(95, Math.max(60, 50 + score1)));
            const conf2 = Math.round(Math.min(95, Math.max(60, 50 + score2)));

            setDetails({
                team1Result: score1 > score2 ? "High Chance" : "Moderate",
                team1Confidence: conf1,
                team2Result: score2 > score1 ? "High Chance" : "Moderate",
                team2Confidence: conf2
            });

            if (score1 > score2) setWinner(team1.team);
            else if (score2 > score1) setWinner(team2.team);
            else setWinner("Draw / Equal Match");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <h2 className="loading-title">⏳ Loading Team Comparison Data...</h2>;
    }

    if (!team1 || !team2) {
        return <h2 className="loading-title">No Team Data Available</h2>;
    }

    // RADAR CHART DATA
    const radarData = {
        labels: [
            "Attack (আক্রমণ)",
            "Defense (রক্ষণ)",
            "Possession (বল দখল)",
            "Creativity (সৃষ্টি)",
            "Physicality (শারীরিক)",
            "Tactical (কৌশল)"
        ],
        datasets: [
            {
                label: `${countryFlags[team1.team] || ""} ${team1.team}`,
                data: [team1.attack, team1.defense, team1.pos || 85, team1.cre || 85, team1.phy || 84, team1.tac || 86],
                backgroundColor: "rgba(37, 99, 235, 0.35)",
                borderColor: "#2563eb",
                borderWidth: 2.5,
                pointBackgroundColor: "#2563eb",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#2563eb"
            },
            {
                label: `${countryFlags[team2.team] || ""} ${team2.team}`,
                data: [team2.attack, team2.defense, team2.pos || 85, team2.cre || 85, team2.phy || 84, team2.tac || 86],
                backgroundColor: "rgba(225, 29, 72, 0.35)",
                borderColor: "#e11d48",
                borderWidth: 2.5,
                pointBackgroundColor: "#e11d48",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#e11d48"
            }
        ]
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: { size: 14, weight: "bold" },
                    color: "#0f172a"
                }
            },
            datalabels: { display: false }
        },
        scales: {
            r: {
                angleLines: { color: "#e2e8f0" },
                grid: { color: "#e2e8f0" },
                pointLabels: {
                    font: { size: 12, weight: "600" },
                    color: "#334155"
                },
                ticks: { display: false, stepSize: 20 },
                suggestedMin: 50,
                suggestedMax: 100
            }
        }
    };

    const keyPlayer1 = keyPlayersMap[team1.team] || { name: `${team1.team} Star`, role: "Forward", goals: team1.goals, assist: 5, rating: 8.8, photo: "" };
    const keyPlayer2 = keyPlayersMap[team2.team] || { name: `${team2.team} Star`, role: "Forward", goals: team2.goals, assist: 5, rating: 8.7, photo: "" };

    const totalH2HMatches = (team1.h2hWins || 8) + (team1.h2hDraws || 5) + (team1.h2hLosses || 6);

    return (
        <div className="compare-page-container">
            {/* HEADER */}
            <div className="compare-header">
                <h1>⚔️ Head-to-Head Team Comparison</h1>
                <p>বিশ্বকাপের যেকোনো দুটি জাতীয় দলের মুখোমুখি তথ্য, ফর্মেট ও রাডার স্ট্যাটস বিশ্লেষণ</p>
            </div>

            {/* SELECTOR BAR */}
            <div className="compare-selector-bar">
                <div className="selector-box">
                    <label htmlFor="team1-select">Select Team A:</label>
                    <select
                        id="team1-select"
                        className="compare-select"
                        value={teams.findIndex(t => t.team === team1.team)}
                        onChange={(e) => setTeam1(teams[e.target.value])}
                    >
                        {teams.map((t, idx) => (
                            <option value={idx} key={t.team}>
                                {countryFlags[t.team] || "🚩"} {t.team} (#{t.ranking})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="vs-circle">VS</div>

                <div className="selector-box">
                    <label htmlFor="team2-select">Select Team B:</label>
                    <select
                        id="team2-select"
                        className="compare-select"
                        value={teams.findIndex(t => t.team === team2.team)}
                        onChange={(e) => setTeam2(teams[e.target.value])}
                    >
                        {teams.map((t, idx) => (
                            <option value={idx} key={t.team}>
                                {countryFlags[t.team] || "🚩"} {t.team} (#{t.ranking})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 1. H2H OVERVIEW CARD */}
            <div className="h2h-summary-card">
                <h2>🤝 Head-to-Head Record Overview</h2>
                <div className="h2h-stats-grid">
                    <div className="h2h-team-stat left">
                        <span className="team-flag">{countryFlags[team1.team] || "🚩"}</span>
                        <h3>{team1.team}</h3>
                        <span className="stat-win-count">{team1.h2hWins || 9} Wins</span>
                    </div>

                    <div className="h2h-center-summary">
                        <div className="total-matches-pill">
                            Total Matches: <b>{totalH2HMatches}</b>
                        </div>
                        <div className="draws-text">
                            Draws: <b>{team1.h2hDraws || 5}</b>
                        </div>
                        <div className="goals-text">
                            Total Goals Scored: <b>{(team1.h2hGoals || 30) + (team2.h2hGoals || 25)}</b>
                        </div>
                    </div>

                    <div className="h2h-team-stat right">
                        <span className="team-flag">{countryFlags[team2.team] || "🚩"}</span>
                        <h3>{team2.team}</h3>
                        <span className="stat-win-count">{team1.h2hLosses || 7} Wins</span>
                    </div>
                </div>
            </div>

            {/* 2. RADAR CHART VISUAL */}
            <div className="radar-chart-card">
                <h2>🕸️ Technical Skill Spider/Radar Chart</h2>
                <p className="radar-sub">অ্যাটাক, ডিফেন্স, পজেশন, টেকনিক্যাল ও শৃঙ্খলার তুলনা</p>
                <div className="radar-wrapper">
                    <Radar data={radarData} options={radarOptions} />
                </div>
            </div>

            {/* 3. FORM & SIDE-BY-SIDE STATS COMPARISON TABLE */}
            <div className="stats-comparison-card">
                <h2>📊 Form & Metric Performance Comparison</h2>

                {/* RECENT FORM ROW */}
                <div className="form-comparison-row">
                    <div className="form-team-side">
                        <span className="form-title">{countryFlags[team1.team]} {team1.team} Form:</span>
                        <div className="form-pills">
                            {(team1.form || ["W", "W", "D", "W", "W"]).map((f, i) => (
                                <span key={i} className={`form-pill ${f === "W" ? "win" : f === "D" ? "draw" : "loss"}`}>{f}</span>
                            ))}
                        </div>
                    </div>

                    <div className="form-team-side right-align">
                        <span className="form-title">{countryFlags[team2.team]} {team2.team} Form:</span>
                        <div className="form-pills">
                            {(team2.form || ["W", "D", "W", "L", "W"]).map((f, i) => (
                                <span key={i} className={`form-pill ${f === "W" ? "win" : f === "D" ? "draw" : "loss"}`}>{f}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SIDE-BY-SIDE METRIC COMPARISON BARS */}
                <div className="comparison-bars-grid">
                    {/* FIFA RANKING */}
                    <div className="metric-row">
                        <span className="metric-val left">#{team1.ranking}</span>
                        <div className="metric-center">
                            <span className="metric-label">FIFA World Ranking</span>
                            <div className="side-bar-wrapper">
                                <div className="bar-left" style={{ width: `${Math.max(10, 100 - team1.ranking * 2)}%` }} />
                                <div className="bar-right" style={{ width: `${Math.max(10, 100 - team2.ranking * 2)}%` }} />
                            </div>
                        </div>
                        <span className="metric-val right">#{team2.ranking}</span>
                    </div>

                    {/* ATTACK RATING */}
                    <div className="metric-row">
                        <span className="metric-val left">{team1.attack}</span>
                        <div className="metric-center">
                            <span className="metric-label">Attack Rating</span>
                            <div className="side-bar-wrapper">
                                <div className="bar-left" style={{ width: `${team1.attack}%` }} />
                                <div className="bar-right" style={{ width: `${team2.attack}%` }} />
                            </div>
                        </div>
                        <span className="metric-val right">{team2.attack}</span>
                    </div>

                    {/* DEFENSE RATING */}
                    <div className="metric-row">
                        <span className="metric-val left">{team1.defense}</span>
                        <div className="metric-center">
                            <span className="metric-label">Defense Rating</span>
                            <div className="side-bar-wrapper">
                                <div className="bar-left" style={{ width: `${team1.defense}%` }} />
                                <div className="bar-right" style={{ width: `${team2.defense}%` }} />
                            </div>
                        </div>
                        <span className="metric-val right">{team2.defense}</span>
                    </div>

                    {/* AVERAGE GOALS */}
                    <div className="metric-row">
                        <span className="metric-val left">{team1.avgGoals || "2.4"}</span>
                        <div className="metric-center">
                            <span className="metric-label">Average Goals / Match</span>
                            <div className="side-bar-wrapper">
                                <div className="bar-left" style={{ width: `${parseFloat(team1.avgGoals || 2.4) * 30}%` }} />
                                <div className="bar-right" style={{ width: `${parseFloat(team2.avgGoals || 2.1) * 30}%` }} />
                            </div>
                        </div>
                        <span className="metric-val right">{team2.avgGoals || "2.1"}</span>
                    </div>

                    {/* CLEAN SHEETS */}
                    <div className="metric-row">
                        <span className="metric-val left">{team1.cleanSheets || "60%"}</span>
                        <div className="metric-center">
                            <span className="metric-label">Clean Sheets Ratio</span>
                            <div className="side-bar-wrapper">
                                <div className="bar-left" style={{ width: `${parseInt(team1.cleanSheets || 60)}%` }} />
                                <div className="bar-right" style={{ width: `${parseInt(team2.cleanSheets || 50)}%` }} />
                            </div>
                        </div>
                        <span className="metric-val right">{team2.cleanSheets || "50%"}</span>
                    </div>

                    {/* PASS ACCURACY */}
                    <div className="metric-row">
                        <span className="metric-val left">{team1.passAcc || "88%"}</span>
                        <div className="metric-center">
                            <span className="metric-label">Pass Accuracy %</span>
                            <div className="side-bar-wrapper">
                                <div className="bar-left" style={{ width: `${parseInt(team1.passAcc || 88)}%` }} />
                                <div className="bar-right" style={{ width: `${parseInt(team2.passAcc || 86)}%` }} />
                            </div>
                        </div>
                        <span className="metric-val right">{team2.passAcc || "86%"}</span>
                    </div>
                </div>
            </div>

            {/* 4. KEY PLAYERS SHOWCASE */}
            <div className="key-players-showcase-card">
                <h2>⭐ Key Players Face-Off Showcase</h2>
                <div className="players-faceoff-grid">
                    {/* KEY PLAYER 1 */}
                    <div className="player-faceoff-card left-card">
                        <div className="player-avatar-box">
                            {keyPlayer1.photo ? (
                                <img src={keyPlayer1.photo} alt={keyPlayer1.name} className="faceoff-img" onError={(e) => e.target.style.display = "none"} />
                            ) : null}
                            <div className="faceoff-placeholder">{keyPlayer1.name.charAt(0)}</div>
                        </div>
                        <h3>{keyPlayer1.name}</h3>
                        <span className="player-role-tag">{keyPlayer1.role} • {countryFlags[team1.team]} {team1.team}</span>
                        <div className="player-stats-row">
                            <span>⚽ {keyPlayer1.goals} Goals</span>
                            <span>🅰️ {keyPlayer1.assist} Assists</span>
                            <span className="star-badge">⭐ {keyPlayer1.rating}</span>
                        </div>
                    </div>

                    <div className="faceoff-vs">VS</div>

                    {/* KEY PLAYER 2 */}
                    <div className="player-faceoff-card right-card">
                        <div className="player-avatar-box">
                            {keyPlayer2.photo ? (
                                <img src={keyPlayer2.photo} alt={keyPlayer2.name} className="faceoff-img" onError={(e) => e.target.style.display = "none"} />
                            ) : null}
                            <div className="faceoff-placeholder">{keyPlayer2.name.charAt(0)}</div>
                        </div>
                        <h3>{keyPlayer2.name}</h3>
                        <span className="player-role-tag">{keyPlayer2.role} • {countryFlags[team2.team]} {team2.team}</span>
                        <div className="player-stats-row">
                            <span>⚽ {keyPlayer2.goals} Goals</span>
                            <span>🅰️ {keyPlayer2.assist} Assists</span>
                            <span className="star-badge">⭐ {keyPlayer2.rating}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* PREDICT WINNER ACTION */}
            <div className="predict-action-section">
                <button className="predict-winner-btn" onClick={predictWinner} disabled={loading}>
                    {loading ? "Calculating Match Simulation..." : "🚀 Predict Match Winner"}
                </button>

                {error && <p className="compare-error">{error}</p>}

                {winner && (
                    <div className="winner-announcement-card">
                        <h2>🏆 Predicted Winner: <span className="winner-highlight">{countryFlags[winner]} {winner}</span></h2>
                        {details && (
                            <div className="confidence-details">
                                <p>{countryFlags[team1.team]} {team1.team}: <b>{details.team1Confidence}% Confidence</b></p>
                                <p>{countryFlags[team2.team]} {team2.team}: <b>{details.team2Confidence}% Confidence</b></p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Compare;