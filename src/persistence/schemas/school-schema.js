
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import mongoose from 'mongoose';

import Qelq from '../../gears/date';

/****************************************************************************************/

class SchoolSchema extends mongoose.Schema {
	constructor() {
		super({
			uniqueName: { type: String, required: true, unique: true },
			displayName: { type: String, required: true },
			dataBaseName: { type: String, required: true },

			status: { type: String, required: true, default: 'active' },

			slogan: { type: String },
			description: { type: String },
			address: { type: String },
			contact: { type: String },
			homePage: { type: String },

			creatorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
			creationDate: { type: String, required: true, default: Qelq.Date.now },
			modifiedDate: { type: String }
		});
	}
}

/****************************************************************************************/

export default SchoolSchema;

/****************************************************************************************/
