
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

class SchoolResolver {
	constructor() {
	}

	async index(parent, args, context, info) {
		let db = await context.db.getConnection(context.user.membership.school.dataBaseName),
			students = await db.students.find();

		return students;
	}

	async one(parent, args, context, info) {
		let db = await context.db.getConnection(context.user.membership.school.dataBaseName),
			student = await db.students.findOne({ rude: args.rude });

		return student;
	}

	async insert(parent, args, context, info) {
		let db = await context.db.getConnection(context.user.membership.school.dataBaseName),
			newStudent = await db.students.create(args.data, context.user);

		await newStudent.save();
		return newStudent;
	}

	async update(parent, args, context, info) {
		let db = context.user.membership.school.db,
			student = await db.students.findOne({ rude: args.rude });

		if(!student)
			throw new Error(`El estudiante con rude: ${args.rude} no fue encontrado.`);

		student.set(args.data);
		await student.save();
		return student;
	}

	resolvers() {
		return {
			Query: {
				students: this.index,
				student: this.one
			},
			Mutation: {
				insertStudent: this.insert,
				updateStudent: this.update
			}
		};
	}
}

/****************************************************************************************/

export default SchoolResolver;

/****************************************************************************************/
