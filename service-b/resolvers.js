const axios = require("axios");
const { pool } = require("./db");

const CACHE_TTL_MINUTES = 30;

const resolvers = {
    Query: {
        weather: async (_, { city }) => {
            const cached = await pool.query(
                "SELECT * FROM weather_cache WHERE city = $1",
                [city]
            );

            if (cached.rows.length > 0) {
                const row = cached.rows[0];
                const ageMinutes = (Date.now() - new Date(row.updated_at)) / 1000 / 60;
                if (ageMinutes < CACHE_TTL_MINUTES) {
                    return {
                        city: row.city,
                        temperature: row.temperature,
                        description: row.description,
                    };
                }
            }

            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather`,
                {
                    params: {
                        q: city,
                        appid: process.env.WEATHER_API_KEY,
                        units: "metric",
                    },
                }
            );

            const temperature = response.data.main.temp;
            const description = response.data.weather[0].description;

            await pool.query(
                `INSERT INTO weather_cache (city, temperature, description, updated_at)
                VALUES ($1, $2, $3, NOW())
                ON CONFLICT (city)
                DO UPDATE SET temperature = $2, description = $3, updated_at = NOW()`,
                [city, temperature, description]
            );

            return { city, temperature, description };
        },
    },
};

module.exports = resolvers;