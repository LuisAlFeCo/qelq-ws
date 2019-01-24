
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import mongoose from 'mongoose';

import Qelq from '../../gears/date';

/****************************************************************************************/

class SchoolActivationSchema extends mongoose.Schema {
	constructor() {
		super({
			registerCode: { type: String, required: true, unique: true },
			description: { type: String, required: true },
			schoolRef: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },

			status: { type: String, required: true, default: 'active' },

			creatorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
			creationDate: { type: String, required: true, default: Qelq.Date.now },
			modifiedDate: { type: String }
		});
	}
}

/****************************************************************************************/

export default SchoolActivationSchema;

/****************************************************************************************/
