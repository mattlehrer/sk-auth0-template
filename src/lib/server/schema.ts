import { mysqlTable, varchar, datetime } from 'drizzle-orm/mysql-core';

export const userTable = mysqlTable('user', {
	id: varchar('id', {
		length: 255
	}).primaryKey(),
	auth0Id: varchar('auth0_id', {
		length: 255
	})
		.unique()
		.notNull(),
	username: varchar('username', {
		length: 255
	}).unique(),
	email: varchar('email', {
		length: 255
	}).unique()
});

export const sessionTable = mysqlTable('session', {
	id: varchar('id', {
		length: 255
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 255
	})
		.notNull()
		.references(() => userTable.id),
	expiresAt: datetime('expires_at').notNull()
});
