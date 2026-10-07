import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "ticket_category_model.pkl"

model = joblib.load(MODEL_PATH)

def predict_category(message: str):

    prediction = model.predict([message])

    return prediction[0]

def predict_category_with_confidence(message: str):

    prediction = model.predict([message])[0]

    probabilities = model.predict_proba([message])[0]

    confidence = max(probabilities)

    return {
        "category": prediction,
        "confidence": round(
            float(confidence) * 100,
            2
        )
    }