<script lang="ts">
    import {
        rankedProductsStore,
        globalBenchmarkStore,
        updateBenchmark,
        addProduct,
        resetProducts,
        calculateRanks,
    } from "$lib/store";
    import ProductCard from "$lib/ProductCard.svelte";

    const benchmarkOptions = [
        { value: "lb", label: "$/lb (Pounds)" },
        { value: "oz", label: "$/oz (Ounces)" },
        { value: "kg", label: "$/kg (Kilograms)" },
        { value: "g", label: "$/g (Grams)" },
        { value: "ea", label: "$/ea (Count / Items)" },
        { value: "l", label: "$/L (Liters)" },
        { value: "ml", label: "$/ml (Milliliters)" },
        { value: "fl-oz", label: "$/fl oz (Fluid Ounces)" },
    ];

    function handleBenchmarkChange(e: Event) {
        const val = (e.target as HTMLSelectElement).value as any;
        updateBenchmark(val);
    }

    let canAddMore = $derived($rankedProductsStore.length < 5);
</script>

<svelte:head>
    <title>CostCompare</title>
</svelte:head>

<div class="flex flex-col gap-4">
    <!-- Global Context Header -->
    <div
        class="flex flex-col gap-2 p-4 bg-[var(--surface-color)] rounded-xl shadow border border-gray-200"
    >
        <div class="flex justify-between items-center">
            <h2
                class="text-sm font-bold text-[var(--primary-color)] uppercase tracking-wider"
            >
                Compare By
            </h2>
            <select
                class="bg-white border text-sm border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] font-medium text-gray-900"
                value={$globalBenchmarkStore}
                onchange={handleBenchmarkChange}
            >
                {#each benchmarkOptions as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>
        </div>
        <p class="text-xs text-gray-500">
            Pick your favorite unit to compare by.
        </p>
    </div>

    <!-- Product Cards -->
    <div class="flex flex-col gap-3">
        {#each $rankedProductsStore as product, i (product.id)}
            <ProductCard
                {product}
                index={i}
                totalCards={$rankedProductsStore.length}
            />
        {/each}
    </div>

    <!-- Controls -->
    <div class="flex flex-col gap-3 mt-4">
        {#if canAddMore}
            <button
                onclick={addProduct}
                class="w-full py-3 border-2 border-dashed border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-semibold hover:bg-[var(--primary-color)] hover:text-white transition-colors flex justify-center items-center gap-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clip-rule="evenodd"
                    />
                </svg>
                Add Another Option
            </button>
        {/if}

        <div class="flex gap-3">
            <button
                onclick={resetProducts}
                class="flex-1 py-3 bg-[var(--accent-color)]/10 text-[var(--accent-color)] rounded-xl font-bold hover:bg-[var(--accent-color)]/20 transition-colors"
            >
                Clear All
            </button>

            <button
                onclick={calculateRanks}
                class="flex-[2] py-3 bg-[var(--primary-color)] text-white rounded-xl font-extrabold shadow-lg hover:bg-blue-800 hover:shadow-xl transition-all text-lg tracking-wide group flex justify-center items-center gap-2"
            >
                <span>COMPARE</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
            </button>
        </div>
    </div>
</div>
