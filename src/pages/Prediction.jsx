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
    "USA": "🇺🇸"
};

// Fallback dataset if API is offline
const DEFAULT_TEAMS = [
    { team: "Argentina", ranking: 1, attack: 88, midfield: 87, defense: 86, goals: 13, form: ["W", "W", "W", "D", "W"], h2h_wins: 12 },
    { team: "France", ranking: 2, attack: 90, midfield: 86, defense: 85, goals: 14, form: ["W", "D", "W", "W", "W"], h2h_wins: 10 },
    { team: "Spain", ranking: 3, attack: 87, midfield: 89, defense: 84, goals: 11, form: ["W", "W", "W", "W", "D"], h2h_wins: 9 },
    { team: "England", ranking: 4, attack: 86, midfield: 86, defense: 85, goals: 12, form: ["W", "D", "L", "W", "W"], h2h_wins: 8 },
    { team: "Brazil", ranking: 5, attack: 89, midfield: 85, defense: 84, goals: 11, form: ["W", "W", "D", "L", "W"], h2h_wins: 11 },
    { team: "Belgium", ranking: 6, attack: 83, midfield: 84, defense: 80, goals: 9, form: ["D", "W", "W", "L", "W"], h2h_wins: 6 },
    { team: "Netherlands", ranking: 7, attack: 84, midfield: 82, defense: 85, goals: 10, form: ["W", "D", "W", "D", "W"], h2h_wins: 7 },
    { team: "Portugal", ranking: 8, attack: 87, midfield: 86, defense: 83, goals: 12, form: ["W", "W", "L", "W", "W"], h2h_wins: 8 },
    { team: "Germany", ranking: 11, attack: 86, midfield: 87, defense: 82, goals: 10, form: ["W", "W", "W", "D", "L"], h2h_wins: 9 }
];

function Prediction() {
    const [mode, setMode] = useState("match"); // 'match' or 'solo'
    const [teams, setTeams] = useState(DEFAULT_TEAMS);
    
    // Match simulation state
    const [teamA, setTeamA] = useState("Argentina");
    const [teamB, setTeamB] = useState("Brazil");
    const [matchResult, setMatchResult] = useState(null);
    const [simulating, setSimulating] = useState(false);

    // Solo team prediction state
    const [selectedTeam, setSelectedTeam] = useState("");
    const [form, setForm] = useState({ ranking: "", attack: "", midfield: "", defense: "", goals: "" });
    const [soloResult, setSoloResult] = useState("");
    const [confidence, setConfidence] = useState(null);
    const [soloLoading, setSoloLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:5050/teams")
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    const enhanced = response.data.map((t, idx) => ({
                        ...t,
                        form: t.form || (idx % 2 === 0 ? ["W", "W", "D", "W", "W"] : ["W", "D", "W", "L", "W"]),
                        h2h_wins: t.h2h_wins || Math.floor(Math.random() * 6) + 4
                    }));
                    setTeams(enhanced);
                }
            })
            .catch((err) => {
                console.log("Using demo team dataset:", err.message);
            });
    }, []);

    // Helper: Find team by name
    const getTeamObj = (name) => {
        return teams.find(t => t.team.toLowerCase() === name.toLowerCase()) || {
            team: name, ranking: 15, attack: 75, midfield: 75, defense: 75, goals: 8,
            form: ["W", "D", "W", "L", "W"], h2h_wins: 5
        };
    };

    // Calculate Head to Head & Match simulation locally if server is slow
    const calculateMatchLocally = (objA, objB) => {
        const attA = Number(objA.attack || 75), midA = Number(objA.midfield || 75), defA = Number(objA.defense || 75), rankA = Number(objA.ranking || 15);
        const attB = Number(objB.attack || 75), midB = Number(objB.midfield || 75), defB = Number(objB.defense || 75), rankB = Number(objB.ranking || 15);

        const ratingA = (attA * 0.35 + midA * 0.30 + defA * 0.25 + (48 - rankA) * 0.5);
        const ratingB = (attB * 0.35 + midB * 0.30 + defB * 0.25 + (48 - rankB) * 0.5);
        const diff = ratingA - ratingB;

        let winA = maxMin(45 + diff * 2.1, 10, 80);
        let winB = maxMin(45 - diff * 2.1, 10, 80);
        let draw = maxMin(100 - winA - winB, 12, 35);

        const total = winA + draw + winB;
        const winA_pct = Math.round((winA / total) * 1000) / 10;
        const draw_pct = Math.round((draw / total) * 1000) / 10;
        const winB_pct = Math.round((winB / total) * 1000) / 10;

        const goalsA = Math.max(0, Math.round((attA / Math.max(defB, 50)) * 1.5));
        const goalsB = Math.max(0, Math.round((attB / Math.max(defA, 50)) * 1.4));

        const factors = [];
        if (attA > attB) {
            factors.push(`${objA.team}'s attacking line (${attA}) outmatches ${objB.team}'s defense rating (${defB}).`);
        } else {
            factors.push(`${objB.team}'s attack (${attB}) possesses superior goal-scoring power.`);
        }

        if (midA >= midB) {
            factors.push(`${objA.team} holds midfield control with an average rating of ${midA}.`);
        } else {
            factors.push(`${objB.team}'s midfield dynamic (${midB}) creates higher chance creation.`);
        }

        if (rankA < rankB) {
            factors.push(`${objA.team} enters with a superior FIFA World Ranking (#${rankA} vs #${rankB}).`);
        } else {
            factors.push(`${objB.team} holds the higher FIFA World Ranking position (#${rankB} vs #${rankA}).`);
        }

        return {
            teamA: objA.team,
            teamB: objB.team,
            winA_pct,
            draw_pct,
            winB_pct,
            scoreline: `${goalsA} - ${goalsB}`,
            goalsA,
            goalsB,
            factors,
            objA,
            objB
        };
    };

    const maxMin = (val, min, max) => Math.max(min, Math.min(max, val));

    // Handle Head-to-Head Match Simulation
    const handleSimulateMatch = () => {
        if (teamA === teamB) {
            setError("Please select two different teams for comparison.");
            return;
        }

        setError("");
        setSimulating(true);

        const objA = getTeamObj(teamA);
        const objB = getTeamObj(teamB);

        axios.post("http://127.0.0.1:5050/predict-match", { teamA: objA, teamB: objB })
            .then((res) => {
                setMatchResult({
                    ...res.data,
                    objA,
                    objB
                });
            })
            .catch(() => {
                // Fallback local calculation
                const fallbackRes = calculateMatchLocally(objA, objB);
                setMatchResult(fallbackRes);
            })
            .finally(() => {
                setSimulating(false);
            });
    };

    // Auto simulate match on selection
    useEffect(() => {
        if (mode === "match" && teamA && teamB && teamA !== teamB) {
            handleSimulateMatch();
        }
    }, [teamA, teamB, mode]);

    // Handle Solo Team selection
    const handleTeamSelect = (e) => {
        const teamName = e.target.value;
        setSelectedTeam(teamName);
        setSoloResult("");
        setConfidence(null);
        setError("");

        if (!teamName) {
            setForm({ ranking: "", attack: "", midfield: "", defense: "", goals: "" });
            return;
        }

        const team = teams.find((t) => t.team === teamName);
        if (team) {
            setForm({
                ranking: team.ranking,
                attack: team.attack,
                midfield: team.midfield,
                defense: team.defense,
                goals: team.goals
            });
        }
    };

    // Handle Solo Predict button
    const predictSolo = () => {
        setSoloResult("");
        setConfidence(null);
        setError("");

        if (!form.ranking || !form.attack || !form.midfield || !form.defense || !form.goals) {
            setError("All stat fields are required.");
            return;
        }

        setSoloLoading(true);

        axios.post("http://127.0.0.1:5050/predict", {
            ranking: Number(form.ranking),
            attack: Number(form.attack),
            midfield: Number(form.midfield),
            defense: Number(form.defense),
            goals: Number(form.goals)
        })
            .then((res) => {
                setSoloResult(res.data.prediction);
                if (res.data.confidence !== null) setConfidence(res.data.confidence);
            })
            .catch(() => {
                // Fallback math calculation
                const avg = (Number(form.attack) + Number(form.midfield) + Number(form.defense)) / 3;
                const bonus = (48 - Number(form.ranking)) * 0.5;
                const score = avg - 50 + bonus;
                const isHigh = score > 20;
                setSoloResult(isHigh ? "High Chance" : "Low Chance");
                setConfidence(Math.round(Math.min(98, Math.max(60, 50 + Math.abs(score)))));
            })
            .finally(() => {
                setSoloLoading(false);
            });
    };

    const objA = getTeamObj(teamA);
    const objB = getTeamObj(teamB);

    return (
        <div className="prediction-page-container">
            {/* HEADER */}
            <div className="prediction-header">
                <h1>🤖 AI World Cup Prediction Engine</h1>
                <p>অ্যাডভান্সড মেশিন লার্নিং ও গাণিতিক অ্যালগরিদমে ম্যাচের সম্ভাব্য জয় ও স্কোরলাইন সিমুলেশন</p>

                {/* MODE TOGGLE */}
                <div className="prediction-mode-toggle">
                    <button
                        className={`mode-btn ${mode === "match" ? "active" : ""}`}
                        onClick={() => setMode("match")}
                    >
                        ⚔️ Head-to-Head Match Simulator
                    </button>
                    <button
                        className={`mode-btn ${mode === "solo" ? "active" : ""}`}
                        onClick={() => setMode("solo")}
                    >
                        📊 Solo Qualification Evaluator
                    </button>
                </div>
            </div>

            {error && <div className="error-box">{error}</div>}

            {/* ================= MODE 1: MATCH SIMULATOR ================= */}
            {mode === "match" && (
                <div className="match-simulator-section">
                    {/* TEAM SELECTORS */}
                    <div className="match-selector-card">
                        <div className="team-select-box">
                            <label>Team A (Home):</label>
                            <select
                                className="team-dropdown"
                                value={teamA}
                                onChange={(e) => setTeamA(e.target.value)}
                            >
                                {teams.map((t) => (
                                    <option key={t.team} value={t.team}>
                                        {countryFlags[t.team] || "🚩"} {t.team} (#{t.ranking})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="vs-badge">VS</div>

                        <div className="team-select-box">
                            <label>Team B (Away):</label>
                            <select
                                className="team-dropdown"
                                value={teamB}
                                onChange={(e) => setTeamB(e.target.value)}
                            >
                                {teams.map((t) => (
                                    <option key={t.team} value={t.team}>
                                        {countryFlags[t.team] || "🚩"} {t.team} (#{t.ranking})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* MATCH SIMULATION RESULT DISPLAY */}
                    {simulating ? (
                        <div className="loading-box">⏳ Simulating AI match outcome...</div>
                    ) : matchResult ? (
                        <div className="match-result-card">
                            {/* EXPECTED SCORELINE BANNER */}
                            <div className="scoreline-banner">
                                <div className="team-side left">
                                    <span className="team-flag-lg">{countryFlags[matchResult.teamA] || "🚩"}</span>
                                    <span className="team-name-lg">{matchResult.teamA}</span>
                                </div>

                                <div className="score-display">
                                    <span className="score-text">{matchResult.scoreline}</span>
                                    <span className="ai-est-badge">AI Projected Score</span>
                                </div>

                                <div className="team-side right">
                                    <span className="team-name-lg">{matchResult.teamB}</span>
                                    <span className="team-flag-lg">{countryFlags[matchResult.teamB] || "🚩"}</span>
                                </div>
                            </div>

                            {/* WIN PROBABILITY PROGRESS BAR */}
                            <div className="probability-container">
                                <h3>📊 Win / Draw Probability Breakdown</h3>

                                <div className="probability-labels">
                                    <span className="prob-lbl team-a-color">
                                        {countryFlags[matchResult.teamA]} {matchResult.teamA}: <b>{matchResult.winA_pct}%</b>
                                    </span>
                                    <span className="prob-lbl draw-color">
                                        🤝 Draw: <b>{matchResult.draw_pct}%</b>
                                    </span>
                                    <span className="prob-lbl team-b-color">
                                        {countryFlags[matchResult.teamB]} {matchResult.teamB}: <b>{matchResult.winB_pct}%</b>
                                    </span>
                                </div>

                                {/* MULTI-SEGMENTED PROGRESS BAR */}
                                <div className="multi-progress-bar">
                                    <div
                                        className="bar-seg seg-team-a"
                                        style={{ width: `${matchResult.winA_pct}%` }}
                                        title={`${matchResult.teamA} Win: ${matchResult.winA_pct}%`}
                                    />
                                    <div
                                        className="bar-seg seg-draw"
                                        style={{ width: `${matchResult.draw_pct}%` }}
                                        title={`Draw: ${matchResult.draw_pct}%`}
                                    />
                                    <div
                                        className="bar-seg seg-team-b"
                                        style={{ width: `${matchResult.winB_pct}%` }}
                                        title={`${matchResult.teamB} Win: ${matchResult.winB_pct}%`}
                                    />
                                </div>
                            </div>

                            {/* HEAD TO HEAD & RECENT FORM GRID */}
                            <div className="h2h-form-grid">
                                {/* TEAM A FORM */}
                                <div className="team-stat-col">
                                    <h4>{countryFlags[matchResult.teamA]} {matchResult.teamA} Form</h4>
                                    <div className="form-pills">
                                        {(objA.form || ["W", "W", "D", "W", "W"]).map((f, i) => (
                                            <span key={i} className={`form-pill ${f === "W" ? "win" : f === "D" ? "draw" : "loss"}`}>
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="sub-stat">H2H Wins: <b>{objA.h2h_wins || 8}</b></p>
                                </div>

                                {/* STAT COMPARISON CENTER */}
                                <div className="stat-compare-center">
                                    <h4>⚔️ Head-to-Head Comparison</h4>
                                    <div className="compare-bar-item">
                                        <span>Attack: {objA.attack || 75} vs {objB.attack || 75}</span>
                                    </div>
                                    <div className="compare-bar-item">
                                        <span>Midfield: {objA.midfield || 75} vs {objB.midfield || 75}</span>
                                    </div>
                                    <div className="compare-bar-item">
                                        <span>Defense: {objA.defense || 75} vs {objB.defense || 75}</span>
                                    </div>
                                </div>

                                {/* TEAM B FORM */}
                                <div className="team-stat-col">
                                    <h4>{countryFlags[matchResult.teamB]} {matchResult.teamB} Form</h4>
                                    <div className="form-pills">
                                        {(objB.form || ["W", "D", "W", "L", "W"]).map((f, i) => (
                                            <span key={i} className={`form-pill ${f === "W" ? "win" : f === "D" ? "draw" : "loss"}`}>
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="sub-stat">H2H Wins: <b>{objB.h2h_wins || 6}</b></p>
                                </div>
                            </div>

                            {/* KEY FACTORS SUMMARY TEXT */}
                            <div className="key-factors-box">
                                <h3>💡 Key Prediction Factors & Summary</h3>
                                <ul>
                                    {matchResult.factors && matchResult.factors.map((factor, idx) => (
                                        <li key={idx}>🔹 {factor}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {/* ================= MODE 2: SOLO TEAM PREDICTOR ================= */}
            {mode === "solo" && (
                <div className="solo-predictor-section">
                    <div className="solo-card">
                        <h3>📊 Select Team or Input Manual Attributes</h3>

                        <select
                            className="team-dropdown-solo"
                            value={selectedTeam}
                            onChange={handleTeamSelect}
                        >
                            <option value="">-- Select Team Preset --</option>
                            {teams.map((t) => (
                                <option value={t.team} key={t.team}>
                                    {countryFlags[t.team] || "🚩"} {t.team}
                                </option>
                            ))}
                        </select>

                        <div className="prediction-form-grid">
                            <div className="input-group">
                                <label>FIFA Ranking:</label>
                                <input
                                    type="number"
                                    name="ranking"
                                    placeholder="e.g. 1"
                                    value={form.ranking}
                                    onChange={(e) => setForm({ ...form, ranking: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Attack Rating:</label>
                                <input
                                    type="number"
                                    name="attack"
                                    placeholder="e.g. 88"
                                    value={form.attack}
                                    onChange={(e) => setForm({ ...form, attack: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Midfield Rating:</label>
                                <input
                                    type="number"
                                    name="midfield"
                                    placeholder="e.g. 87"
                                    value={form.midfield}
                                    onChange={(e) => setForm({ ...form, midfield: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Defense Rating:</label>
                                <input
                                    type="number"
                                    name="defense"
                                    placeholder="e.g. 86"
                                    value={form.defense}
                                    onChange={(e) => setForm({ ...form, defense: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Avg Goals Scored:</label>
                                <input
                                    type="number"
                                    name="goals"
                                    placeholder="e.g. 13"
                                    value={form.goals}
                                    onChange={(e) => setForm({ ...form, goals: e.target.value })}
                                />
                            </div>
                        </div>

                        <button className="predict-btn" onClick={predictSolo} disabled={soloLoading}>
                            {soloLoading ? "Evaluating Model..." : "Evaluate Qualification Chance"}
                        </button>
                    </div>

                    {soloResult && (
                        <div className={`result-box ${soloResult === "High Chance" ? "high" : "low"}`}>
                            <h2>
                                {soloResult === "High Chance" ? "🏆 High Qualification & Title Chance" : "📉 Moderate / Low Qualification Chance"}
                            </h2>
                            {confidence !== null && (
                                <p className="confidence">
                                    Model Confidence Score: <b>{confidence}%</b>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Prediction;