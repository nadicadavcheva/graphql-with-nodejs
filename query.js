const { GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const _ = require('lodash');

const { ContactType } = require('./types.js');
let { contacts } = require('./data.js');


//Define the Query
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            type: GraphQLString,

            resolve: function () {
                return "Hello World";
            }
        },

        contacts: {
            type: new GraphQLList(ContactType),
            resolve: (parent, args) => contacts,
        },
          
        contact: {
            type: ContactType,
            args: {
              id: {
                // example of using GraphQLNonNull to make the id required
                type: new GraphQLNonNull(GraphQLString)
              },
            },
            resolve: (parent, args) => contacts.find(contact => contact.id === args.id),
        }
    }
});

exports.queryType = queryType;