require("dotenv").config();
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/users";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { COOKIE_NAME, __prod__ } from "./utils/constants";
import { Context } from "./types/Context";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "myblog",
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  });

  const app = express();

  // session/cookie store
  const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@myblog.k4bsn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  await mongoose.connect(mongoUrl, {
    dbName: "myblog",
    ssl: true,
  });

  // session
  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({ mongoUrl }),
      cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true, // js frontend cannot access the cookie
        secure: __prod__, // cookie only works in https
        sameSite: "lax", // protection against CSRF
      },
      secret: process.env.SESSION_SECRET as string,
      saveUninitialized: false, // dont save empty session, right front the start
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(
      `Connected to host ${PORT}. GraphQl server started on localhost: ${PORT}${apolloServer.graphqlPath}`
    )
  );
};

main().catch((err) => console.log(err));
