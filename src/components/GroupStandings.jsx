import React, { useState } from "react";
import "./GroupStandings.css";

/**
 * GroupStandings – displays World Cup group tables (A‑H).
 *
 * The component keeps a small static example dataset. In a real app you would
 * fetch the data from an API and pass it via props. The UI consists of a row of
 * tabs for each group; clicking a tab shows the corresponding points table.
 *
 * Dark‑mode colours are defined in `GroupStandings.css` using CSS variables so
 * they automatically follow the app theme.
 */
const sampleData = {
  A: [
    { team: "Argentina", P: 3, W: 2, D: 0, L: 1, GD: 4, Pts: 6 },
    { team: "France", P: 3, W: 2, D: 0, L: 1, GD: 2, Pts: 6 },
    { team: "Poland", P: 3, W: 1, D: 1, L: 1, GD: -1, Pts: 4 },
    { team: "Mexico", P: 3, W: 0, D: 1, L: 2, GD: -5, Pts: 1 },
  ],
  B: [
    { team: "England", P: 3, W: 2, D: 1, L: 0, GD: 3, Pts: 7 },
    { team: "USA", P: 3, W: 2, D: 0, L: 1, GD: 2, Pts: 6 },
    { team: "Iran", P: 3, W: 1, D: 0, L: 2, GD: -2, Pts: 3 },
    { team: "Wales", P: 3, W: 0, D: 1, L: 2, GD: -3, Pts: 1 },
  ],
  // ... add groups C‑H similarly or fetch dynamically
};

function GroupStandings({ data = sampleData }) {
  const groups = Object.keys(data);
  const [activeGroup, setActiveGroup] = useState(groups[0]);

  return (
    <section className="group-standings" aria-label="World Cup group standings">
      <h2 className="gs-title">Group Standings</h2>
      <div className="gs-tabs" role="tablist">
        {groups.map((g) => (
          <button
            key={g}
            role="tab"
            aria-selected={activeGroup === g}
            className={`gs-tab ${activeGroup === g ? "active" : ""}`}
            onClick={() => setActiveGroup(g)}
          >
            Group {g}
          </button>
        ))}
      </div>
      <table className="gs-table" aria-describedby={`Group ${activeGroup} standings`}>
        <thead>
          <tr>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {data[activeGroup].map((row) => (
            <tr key={row.team} className="gs-row">
              <td>{row.team}</td>
              <td>{row.P}</td>
              <td>{row.W}</td>
              <td>{row.D}</td>
              <td>{row.L}</td>
              <td>{row.GD}</td>
              <td>{row.Pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default GroupStandings;
