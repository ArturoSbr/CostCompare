import { writable, get } from 'svelte/store';
import { db, type Product, type UnitType } from './db';
import convert from 'convert';

// Define the store references
export const productsStore = writable<Product[]>([]);
export const globalBenchmarkStore = writable<UnitType>('lb');
export const rankedProductsStore = writable<(Product & { rank: number | null })[]>([]);

// Pre-populate store from DB
export async function initializeStores() {
    const dbProducts = await db.products.toArray();
    if (dbProducts.length === 0) {
        // Initial State: 2 cards visible
        const defaults: Product[] = [
            { id: crypto.randomUUID(), price: null, quantity: null, unit: 'lb' },
            { id: crypto.randomUUID(), price: null, quantity: null, unit: 'lb' }
        ];
        await db.products.bulkAdd(defaults);
        productsStore.set(defaults);
    } else {
        productsStore.set(dbProducts);
    }

    const settings = await db.settings.get('global');
    if (settings) {
        globalBenchmarkStore.set(settings.benchmark);
    } else {
        await db.settings.add({ id: 'global', benchmark: 'lb' });
    }

    calculateRanks(); // initial calculation
}

// Add a product card
export async function addProduct() {
    const current = get(productsStore);
    if (current.length >= 5) return;
    const newProduct: Product = { id: crypto.randomUUID(), price: null, quantity: null, unit: get(globalBenchmarkStore) };
    await db.products.add(newProduct);
    productsStore.update(arr => [...arr, newProduct]);
    clearRanks();
}

// Remove a product card
export async function removeProduct(id: string) {
    await db.products.delete(id);
    productsStore.update(arr => arr.filter(p => p.id !== id));
    clearRanks();
}

// Update a product card
export async function updateProduct(id: string, updates: Partial<Product>) {
    await db.products.update(id, updates);
    productsStore.update(arr => arr.map(p => p.id === id ? { ...p, ...updates } : p));
    clearRanks();
}

// Update Global Benchmark
export async function updateBenchmark(benchmark: UnitType) {
    await db.settings.update('global', { benchmark });
    globalBenchmarkStore.set(benchmark);
    clearRanks();
}

// Clear All / Reset to 2 cards
export async function resetProducts() {
    await db.products.clear();
    const defaults: Product[] = [
        { id: crypto.randomUUID(), price: null, quantity: null, unit: get(globalBenchmarkStore) },
        { id: crypto.randomUUID(), price: null, quantity: null, unit: get(globalBenchmarkStore) }
    ];
    await db.products.bulkAdd(defaults);
    productsStore.set(defaults);
    clearRanks();
}

export function clearRanks() {
    const products = get(productsStore);
    rankedProductsStore.set(products.map(p => ({ ...p, rank: null })));
}

// Calculation logic
export function calculateRanks() {
    const products = get(productsStore);
    const benchmark = get(globalBenchmarkStore);

    const computed = products.map(p => {
        if (!p.price || !p.quantity || Number(p.price) <= 0 || Number(p.quantity) <= 0) {
            return { ...p, unitCost: Infinity };
        }

        // Check if mixing mass and count. If mixing, it's invalid unless handled, but we assume UI forces valid choices.
        let normalizedQuantity = Number(p.quantity);
        if (benchmark === 'ea' || p.unit === 'ea') {
            // If one is ea and the other isn't, the comparison is invalid, default to Infinity
            if (benchmark !== p.unit) return { ...p, unitCost: Infinity };
        } else {
            // Both are mass or both are volume
            try {
                normalizedQuantity = Number(convert(Number(p.quantity), p.unit as any).to(benchmark as any));
            } catch (e) {
                return { ...p, unitCost: Infinity };
            }
        }


        const uc = Number(p.price) / normalizedQuantity;
        return { ...p, unitCost: uc };
    });

    // Rank them
    const validProducts = computed.filter(p => p.unitCost !== Infinity).sort((a, b) => a.unitCost - b.unitCost);

    // Assign rank mapping: ID -> Rank
    const ranksMap = new Map<string, number>();
    let currentRank = 1;
    for (let i = 0; i < validProducts.length; i++) {
        if (i > 0 && validProducts[i].unitCost === validProducts[i - 1].unitCost) {
            ranksMap.set(validProducts[i].id, currentRank);
        } else {
            currentRank = i + 1;
            ranksMap.set(validProducts[i].id, currentRank);
        }
    }

    const updated = products.map(p => {
        return {
            ...p,
            rank: ranksMap.has(p.id) ? ranksMap.get(p.id)! : null
        };
    });

    rankedProductsStore.set(updated);
}
