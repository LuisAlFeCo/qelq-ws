
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

class SchoolResolver {
	constructor() {
	}

	async one(parent, args, context, info) {
		let db = context.db,
			school = await db.schools.findOne({ uniqueName: args.identifier });

		if(!school)
			throw new Error(`No se encontró la unidad Educativa "${args.identifier}"`);

		return {
			identifier: school.uniqueName,
			name: school.displayName,
			//creationDate: school.creationDate.split(' ')[0],
		};
	}

	async userSchool(parent, args, context, info) {
		let db = context.db,
			school = await db.schools.findOne({ uniqueName: args.identifier });

		if(!school)
			throw new Error(`No se encontró la unidad Educativa "${args.identifier}"`);

		let user = await db.users.findOne({ userName: context.user.userName }, 'memberships'),
			membership = user.memberships.find(m => school._id.equals(m.schoolRef));

		if(!membership)
			throw new Error(`No tienes ningún rol para acceder a la unidad Educativa "${args.identifier}"`);

		return {
			identifier: school.uniqueName,
			name: school.displayName,
			userRole: membership.role
		};
	}

	async memberships(parent, args, context, info) {
		let db = context.db,
			user = await db.users.findOne({ userName: context.user.userName }, 'memberships'),
			res = [];

		for (let i = 0; i < user.memberships.length; i++) {
			let school = await db.schools.findOne({_id: user.memberships[i].schoolRef});
			res.push({
				identifier: school.uniqueName,
				name: school.displayName,
				userRole: user.memberships[i].role,
				//creationDate: school.creationDate.split(' ')[0],
			});
		}

		return res;
	}

	async insert(parent, args, context, info) {
		let db = context.db,
			user = await db.users.findOne({ userName: context.user.userName }, 'memberships'),
			activation = await db.schoolActivations.findOne({ registerCode: args.data.registerCode, status: 'active' }),
			newSchool = await db.schools.create(args.data, user);

		if(!activation) throw new Error('Código de registro no válido');

		await newSchool.save();
		user.memberships.push({ schoolRef: newSchool._id, role: 'owner' });
		await user.save();
		activation.status = 'used';
		activation.schoolRef = newSchool._id;
		await activation.save();

		await db.getConnection(newSchool.dataBaseName);

		/*let db = context.db,
			act = await db.schoolActivations.create({description: 'Código de prueba'}, context.user);
		
		await act.save();*/

		return { message: 'Success' };
	}

	resolvers() {
		return {
			Query: {
				school: this.one,
				userSchool: this.userSchool,
				membershipSchools: this.memberships
			},
			Mutation: {
				createSchool: this.insert
			}
		};
	}
}

/****************************************************************************************/

export default SchoolResolver;

/****************************************************************************************/
