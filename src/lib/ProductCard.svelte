<script lang="ts">
    import {
        updateProduct,
        removeProduct,
        globalBenchmarkStore,
    } from "$lib/store";
    import type { Product } from "$lib/db";

    let {
        product,
        index,
        totalCards,
    }: {
        product: Product & { rank?: number | null };
        index: number;
        totalCards: number;
    } = $props();

    let isWinner = $derived(product.rank === 1);

    function handlePriceChange(e: Event) {
        const val = (e.target as HTMLInputElement).value;
        updateProduct(product.id, { price: val ? parseFloat(val) : null });
    }

    function handleQuantityChange(e: Event) {
        const val = (e.target as HTMLInputElement).value;
        updateProduct(product.id, { quantity: val ? parseFloat(val) : null });
    }

    function handleUnitChange(e: Event) {
        const val = (e.target as HTMLSelectElement).value as any;
        updateProduct(product.id, { unit: val });
    }

    function remove() {
        removeProduct(product.id);
    }

    // Predefined options based on global benchmark category
    let isCount = $derived($globalBenchmarkStore === "ea");
    let isVolume = $derived(
        ["ml", "l", "fl-oz"].includes($globalBenchmarkStore),
    );

    const countUnits = [{ value: "ea", label: "Items / Count (ea)" }];
    const volumeUnits = [
        { value: "ml", label: "Milliliters (ml)" },
        { value: "l", label: "Liters (l)" },
        { value: "fl-oz", label: "Fluid Ounces (fl oz)" },
    ];
    const massUnits = [
        { value: "g", label: "Grams (g)" },
        { value: "kg", label: "Kilograms (kg)" },
        { value: "oz", label: "Ounces (oz)" },
        { value: "lb", label: "Pounds (lb)" },
    ];

    let availableUnits = $derived(
        isCount ? countUnits : isVolume ? volumeUnits : massUnits,
    );

    // Medal assignment
    function getMedalStyles(rank: number | null | undefined) {
        if (!rank) return "hidden";
        if (rank === 1)
            return "bg-yellow-400 text-yellow-900 shadow-yellow-400/50 shadow-md ring-2 ring-yellow-300";
        if (rank === 2)
            return "bg-gray-300 text-gray-800 shadow-gray-400/50 shadow-md ring-2 ring-gray-200";
        if (rank === 3)
            return "bg-amber-700 text-amber-100 shadow-amber-900/50 shadow-md ring-2 ring-amber-600";
        return "bg-slate-700 text-white shadow-md";
    }
</script>

<div
    class={`relative flex flex-col gap-3 p-4 rounded-xl border-2 transition-all duration-300 ease-in-out shadow-sm
  ${isWinner ? "border-yellow-400 bg-yellow-50/10 scale-[1.02]" : "border-[var(--surface-color)] bg-[var(--surface-color)] hover:border-gray-300"}`}
>
    <!-- Card Header -->
    <div class="flex justify-between items-center mb-1">
        <h3 class="font-semibold text-[var(--primary-color)]">
            Option {index + 1}
        </h3>

        <div class="flex gap-2 items-center">
            {#if product.rank}
                <div
                    class={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getMedalStyles(product.rank)} transition-transform scale-110`}
                >
                    {product.rank}
                </div>
            {/if}

            {#if totalCards > 2}
                <button
                    onclick={remove}
                    class="text-gray-400 hover:text-[var(--accent-color)] transition-colors p-1"
                    aria-label="Remove Item"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            {/if}
        </div>
    </div>

    <!-- Inputs -->
    <div class="grid grid-cols-2 gap-4">
        <!-- Price -->
        <div class="flex flex-col">
            <label
                for={`price-${product.id}`}
                class="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider"
                >Price ($)</label
            >
            <div class="relative">
                <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >$</span
                >
                <input
                    id={`price-${product.id}`}
                    type="number"
                    inputmode="decimal"
                    step="0.01"
                    min="0"
                    class="w-full bg-[var(--bg-color)] border border-gray-300 rounded-lg py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-shadow text-[var(--text-color)]"
                    placeholder="0.00"
                    value={product.price || ""}
                    oninput={handlePriceChange}
                />
            </div>
        </div>

        <!-- Quantity & Unit -->
        <div class="flex flex-col">
            <label
                for={`qty-${product.id}`}
                class="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider"
                >Quantity</label
            >
            <div class="flex">
                <input
                    id={`qty-${product.id}`}
                    type="number"
                    inputmode="decimal"
                    step="0.1"
                    min="0"
                    class="w-full bg-[var(--bg-color)] border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-shadow text-[var(--text-color)]"
                    placeholder="0"
                    value={product.quantity || ""}
                    oninput={handleQuantityChange}
                />
                <select
                    class="bg-gray-100 border-y border-r border-gray-300 rounded-r-lg py-2 px-1 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-gray-900 font-medium"
                    value={product.unit}
                    onchange={handleUnitChange}
                >
                    {#each availableUnits as u}
                        <option value={u.value}>{u.value}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>
</div>
