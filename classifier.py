def predict_category(message: str):

    message = message.lower()

    if "payment" in message or "refund" in message or "charged" in message:
        return "Payment"

    elif "login" in message or "password" in message or "account" in message:
        return "Account"

    elif "crash" in message or "error" in message or "bug" in message:
        return "Technical"

    elif "delivery" in message or "order" in message or "shipping" in message:
        return "Delivery"

    else:
        return "General"


def predict_priority(message: str):

    message = message.lower()

    high_priority_words = [
        "urgent",
        "immediately",
        "fraud",
        "hacked",
        "stolen",
        "money deducted",
        "payment failed"
    ]

    for word in high_priority_words:
        if word in message:
            return "High"

    medium_priority_words = [
        "problem",
        "issue",
        "not working",
        "failed",
        "error"
    ]

    for word in medium_priority_words:
        if word in message:
            return "Medium"

    return "Low"


def predict_sentiment(message: str):

    message = message.lower()

    negative_words = [
        "angry",
        "bad",
        "worst",
        "terrible",
        "frustrated",
        "frustrating",
        "hate",
        "disappointed",
        "failed",
        "problem",
        "issue",
        "not working"
    ]

    positive_words = [
        "good",
        "great",
        "excellent",
        "thank",
        "thanks",
        "happy",
        "helpful",
        "awesome",
        "solved"
    ]

    for word in negative_words:
        if word in message:
            return "Negative"

    for word in positive_words:
        if word in message:
            return "Positive"

    return "Neutral"