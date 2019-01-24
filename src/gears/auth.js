
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import passport from 'passport';
import CustomStrategy from 'passport-custom';
import jwt from 'jsonwebtoken';

/****************************************************************************************/

class Auth {
	constructor(config) {
		this.rsa = config.rsa;
		this.algorithm = config.algorithm;
	}

	verify(token) {
		let cert = this.rsa.public,
			alg = this.algorithm;
		return new Promise((resolve, reject) => {
			jwt.verify(token, cert, { algorithms: [alg] }, (err, payload) => {
				if(err) { reject(err); } else { resolve(payload); }
			});
		});
	}

	sign(payload) {
		let cert = this.rsa.private,
			alg = this.algorithm;
		return new Promise((resolve, reject) => {
			jwt.sign(payload, cert, { algorithm: alg }, (err, token) => {
				if(err) { reject(err); } else { resolve(token); }
			});
		});
	}

	async signin(db, params) {
		let select = 'userName displayName email roles password status',
			user = await db.users.findOne({userName: params.user}, select);

		if(!user) {
			user = await db.users.findOne({email: params.user}, select);
			if(!user)
				throw new Error('Nombre de usuario incorrecto');
		}

		let payload = await user.auth(params.password),
			token = await this.sign(payload);

		return {
			user,
			authorization: token
		};
	}

	async getUser(db, params, select='userName displayName email roles status') {
		let user = await db.users.findOne({userName: params.user}, select);
		if(!user) {
			user = await db.users.findOne({email: params.user}, select);
			if(!user)
				return null;
		}
		return {
			_id: user._id,
			userName: user.userName,
			displayName: user.displayName,
			email: user.email,
			roles: user.roles,
			status: user.status
		};
	}
}

/****************************************************************************************/

export default Auth;

/****************************************************************************************/
