/**
 * i-parfumeur - Artisan Perfume Formula Manager
 * 
 * @license MIT
 * Copyright (c) 2025 2025 Anlohse Software
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { openDB, IDBPDatabase, IDBPTransaction, StoreNames, DBSchema } from 'idb';
import { Dao } from './dao';
import { databaseVersions } from './database-versions';

export const DB_NAME = 'iparfumeur-idb';
export const DB_VERSION = 1;

export type IDBTransaction = IDBPTransaction<any, StoreNames<any>[], 'versionchange'>;

export class IndexedDbDao<T extends { id?: string }> implements Dao<T> {

    constructor(private storeName: string) { }

    upgrade(database: IDBPDatabase, oldVersion: number, newVersion: number | null, transaction: IDBTransaction): void {
        databaseVersions.forEach((version) => {
            if (version.version === newVersion) {
                version.stores.forEach((store) => {
                    const objectStore = database.createObjectStore(store.name, store.options);
                    store.indexes?.forEach((index) => {
                        objectStore.createIndex(index.name, index.keyPath, index.options);
                    });
                    store.data?.forEach((data) => objectStore.put(data));
                });
            }
        });
    }

    private async getDb() {
        return await openDB(DB_NAME, DB_VERSION, {
            upgrade: this.upgrade.bind(this)
        });
    }

    async findAll(): Promise<T[]> {
        const db = await this.getDb();
        return db.getAll(this.storeName);
    }

    async findById(id: string): Promise<T | undefined> {
        const db = await this.getDb();
        return db.get(this.storeName, id);
    }

    composeId(value: T, rawId: number): string {
        return value.id || this.storeName + "-" + rawId;
    }

    async save(entity: T): Promise<void> {
        if (!entity.id) {
            entity.id = this.composeId(entity, await sequenceGenerator.next(this.storeName));
        }
        const db = await this.getDb();
        await db.put(this.storeName, entity);
    }

    async delete(id: string): Promise<void> {
        const db = await this.getDb();
        await db.delete(this.storeName, id);
    }

    async findByFilters(filters: Record<string, string>): Promise<T[]> {
        const all = await this.findAll();
        return all.filter((item) => {
            let filterEntries = Object.entries(filters);
            return filterEntries.length == 0 || filterEntries.every(
                ([key, value]) => (item as any)[key] == value
            )
        });
    }

    async findByPartial(field: keyof T, query: string): Promise<T[]> {
        const all = await this.findAll();
        return all.filter((item) => {
          const value = (item[field] as unknown as string)?.toLowerCase();
          return value?.includes(query.toLowerCase());
        });
      }      

    async findByIndexes(indexValues: Record<string, string>): Promise<T[]> {
        const db = await this.getDb();
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);

        const results: T[][] = [];

        for (const [indexName, indexValue] of Object.entries(indexValues)) {
            const index = store.index(indexName);
            const matched = await index.getAll(indexValue);
            results.push(matched);
        }

        await tx.done;

        if (results.length === 1) return results[0];

        const firstSet = new Set(results[0].map((item) => JSON.stringify(item)));
        for (let i = 1; i < results.length; i++) {
            const currentSet = new Set(results[i].map((item) => JSON.stringify(item)));
            for (const val of firstSet) {
                if (!currentSet.has(val)) {
                    firstSet.delete(val);
                }
            }
        }

        return Array.from(firstSet).map((s) => JSON.parse(s));
    }
}

interface Sequence {
    id: string;
    value: number;
}

export class SequenceGenerator {
    private storeName = 'sequences';

    private async getDb(): Promise<IDBPDatabase> {
        return openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('sequences')) {
                    db.createObjectStore('sequences', { keyPath: 'id' });
                }
            }
        });
    }

    async next(sequenceId: string): Promise<number> {
        const db = await this.getDb();
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);

        const current = (await store.get(sequenceId)) as Sequence | undefined;

        const nextValue = (current?.value ?? 0) + 1;

        await store.put({ id: sequenceId, value: nextValue });

        await tx.done;

        return nextValue;
    }

    async current(sequenceId: string): Promise<number | undefined> {
        const db = await this.getDb();
        const seq = await db.get(this.storeName, sequenceId);
        return seq?.value;
    }

    async reset(sequenceId: string, value = 0): Promise<void> {
        const db = await this.getDb();
        await db.put(this.storeName, { id: sequenceId, value });
    }
}

const sequenceGenerator = new SequenceGenerator();
