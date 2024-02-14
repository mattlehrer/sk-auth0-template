import { auth0, lucia } from '$lib/server/auth';
import { AUTH0_DOMAIN } from '$env/static/private';
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('auth0_oauth_state') ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const tokens = await auth0.validateAuthorizationCode(code);
		const auth0UserResponse = await fetch(`${AUTH0_DOMAIN}/userinfo`, {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		const auth0User: Auth0User = await auth0UserResponse.json();
		console.log({ auth0User });
		const existingUser = await db.query.userTable.findFirst({
			where: eq(userTable.auth0Id, auth0User.sub),
		});

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});
		} else {
			const userId = generateId(15);
			await db.insert(userTable).values({
				id: userId,
				auth0Id: auth0User.sub,
				email: auth0User.email,
				emailVerified: auth0User.email_verified,
			});
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes,
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		});
	} catch (e) {
		console.error({ e });
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400,
			});
		}
		return new Response(null, {
			status: 500,
		});
	}
}

interface Auth0User {
	sub: string;
	email: string;
	email_verified: boolean;
}
