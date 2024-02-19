import { Lucia } from 'lucia';
import { Auth0 } from 'arctic';
import { dev } from '$app/environment';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } from '$env/static/private';
import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db';
import { sessionTable, userTable } from './schema';
import { baseUrl } from '$lib/config';

const adapter = new DrizzleMySQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev,
		},
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			auth0Id: attributes.auth0Id,
			username: attributes.username,
			email: attributes.email,
		};
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	auth0Id: number;
	username: string;
	email: string;
}

export const auth0 = new Auth0(
	AUTH0_DOMAIN,
	AUTH0_CLIENT_ID,
	AUTH0_CLIENT_SECRET,
	`${baseUrl}/auth/login/callback`,
);
