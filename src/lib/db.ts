import Dexie, { type EntityTable } from 'dexie';

export type UnitType = 'g' | 'kg' | 'oz' | 'lb' | 'ea' | 'ml' | 'l' | 'fl-oz';

export interface Product {
    id: string; // uuid
    price: number | null;
    quantity: number | null;
    unit: UnitType;
}

export interface Settings {
    id: string; // 'global'
    benchmark: UnitType;
}

const db = new Dexie('costcompare_db') as Dexie & {
    products: EntityTable<Product, 'id'>;
    settings: EntityTable<Settings, 'id'>;
};

// Schema version 1
db.version(1).stores({
    products: 'id', // Primary key
    settings: 'id'
});

export { db };
