
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import mongoose from 'mongoose';
import Hashmap from 'hashmap';

import ImageModel from './models/image-model';
import UserModel from './models/user-model';
import SchoolModel from './models/school-model';
import SchoolActivationModel from './models/school-activation-model';

import Connection from './connection';

/****************************************************************************************/

class Database {
	constructor(cfg) {
		this.config = cfg.db;

		let cnnStr = `mongodb://${this.config.host}:${this.config.port}/${this.config.database}`;

		mongoose.set('useCreateIndex', true);
		
		this.connection = mongoose.createConnection(cnnStr, {
			useNewUrlParser: true
		});

		this.images = new ImageModel(this);
		this.users = new UserModel(this, cfg.auth);
		this.schools = new SchoolModel(this);
		this.schoolActivations = new SchoolActivationModel(this);

		this.connections = new Hashmap();

		this.connection.on('connected', () => {
			console.log('[DB]: Connected to:', this.config.database);

			this.schools.find({}, 'dataBaseName').then(rows => {
				rows.forEach(element => {
					this.getConnection(element.dataBaseName);
				});
			});
		});
	}

	async getConnection(dbname) {
		if(this.connections.has(dbname)){
			return this.connections.get(dbname);
		} else {
			let cnn = new Connection({
				host: this.config.host,
				port: this.config.port,
				database: dbname
			});
			await cnn.connect();
			this.connections.set(dbname, cnn);
			return cnn;
		}
	}
}

/****************************************************************************************/

export default Database;

/****************************************************************************************/
