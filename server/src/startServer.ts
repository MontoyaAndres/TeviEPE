import "dotenv/config";
import "reflect-metadata";
import * as express from "express";
import * as session from "express-session";
import * as compression from "compression";
import * as helmet from "helmet";
import * as cors from "cors";
import * as connectRedis from "connect-redis";

import { createTypeormConn } from "./utils/createTypeormConn";
import { redis } from "./redis";
import Router from "./routes";

const RedisStore = connectRedis(session);

const app = express();

const corsConfig = {
	credentials: true,
	origin: process.env.FRONTEND_HOST as string
};

export const startServer = async () => {
	app
		.use(compression())
		.use(helmet())
		.use(express.json())
		.use(express.urlencoded({ extended: false }))
		.use(cors(corsConfig))
		.use(
			session({
				store: new RedisStore({
					client: redis as any
				}),
				secret: process.env.SESSIONS_SECRET as string,
				resave: false,
				saveUninitialized: false,
				cookie: {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production", // only works with https
					maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
				}
			})
		)
		.use(Router)
		.listen(process.env.PORT);

	await createTypeormConn();

	return app;
};