const { ApolloServer } = require('apollo-server');
const db = require('./database');

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

    input PostInput {
        id: Int
        title: String
        image: String
        description: String
        content: String
    }

    type Mutation {
        savePost(post: PostInput): Post
        deletePost(post: PostInput): Post
    }
`;

const resolvers = {
    Query: {
        async posts() {
            const result = await db.query("select * from posts");
            return result;
        }
    },
    Mutation: {
        async savePost(_, args) {
            const post = args.post;
            if(post.id === 0) {
                // Insert data
                const result = await db.one('insert into posts (title, image, description, content) values ($1, $2, $3, $4) returning *', [post.title, post.image, post.description, post.content]);
                return result;
            } 
            else {
                // Update data
                const result = await db.one('update posts set title=$1, image=$2, description=$3, content=$4 where id=$5 returning *', [post.title, post.image, post.description, post.content, post.id]);
                return result;
            }
        },
        async deletePost(_, args) {
            // Delete data
            const post = args.post;
            const result = await db.one('delete from posts where id=$1 returning *', [post.id]);
            return result;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();