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
import {Formula} from '../types';
import {IndexedDbDao, IDBTransaction} from '../system/dao-indexeddb';
import { IDBPDatabase } from 'idb';

const FORMULA_STORE_NAME = 'formulas';

export class FormulaDao extends IndexedDbDao<Formula> {
    constructor() {
        super(FORMULA_STORE_NAME);
    }

    upgrade(database: IDBPDatabase, oldVersion: number, newVersion: number | null, transaction: IDBTransaction): void {
        super.upgrade(database, oldVersion, newVersion, transaction);
        if (oldVersion < 1) {
            const store = transaction.objectStore(FORMULA_STORE_NAME);
            store.createIndex(FORMULA_STORE_NAME + '_byName', 'name');
            store.createIndex(FORMULA_STORE_NAME + '_byFamily', 'family');
        }
    }
}