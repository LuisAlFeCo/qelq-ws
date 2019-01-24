
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

class UserResolver {
	constructor() {
	}

	async current(parent, args, context, info) {
		return context.user;
	}

	async signUp(parent, args, context, info) {
		let db = context.db,
			mailer = context.mailer;

		try {
			let newUser = await db.users.create(args.data);
			await newUser.save();
			let msg = mailer.buildMessage('emailVerification', newUser),
				auth = await context.auth.signin(db, {
					user: args.data.email,
					password: args.data.password
				});
			await mailer.send(msg);
			return auth;
		} catch (err) {
			if(err.code === 11000) {
				throw new Error(`El correo electrónico '${args.data.email}' ya fue registrado.`);
			} else {
				throw err;
			}
		}
	}

	async resendConfirmationMessage(parent, args, context, info) {
		let user = context.user,
			db = context.db,
			mailer = context.mailer,
			payload = await db.users.findOne({ email: user.email, status: 'created' }, 'displayName email creationHash');
			
		if(payload) {
			let msg = mailer.buildMessage('emailVerification', payload);
			await mailer.send(msg);
			return { message: 'Mensaje enviado.' };
		}
		throw new Error('Mensaje no enviado.');
	}

	async verifyEmail(parent, args, context, info) {
		let db = context.db,
			user = await db.users.findOne({ creationHash: args.hash });

		if(!user) throw 'La cuenta de usuario que intenta validar no existe.';

		let token = await context.auth.sign({
			userName: user.userName,
			displayName: user.displayName,
			email: user.email
		});

		user.status = 'active';
		await user.save();

		return {
			user,
			authorization: token
		};
	}

	async signIn(parent, args, context, info) {
		return await context.auth.signin(context.db, args.data);
	}

	resolvers() {
		return {
			Query: {
				user: this.current
			},
			Mutation: {
				signUp: this.signUp,
				resendConfirmationMessage: this.resendConfirmationMessage,
				verifyEmail: this.verifyEmail,
				signIn: this.signIn
			}
		};
	}
}

/****************************************************************************************/

export default UserResolver;

/****************************************************************************************/
