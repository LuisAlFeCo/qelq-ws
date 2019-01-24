
/****************************************************************************************

	Copyright (c) 2018, QELQ.
	Author: Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import UserResolver from './resolvers/user-resolver';
import SchoolResolver from './resolvers/school-resolver';
import StudentResolver from './resolvers/school/student-resolver';

import AuthDirective from './resolvers/directive-resolvers/auth-directive';

/****************************************************************************************/

class Api {
	constructor() {
		this.schema = makeExecutableSchema({
			typeDefs: this.buildSchema(),
			resolvers: this.buildResolvers(),
			directiveResolvers: this.buildDirectives()
		});
	}

	buildSchema() {
		let typesArray = fileLoader(path.join(__dirname, 'api'), { recursive: true }),
			typeDefs = mergeTypes(typesArray);

		return typeDefs;
	}

	buildResolvers() {
		this.user = new UserResolver;
		this.school = new SchoolResolver;
		this.student = new StudentResolver;

		return mergeResolvers([
			this.user.resolvers(),
			this.school.resolvers(),
			this.student.resolvers()
		]);
	}

	buildDirectives() {
		this.auth = new AuthDirective;

		return mergeResolvers([
			this.auth.resolvers()
		]);
	}
}

/****************************************************************************************/

export default Api;

/****************************************************************************************/
