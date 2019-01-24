
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import emailer from 'google-zoho-node-mailer';
import React from 'react';
import { renderToString } from 'react-dom/server';

import EmailVerificationMessage from './mail-templates/email-verification-message.jsx';

/****************************************************************************************/

class Mailer {
	constructor(config) {
		this.config = config;
	}

	buildMessage(msgName, user) {
		switch(msgName) {
		case 'emailVerification':
			return {
				from: this.config.sender.email,
				to: user.email,
				subject: 'Correo de verificación de tu cuenta QELQ - Accion requerida',
				body: renderToString(<EmailVerificationMessage user={user}/>),
				bodyType: 'html'
			};
		}
	}

	send(msg) {
		return new Promise((resolve, reject) => {
			emailer.UseZohoSMTPTransport({
				username: this.config.sender.email,
				password: this.config.sender.password
			});
			var message = new emailer.Email(msg);

			message.send(function(status){
				resolve();
			});
		});
	}
}

/****************************************************************************************/

export default Mailer;

/****************************************************************************************/
