const { ApolloServer } = require('apollo-server');

const typeDefs = `
    type Post {
        id: Int
        title: String
        image: String
        description: String
        content: String
    }

    type Query {
        posts: [Post]
    }
`;

const posts = [];
posts.push({
    id: 1,
    title: "Aliens: They exist!",
    image: "https://i.guim.co.uk/img/media/26f400b3f7b1eb2c0cefb0e3c55a0ca69c4009d3/0_346_5184_3110/master/5184.jpg?width=1200&quality=85&auto=format&fit=max&s=1e234daf5bfa1268bb3422dd4c9d67dd",
    description: "Know about aliens, where you could found one and more...",
    content: "Aliens: They really exists.. we found one and interviewed him."
});
posts.push({
    id: 2,
    title: "MIB interventions",
    image: "https://s2.glbimg.com/qP6Kaw-Gz0aoVJ4UO_KlkkgCS48=/smart/e.glbimg.com/og/ed/f/original/2017/10/02/mib.jpg",
    description: "Did you ever asked to concentrate on a little red light in a device like a pen?",
    content: "MIB interventions"
});
posts.push({
    id: 3,
    title: "Elvis is not dead, he's under arrest by MIBs",
    image: "https://necaonline.com/wp-content/uploads/2020/08/180856.jpg",
    description: "Why those black suit guys want restrain a rock legend? And how he still alive?",
    content: "Elvis is not dead, he's under arrest by MIBs"
});

const resolvers = {
    Query: {
        posts() {
            return posts;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();