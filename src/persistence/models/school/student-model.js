
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import StudentSchema from '../../schemas/school/student-schema';

/****************************************************************************************/

class StudentModel {
	constructor(db) {
		this.schema = new StudentSchema();
		this.model = db.connection.model('Student', this.schema);
	}

	create(data, user) {
		return new this.model({
			rude: data.rude.trim(),
			ci: data.ci ? data.ci.trim() : null,
			firstName: data.firstName.trim(),
			lastName1: data.lastName1.trim(),
			lastName2: data.lastName2 ? data.lastName2.trim() : null,
			sex: data.sex.trim(),
			birdDate: data.birdDate.trim(),
			creatorRef: user._id
		});
	}

	find(query = {}, filter = 'rude ci firstName lastName1 lastName2 sex birdDate') {
		return this.model.find(query, filter);
	}

	findOne(query, filter = 'rude ci firstName lastName1 lastName2 sex birdDate') {
		return this.model.findOne(query, filter);
	}
}

/****************************************************************************************/

export default StudentModel;

/****************************************************************************************/
