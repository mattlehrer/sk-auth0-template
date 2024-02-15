// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			code?: string;
			errorId?: string;
		}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
			requestId: string;
			startTimer: number;
			error?: string;
			errorId: string;
			errorStackTrace?: string;
			message: unknown;
			track: unknown;
		}
		interface Platform {
			env: {
				COUNTER: DurableObjectNamespace;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
