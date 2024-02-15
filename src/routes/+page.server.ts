import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	// It's possible that the user will verify their email after the data is loaded from Auth0
	// In that case, Auth0 does not push an update via webhook or otherwise.
	// Consider using tanstack-query to poll for changes to the user's emailVerified status.
	return { user: locals.user };
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
		redirect(302, '/');
	},
};
