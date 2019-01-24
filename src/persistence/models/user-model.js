
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import randomstring from 'randomstring';

import UserSchema from '../schemas/user-schema';

/****************************************************************************************/

class UserModel {
	constructor(db, authConfig) {
		this.db = db;
		this.schema = new UserSchema(authConfig);
		this.model = db.connection.model('User', this.schema);
	}

	default() {
		return new this.model({
			userName: '',
			displayName: '',
			email: '',
			roles: ['guest'],
			status: 'unknown'
		});
	}

	create(data) {
		data.firstName = data.firstName.trim();
		data.lastName = data.lastName.trim();
		data.email = data.email.trim();

		let encrypted = this.schema.encryptPassword(data.password),
			userName = data.firstName.replace(/\s/g, '') + data.lastName.replace(/\s/g, '');
		
		userName = userName.length > 12 ?
			userName.substring(0, 12) + randomstring.generate({length: 4, charset: 'numeric'})
			:
			userName + randomstring.generate({length: 4, charset: 'numeric'});
	
		return new this.model({
			userName,
			displayName: `${data.firstName} ${data.lastName}`,
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			password: encrypted,
			roles: ['basic'],
			emailHistory: [{email: data.email}],
			passwordHistory: [{encrypted}],
			creationHash: randomstring.generate(64),
			creationSecret: randomstring.generate({length: 4, charset: 'numeric'})
		});
	}

	findOne(where, select = 'userName displayName email roles status') {
		return this.model.findOne(where, select);
	}
}

/****************************************************************************************/

export default UserModel;

/****************************************************************************************/
