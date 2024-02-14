import { eq } from 'drizzle-orm';
import { db } from './db';
import { userTable } from './schema';

export const insertUser = async (data: {
	id: string;
	auth0Id: string;
	email: string;
	emailVerified?: boolean;
}) => {
	return db.insert(userTable).values(data);
};

export const getUserByAuth0Id = async (auth0Id: string) => {
	return db.query.userTable.findFirst({
		where: eq(userTable.auth0Id, auth0Id),
	});
};
