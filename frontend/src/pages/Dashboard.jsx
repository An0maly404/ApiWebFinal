import { useState } from 'react'
import session from '../mocks/session.json'
import trips from '../mocks/trips.json'

function Dashboard() {
  const userTrips = trips.filter((trip) => trip.userId === session.userId)
  const [selectedTripId, setSelectedTripId] = useState(userTrips[0]?.id)
  const selectedTrip = userTrips.find((trip) => trip.id === selectedTripId)

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Upcoming Trips</h2>
        <ul>
          {userTrips.map((trip) => (
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
