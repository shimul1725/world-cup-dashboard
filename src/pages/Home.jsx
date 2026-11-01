import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PredictionChart from "../components/PredictionChart";
import "../App.css";

// Comprehensive FIFA Demo Ranking Dataset
const DEMO_FIFA_RANKINGS = [
    { rank: 1, team: "Argentina", flag: "🇦🇷", points: "1889.02", attack: 88, midfield: 87, defense: 86, trend: "🟢 =" },
    { rank: 2, team: "France", flag: "🇫🇷", points: "1854.91", attack: 90, midfield: 86, defense: 85, trend: "🟢 =" },
    { rank: 3, team: "Spain", flag: "🇪🇸", points: "1835.67", attack: 87, midfield: 89, defense: 84, trend: "⬆️ +1" },
    { rank: 4, team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", points: "1813.81", attack: 86, midfield: 86, defense: 85, trend: "🔻 -1" },
    { rank: 5, team: "Brazil", flag: "🇧🇷", points: "1772.02", attack: 89, midfield: 85, defense: 84, trend: "🟢 =" },
    { rank: 6, team: "Belgium", flag: "🇧🇪", points: "1768.14", attack: 83, midfield: 84, defense: 80, trend: "⬆️ +1" },
    { rank: 7, team: "Netherlands", flag: "🇳🇱", points: "1759.95", attack: 84, midfield: 82, defense: 85, trend: "🔻 -1" },
    { rank: 8, team: "Portugal", flag: "🇵🇹", points: "1752.68", attack: 87, midfield: 86, defense: 83, trend: "🟢 =" },
    { rank: 9, team: "Colombia", flag: "🇨🇴", points: "1738.72", attack: 82, midfield: 83, defense: 81, trend: "⬆️ +2" },
    { rank: 10, team: "Italy", flag: "🇮🇹", points: "1726.90", attack: 81, midfield: 83, defense: 86, trend: "🔻 -1" },
    { rank: 11, team: "Germany", flag: "🇩🇪", points: "1703.59", attack: 86, midfield: 87, defense: 82, trend: "⬆️ +1" },
    { rank: 12, team: "Uruguay", flag: "🇺🇾", points: "1695.91", attack: 82, midfield: 81, defense: 83, trend: "🔻 -1" },
    { rank: 13, team: "Croatia", flag: "🇭🇷", points: "1688.42", attack: 80, midfield: 86, defense: 82, trend: "🟢 =" },
    { rank: 14, team: "Morocco", flag: "🇲🇦", points: "1681.57", attack: 81, midfield: 82, defense: 84, trend: "⬆️ +1" },
    { rank: 15, team: "Japan", flag: "🇯🇵", points: "1649.33", attack: 80, midfield: 82, defense: 80, trend: "⬆️ +2" },
    { rank: 16, team: "USA", flag: "🇺🇸", points: "1632.40", attack: 79, midfield: 80, defense: 78, trend: "🔻 -1" }
];

function Home() {
    const [teams, setTeams] = useState([]);
    const [rankingList, setRankingList] = useState(DEMO_FIFA_RANKINGS);
    const [rankSearch, setRankSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:5050/teams")
            .then((response) => {
                const rawTeams = response.data;
                const teamsWithChance = rawTeams.map((team) => {
                    const avgStat = (team.attack + team.midfield + team.defense) / 3;
                    const rankingBonus = (48 - team.ranking) * 0.5;
                    let chance = avgStat - 50 + rankingBonus;
                    if (chance > 98) chance = 98;
                    if (chance < 5) chance = 5;

                    return {
                        ...team,
                        chance: Math.round(chance)
                    };
                });

                teamsWithChance.sort((a, b) => b.chance - a.chance);
                setTeams(teamsWithChance);
            })
            .catch((error) => {
                console.log("Using demo team data for chart:", error.message);
                const demoChartTeams = DEMO_FIFA_RANKINGS.map(item => {
                    const avgStat = (item.attack + item.midfield + item.defense) / 3;
                    const rankingBonus = (48 - item.rank) * 0.5;
                    let chance = Math.round(avgStat - 50 + rankingBonus);
                    if (chance > 98) chance = 98;
                    if (chance < 5) chance = 5;
                    return {
                        team: item.team,
                        ranking: item.rank,
                        chance: chance
                    };
                });
                setTeams(demoChartTeams);
            });
    }, []);

    // Filter rankings dynamically
    const filteredRankings = rankingList.filter(item =>
        item.team.toLowerCase().includes(rankSearch.toLowerCase()) ||
        `#${item.rank}`.includes(rankSearch)
    );

    const getRankBadge = (rank) => {
        if (rank === 1) return <span className="gold-medal">🥇 #1</span>;
        if (rank === 2) return <span className="silver-medal">🥈 #2</span>;
        if (rank === 3) return <span className="bronze-medal">🥉 #3</span>;
        return <span className="standard-rank">#{rank}</span>;
    };

    return (
        <div className="home-container">
            {/* HERO SECTION */}
            <div className="hero">
                <h1>🏆 FIFA World Cup 2026 Prediction</h1>
                <p>AI এবং অ্যাডভান্সড অ্যানালিটিক্স দিয়ে জেনে নিন কোন টিমের ট্রফি জেতার সম্ভাবনা কতটুকু</p>

                <div className="hero-buttons">
                    <button onClick={() => navigate("/prediction")}>
                        Predict Now 🚀
                    </button>
                    <button className="secondary" onClick={() => navigate("/compare")}>
                        Compare Teams ⚔️
                    </button>
                </div>
            </div>

            {/* FEATURE CARDS */}
            <div className="feature-section">
                <div className="feature-card" onClick={() => navigate("/prediction")}>
                    <span className="feature-icon">🤖</span>
                    <h3>AI Prediction</h3>
                    <p>মেশিন লার্নিং মডেল দিয়ে জয়ের সম্ভাবনা জানুন</p>
                </div>

                <div className="feature-card" onClick={() => navigate("/compare")}>
                    <span className="feature-icon">⚔️</span>
                    <h3>Team Compare</h3>
                    <p>দুটো টিমের স্ট্যাটস সরাসরি তুলনা করুন</p>
                </div>

                <div className="feature-card" onClick={() => navigate("/players")}>
                    <span className="feature-icon">👥</span>
                    <h3>Players Directory</h3>
                    <p>বিশ্বকাপের সেরা ফুটবলারদের তথ্য ও ফিল্টার দেখুন</p>
                </div>
            </div>

            {/* LIVE WIN CHANCES CHART */}
            <div className="section-divider">
                <h2>📊 Live Win Chances Visualizer</h2>
            </div>
            <PredictionChart teams={teams} />

            {/* LATEST WORLD RANKINGS WIDGET SECTION */}
            <div className="section-divider">
                <h2>🌍 Latest World Rankings</h2>
                <p className="section-subtitle">FIFA অফিসিয়াল র্যাঙ্কিং পয়েন্ট ও ট্রেন্ড অনুযায়ী শীর্ষ দলসমূহ</p>
            </div>

            <div className="rankings-widget-container">
                <div className="rankings-widget-header">
                    <div className="widget-title-box">
                        <span className="fifa-badge">FIFA</span>
                        <span className="widget-heading">Men's World Ranking</span>
                    </div>

                    {/* Ranking Search Input */}
                    <div className="rankings-search-box">
                        <input
                            type="text"
                            placeholder="🔍 Filter team name..."
                            value={rankSearch}
                            onChange={(e) => setRankSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* RANKING LIST TABLE */}
                <div className="rankings-table-wrapper">
                    <table className="rankings-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Country / Team</th>
                                <th>FIFA Points</th>
                                <th>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRankings.map((item) => (
                                <tr key={item.rank} className={item.rank <= 3 ? "top-three-row" : ""}>
                                    <td className="rank-cell">
                                        {getRankBadge(item.rank)}
                                    </td>

                                    <td className="team-cell">
                                        <span className="flag-icon">{item.flag}</span>
                                        <span className="team-title-name">{item.team}</span>
                                    </td>

                                    <td className="points-cell">
                                        <span className="pts-number">{item.points}</span>
                                        <span className="pts-unit"> pts</span>
                                    </td>

                                    <td className="trend-cell">
                                        <span className="trend-badge">{item.trend}</span>
                                    </td>
                                </tr>
                            ))}

                            {filteredRankings.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="no-rank-data">
                                        কোনো টিম পাওয়া যায়নি
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Home;