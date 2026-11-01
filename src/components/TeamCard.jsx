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

function TeamCard({ name, chance, ranking, flag }) {
    const displayFlag = flag || countryFlags[name] || "🚩";

    return (
        <div className="team-card">
            <div className="card-top">
                <h2>
                    <span className="card-flag">{displayFlag}</span> {name}
                </h2>

                {ranking && (
                    <span className="world-rank">🌍 Rank #{ranking}</span>
                )}
            </div>

            <div className="chance-row">
                <span className="chance-lbl">Winning Chance</span>
                <span className="chance-val">{chance}%</span>
            </div>

            <div className="progress">
                <div
                    className="bar"
                    style={{ width: `${chance}%` }}
                />
            </div>
        </div>
    );
}

export default TeamCard;