
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import moment from 'moment-timezone';
moment.locale('es');

/****************************************************************************************/

class Date {
	constructor(connection) {
	}

	static now() {
		return moment().tz('America/Caracas').format('L LTS');
	}
}

/****************************************************************************************/

export default { Date };

/****************************************************************************************/
