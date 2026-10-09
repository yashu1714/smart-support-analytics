
def predict_category(message: str):
    message = message.lower()

    if any(word in message for word in [
        "payment", "refund", "charged", "billing", "transaction"
    ]):
        return "Payment"

    elif any(word in message for word in [
        "login", "log in", "password", "account", "otp", "sign in"
    ]):
        return "Account"

    elif any(word in message for word in [
        "crash", "crashed", "crashing", "error", "bug",
        "application", "app", "not opening", "stopped working"
    ]):
        return "Technical"

    elif any(word in message for word in [
        "delivery", "order", "shipping", "shipment", "courier"
    ]):
        return "Delivery"

    return "General"


def predict_priority(message: str):
    message = message.lower()

    high_priority_words = [
        "crash",
        "crashed",
        "crashing",
        "application crashed",
        "app crashed",
        "completely down",
        "system down",
        "urgent",
        "immediately",
        "fraud",
        "hacked",
        "stolen",
        "money deducted",
        "payment failed",
        "account blocked",
        "data loss",
    ]

    if any(word in message for word in high_priority_words):
        return "High"

    medium_priority_words = [
        "problem",
        "issue",
        "not working",
        "failed",
        "failure",
        "error",
        "bug",
        "slow",
        "delay",
        "unable to",
        "not opening",
    ]

    if any(word in message for word in medium_priority_words):
        return "Medium"

    return "Low"


def predict_sentiment(message: str):
    message = message.lower()

    negative_words = [
        "crash",
        "crashed",
        "crashing",
        "angry",
        "bad",
        "worst",
        "terrible",
        "frustrated",
        "frustrating",
        "hate",
        "disappointed",
        "failed",
        "failure",
        "problem",
        "issue",
        "not working",
        "error",
        "bug",
        "broken",
        "unable to",
        "not opening",
        "slow",
        "delayed",
        "money deducted",
        "payment failed",
    ]

    positive_words = [
        "great",
        "excellent",
        "thank you",
        "thanks",
        "happy",
        "helpful",
        "awesome",
        "solved",
        "resolved",
        "working fine",
        "works perfectly",
    ]

    if any(word in message for word in negative_words):
        return "Negative"

    if any(word in message for word in positive_words):
        return "Positive"

    return "Neutral"
