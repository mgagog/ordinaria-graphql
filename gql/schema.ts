export const typeDefs = `#graphql
    type Contact {
      id: ID!
      nombre: String!
      apellidos: String!
      numTelefono: String!
      pais: String!
      horaCapital: String!
    }
    
    type Query {
      getContact(id: ID!): Contact!
      getContacts: [Contact!]!
    }
    type Mutation {
      addContact(nombre: String!, apellidos: String!, numTelefono: String!): Contact!
      updateContact(id: ID!, nombre: String, apellidos: String, numTelefono: String): Contact!
      deleteContact(id: ID!): Contact!
    }
`;