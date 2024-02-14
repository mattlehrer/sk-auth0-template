import { auth0 } from '$lib/server/auth';
import { generateState } from 'arctic';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = generateState();
	const url = await auth0.createAuthorizationURL(state, {
		scopes: ['profile', 'email']
	});

	cookies.set('auth0_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
};
