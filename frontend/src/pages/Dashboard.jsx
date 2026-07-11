import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL, getToken } from '../lib/auth'

function Dashboard() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/trips`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => {
        if (!res.ok) {
          navigate('/login')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (!data) return
        setTrips(data)
        setSelectedTripId(data[0]?.id)
      })
  }, [navigate])

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId)

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Upcoming Trips</h2>
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              <button
                type="button"
                className={trip.id === selectedTripId ? 'active' : ''}
                onClick={() => setSelectedTripId(trip.id)}
              >
                {trip.destination} ({trip.startDate})
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="timeline">
        {selectedTrip ? (
          <>
            <h2>{selectedTrip.destination}</h2>
            <ul>
              {selectedTrip.activities.map((activity) => (
                <li key={`${activity.date}-${activity.time}`}>
                  <strong>{activity.date} {activity.time}</strong> — {activity.title}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No trips yet.</p>
        )}
      </main>
    </div>
  )
}

export default Dashboard
