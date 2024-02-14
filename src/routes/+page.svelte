<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Welcome to SvelteKit {data.user?.email ?? ''}</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<a href="/auth/login">Login</a>

{#if data.user}
	<form method="post" use:enhance>
		<button>Sign out</button>
	</form>
{/if}
