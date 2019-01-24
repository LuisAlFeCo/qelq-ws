
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

class AuthDirective  {
	constructor() {
	}

	async authorize(next, source, params, context) {
		let req = context.req,
			auth = context.auth,
			db = context.db;

		try {
			if(req.headers && req.headers.authorization) {
				let user = await new Promise((resolve, reject) => {
					let token = req.headers.authorization;
					auth.verify(token)
						.then(payload => {
							auth.getUser(db, {user: payload.userName})
								.then(user => {
									if(user) resolve(user);
									else reject(new Error('No se encontró los datos del usuario.'));
								})
								.catch(err => reject(new Error('Error al acceder a datos del usuario.')));
						})
						.catch(err => reject(new Error('Credenciales de usuario inválidos.')));
				});
				context.user = user;
				return next();
			} else throw new Error('El usuario no tiene credenciales.');
		} catch (error) {
			context.user = await db.users.default();
			return next();
		}
	}

	async hasRole(next, source, {role}, context) {
		let user = context.user;

		if(user) {
			if(user.roles.includes(role))
				return next();

			throw new Error(`No autorizado. Debes tener el rol de: "${role}".`);
		} else throw new Error('No autorizado. Datos de usuario no encontrados.');
	}

	async hasMembershipRole(next, source, args, context) {
		let vars = context.req.body.variables,
			db = context.db;

		if(vars.schoolId) {
			let user = await db.users.findOne({ userName: context.user.userName }, 'memberships'),
				school = await db.schools.findOne({ uniqueName: vars.schoolId }, '_id uniqueName dataBaseName'),
				membership = school ? user.memberships.find(m => school._id.equals(m.schoolRef)) : null;

			if(membership && (membership.role === args.role)) {
				context.user.membership = {
					school: {
						uniqueName: school.uniqueName,
						dataBaseName: school.dataBaseName,
						db: await context.db.getConnection(school.dataBaseName),
					},
					role: membership.role
				};
				return next();
			}
			throw new Error('No autorizado. Debes ser miembro de la Unidad edecativa con rol de "Propietario".');
		}
		throw new Error('No autorizado. Datos de UE no encontrados.');
	}

	resolvers() {
		return {
			Authorized: this.authorize,
			HasRole: this.hasRole,
			HasMembershipRole: this.hasMembershipRole
		};
	}
}

/****************************************************************************************/

export default AuthDirective;

/****************************************************************************************/
