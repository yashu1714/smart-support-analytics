import { useEffect, useState } from "react"

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
  Legend
} from "recharts"

import {
  ToastContainer,
  toast
} from "react-toastify"

import "react-toastify/dist/ReactToastify.css"


const API_URL = "http://127.0.0.1:8000"


function App() {

  const [summary, setSummary] = useState(null)

  const [categories, setCategories] = useState({})

  const [priority, setPriority] = useState({})

  const [sentiment, setSentiment] = useState({})

  const [tickets, setTickets] = useState([])

  const [customerName, setCustomerName] =
    useState("")

  const [message, setMessage] =
    useState("")


  const [searchTerm, setSearchTerm] =
    useState("")

  const [categoryFilter, setCategoryFilter] =
    useState("All")

  const [priorityFilter, setPriorityFilter] =
    useState("All")

  const [sentimentFilter, setSentimentFilter] =
    useState("All")


  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)


  async function fetchAnalytics() {

    try {

      const [
        summaryResponse,
        categoriesResponse,
        priorityResponse,
        sentimentResponse,
        ticketsResponse
      ] = await Promise.all([

        fetch(
          `${API_URL}/analytics/summary`
        ),

        fetch(
          `${API_URL}/analytics/categories`
        ),

        fetch(
          `${API_URL}/analytics/priority`
        ),

        fetch(
          `${API_URL}/analytics/sentiment`
        ),

        fetch(
          `${API_URL}/tickets`
        )

      ])


      if (
        !summaryResponse.ok ||
        !categoriesResponse.ok ||
        !priorityResponse.ok ||
        !sentimentResponse.ok ||
        !ticketsResponse.ok
      ) {

        throw new Error(
          "Failed to fetch data"
        )

      }


      const summaryData =
        await summaryResponse.json()

      const categoriesData =
        await categoriesResponse.json()

      const priorityData =
        await priorityResponse.json()

      const sentimentData =
        await sentimentResponse.json()

      const ticketsData =
        await ticketsResponse.json()


      setSummary(
        summaryData
      )

      setCategories(
        categoriesData
      )

      setPriority(
        priorityData
      )

      setSentiment(
        sentimentData
      )

      setTickets(
        ticketsData
      )

    }

    catch (error) {

      console.error(error)

      toast.error(
        "Unable to connect to FastAPI"
      )

    }

    finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    fetchAnalytics()

  }, [])



  async function createTicket(event) {

    event.preventDefault()


    if (
      !customerName.trim() ||
      !message.trim()
    ) {

      toast.warning(
        "Please enter customer name and ticket message"
      )

      return

    }


    setSubmitting(true)


    try {

      const response = await fetch(

        `${API_URL}/tickets`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            customer_name:
              customerName,

            message:
              message

          })

        }

      )


      if (!response.ok) {

        throw new Error(
          "Failed to create ticket"
        )

      }


      const newTicket =
        await response.json()


      setCustomerName("")

      setMessage("")


      toast.success(
        `Ticket #${newTicket.id} created successfully!`
      )



      toast.info(

        `Category: ${newTicket.category} | ` +
        `Priority: ${newTicket.priority} | ` +
        `Sentiment: ${newTicket.sentiment}`

      )



      await fetchAnalytics()

    }

    catch (error) {

      console.error(error)

      toast.error(
        "Unable to create ticket"
      )

    }

    finally {

      setSubmitting(false)

    }

  }



  const filteredTickets =

    tickets.filter((ticket) => {

      const search =
        searchTerm
          .toLowerCase()
          .trim()


      const matchesSearch =

        search === "" ||

        ticket.customer_name
          .toLowerCase()
          .includes(search) ||

        ticket.message
          .toLowerCase()
          .includes(search)


      const matchesCategory =

        categoryFilter === "All" ||

        ticket.category ===
          categoryFilter


      const matchesPriority =

        priorityFilter === "All" ||

        ticket.priority ===
          priorityFilter


      const matchesSentiment =

        sentimentFilter === "All" ||

        ticket.sentiment ===
          sentimentFilter


      return (

        matchesSearch &&

        matchesCategory &&

        matchesPriority &&

        matchesSentiment

      )

    })


  if (loading) {

    return (

      <div className="loading">

        Loading analytics...

      </div>

    )

  }

  const totalTickets =
    summary?.total_tickets || 0


  const highPriority =
    summary?.high_priority_tickets || 0


  const negativeSentiment =
    summary?.negative_sentiment_tickets || 0

  const categoryChartData =

    Object.entries(categories).map(

      ([name, value]) => ({

        name,
        value

      })

    )


  const priorityChartData =

    Object.entries(priority).map(

      ([name, value]) => ({

        name,
        value

      })

    )


  const sentimentChartData =

    Object.entries(sentiment).map(

      ([name, value]) => ({

        name,
        value

      })

    )



  let topCategory = "None"

  let topCategoryCount = 0


  Object.entries(categories).forEach(

    ([category, count]) => {

      if (
        count >
        topCategoryCount
      ) {

        topCategory =
          category

        topCategoryCount =
          count

      }

    }

  )

  const negativePercentage =

    totalTickets > 0

      ? Math.round(

          (
            negativeSentiment /
            totalTickets

          ) * 100

        )

      : 0


  const highPriorityPercentage =

    totalTickets > 0

      ? Math.round(

          (
            highPriority /
            totalTickets

          ) * 100

        )

      : 0

  const sentimentColors = [

    "#ef4444",

    "#22c55e",

    "#94a3b8"

  ]


  const priorityColors = {

    High: "#ef4444",

    Medium: "#f59e0b",

    Low: "#22c55e"

  }


  return (

    <div className="dashboard">


      <ToastContainer

        position="top-right"

        autoClose={3000}

        hideProgressBar={false}

        newestOnTop

        closeOnClick

        pauseOnHover

        draggable

        theme="light"

      />

      <header className="header">

        <div>

          <h1>
            Smart Support Analytics
          </h1>

          <p>
            AI-powered customer support insights
          </p>

        </div>


        <div className="status">

          <span></span>

          API Connected

        </div>

      </header>


      <section className="cards">


        <div className="card">

          <p>
            Total Tickets
          </p>

          <h2>
            {summary?.total_tickets}
          </h2>

        </div>


        <div className="card">

          <p>
            Open Tickets
          </p>

          <h2>
            {summary?.open_tickets}
          </h2>

        </div>


        <div className="card">

          <p>
            High Priority
          </p>

          <h2>
            {summary?.high_priority_tickets}
          </h2>

        </div>


        <div className="card">

          <p>
            Negative Sentiment
          </p>

          <h2>
            {summary?.negative_sentiment_tickets}
          </h2>

        </div>


      </section>

      <section className="panel insights-panel">


        <div className="section-title">

          <div>

            <h3>
              AI Insights
            </h3>

            <p>
              Automatically generated from support data
            </p>

          </div>


          <span className="insight-label">
            Analytics
          </span>

        </div>


        <div className="insights-grid">


          <div className="insight-card">

            <div className="insight-icon">
              📊
            </div>

            <div>

              <h4>
                Most Common Category
              </h4>

              <strong>
                {topCategory}
              </strong>

              <p>

                {topCategoryCount}{" "}

                tickets belong to this category.

              </p>

            </div>

          </div>


          <div className="insight-card">

            <div className="insight-icon">
              🚨
            </div>

            <div>

              <h4>
                Priority Alert
              </h4>

              <strong>
                {highPriority} High
              </strong>

              <p>

                {highPriorityPercentage}%

                {" "}

                of all tickets are high priority.

              </p>

            </div>

          </div>


          <div className="insight-card">

            <div className="insight-icon">
              😟
            </div>

            <div>

              <h4>
                Customer Sentiment
              </h4>

              <strong>
                {negativePercentage}% Negative
              </strong>

              <p>
                Monitor negative customer
                experiences closely.
              </p>

            </div>

          </div>


        </div>

      </section>


      <section className="panel ticket-form-panel">

        <h3>
          Create Support Ticket
        </h3>


        <form
          onSubmit={createTicket}
        >

          <div className="form-row">


            <div className="form-group">

              <label>
                Customer Name
              </label>

              <input

                type="text"

                placeholder="Enter customer name"

                value={customerName}

                onChange={(event) =>
                  setCustomerName(
                    event.target.value
                  )
                }

              />

            </div>


            <div className="form-group">

              <label>
                Support Message
              </label>

              <input

                type="text"

                placeholder="Describe the customer's problem"

                value={message}

                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }

              />

            </div>


          </div>


          <button

            type="submit"

            disabled={submitting}

          >

            {submitting

              ? "Analyzing..."

              : "Create & Analyze Ticket"

            }

          </button>


        </form>

      </section>


      <section className="charts-grid">


        {/* CATEGORY */}

        <div className="panel chart-panel">

          <h3>
            Tickets by Category
          </h3>

          <p className="chart-description">
            Distribution of customer support requests
          </p>


          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart

              data={categoryChartData}

              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 10
              }}

            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis
                allowDecimals={false}
              />

              <Tooltip />


              <Bar

                dataKey="value"

                name="Tickets"

                fill="#6366f1"

                radius={[
                  6,
                  6,
                  0,
                  0
                ]}

              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* PRIORITY */}

        <div className="panel chart-panel">

          <h3>
            Priority Distribution
          </h3>

          <p className="chart-description">
            Current ticket priority levels
          </p>


          <ResponsiveContainer

            width="100%"

            height={300}

          >

            <BarChart

              data={priorityChartData}

              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 10
              }}

            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis
                allowDecimals={false}
              />

              <Tooltip />


              <Bar

                dataKey="value"

                name="Tickets"

                radius={[
                  6,
                  6,
                  0,
                  0
                ]}

              >

                {priorityChartData.map(

                  (entry) => (

                    <Cell

                      key={entry.name}

                      fill={
                        priorityColors[
                          entry.name
                        ] ||
                        "#6366f1"
                      }

                    />

                  )

                )}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* SENTIMENT */}

        <div className="panel chart-panel sentiment-chart">

          <h3>
            Sentiment Distribution
          </h3>

          <p className="chart-description">
            Customer sentiment across tickets
          </p>


          <ResponsiveContainer

            width="100%"

            height={320}

          >

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

                {sentimentChartData.map(

                  (entry, index) => (

                    <Cell

                      key={entry.name}

                      fill={
                        sentimentColors[
                          index %
                          sentimentColors.length
                        ]
                      }

                    />

                  )

                )}

              </Pie>


              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>


      </section>



      <section className="panel">


        <div className="tickets-header">

          <div>

            <h3>
              Support Tickets
            </h3>

            <p>
              Search and filter AI-classified tickets
            </p>

          </div>


          <strong>

            {filteredTickets.length}

            {" "}

            of

            {" "}

            {tickets.length}

            {" "}

            tickets

          </strong>

        </div>


        {/* SEARCH AND FILTERS */}

        <div className="ticket-filters">


          {/* SEARCH */}

          <input

            type="text"

            className="search-input"

            placeholder="Search tickets..."

            value={searchTerm}

            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }

          />


          {/* CATEGORY */}

          <select

            value={categoryFilter}

            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }

          >

            <option value="All">
              All Categories
            </option>


            {Object.keys(categories).map(

              (category) => (

                <option

                  key={category}

                  value={category}

                >

                  {category}

                </option>

              )

            )}

          </select>


          {/* PRIORITY */}

          <select

            value={priorityFilter}

            onChange={(event) =>
              setPriorityFilter(
                event.target.value
              )
            }

          >

            <option value="All">
              All Priorities
            </option>

            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Low">
              Low
            </option>

          </select>


          {/* SENTIMENT */}

          <select

            value={sentimentFilter}

            onChange={(event) =>
              setSentimentFilter(
                event.target.value
              )
            }

          >

            <option value="All">
              All Sentiments
            </option>

            <option value="Positive">
              Positive
            </option>

            <option value="Neutral">
              Neutral
            </option>

            <option value="Negative">
              Negative
            </option>

          </select>


          {/* CLEAR */}

          <button

            type="button"

            className="clear-filters"

            onClick={() => {

              setSearchTerm("")

              setCategoryFilter("All")

              setPriorityFilter("All")

              setSentimentFilter("All")

            }}

          >

            Clear

          </button>


        </div>


        {/* TABLE */}

        <div className="ticket-table">


          <div className="ticket-row ticket-heading">

            <span>
              ID
            </span>

            <span>
              Customer
            </span>

            <span>
              Message
            </span>

            <span>
              Category
            </span>

            <span>
              Priority
            </span>

            <span>
              Sentiment
            </span>

            <span>
              Status
            </span>

          </div>


          {filteredTickets.length === 0 ? (

            <div className="empty-tickets">

              No matching tickets found.

            </div>

          ) : (

            filteredTickets.map(

              (ticket) => (

                <div

                  className="ticket-row"

                  key={ticket.id}

                >

                  <span>
                    #{ticket.id}
                  </span>


                  <span>
                    {ticket.customer_name}
                  </span>


                  <span className="ticket-message">

                    {ticket.message}

                  </span>


                  <span className="badge category-badge">

                    {ticket.category}

                  </span>


                  <span

                    className={
                      `badge priority-${ticket.priority.toLowerCase()}`
                    }

                  >

                    {ticket.priority}

                  </span>


                  <span

                    className={
                      `badge sentiment-${ticket.sentiment.toLowerCase()}`
                    }

                  >

                    {ticket.sentiment}

                  </span>


                  <span className="badge status-badge">

                    {ticket.status}

                  </span>


                </div>

              )

            )

          )}


        </div>


      </section>


    </div>

  )

}


export default App