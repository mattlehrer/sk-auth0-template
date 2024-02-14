import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { PLANETSCALE_CONNECTION_STRING } from '$env/static/private';
import * as schema from './schema';

// create the connection
const connection = connect({
	url: PLANETSCALE_CONNECTION_STRING,
});

export const db = drizzle(connection, { schema });
