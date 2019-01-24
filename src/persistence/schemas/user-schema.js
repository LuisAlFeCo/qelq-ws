
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import mongoose from 'mongoose';
import crypto from 'crypto';

import Qelq from '../../gears/date';

/****************************************************************************************/

class UserSchema extends mongoose.Schema {
	constructor(authConfig) {
		let emailSchema = new mongoose.Schema({
			email: { type: String, required: true, unique: true },
			creationDate: { type: String, default: Qelq.Date.now }
		});

		let membershipSchema = new mongoose.Schema({
			schoolRef: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
			role: { type: String, required: true }
		});

		let passwordSchema = new mongoose.Schema({
			encrypted: { type: String, required: true },
			creationDate: { type: String, default: Qelq.Date.now }
		});

		let profileImageSchema = new mongoose.Schema({
			imageRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
			creationDate: { type: String, default: Qelq.Date.now }
		});

		super({
			userName: { type: String, required: true, unique: true },
			displayName: { type: String, required: true },
			firstName: { type: String, required: true },
			lastName: { type: String, required: true },
			email: { type: String, required: true, unique: true },
			password: { type: String, required: true },

			roles: [String],
			memberships: [membershipSchema],
			status: { type: String, required: true, default: 'created' },

			emailHistory: [emailSchema],
			passwordHistory: [passwordSchema],
			profileImageHistory: [profileImageSchema],

			creationHash:  { type: String, required: true },
			creationSecret:  { type: String, required: true },

			creationDate: { type: String, default: Qelq.Date.now },
			modifiedDate: { type: String }
		});

		this.path('emailHistory').validate((value) => {
			return value.length;
		}, 'El campo <emailHistory> no puede ser un array vacío');

		this.path('passwordHistory').validate((value) => {
			return value.length;
		}, 'El campo <passwordHistory> no puede ser un array vacío');

		this.path('roles').validate((value) => {
			return value.length;
		}, 'El campo <roles> no puede ser un array vacío');


		this.config = authConfig;

		this.methods.encryptPassword = this.encryptPassword;
		this.methods.decryptPassword = this.decryptPassword;
		this.methods.auth = this.auth;
		this.methods.getConfig = () => { return authConfig.passwordCrypt; };
	}

	encryptPassword(text) {
		let cfg = this.config ? this.config.passwordCrypt : this.getConfig(),
			cipher = crypto.createCipheriv(cfg.algorithm, cfg.secret, Buffer.from(cfg.iv, 'hex')),
			crypted = cipher.update(text, 'utf8', 'hex');

		crypted += cipher.final('hex');
		return crypted;
	}

	decryptPassword(text) {
		let cfg = this.config ? this.config.passwordCrypt : this.getConfig(),
			decipher = crypto.createDecipheriv(cfg.algorithm, cfg.secret, Buffer.from(cfg.iv, 'hex')),
			dec = decipher.update(text, 'hex', 'utf8');

		dec += decipher.final('utf8');
		return dec;
	}

	auth(password) {
		let self = this;
		
		return new Promise((resolve, reject) => {
			let encrypted = self.password;
			if(encrypted) {
				let decrypted = self.decryptPassword(encrypted);
				if(decrypted === password) {
					resolve({
						userName: self.userName,
						displayName: self.displayName,
						email: self.email
					});
				} else {
					reject('Contraseña incorrecta');
				}
			} else {
				reject('No se recuperó la contraseña del usuario');
			}
		});
	}
}

/****************************************************************************************/

export default UserSchema;

/****************************************************************************************/
