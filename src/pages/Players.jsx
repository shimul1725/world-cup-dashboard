import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

// Flag helper
const countryFlags = {
    "Argentina": "🇦🇷",
    "Brazil": "🇧🇷",
    "France": "🇫🇷",
    "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Spain": "🇪🇸",
    "Germany": "🇩🇪",
    "Portugal": "🇵🇹"
};

// Initial demo players database
const DEMO_PLAYERS = [
    // Argentina
    { _id: "arg1", name: "Lionel Messi", team: "Argentina", role: "Forward", goals: 13, assist: 8, rating: 9.7, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Lionel_Messi_20180626.jpg/440px-Lionel_Messi_20180626.jpg" },
    { _id: "arg2", name: "Julián Álvarez", team: "Argentina", role: "Forward", goals: 8, assist: 3, rating: 8.7, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Juli%C3%A1n_%C3%81lvarez_2022.jpg/440px-Juli%C3%A1n_%C3%81lvarez_2022.jpg" },
    { _id: "arg3", name: "Rodrigo De Paul", team: "Argentina", role: "Midfielder", goals: 3, assist: 6, rating: 8.4, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rodrigo_De_Paul_2022.jpg/440px-Rodrigo_De_Paul_2022.jpg" },
    { _id: "arg4", name: "Emiliano Martínez", team: "Argentina", role: "Goalkeeper", goals: 0, assist: 0, rating: 8.9, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Emiliano_Mart%C3%ADnez_2022.jpg/440px-Emiliano_Mart%C3%ADnez_2022.jpg" },
    
    // Brazil
    { _id: "bra1", name: "Vinícius Júnior", team: "Brazil", role: "Forward", goals: 11, assist: 7, rating: 9.4, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Vinicius_Jr_2021.jpg/440px-Vinicius_Jr_2021.jpg" },
    { _id: "bra2", name: "Rodrygo", team: "Brazil", role: "Forward", goals: 7, assist: 5, rating: 8.6, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Rodrygo_Goes_2021.jpg/440px-Rodrygo_Goes_2021.jpg" },
    { _id: "bra3", name: "Bruno Guimarães", team: "Brazil", role: "Midfielder", goals: 4, assist: 6, rating: 8.5, photo: "" },
    { _id: "bra4", name: "Alisson Becker", team: "Brazil", role: "Goalkeeper", goals: 0, assist: 0, rating: 8.8, photo: "" },
    
    // France
    { _id: "fra1", name: "Kylian Mbappé", team: "France", role: "Forward", goals: 14, assist: 6, rating: 9.8, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/2019-06-11_Russia-Finland_%28cropped%29.jpg/440px-2019-06-11_Russia-Finland_%28cropped%29.jpg" },
    { _id: "fra2", name: "Antoine Griezmann", team: "France", role: "Midfielder", goals: 6, assist: 9, rating: 8.9, photo: "" },
    { _id: "fra3", name: "Eduardo Camavinga", team: "France", role: "Midfielder", goals: 2, assist: 4, rating: 8.4, photo: "" },
    { _id: "fra4", name: "Mike Maignan", team: "France", role: "Goalkeeper", goals: 0, assist: 0, rating: 8.7, photo: "" },
    
    // England
    { _id: "eng1", name: "Jude Bellingham", team: "England", role: "Midfielder", goals: 10, assist: 7, rating: 9.5, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Jude_Bellingham_2023.jpg/440px-Jude_Bellingham_2023.jpg" },
    { _id: "eng2", name: "Harry Kane", team: "England", role: "Forward", goals: 12, assist: 5, rating: 9.2, photo: "" },
    { _id: "eng3", name: "Bukayo Saka", team: "England", role: "Forward", goals: 8, assist: 8, rating: 8.8, photo: "" },
    { _id: "eng4", name: "Declan Rice", team: "England", role: "Midfielder", goals: 3, assist: 4, rating: 8.5, photo: "" },
    
    // Spain
    { _id: "esp1", name: "Lamine Yamal", team: "Spain", role: "Forward", goals: 9, assist: 10, rating: 9.6, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Lamine_Yamal_2024.jpg/440px-Lamine_Yamal_2024.jpg" },
    { _id: "esp2", name: "Rodri", team: "Spain", role: "Midfielder", goals: 5, assist: 7, rating: 9.6, photo: "" },
    { _id: "esp3", name: "Pedri", team: "Spain", role: "Midfielder", goals: 4, assist: 8, rating: 8.9, photo: "" },
    { _id: "esp4", name: "Unai Simón", team: "Spain", role: "Goalkeeper", goals: 0, assist: 0, rating: 8.4, photo: "" },
    
    // Germany
    { _id: "ger1", name: "Jamal Musiala", team: "Germany", role: "Midfielder", goals: 9, assist: 6, rating: 9.3, photo: "" },
    { _id: "ger2", name: "Florian Wirtz", team: "Germany", role: "Midfielder", goals: 8, assist: 9, rating: 9.1, photo: "" },
    { _id: "ger3", name: "Joshua Kimmich", team: "Germany", role: "Defender", goals: 3, assist: 7, rating: 8.6, photo: "" },
    { _id: "ger4", name: "Manuel Neuer", team: "Germany", role: "Goalkeeper", goals: 0, assist: 0, rating: 8.5, photo: "" },
    
    // Portugal
    { _id: "por1", name: "Cristiano Ronaldo", team: "Portugal", role: "Forward", goals: 11, assist: 3, rating: 9.1, photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/440px-Cristiano_Ronaldo_2018.jpg" },
    { _id: "por2", name: "Bruno Fernandes", team: "Portugal", role: "Midfielder", goals: 7, assist: 11, rating: 9.1, photo: "" },
    { _id: "por3", name: "Bernardo Silva", team: "Portugal", role: "Midfielder", goals: 5, assist: 8, rating: 8.7, photo: "" },
    { _id: "por4", name: "Diogo Costa", team: "Portugal", role: "Goalkeeper", goals: 0, assist: 0, rating: 8.5, photo: "" }
];

function Players() {
    const [players, setPlayers] = useState(DEMO_PLAYERS);
    const [search, setSearch] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("All");
    const [viewMode, setViewMode] = useState("grid");
    const [showForm, setShowForm] = useState(false);
    
    const [newPlayer, setNewPlayer] = useState({
        name: "",
        team: "Argentina",
        role: "Forward",
        goals: "",
        assist: "",
        rating: "",
        photo: ""
    });
    
    const [adding, setAdding] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    const fetchPlayers = () => {
        axios.get("http://localhost:5000/players")
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    const serverPlayers = response.data;
                    const combined = [...serverPlayers];
                    
                    DEMO_PLAYERS.forEach(demoP => {
                        const exists = serverPlayers.some(sp => sp.name?.toLowerCase() === demoP.name.toLowerCase());
                        if (!exists) {
                            combined.push(demoP);
                        }
                    });
                    setPlayers(combined);
                }
            })
            .catch((error) => {
                console.log("Using demo player data:", error.message);
            });
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const filteredPlayers = players.filter(player => {
        const matchesCountry = selectedCountry === "All" || 
            (player.team || "").toLowerCase() === selectedCountry.toLowerCase();
        
        const matchesSearch = (player.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (player.team || "").toLowerCase().includes(search.toLowerCase()) ||
            (player.role || "").toLowerCase().includes(search.toLowerCase());

        return matchesCountry && matchesSearch;
    });

    const getRatingClass = (rating) => {
        if (rating >= 9) return "rating-elite";
        if (rating >= 8) return "rating-good";
        if (rating >= 7) return "rating-average";
        return "rating-low";
    };

    const getRoleBadgeClass = (role) => {
        switch ((role || "").toLowerCase()) {
            case "forward": return "role-forward";
            case "midfielder": return "role-midfielder";
            case "defender": return "role-defender";
            case "goalkeeper": return "role-goalkeeper";
            default: return "role-general";
        }
    };

    const getRoleIcon = (role) => {
        switch ((role || "").toLowerCase()) {
            case "forward": return "⚽";
            case "midfielder": return "🎯";
            case "defender": return "🛡️";
            case "goalkeeper": return "🧤";
            default: return "🏃";
        }
    };

    const handleNewPlayerChange = (e) => {
        setNewPlayer({
            ...newPlayer,
            [e.target.name]: e.target.value
        });
    };

    const handleAddPlayer = () => {
        setFormError("");
        setFormSuccess("");

        if (!newPlayer.name || !newPlayer.team) {
            setFormError("Player Name and Country/Team are required");
            return;
        }

        const ratingValue = Number(newPlayer.rating);
        if (newPlayer.rating !== "" && (ratingValue < 0 || ratingValue > 10)) {
            setFormError("Rating must be between 0 and 10");
            return;
        }

        if (Number(newPlayer.goals) < 0 || Number(newPlayer.assist) < 0) {
            setFormError("Goals/Assists cannot be negative");
            return;
        }

        setAdding(true);

        const playerPayload = {
            name: newPlayer.name,
            team: newPlayer.team,
            role: newPlayer.role || "Forward",
            goals: Number(newPlayer.goals) || 0,
            assist: Number(newPlayer.assist) || 0,
            rating: ratingValue || 0,
            photo: newPlayer.photo
        };

        axios.post("http://localhost:5000/players", playerPayload)
            .then(() => {
                setFormSuccess("✅ Player added successfully!");
                setPlayers(prev => [playerPayload, ...prev]);
                setNewPlayer({
                    name: "",
                    team: "Argentina",
                    role: "Forward",
                    goals: "",
                    assist: "",
                    rating: "",
                    photo: ""
                });
            })
            .catch(() => {
                setPlayers(prev => [playerPayload, ...prev]);
                setFormSuccess("✅ Player added locally!");
            })
            .finally(() => {
                setAdding(false);
            });
    };

    const countriesList = ["All", "Argentina", "Brazil", "France", "England", "Spain", "Germany", "Portugal"];

    return (
        <div className="players-page">
            {/* HEADER */}
            <div className="players-header">
                <h1>⭐ Country-wise Player Directory</h1>
                <p>বিশ্বকাপের দলভিত্তিক প্লেয়ার ডিরেক্টরি ও পারফরম্যান্স পরিসংখ্যান</p>

                <div className="players-summary">
                    <div className="summary-box">
                        <span className="summary-number">{filteredPlayers.length}</span>
                        <span className="summary-label">Showing Players</span>
                    </div>
                    <div className="summary-box">
                        <span className="summary-number">
                            {filteredPlayers.length > 0 ? Math.max(...filteredPlayers.map(p => p.goals || 0)) : 0}
                        </span>
                        <span className="summary-label">Max Goals</span>
                    </div>
                    <div className="summary-box">
                        <span className="summary-number">
                            {filteredPlayers.length > 0 ? (filteredPlayers.reduce((sum, p) => sum + (p.rating || 0), 0) / filteredPlayers.length).toFixed(1) : 0}
                        </span>
                        <span className="summary-label">Avg Rating</span>
                    </div>
                </div>
            </div>

            {/* FILTER TOOLBAR */}
            <div className="players-toolbar-container">
                <div className="filter-group">
                    {/* Country Selector Dropdown */}
                    <div className="country-filter">
                        <label htmlFor="country-select">🌎 Country:</label>
                        <select
                            id="country-select"
                            className="country-dropdown"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                        >
                            {countriesList.map((country) => (
                                <option key={country} value={country}>
                                    {countryFlags[country] ? `${countryFlags[country]} ${country}` : `🌐 ${country}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Input */}
                    <input
                        className="search-input"
                        placeholder="🔍 Search player, role, team..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="action-group">
                    {/* View Switcher Toggle */}
                    <div className="view-toggle">
                        <button 
                            className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                            onClick={() => setViewMode("grid")}
                            title="Grid Card View"
                        >
                            🎴 Grid
                        </button>
                        <button 
                            className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
                            onClick={() => setViewMode("table")}
                            title="Table View"
                        >
                            📋 Table
                        </button>
                    </div>

                    {/* Add Player Button */}
                    <button
                        className="add-player-btn"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? "✕ Close" : "+ Add Player"}
                    </button>
                </div>
            </div>

            {/* ADD PLAYER FORM */}
            {showForm && (
                <div className="add-player-form">
                    <h3>➕ Add New Player to Directory</h3>
                    <div className="form-grid">
                        <input
                            type="text"
                            name="name"
                            placeholder="Player Name (e.g. Lionel Messi)"
                            value={newPlayer.name}
                            onChange={handleNewPlayerChange}
                        />

                        <select
                            name="team"
                            value={newPlayer.team}
                            onChange={handleNewPlayerChange}
                            className="form-select"
                        >
                            {countriesList.filter(c => c !== "All").map(c => (
                                <option key={c} value={c}>{countryFlags[c]} {c}</option>
                            ))}
                        </select>

                        <select
                            name="role"
                            value={newPlayer.role}
                            onChange={handleNewPlayerChange}
                            className="form-select"
                        >
                            <option value="Forward">⚽ Forward</option>
                            <option value="Midfielder">🎯 Midfielder</option>
                            <option value="Defender">🛡️ Defender</option>
                            <option value="Goalkeeper">🧤 Goalkeeper</option>
                        </select>

                        <input
                            type="number"
                            name="goals"
                            placeholder="Goals"
                            min="0"
                            value={newPlayer.goals}
                            onChange={handleNewPlayerChange}
                        />

                        <input
                            type="number"
                            name="assist"
                            placeholder="Assists"
                            min="0"
                            value={newPlayer.assist}
                            onChange={handleNewPlayerChange}
                        />

                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            name="rating"
                            placeholder="Rating (0-10)"
                            value={newPlayer.rating}
                            onChange={handleNewPlayerChange}
                        />

                        <input
                            type="text"
                            name="photo"
                            placeholder="Photo URL (https://...)"
                            value={newPlayer.photo}
                            onChange={handleNewPlayerChange}
                            className="photo-input"
                        />
                    </div>

                    {newPlayer.photo && (
                        <div className="photo-preview">
                            <img src={newPlayer.photo} alt="preview" onError={(e) => e.target.style.display = "none"} />
                            <span>Image Preview</span>
                        </div>
                    )}

                    <button
                        className="submit-player-btn"
                        onClick={handleAddPlayer}
                        disabled={adding}
                    >
                        {adding ? "Saving..." : "Save Player"}
                    </button>

                    {formError && <p className="form-error">{formError}</p>}
                    {formSuccess && <p className="form-success">{formSuccess}</p>}
                </div>
            )}

            {/* DIRECTORY VIEW */}
            {viewMode === "grid" ? (
                /* GRID CARD VIEW */
                <div className="player-grid">
                    {filteredPlayers.map((player, index) => (
                        <div className="player-card" key={player._id || index}>
                            <div className="card-header-banner">
                                <span className="country-tag">
                                    {countryFlags[player.team] || "🚩"} {player.team}
                                </span>
                                <span className={`role-badge ${getRoleBadgeClass(player.role)}`}>
                                    {getRoleIcon(player.role)} {player.role || "Player"}
                                </span>
                            </div>

                            <div className="card-avatar-wrapper">
                                {player.photo ? (
                                    <img
                                        src={player.photo}
                                        alt={player.name}
                                        className="card-avatar"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            if (e.target.nextSibling) {
                                                e.target.nextSibling.style.display = "flex";
                                            }
                                        }}
                                    />
                                ) : null}
                                <div 
                                    className="card-avatar-placeholder" 
                                    style={{ display: player.photo ? "none" : "flex" }}
                                >
                                    {player.name ? player.name.charAt(0) : "?"}
                                </div>
                            </div>

                            <div className="card-info">
                                <h3 className="player-card-name">{player.name}</h3>
                                
                                <div className="card-stats-row">
                                    <div className="stat-item">
                                        <span className="stat-val">{player.goals || 0}</span>
                                        <span className="stat-lbl">⚽ Goals</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-val">{player.assist || 0}</span>
                                        <span className="stat-lbl">🅰️ Assists</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className={`rating-badge ${getRatingClass(player.rating)}`}>
                                            ⭐ {player.rating || "N/A"}
                                        </span>
                                        <span className="stat-lbl">Rating</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredPlayers.length === 0 && (
                        <div className="no-players-box">
                            <span>🔍</span>
                            <p>কোনো প্লেয়ার পাওয়া যায়নি</p>
                        </div>
                    )}
                </div>
            ) : (
                /* TABLE VIEW */
                <div className="table-wrapper">
                    <table className="players-table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Player Name</th>
                                <th>Country / Team</th>
                                <th>Role</th>
                                <th>Goals</th>
                                <th>Assists</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPlayers.map((player, index) => (
                                <tr key={player._id || index}>
                                    <td>
                                        {player.photo ? (
                                            <img
                                                src={player.photo}
                                                alt={player.name}
                                                className="player-photo"
                                                onError={(e) => { e.target.style.display = "none"; }}
                                            />
                                        ) : (
                                            <div className="player-photo-placeholder">
                                                {player.name ? player.name.charAt(0) : "?"}
                                            </div>
                                        )}
                                    </td>
                                    <td className="player-name">{player.name}</td>
                                    <td>{countryFlags[player.team] || "🚩"} {player.team}</td>
                                    <td>
                                        <span className={`role-badge ${getRoleBadgeClass(player.role)}`}>
                                            {getRoleIcon(player.role)} {player.role || "Player"}
                                        </span>
                                    </td>
                                    <td className="stat-number">{player.goals || 0}</td>
                                    <td className="stat-number">{player.assist || 0}</td>
                                    <td>
                                        <span className={`rating-badge ${getRatingClass(player.rating)}`}>
                                            ⭐ {player.rating || "N/A"}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {filteredPlayers.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="no-data">কোনো প্লেয়ার পাওয়া যায়নি</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Players;