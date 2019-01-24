
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import ImageSchema from '../schemas/image-schema';

/****************************************************************************************/

class ImageModel {
	constructor(db) {
		this.schema = new ImageSchema();
		this.model = db.connection.model('Image', this.schema);
	}
}

/****************************************************************************************/

export default ImageModel;

/****************************************************************************************/
