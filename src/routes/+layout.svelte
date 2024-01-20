<script>
	import "@fontsource-variable/jost";
</script>

<slot />

<style>
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}

	:global(body, button) {
		font-family: "Jost Variable", sans-serif;
	}
</style>
