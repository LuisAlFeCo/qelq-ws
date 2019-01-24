
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import randomstring from 'randomstring';

import SchoolSchema from '../schemas/school-schema';

/****************************************************************************************/

class SchoolModel {
	constructor(db) {
		this.db = db;
		this.schema = new SchoolSchema();
		this.model = db.connection.model('School', this.schema);
	}

	create(data, user) {
		let uniqueName = data.identifier.trim();

		return new this.model({
			uniqueName,
			displayName: data.name.trim(),
			dataBaseName: uniqueName + randomstring.generate({length: 3, charset: 'numeric'}),
			creatorRef: user._id
		});
	}

	find(query = {}, filter = 'uniqueName displayName') {
		return this.model.find(query, filter);
	}

	findOne(query, filter = 'uniqueName displayName creatorRef creationDate') {
		return this.model.findOne(query, filter);
	}
}

/****************************************************************************************/

export default SchoolModel;

/****************************************************************************************/
