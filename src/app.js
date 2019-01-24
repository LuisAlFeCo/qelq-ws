
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import http from 'http';
import path from 'path';

import express from 'express';
import jsonfile from 'jsonfile';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';

import Api from './api';
import Database from './persistence/database';
import Auth from './gears/auth';
import Mailer from './gears/mailer';

/****************************************************************************************/

class App {
	constructor() {
		this.config = jsonfile.readFileSync(path.join(__dirname, 'config.json'));

		this.express = express();

		this.init();
	}

	init() {
		let app = this;

		this.api = new Api();
		this.db = new Database(this.config);
		this.auth = new Auth(this.config.auth);
		this.mailer = new Mailer(this.config.mailer);

		this.graphql = new ApolloServer({
			schema: this.api.schema,

			context: async ({req}) => {
				return {
					db: app.db,
					auth: app.auth,
					mailer: app.mailer,
					req: {
						headers: req.headers,
						body: req.body
					}
				};
			}
		});

		this.express.use(this.onRequest.bind(this));
		this.express.use(cors());
		//this.express.use(this.auth.authorize);
		this.graphql.applyMiddleware({ app: this.express });

		this.server = http.createServer(this.express);
		this.server.listen(this.config.port, this.onStart.bind(this));
	}

	onStart() {
		console.log('[INFO]: Server is up and running on port:', this.config.port);
	}

	onRequest(req, res, next) {
		//req.api = this.api;
		//req.db = this.db;
		//req.auth = this.auth;
		//req.mailer = this.mailer;

		//setTimeout(() => {next();}, 2000);
		next();
	}
}

/****************************************************************************************/

export default App;

/****************************************************************************************/
