import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	schema: './src/lib/server/schema.ts',
	out: './drizzle',
	driver: 'mysql2',
	dbCredentials: {
		uri: process.env.PLANETSCALE_CONNECTION_STRING as string,
	},
} satisfies Config;
