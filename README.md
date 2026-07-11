# ApiWebFinal

By Noah Hemon, Antoine Iglesias-Tallon, Nassim Ainine

# Service A — Itinerary Service

Port: 5001

## Endpoints
- GET /health
- POST /trips — body: { userId, destination, startDate, activities: [{ time, title }] }
- GET /trips/:userId — returns array of trips for that user

# Service B — Weather Service

Port: 5002

## GraphQL endpoint
POST /graphql

## Example query
query {
  weather(city: "London") {
    city
    temperature
    description
  }
}