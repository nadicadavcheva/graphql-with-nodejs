var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var { contactsData } = require('./data.js');

// GraphQL schema
var schema = buildSchema(`
    type Query {
        contact(id: Int!): Contact
        contacts(name: String): [Contact]
    },
    type Mutation {
        createContact(name: String, phone: String, email: String): Contact
        updateContact(id: Int!, name: String, phone: String, email: String): Contact
        deleteContact(id: Int!): [Contact]
    }
    type Contact {
        id: Int
        name: String
        phone: String
        email: String
    }
`);

var getContact = function(args) {
    var id = args.id;
    return contactsData.filter(contact => {
        return contact.id == id;
    })[0];
}

var getContacts = function(args) {
    return contactsData;
}

var createContact = function({ name, phone, email }) {
    var newContact = { id: Math.floor(Math.random() * 20), name: name, phone: phone, email: email };
    contactsData = [...contactsData, newContact ];
    return contactsData[contactsData.length - 1];
}

var updateContact = function({id, name, phone, email}) {
    contactsData.map(contact => {
        if (contact.id === id) {
            contact.name = name;
            contact.phone = phone;
            contact.email = email;
            return contact;
        }
    });
    return contactsData.filter(contact => contact.id === id) [0];
}

var deleteContact = function({id}) {
    contactsData = contactsData.filter(contact => contact.id !== id);
    return contactsData;
}

// Root resolver
var root = {
   contact: getContact,
   contacts: getContacts,
   updateContact: updateContact,
   createContact: createContact,
   deleteContact: deleteContact
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));