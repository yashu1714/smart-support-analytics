# 🤖 Smart Support Analytics

An AI-powered customer support analytics dashboard that automatically analyzes support tickets, classifies customer issues, and provides useful insights through an interactive web dashboard.

This project combines **Python, FastAPI, Machine Learning, SQL, and React** to build an end-to-end customer support analytics system.

## 📌 Project Overview
Customer support teams receive a large number of support requests every day.
Manually analyzing and categorizing these requests can be time-consuming.
**Smart Support Analytics** helps automate this process by:
- Automatically classifying support tickets
- Detecting ticket priority
- Analyzing customer sentiment
- Storing tickets in a SQL database
- Providing analytics through interactive charts
- Searching and filtering support tickets
- Displaying important support insights

## 🚀 Live Demo

live link :  (https://smart-support-analytics-4tol.vercel.app/)**

## ✨ Features

### 🤖 AI Ticket Classification

The application uses a Machine Learning model to classify customer support tickets into different categories:

- Payment
- Account
- Technical
- Delivery
- General

The category classification model uses:

**TF-IDF + Logistic Regression**

---

### 🚨 Priority Detection

Each support ticket is assigned a priority level:

- 🔴 High
- 🟡 Medium
- 🟢 Low

Priority detection is implemented using rule-based logic based on important keywords and phrases.

---

### 😊 Sentiment Analysis

Customer messages are classified into:

- 🟢 Positive
- ⚪ Neutral
- 🔴 Negative

Sentiment classification is implemented using rule-based logic.

---

## 📊 Analytics Dashboard

The dashboard provides important customer support metrics such as:

- Total Tickets
- Open Tickets
- High Priority Tickets
- Negative Sentiment Tickets
- Most Common Ticket Category
- Priority Distribution
- Sentiment Distribution

---

## 📈 Data Visualization

The dashboard provides interactive charts for:

### Tickets by Category

Shows the distribution of support tickets across different categories.

### Priority Distribution

Shows the number of High, Medium, and Low priority tickets.

### Sentiment Distribution

Shows the distribution of Positive, Neutral, and Negative customer sentiment.

Charts are implemented using **Recharts**.

---

## 🔎 Search and Filtering

Support tickets can be searched using:

- Customer name
- Ticket message

Tickets can also be filtered by:

- Category
- Priority
- Sentiment

A clear filters option is also available.

---

## 🔔 Toast Notifications

The application uses **React Toastify** to provide user-friendly notifications.

Notifications are displayed for:

- Successful ticket creation
- Ticket analysis results
- Invalid form input
- API errors
- Backend connection errors

---

## 🧠 Machine Learning

The project uses Machine Learning for automatic ticket category classification.

### ML Pipeline

```text
Customer Support Message
          ↓
    TF-IDF Vectorization
          ↓
    Logistic Regression
          ↓
    Category Prediction
```

### TF-IDF

TF-IDF converts text messages into numerical features based on the importance of words in the dataset.

It helps the Machine Learning model understand which words are useful for identifying different ticket categories.

### Logistic Regression

Logistic Regression is used as the classification algorithm to predict the category of a customer support message.

It is lightweight and works effectively with TF-IDF text features.

---

## 📊 Model Performance

The category classification model was evaluated using a test dataset.

The model achieved approximately:

**86.67% Accuracy**

The model evaluation includes:

- Accuracy
- Precision
- Recall
- F1-score

The dataset contains support ticket examples covering multiple customer support categories.

---

## 🏗️ System Architecture

```text
                    Customer
                       │
                       ▼
              React Dashboard
                       │
                       │ REST API
                       ▼
                    FastAPI
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
       ML Classification    Rule-Based Logic
              │                 │
              │          ┌──────┴──────┐
              │          │             │
              ▼          ▼             ▼
          Category     Priority     Sentiment
              │          │             │
              └──────────┴─────────────┘
                         │
                         ▼
                  SQLite Database
                         │
                         ▼
                  Analytics APIs
                         │
                         ▼
                 React Dashboard
                         │
                         ▼
                Charts & Insights
```

---

## 🔄 Application Workflow

When a customer support ticket is created:

```text
1. User enters customer name and support message
                    ↓
2. React sends the ticket to FastAPI
                    ↓
3. FastAPI receives the request
                    ↓
4. ML model predicts the ticket category
                    ↓
5. Rule-based logic determines priority
                    ↓
6. Rule-based logic determines sentiment
                    ↓
7. Ticket is stored in SQLite
                    ↓
8. FastAPI returns the analysis
                    ↓
9. React displays the result using Toastify
                    ↓
10. Dashboard analytics are refreshed
```

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- Vite
- HTML
- CSS
- Recharts
- React Toastify

### Backend

- Python
- FastAPI
- Uvicorn

### Database

- SQLite
- SQLAlchemy

### Machine Learning

- Pandas
- NumPy
- Scikit-learn
- TF-IDF
- Logistic Regression
- Joblib

### Development Tools

- VS Code
- Git
- GitHub

---

## 📂 Project Structure

```text
smart-support-analytics/
│
├── dataset/
│   └── tickets.csv
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── classifier.py
├── database.py
├── main.py
├── ml_model.py
├── models.py
├── requirements.txt
├── ticket_category_model.pkl
├── train_model.py
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Home

```http
GET /
```

Checks whether the FastAPI application is running.

---

### Create Support Ticket

```http
POST /tickets
```

Creates a new ticket and automatically analyzes the customer message.

Example request:

```json
{
  "customer_name": "John",
  "message": "My payment failed and money was deducted"
}
```

The API returns:

- Ticket ID
- Customer name
- Message
- Category
- Category confidence
- Priority
- Sentiment
- Status

---

### Get All Tickets

```http
GET /tickets
```

Returns all support tickets stored in the database.

---

### Get Single Ticket

```http
GET /tickets/{ticket_id}
```

Returns a specific ticket using its ID.

---

### Analytics Summary

```http
GET /analytics/summary
```

Returns overall support statistics including:

- Total tickets
- Open tickets
- High-priority tickets
- Payment tickets
- Negative sentiment tickets

---

### Category Analytics

```http
GET /analytics/categories
```

Returns ticket counts grouped by category.

---

### Priority Analytics

```http
GET /analytics/priority
```

Returns ticket counts grouped by priority.

---

### Sentiment Analytics

```http
GET /analytics/sentiment
```

Returns ticket counts grouped by sentiment.

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yashu1714/smart-support-analytics.git
```

Move into the project:

```bash
cd smart-support-analytics
```

---

## 🐍 Backend Setup

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## ⚛️ Frontend Setup

Open another terminal.

Navigate to the frontend folder:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Vite will display the frontend URL in the terminal.

For example:

```text
http://localhost:5174
```

---

## 🧪 Example Ticket

### Input

```text
Customer Name:
Rahul

Support Message:
My card was charged twice for the same purchase
```

### System Processing

```text
Support Message
       ↓
TF-IDF + Logistic Regression
       ↓
Category: Payment
       ↓
Priority Detection
       ↓
Sentiment Detection
       ↓
SQLite Database
```

### Dashboard

The ticket is then displayed in the support ticket table and included in the analytics dashboard.

---

## 🎯 Use Cases

Smart Support Analytics can help customer support teams:

- Automatically categorize incoming support requests
- Identify high-priority issues
- Monitor customer sentiment
- Understand common customer problems
- Search historical support tickets
- Filter tickets based on different attributes
- Monitor support trends using analytics dashboards

---

## 🚀 Future Enhancements

Possible future improvements include:

- Advanced NLP-based sentiment analysis
- Larger and more diverse training datasets
- Real-time ticket updates
- User authentication
- Role-based access control
- Ticket status management
- Analytics report export
- Model performance monitoring
- Cloud deployment
- Integration with real customer support platforms

---

## 📚 Learning Outcomes

This project provided practical experience with:

- Building REST APIs using FastAPI
- Connecting React with a Python backend
- Working with SQLite databases
- Using SQLAlchemy for database operations
- Preparing text data for Machine Learning
- TF-IDF text feature extraction
- Logistic Regression classification
- Machine Learning model evaluation
- Building analytics dashboards
- Creating interactive charts
- Implementing search and filtering
- Using Git and GitHub for version control

---

## 👨‍💻 Author

### N Yaswanth

Computer Science Engineering Graduate

GitHub:

https://github.com/yashu1714
