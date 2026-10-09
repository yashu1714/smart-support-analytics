import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState({});
  const [priority, setPriority] = useState({});
  const [sentiment, setSentiment] = useState({});
  const [tickets, setTickets] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");

  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sentimentFilter, setSentimentFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  async function fetchAnalytics() {
    try {
      const [
        summaryResponse,
        categoriesResponse,
        priorityResponse,
        sentimentResponse,
        ticketsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/analytics/summary`),
        fetch(`${API_URL}/analytics/categories`),
        fetch(`${API_URL}/analytics/priority`),
        fetch(`${API_URL}/analytics/sentiment`),
        fetch(`${API_URL}/tickets`),
      ]);

      if (
        !summaryResponse.ok ||
        !categoriesResponse.ok ||
        !priorityResponse.ok ||
        !sentimentResponse.ok ||
        !ticketsResponse.ok
      ) {
        throw new Error("Failed to fetch dashboard data.");
      }

      const summaryData = await summaryResponse.json();
      const categoriesData = await categoriesResponse.json();
      const priorityData = await priorityResponse.json();
      const sentimentData = await sentimentResponse.json();
      const ticketsData = await ticketsResponse.json();

      setSummary(summaryData);
      setCategories(categoriesData);
      setPriority(priorityData);
      setSentiment(sentimentData);
      setTickets(ticketsData);

      setError("");
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        "Unable to connect to FastAPI. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);


  async function createTicket(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = customerName.trim();
    const trimmedMessage = message.trim();

    // Validate empty fields
    if (!trimmedName || !trimmedMessage) {
      const errorMessage =
        "Please enter both customer name and support message.";

      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Reject names containing only numbers or symbols
    if (!/[a-zA-Z]/.test(trimmedName)) {
      const errorMessage =
        "Please enter a valid customer name containing letters.";

      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Reject messages containing only numbers or symbols
    if (!/[a-zA-Z]/.test(trimmedMessage)) {
      const errorMessage =
        "Please enter a valid support message containing letters.";

      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: trimmedName,
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      // Handle backend validation errors
      if (!response.ok) {
        const errorDetail = data.detail;

        if (Array.isArray(errorDetail)) {
          const messageError = errorDetail.find((item) =>
            item.loc?.includes("message")
          );

          const nameError = errorDetail.find((item) =>
            item.loc?.includes("customer_name")
          );

          if (messageError) {
            throw new Error(
              "Please enter a valid support message containing letters."
            );
          }

          if (nameError) {
            throw new Error(
              "Please enter a valid customer name containing letters."
            );
          }

          throw new Error(
            "Please enter a valid customer name and support message."
          );
        }

        throw new Error(
          typeof errorDetail === "string"
            ? errorDetail
            : "Unable to create ticket. Please try again."
        );
      }

      // Clear the form after success
      setCustomerName("");
      setMessage("");

      const successMessage =
        `Ticket #${data.id} created successfully!`;

      setSuccess(
        `${successMessage} Category: ${data.category} | ` +
          `Priority: ${data.priority} | ` +
          `Sentiment: ${data.sentiment}`
      );

      // Toast notifications
      toast.success(successMessage);

      toast.info(
        `Category: ${data.category} | ` +
          `Priority: ${data.priority} | ` +
          `Sentiment: ${data.sentiment}`
      );

      // Refresh dashboard
      await fetchAnalytics();
    } catch (err) {
      console.error("Create ticket error:", err);

      const errorMessage =
        err.message || "Unable to create ticket. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const search = searchTerm.toLowerCase().trim();

    const customer = (ticket.customer_name || "").toLowerCase();
    const ticketMessage = (ticket.message || "").toLowerCase();

    const matchesSearch =
      search === "" ||
      customer.includes(search) ||
      ticketMessage.includes(search);

    const matchesCategory =
      categoryFilter === "All" ||
      ticket.category === categoryFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      ticket.priority === priorityFilter;

    const matchesSentiment =
      sentimentFilter === "All" ||
      ticket.sentiment === sentimentFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriority &&
      matchesSentiment
    );
  });

  if (loading) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        <div className="loading">Loading analytics...</div>
      </>
    );
  }

  const totalTickets = summary?.total_tickets || 0;
  const highPriority = summary?.high_priority_tickets || 0;
  const negativeSentiment =
    summary?.negative_sentiment_tickets || 0;
  const openTickets = summary?.open_tickets || 0;

  const categoryChartData = Object.entries(categories).map(
    ([name, value]) => ({ name, value })
  );

  const priorityChartData = Object.entries(priority).map(
    ([name, value]) => ({ name, value })
  );

  const sentimentChartData = Object.entries(sentiment).map(
    ([name, value]) => ({ name, value })
  );

  let topCategory = "None";
  let topCategoryCount = 0;

  Object.entries(categories).forEach(([category, count]) => {
    if (count > topCategoryCount) {
      topCategory = category;
      topCategoryCount = count;
    }
  });

  const negativePercentage =
    totalTickets > 0
      ? Math.round((negativeSentiment / totalTickets) * 100)
      : 0;

  const highPriorityPercentage =
    totalTickets > 0
      ? Math.round((highPriority / totalTickets) * 100)
      : 0;

  const sentimentColors = ["#ef4444", "#22c55e", "#94a3b8"];

  const priorityColors = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#22c55e",
  };

  return (
    <div className="dashboard">
      {/* TOAST NOTIFICATIONS */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>Smart Support Analytics</h1>
          <p>AI-powered customer support insights</p>
        </div>

        <div className="status">
          <span></span>
          API Connected
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="cards">
        <div className="card">
          <p>Total Tickets</p>
          <h2>{totalTickets}</h2>
        </div>

        <div className="card">
          <p>Open Tickets</p>
          <h2>{openTickets}</h2>
        </div>

        <div className="card">
          <p>High Priority</p>
          <h2>{highPriority}</h2>
        </div>

        <div className="card">
          <p>Negative Sentiment</p>
          <h2>{negativeSentiment}</h2>
        </div>
      </section>

      {/* AI INSIGHTS */}
      <section className="panel insights-panel">
        <div className="section-title">
          <div>
            <h3>AI Insights</h3>
            <p>Automatically generated from support data</p>
          </div>

          <span className="insight-label">Analytics</span>
        </div>

        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div>
              <h4>Most Common Category</h4>
              <strong>{topCategory}</strong>
              <p>{topCategoryCount} tickets belong to this category.</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">🚨</div>
            <div>
              <h4>Priority Alert</h4>
              <strong>{highPriority} High</strong>
              <p>
                {highPriorityPercentage}% of all tickets are high
                priority.
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">😟</div>
            <div>
              <h4>Customer Sentiment</h4>
              <strong>{negativePercentage}% Negative</strong>
              <p>Monitor negative customer experiences closely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CREATE TICKET */}
      <section className="panel ticket-form-panel">
        <h3>Create Support Ticket</h3>

        <form onSubmit={createTicket}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                id="customerName"
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="supportMessage">Support Message</label>
              <input
                id="supportMessage"
                type="text"
                placeholder="Describe the customer's problem"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={1000}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting
              ? "Analyzing..."
              : "Create & Analyze Ticket"}
          </button>
        </form>

        {success && (
          <div className="success-message" role="status">
            {success}
          </div>
        )}

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
      </section>

      {/* CHARTS */}
      <section className="charts-grid">
        {/* CATEGORY CHART */}
        <div className="panel chart-panel">
          <h3>Tickets by Category</h3>
          <p className="chart-description">
            Distribution of customer support requests
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryChartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="value"
                name="Tickets"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PRIORITY CHART */}
        <div className="panel chart-panel">
          <h3>Priority Distribution</h3>
          <p className="chart-description">
            Current ticket priority levels
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={priorityChartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar
                dataKey="value"
                name="Tickets"
                radius={[6, 6, 0, 0]}
              >
                {priorityChartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={priorityColors[entry.name] || "#6366f1"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SENTIMENT CHART */}
        <div className="panel chart-panel sentiment-chart">
          <h3>Sentiment Distribution</h3>
          <p className="chart-description">
            Customer sentiment across tickets
          </p>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={sentimentChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                label
              >
                {sentimentChartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      sentimentColors[index % sentimentColors.length]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* SUPPORT TICKETS */}
      <section className="panel">
        <div className="tickets-header">
          <div>
            <h3>Support Tickets</h3>
            <p>Search and filter AI-classified tickets</p>
          </div>

          <strong>
            {filteredTickets.length} of {tickets.length} tickets
          </strong>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="ticket-filters">
          <input
            type="text"
            className="search-input"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="All">All Categories</option>

            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={sentimentFilter}
            onChange={(event) =>
              setSentimentFilter(event.target.value)
            }
          >
            <option value="All">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>

          <button
            type="button"
            className="clear-filters"
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("All");
              setPriorityFilter("All");
              setSentimentFilter("All");
            }}
          >
            Clear
          </button>
        </div>

        {/* TICKET TABLE */}
        <div className="ticket-table">
          <div className="ticket-row ticket-heading">
            <span>ID</span>
            <span>Customer</span>
            <span>Message</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Sentiment</span>
            <span>Status</span>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="empty-tickets">
              No matching tickets found.
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div className="ticket-row" key={ticket.id}>
                <span>#{ticket.id}</span>
                <span>{ticket.customer_name}</span>

                <span className="ticket-message">
                  {ticket.message}
                </span>

                <span className="badge category-badge">
                  {ticket.category}
                </span>

                <span
                  className={`badge priority-${(
                    ticket.priority || ""
                  ).toLowerCase()}`}
                >
                  {ticket.priority}
                </span>

                <span
                  className={`badge sentiment-${(
                    ticket.sentiment || ""
                  ).toLowerCase()}`}
                >
                  {ticket.sentiment}
                </span>

                <span className="badge status-badge">
                  {ticket.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;