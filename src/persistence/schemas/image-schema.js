
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import mongoose from 'mongoose';

import Qelq from '../../gears/date';

/****************************************************************************************/

class ImageSchema extends mongoose.Schema {
	constructor() {
		super({
			checksum: { type: String, required: true, unique: true },
			data: { type: Buffer, required: true },
			mimetype: { type: String, required: true },
			creationDate: { type: String, default: Qelq.Date.now }
		});
	}
}

/****************************************************************************************/

export default ImageSchema;

/****************************************************************************************/
