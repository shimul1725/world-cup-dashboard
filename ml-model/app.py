from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd


app = Flask(__name__)

CORS(app)


# Load model
with open("model.pkl","rb") as f:
    model = pickle.load(f)



@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.json

        print("DATA RECEIVED:", data)


        # Validation - check required fields
        required_fields = ["ranking", "attack", "midfield", "defense", "goals"]

        for field in required_fields:

            if field not in data or data[field] == "" or data[field] is None:

                print("MISSING FIELD:", field)

                return jsonify({

                    "error": f"Missing field: {field}"

                }), 400


        input_data = pd.DataFrame([{

            "ranking": float(data["ranking"]),
            "attack": float(data["attack"]),
            "midfield": float(data["midfield"]),
            "defense": float(data["defense"]),
            "goals": float(data["goals"])

        }])


        print("INPUT DATA:")
        print(input_data)


        print("MODEL TYPE:")
        print(type(model))


        try:
            print("MODEL FEATURES:")
            print(model.feature_names_in_)

        except:
            print("NO FEATURE NAME")


        prediction = model.predict(input_data)


        print("MODEL RESULT:")
        print(prediction)


        # Try to get confidence/probability
        confidence = None

        try:

            proba = model.predict_proba(input_data)

            print("MODEL PROBABILITY:")
            print(proba)

            confidence = round(float(max(proba[0])) * 100, 2)

        except:

            print("MODEL HAS NO predict_proba")



        if str(prediction[0]) == "1":

            result = "High Chance"

        else:

            result = "Low Chance"



        return jsonify({

            "prediction": result,

            "confidence": confidence

        })



    except Exception as e:


        print("ERROR:", e)


        return jsonify({

            "error": str(e)

        }), 500




# NEW ROUTE - get all teams from data.csv

@app.route("/teams", methods=["GET"])
def get_teams():

    try:

        df = pd.read_csv("data.csv")

        print("TEAMS LOADED:", len(df))

        teams_list = df.to_dict(orient="records")

        return jsonify(teams_list)


    except Exception as e:

        print("ERROR:", e)

        return jsonify({

            "error": str(e)

        }), 500




# NEW ROUTE - Head-to-Head Match Prediction Simulation
@app.route("/predict-match", methods=["POST"])
def predict_match():
    try:
        data = request.json
        teamA = data.get("teamA")
        teamB = data.get("teamB")

        if not teamA or not teamB:
            return jsonify({"error": "Both teamA and teamB parameters are required"}), 400

        # Calculate performance ratings
        attA, midA, defA, rankA = float(teamA.get("attack", 75)), float(teamA.get("midfield", 75)), float(teamA.get("defense", 75)), float(teamA.get("ranking", 15))
        attB, midB, defB, rankB = float(teamB.get("attack", 75)), float(teamB.get("midfield", 75)), float(teamB.get("defense", 75)), float(teamB.get("ranking", 15))

        ratingA = (attA * 0.35 + midA * 0.30 + defA * 0.25 + (48 - rankA) * 0.5)
        ratingB = (attB * 0.35 + midB * 0.30 + defB * 0.25 + (48 - rankB) * 0.5)

        diff = ratingA - ratingB

        # Win probabilities
        winA_prob = max(10, min(80, round(50 + diff * 1.8, 1)))
        winB_prob = max(10, min(80, round(50 - diff * 1.8, 1)))
        draw_prob = max(10, round(100 - winA_prob - winB_prob, 1))

        # Re-normalize to 100%
        total = winA_prob + draw_prob + winB_prob
        winA_pct = round((winA_prob / total) * 100, 1)
        draw_pct = round((draw_prob / total) * 100, 1)
        winB_pct = round((winB_prob / total) * 100, 1)

        # Expected scoreline calculation
        goalsA = max(0, int(round((attA / max(defB, 50)) * 1.55)))
        goalsB = max(0, int(round((attB / max(defA, 50)) * 1.45)))
        
        if abs(diff) < 2 and goalsA == goalsB:
            goalsA = max(1, goalsA)
            goalsB = goalsA

        # Summary key factors
        factors = []
        if attA > attB:
            factors.append(f"{teamA.get('team', 'Team A')}'s attack ({attA}) outmatches {teamB.get('team', 'Team B')}'s attack ({attB}).")
        else:
            factors.append(f"{teamB.get('team', 'Team B')}'s attack ({attB}) has higher firepower than {teamA.get('team', 'Team A')}'s ({attA}).")

        if midA > midB:
            factors.append(f"Midfield control favors {teamA.get('team', 'Team A')} ({midA} vs {midB}).")
        else:
            factors.append(f"{teamB.get('team', 'Team B')} dominates midfield creation ({midB} vs {midA}).")

        if rankA < rankB:
            factors.append(f"{teamA.get('team', 'Team A')} holds a superior FIFA World Ranking (#{int(rankA)} vs #{int(rankB)}).")
        else:
            factors.append(f"{teamB.get('team', 'Team B')} holds a superior FIFA World Ranking (#{int(rankB)} vs #{int(rankA)}).")

        return jsonify({
            "teamA": teamA.get("team", "Team A"),
            "teamB": teamB.get("team", "Team B"),
            "winA_pct": winA_pct,
            "draw_pct": draw_pct,
            "winB_pct": winB_pct,
            "scoreline": f"{goalsA} - {goalsB}",
            "goalsA": goalsA,
            "goalsB": goalsB,
            "factors": factors
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5050,
        debug=True
    )