<script lang="ts">
	import allSets from "$lib/allSets.json";
	import allSetData from "$lib/setData.json";

	type ArrayType<T extends any[]> =
		T extends Array<infer Inner> ? Inner : never;

	type CardData = ArrayType<typeof allSetData>;

	interface RefinedCardData {
		name: string;
		code: string;
		averageWordCount: number | null;
	}

	const setMetadataMap: { [code: string]: { releasedTimestamp: number } } = {};
	for (const set of allSets.data) {
		setMetadataMap[set.code] = {
			releasedTimestamp: Date.parse(set.released_at),
		};
	}

	let sortBy: "date" | "count" = "date";

	let whatToCount: "common" | "uncommon" | "rare" | "overall" = "common";

	let includeReminderText = false;

	$: refineFunction = (original: CardData): RefinedCardData => {
		const counts = includeReminderText
			? original.averageWordCountsWithReminderText
			: original.averageWordCounts;
		return {
			name: original.name,
			code: original.code,
			averageWordCount: counts[whatToCount],
		};
	};

	$: refinedSets = allSetData.map(refineFunction);

	let sortFunction: (first: RefinedCardData, second: RefinedCardData) => number;
	$: {
		if (sortBy === "count") {
			sortFunction = (first, second) =>
				Number(second.averageWordCount) - Number(first.averageWordCount);
		} else {
			sortFunction = (first, second) =>
				setMetadataMap[first.code].releasedTimestamp -
				setMetadataMap[second.code].releasedTimestamp;
		}
	}

	$: sortedSetData = refinedSets.toSorted(sortFunction);

	$: maxWordCount = refinedSets.reduce<number>((currentMax, nextSet) => {
		if (nextSet.averageWordCount && nextSet.averageWordCount > currentMax) {
			return nextSet.averageWordCount;
		}
		return currentMax;
	}, 0);

	let barChartRef: HTMLElement | undefined;
</script>

<main>
	<h1 class="title">Average card word count by Magic set</h1>
	<p class="description">Based on Oracle text.</p>

	<div class="inputs">
		<div role="radiogroup" aria-label="Sort by">
			Sort by:

			<label>
				<input type="radio" bind:group={sortBy} value="date" />
				Date
			</label>

			<label>
				<input type="radio" bind:group={sortBy} value="count" />
				Count
			</label>
		</div>

		<div role="radiogroup" aria-label="Filter">
			Filter:

			<label class="radio-label">
				<input type="radio" bind:group={whatToCount} value="common" />
				Common
			</label>

			<label class="radio-label">
				<input type="radio" bind:group={whatToCount} value="uncommon" />
				Uncommon
			</label>

			<label class="radio-label">
				<input type="radio" bind:group={whatToCount} value="rare" />
				Rare & Mythic
			</label>

			<label class="radio-label">
				<input type="radio" bind:group={whatToCount} value="overall" />
				Overall
			</label>
		</div>

		<label>
			<input type="checkbox" bind:checked={includeReminderText} /> Include reminder
			text
		</label>
	</div>

	<div class="bar-chart" bind:this={barChartRef}>
		{#each sortedSetData as setData (setData.code)}
			<div class="set-data-wrapper" title={setData.name}>
				<div class="bar-wrapper">
					{#if setData.averageWordCount}
						<div
							class="bar"
							style="height: {(
								(setData.averageWordCount / maxWordCount) *
								100
							).toFixed(2)}%"
						/>
						<div class="count-text">
							{setData.averageWordCount.toFixed(1)}
						</div>
					{/if}
				</div>
				<div class="set-symbol">
					<img src="/set_symbols/{setData.code}.svg" alt={setData.name} />
				</div>
			</div>
		{/each}
	</div>
	<div class="scroll-buttons">
		<button
			on:click={() => {
				barChartRef?.scrollTo({
					left: 0,
					behavior: "smooth",
				});
			}}>{"<"} Scroll left</button
		>
		<button
			on:click={() => {
				if (barChartRef) {
					barChartRef.scrollTo({
						left: barChartRef.scrollWidth - barChartRef.clientWidth,
						behavior: "smooth",
					});
				}
			}}>Scroll right {">"}</button
		>
	</div>
</main>

<style>
	.title {
		margin: 0;
		padding: 6px 0;
		font-size: 32px;
		line-height: 34px;
	}

	.description {
		margin: 0;
		padding: 4px 0;
	}

	.inputs {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-bottom: 8px;
	}

	.radio-label {
		white-space: nowrap;
	}

	.bar-chart {
		display: flex;
		height: 300px;
		overflow: auto;
		gap: 2px;
	}

	.set-data-wrapper {
		width: 42px;
		min-width: 42px;
		display: flex;
		flex-direction: column;
	}

	.set-data-wrapper:nth-child(5n) {
		--bar-color: #e3c567;
		--text-color: black;
	}

	.set-data-wrapper:nth-child(5n + 1) {
		--bar-color: #c8963e;
		--text-color: black;
	}

	.set-data-wrapper:nth-child(5n + 2) {
		--bar-color: #573d1c;
		--text-color: white;
	}

	.set-data-wrapper:nth-child(5n + 3) {
		--bar-color: #d9ae61;
		--text-color: black;
	}

	.set-data-wrapper:nth-child(5n + 4) {
		--bar-color: #d1462f;
		--text-color: black;
	}

	.bar-wrapper {
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.bar {
		width: 100%;
		background-color: var(--bar-color);
	}

	.count-text {
		color: var(--text-color);
		position: absolute;
		bottom: 0;
		text-align: center;
		align-self: center;
		padding-bottom: 2px;
	}

	.set-symbol {
		display: flex;
		height: 44px;
		padding: 4px;
		justify-content: center;
	}

	.scroll-buttons {
		padding-top: 4px;
		display: flex;
		justify-content: space-between;
	}
</style>
