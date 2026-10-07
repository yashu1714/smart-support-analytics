import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = BASE_DIR / "dataset" / "tickets.csv"

data = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully!")
print(f"Total records: {len(data)}")


X = data["message"]
y = data["category"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

category_model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=(1, 2)
        )
    ),

    (
        "classifier",
        LogisticRegression(
            max_iter=1000
        )
    )
])

category_model.fit(
    X_train,
    y_train
)

y_pred = category_model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("\n==============================")
print("CATEGORY MODEL")
print("==============================")

print(
    f"Accuracy: {accuracy:.2%}"
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred
    )
)

category_model_path = (
    BASE_DIR / "ticket_category_model.pkl"
)

joblib.dump(
    category_model,
    category_model_path
)

print(
    f"\nCategory model saved to:"
    f"\n{category_model_path}"
)

priority_data = [

    # High priority

    ("My account has been hacked", "High"),
    ("Someone stole money from my account", "High"),
    ("There is a fraudulent transaction on my card", "High"),
    ("My card was stolen", "High"),
    ("Money was deducted from my account without permission", "High"),
    ("Someone charged my card twice and I need help immediately", "High"),
    ("My account has been compromised", "High"),
    ("I see an unauthorized transaction", "High"),
    ("My payment was made without my permission", "High"),
    ("This is urgent, my money is missing", "High"),
    ("My card has been used by someone else", "High"),
    ("I need immediate help with a fraudulent payment", "High"),

    # Medium priority

    ("My payment failed", "Medium"),
    ("The application is showing an error", "Medium"),
    ("My account login is not working", "Medium"),
    ("My order delivery is delayed", "Medium"),
    ("The website is not working properly", "Medium"),
    ("I cannot reset my password", "Medium"),
    ("The payment is stuck", "Medium"),
    ("My application keeps crashing", "Medium"),
    ("I cannot access my account", "Medium"),
    ("My shipment is delayed", "Medium"),
    ("The app is showing an error message", "Medium"),
    ("My refund is taking a long time", "Medium"),

    # Low priority

    ("How can I change my password", "Low"),
    ("Where can I track my order", "Low"),
    ("I want to update my account details", "Low"),
    ("How do I check my shipment status", "Low"),
    ("Can you explain the payment process", "Low"),
    ("How can I update my profile", "Low"),
    ("Where can I find my order details", "Low"),
    ("I want information about my account", "Low"),
    ("How do I change my username", "Low"),
    ("Can I update my customer information", "Low"),
    ("Where can I see my transaction history", "Low"),
    ("How can I track my package", "Low"),
]


priority_df = pd.DataFrame(
    priority_data,
    columns=["message", "priority"]
)

X_priority = priority_df["message"]
y_priority = priority_df["priority"]


priority_model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=(1, 2)
        )
    ),

    (
        "classifier",
        LogisticRegression(
            max_iter=1000
        )
    )
])


priority_model.fit(
    X_priority,
    y_priority
)

priority_model_path = (
    BASE_DIR / "ticket_priority_model.pkl"
)

joblib.dump(
    priority_model,
    priority_model_path
)


print(
    "\nPriority model trained successfully!"
)

print(
    f"Priority model saved to:"
    f"\n{priority_model_path}"
)
sentiment_data = [

    # Negative

    ("I am very angry about this problem", "Negative"),
    ("This is the worst service", "Negative"),
    ("I am extremely frustrated", "Negative"),
    ("My payment failed and I am disappointed", "Negative"),
    ("The application is terrible", "Negative"),
    ("I hate this service", "Negative"),
    ("My money was deducted and I am angry", "Negative"),
    ("This issue is very frustrating", "Negative"),
    ("I am unhappy with the service", "Negative"),
    ("My order has not arrived and I am disappointed", "Negative"),
    ("The application keeps crashing and it is frustrating", "Negative"),
    ("I am having a terrible experience", "Negative"),

    # Positive

    ("Thank you for helping me", "Positive"),
    ("The issue has been solved", "Positive"),
    ("Great support from your team", "Positive"),
    ("I am happy with the service", "Positive"),
    ("Excellent customer support", "Positive"),
    ("Thank you, everything is working now", "Positive"),
    ("The problem was solved quickly", "Positive"),
    ("Awesome service", "Positive"),
    ("I really appreciate your help", "Positive"),
    ("Great experience", "Positive"),
    ("The support team was very helpful", "Positive"),
    ("Thanks for solving my issue", "Positive"),

    # Neutral

    ("I want to change my password", "Neutral"),
    ("Where can I track my order", "Neutral"),
    ("I need information about my account", "Neutral"),
    ("How can I update my profile", "Neutral"),
    ("Where is my order", "Neutral"),
    ("I want to know my transaction status", "Neutral"),
    ("How do I reset my password", "Neutral"),
    ("Can I update my account details", "Neutral"),
    ("I need help with my account", "Neutral"),
    ("Where can I find my order details", "Neutral"),
    ("How can I track my package", "Neutral"),
    ("I want to know about my payment", "Neutral"),
]


sentiment_df = pd.DataFrame(
    sentiment_data,
    columns=["message", "sentiment"]
)

X_sentiment = sentiment_df["message"]
y_sentiment = sentiment_df["sentiment"]


sentiment_model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=(1, 2)
        )
    ),

    (
        "classifier",
        LogisticRegression(
            max_iter=1000
        )
    )
])


sentiment_model.fit(
    X_sentiment,
    y_sentiment
)

sentiment_model_path = (
    BASE_DIR / "ticket_sentiment_model.pkl"
)

joblib.dump(
    sentiment_model,
    sentiment_model_path
)


print(
    "\nSentiment model trained successfully!"
)

print(
    f"Sentiment model saved to:"
    f"\n{sentiment_model_path}"
)

print("\n====================================")
print("ALL ML MODELS TRAINED SUCCESSFULLY!")
print("====================================")