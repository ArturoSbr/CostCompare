<script lang="ts">
  import './layout.css';
  import { onMount, type Snippet } from 'svelte';
  import { initializeStores } from '$lib/store';

  let { children } = $props<{ children: Snippet }>();

  onMount(async () => {
    await initializeStores();
  });
</script>

<div class="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex flex-col items-center pb-20">
	<header class="w-full max-w-md p-4 bg-[var(--surface-color)] shadow-sm flex justify-center items-center">
		<h1 class="text-3xl font-extrabold italic tracking-tight shadow-text">
			<span class="text-[var(--accent-color)]">Cost</span><span class="text-[var(--primary-color)]">Compare</span>
		</h1>
	</header>

	<main class="flex-grow w-full max-w-md p-4 flex flex-col gap-4">
		{@render children()}
	</main>
</div>
