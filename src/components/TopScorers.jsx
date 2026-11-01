import React from "react";
import "./TopScorers.css";

/**
 * TopScorers – leaderboard of the leading goal‑scorers.
 *
 * Props:
 *   data – array of player objects. Each object should contain:
 *     name, country (ISO code or full name), flag (emoji or image URL),
 *     goals, assists, matches.
 *   If no data is supplied a small static sample is rendered.
 *
 * The UI highlights the top‑3 players with a podium style; the rest are shown
 * in a simple list/table.
 */
const sampleScorers = [
  {
    name: "Lionel Messi",
    country: "Argentina",
    flag: "🇦🇷",
    goals: 5,
    assists: 2,
    matches: 3,
  },
  {
    name: "Kylian Mbappé",
    country: "France",
    flag: "🇫🇷",
    goals: 4,
    assists: 1,
    matches: 3,
  },
  {
    name: "Neymar Jr.",
    country: "Brazil",
    flag: "🇧🇷",
    goals: 4,
    assists: 2,
    matches: 3,
  },
  {
    name: "Harry Kane",
    country: "England",
    flag: "🏴",
    goals: 3,
    assists: 1,
    matches: 3,
  },
  {
    name: "Alvaro Morata",
    country: "Spain",
    flag: "🇪🇸",
    goals: 3,
    assists: 0,
    matches: 3,
  },
];

function TopScorers({ data = sampleScorers }) {
  // sort descending by goals, then assists
  const sorted = [...data].sort((a, b) =>
    b.goals - a.goals || b.assists - a.assists
  );
  const topThree = sorted.slice(0, 3);
  const others = sorted.slice(3);

  return (
    <section className="top-scorers" aria-label="Top scorers leaderboard">
      <h2 className="ts-title">Top Scorers</h2>
      <div className="ts-podium">
        {topThree
          .map((player, idx) => ({ player, rank: idx + 1 }))
          .sort((a, b) => b.rank - a.rank) // display 2nd, 1st, 3rd left‑to‑right
          .map(({ player, rank }) => (
            <div key={player.name} className={`podium-item rank-${rank}`}>
              <div className="podium-rank">{rank}</div>
              <div className="podium-flag">{player.flag}</div>
              <div className="podium-name">{player.name}</div>
              <div className="podium-stats">
                <span>{player.goals} ⚽</span>
                <span>{player.assists} 🅰️</span>
                <span>{player.matches} 🟰</span>
              </div>
            </div>
          ))}
      </div>
      {others.length > 0 && (
        <table className="ts-table" aria-describedby="additional scorers">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Goals</th>
              <th>Assists</th>
              <th>Matches</th>
            </tr>
          </thead>
          <tbody>
            {others.map((p, i) => (
              <tr key={p.name} className="ts-row">
                <td>{i + 4}</td>
                <td>
                  <span className="ts-flag">{p.flag}</span> {p.name}
                </td>
                <td>{p.goals}</td>
                <td>{p.assists}</td>
                <td>{p.matches}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default TopScorers;
