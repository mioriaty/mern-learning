"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const hello_1 = require("./resolvers/hello");
const users_1 = require("./resolvers/users");
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const constants_1 = require("./utils/constants");
const post_1 = require("./resolvers/post");
const main = async () => {
    await (0, typeorm_1.createConnection)({
        type: "postgres",
        database: "myblog",
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        logging: true,
        synchronize: true,
        entities: [User_1.User, Post_1.Post],
    });
    const app = (0, express_1.default)();
    const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@myblog.k4bsn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    await mongoose_1.default.connect(mongoUrl, {
        dbName: "myblog",
        ssl: true,
    });
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: connect_mongo_1.default.create({ mongoUrl }),
        cookie: {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            secure: constants_1.__prod__,
            sameSite: "lax",
        },
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [hello_1.HelloResolver, users_1.UserResolver, post_1.PostResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res }),
        plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Connected to host ${PORT}. GraphQl server started on localhost: ${PORT}${apolloServer.graphqlPath}`));
};
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map