import pandas as pd

from sklearn.ensemble import RandomForestClassifier

import pickle



# Load dataset

data = pd.read_csv("data.csv")



# Input features

X = data[
    [
        "ranking",
        "attack",
        "midfield",
        "defense",
        "goals"
    ]
]



# Output

y = data["winner"]



# Create model

model = RandomForestClassifier(
    random_state=42
)



# Train model

model.fit(
    X,
    y
)

import pandas as pd

from sklearn.ensemble import RandomForestClassifier

import pickle



# Load dataset

data = pd.read_csv("data.csv")



# Input features

X = data[
    [
        "ranking",
        "attack",
        "midfield",
        "defense",
        "goals"
    ]
]



# Output

y = data["winner"]



# Create model

model = RandomForestClassifier(
    random_state=42
)



# Train model

model.fit(
    X,
    y
)



# Save model

pickle.dump(
    model,
    open("model.pkl","wb")
)



print("Model Saved")

# Save model

pickle.dump(
    model,
    open("model.pkl","wb")
)



print("Model Saved")