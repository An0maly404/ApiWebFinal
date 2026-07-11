const { gql } = require("graphql-tag");

const typeDefs = gql`
    type Weather {
    city: String
    temperature: Float
    description: String
    }

    type Query {
    weather(city: String!): Weather
    }
`;

module.exports = typeDefs;