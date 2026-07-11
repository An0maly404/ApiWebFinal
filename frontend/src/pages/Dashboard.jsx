import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL, getToken } from '../lib/auth'

const WEATHER_QUERY = `
  query($city: String!) {
    weather(city: $city) {
      city
      temperature
      description
    }
  }
`

function Dashboard() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState(null)
  const [error, setError] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/trips`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate('/login')
          return null
        }
        if (!res.ok) {
          setError('Could not load trips. Please try again later.')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (!data) return
        setTrips(data)
        setSelectedTripId(data[0]?._id)
      })
  }, [navigate])

  const selectedTrip = trips.find((trip) => trip._id === selectedTripId)

  useEffect(() => {
    if (!selectedTrip) {
      setWeather(null)
      return
    }

    fetch(`${API_BASE_URL}/api/proxy/weather/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        query: WEATHER_QUERY,
        variables: { city: selectedTrip.destination },
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => setWeather(result?.data?.weather ?? null))
      .catch(() => setWeather(null))
  }, [selectedTrip])

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Upcoming Trips</h2>
        <ul>
          {trips.map((trip) => (
            <li key={trip._id}>
              <button
                type="button"
                className={trip._id === selectedTripId ? 'active' : ''}
                onClick={() => setSelectedTripId(trip._id)}
              >
                {trip.destination} ({trip.startDate.slice(0, 10)})
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="timeline">
        {error && <p className="error">{error}</p>}
        {selectedTrip ? (
          <>
            <h2>{selectedTrip.destination}</h2>
            {weather && (
              <p className="weather">
                {Math.round(weather.temperature)}°C — {weather.description}
              </p>
            )}
            <ul>
              {selectedTrip.activities.map((activity, index) => (
                <li key={`${activity.time}-${index}`}>
                  <strong>{activity.time}</strong> — {activity.title}
                </li>
              ))}
            </ul>
          </>
        ) : (
          !error && <p>No trips yet.</p>
        )}
      </main>
    </div>
  )
}

export default Dashboard
