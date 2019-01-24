
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import randomstring from 'randomstring';

import SchoolActivationSchema from '../schemas/school-activation-schema';

/****************************************************************************************/

class SchoolActivationModel {
	constructor(db) {
		this.db = db;
		this.schema = new SchoolActivationSchema();
		this.model = db.connection.model('SchoolActivation', this.schema);
	}

	create(data, user) {
		return new this.model({
			registerCode: randomstring.generate({length: 8, capitalization: 'uppercase'}),
			description: data.description.trim(),
			creatorRef: user._id
		});
	}

	findOne(query, filter = 'registerCode description schoolRef status') {
		return this.model.findOne(query, filter);
	}
}

/****************************************************************************************/

export default SchoolActivationModel;

/****************************************************************************************/
