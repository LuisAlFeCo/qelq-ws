
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import mongoose from 'mongoose';

import Qelq from '../../../gears/date';

/****************************************************************************************/

class StudentSchema extends mongoose.Schema {
	constructor() {
		super({
			rude: { type: String, required: true, unique: true },
			ci: { type: String },
			firstName: { type: String, required: true },
			lastName1: { type: String, required: true },
			lastName2: { type: String },

			sex: { type: String, required: true },
			birdDate: { type: String, required: true },

			status: { type: String, required: true, default: 'active'},

			creatorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
			creationDate: { type: String, default: Qelq.Date.now },
			modifiedDate: { type: String }
		});

		this.methods.set = this.set;
	}

	set(data) {
		this.rude = data.rude.trim(),
		this.ci = data.ci ? data.ci.trim() : null,
		this.firstName = data.firstName.trim(),
		this.lastName1 = data.lastName1.trim(),
		this.lastName2 = data.lastName2 ? data.lastName2.trim() : null,
		this.sex = data.sex.trim(),
		this.birdDate = data.birdDate.trim();
	}
}

/****************************************************************************************/

export default StudentSchema;

/****************************************************************************************/
