import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "../App.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
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

function PredictionChart({ teams }) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("chance_desc"); // 'chance_desc', 'rank_asc', 'name_asc'
    const [viewType, setViewType] = useState("cards"); // 'cards' or 'chart'

    const allTeams = teams && teams.length > 0 ? teams : [
        { team: "Argentina", chance: 94, ranking: 1 },
        { team: "France", chance: 91, ranking: 2 },
        { team: "Spain", chance: 88, ranking: 3 },
        { team: "England", chance: 85, ranking: 4 },
        { team: "Brazil", chance: 84, ranking: 5 },
        { team: "Belgium", chance: 78, ranking: 6 },
        { team: "Netherlands", chance: 76, ranking: 7 },
        { team: "Portugal", chance: 75, ranking: 8 },
        { team: "Germany", chance: 74, ranking: 11 }
    ];

    // Filter by search query
    let processedTeams = allTeams.filter(item =>
        item.team.toLowerCase().includes(search.toLowerCase())
    );

    // Sort teams
    if (sortBy === "chance_desc") {
        processedTeams.sort((a, b) => b.chance - a.chance);
    } else if (sortBy === "rank_asc") {
        processedTeams.sort((a, b) => a.ranking - b.ranking);
    } else if (sortBy === "name_asc") {
        processedTeams.sort((a, b) => a.team.localeCompare(b.team));
    }

    const topTeamsForChart = processedTeams.slice(0, 10);

    const chartData = {
        labels: topTeamsForChart.map((item) => `${countryFlags[item.team] || ""} ${item.team}`),
        datasets: [
            {
                label: "Winning Chance %",
                data: topTeamsForChart.map((item) => item.chance),
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return "#1e3a8a";
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, "#0a1f44");
                    gradient.addColorStop(1, "#38bdf8");
                    return gradient;
                },
                borderRadius: 8,
                maxBarThickness: 45
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                backgroundColor: "#0a1f44",
                padding: 12,
                titleFont: { weight: "bold", size: 14 },
                callbacks: {
                    label: (ctx) => ` Win Chance: ${ctx.parsed.y}%`
                }
            },
            datalabels: {
                anchor: "end",
                align: "top",
                color: "#0a1f44",
                font: { weight: "bold", size: 12 },
                formatter: (val) => val + "%"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: "#f1f5f9" },
                ticks: { callback: (val) => val + "%" }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    const getProgressColorClass = (chance) => {
        if (chance >= 85) return "elite-bar";
        if (chance >= 70) return "contender-bar";
        return "challenger-bar";
    };

    return (
        <div className="live-visualizer-container">
            {/* WIDGET HEADER WITH PULSE EFFECT */}
            <div className="visualizer-header">
                <div className="visualizer-title-box">
                    <span className="pulse-live-tag">
                        <span className="pulse-dot"></span> LIVE AI PROBABILITIES
                    </span>
                    <h2>📊 Live Win Chances Visualizer</h2>
                </div>

                {/* SEARCH, SORT & VIEW TOGGLE CONTROLS */}
                <div className="visualizer-controls">
                    {/* Search Bar */}
                    <div className="search-box-sm">
                        <input
                            type="text"
                            placeholder="🔍 Filter country..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        className="sort-dropdown-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="chance_desc">Sort by Win Chance 📈</option>
                        <option value="rank_asc">Sort by FIFA Rank 🏆</option>
                        <option value="name_asc">Sort Alphabetically A-Z 🔤</option>
                    </select>

                    {/* View Switcher Toggle */}
                    <div className="viz-toggle-group">
                        <button
                            className={`viz-btn ${viewType === "cards" ? "active" : ""}`}
                            onClick={() => setViewType("cards")}
                            title="Interactive Progress Cards View"
                        >
                            🎴 Cards
                        </button>
                        <button
                            className={`viz-btn ${viewType === "chart" ? "active" : ""}`}
                            onClick={() => setViewType("chart")}
                            title="Chart View"
                        >
                            📊 Chart
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            {viewType === "cards" ? (
                /* RESPONSIVE PROGRESS CARDS GRID */
                <div className="visualizer-cards-grid">
                    {processedTeams.map((team, idx) => (
                        <div className="visualizer-card" key={team.team || idx}>
                            <div className="viz-card-top">
                                <div className="viz-team-info">
                                    <span className="viz-flag">{countryFlags[team.team] || "🚩"}</span>
                                    <span className="viz-team-name">{team.team}</span>
                                </div>
                                <span className="viz-rank-tag">Rank #{team.ranking}</span>
                            </div>

                            <div className="viz-stat-row">
                                <span className="viz-stat-label">Championship Probability</span>
                                <span className="viz-stat-value">{team.chance}%</span>
                            </div>

                            {/* ANIMATED PROGRESS BAR */}
                            <div className="viz-progress-track">
                                <div
                                    className={`viz-progress-fill ${getProgressColorClass(team.chance)}`}
                                    style={{ width: `${team.chance}%` }}
                                />
                            </div>
                        </div>
                    ))}

                    {processedTeams.length === 0 && (
                        <div className="no-viz-data">
                            <span>🔍</span>
                            <p>কোনো টিম খুঁজে পাওয়া যায়নি</p>
                        </div>
                    )}
                </div>
            ) : (
                /* CHART VIEW */
                <div className="chart-view-wrapper">
                    {topTeamsForChart.length > 0 ? (
                        <Bar data={chartData} options={chartOptions} />
                    ) : (
                        <p className="no-viz-data">কোনো তথ্য পাওয়া যায়নি</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default PredictionChart;