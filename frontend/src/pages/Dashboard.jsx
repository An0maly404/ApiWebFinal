import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import { API_BASE_URL, getToken, clearSession } from '../lib/auth'

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
  const [showForm, setShowForm] = useState(false)
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [activityRows, setActivityRows] = useState([{ time: '', title: '' }])
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const updateActivityRow = (index, field, value) => {
    setActivityRows((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    )
  }

  const removeActivityRow = (index) => {
    setActivityRows((rows) => rows.filter((_, i) => i !== index))
  }

  const fetchTrips = () => {
    return fetch(`${API_BASE_URL}/api/trips`, {
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
        return data
      })
  }

  useEffect(() => {
    fetchTrips().then((data) => {
      if (data) setSelectedTripId(data[0]?._id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleAddTrip = (event) => {
    event.preventDefault()
    setFormError(null)

    const hasPartialRow = activityRows.some(
      (row) => (row.time && !row.title) || (!row.time && row.title)
    )
    if (hasPartialRow) {
      setFormError('Each activity needs both a time and a title (or leave both blank).')
      return
    }

    const activities = activityRows.filter((row) => row.time && row.title)

    setSubmitting(true)

    fetch(`${API_BASE_URL}/api/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ destination, startDate, activities }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create trip')
        return res.json()
      })
      .then((newTrip) => {
        setDestination('')
        setStartDate('')
        setActivityRows([{ time: '', title: '' }])
        setShowForm(false)
        return fetchTrips().then(() => setSelectedTripId(newTrip._id))
      })
      .catch(() => setFormError('Could not add trip. Please try again.'))
      .finally(() => setSubmitting(false))
  }

  const handleDeleteTrip = (tripId) => {
    fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(() => fetchTrips())
      .then((data) => {
        if (data) {
          setSelectedTripId(data[0]?._id ?? null)
        }
      })
  }

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

        {showForm ? (
          <form className="add-trip-form" onSubmit={handleAddTrip}>
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            {activityRows.map((row, index) => (
              <div className="activity-row" key={index}>
                <textarea
                  rows={1}
                  placeholder="Activity title"
                  value={row.title}
                  onChange={(e) => {
                    updateActivityRow(index, 'title', e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                />
                <div className="activity-row-meta">
                  <input
                    type="time"
                    value={row.time}
                    onChange={(e) => updateActivityRow(index, 'time', e.target.value)}
                  />
                  {activityRows.length > 1 && (
                    <button type="button" onClick={() => removeActivityRow(index)}>
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="add-activity-row"
              onClick={() => setActivityRows((rows) => [...rows, { time: '', title: '' }])}
            >
              + Add activity
            </button>
            {formError && <p className="error">{formError}</p>}
            <div className="add-trip-actions">
              <button type="submit" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button type="button" className="add-trip-toggle" onClick={() => setShowForm(true)}>
            + Add Trip
          </button>
        )}

        <button
          type="button"
          className="logout-btn"
          onClick={() => {
            googleLogout()
            clearSession()
            navigate('/login')
          }}
          title="Sign out"
        >
          🚪 Sign out
        </button>
      </aside>

      <main className="timeline">
        {error && <p className="error">{error}</p>}
        {selectedTrip ? (
          <>
            <div className="timeline-header">
              <h2>{selectedTrip.destination}</h2>
              <button
                type="button"
                className="delete-trip"
                onClick={() => handleDeleteTrip(selectedTrip._id)}
              >
                Delete trip
              </button>
            </div>
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
