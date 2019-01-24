
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import mongoose, { Promise } from 'mongoose';

import StudentModel from './models/school/student-model';

/****************************************************************************************/

class Connection {
	constructor(cfg) {
		this.config = cfg;
	}

	connect() {
		let self = this,
			cnnStr = `mongodb://${this.config.host}:${this.config.port}/${this.config.database}`;

		return new Promise((resolve, reject) => {
			mongoose.set('useCreateIndex', true);

			self.connection = mongoose.createConnection(cnnStr, {
				useNewUrlParser: true
			});

			self.students = new StudentModel(self);

			self.connection.on('connected', () => {
				console.log('[DB]: Connected to:', self.config.database);
				resolve(self);
			});
		});
	}
}

/****************************************************************************************/

export default Connection;

/****************************************************************************************/
