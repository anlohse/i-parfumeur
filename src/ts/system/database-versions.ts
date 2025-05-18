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
import {DEFAULT_MATERIALS} from '../materials-precreated';
interface StoreDefinition {
    name: string;
    options?: IDBObjectStoreParameters;
    indexes?: {
        name: string;
        keyPath: string | string[];
        options?: IDBIndexParameters;
    }[];
    data?: any[]; // Optional initial data for the store
}    

export interface DatabaseVersion {
    version: number;
    stores: StoreDefinition[]
}

export const databaseVersions: DatabaseVersion[] = [
    {
        version: 1,
        stores: [
            {
                name: 'sequences',
                options: { keyPath: 'id' }
            },
            {
                name: 'materials',
                options: { keyPath: 'id' },
                indexes: [
                    { name: 'materialsByName', keyPath: 'name', options: { unique: true } },
                    { name: 'materialsByNotes', keyPath: 'notes', options: { multiEntry: true } },
                    { name: 'materialsByFamily', keyPath: 'family' }
                ],
                data: DEFAULT_MATERIALS // Predefined materials
            },
            {
                name: 'formulas',
                options: { keyPath: 'id' },
                indexes: [
                    { name: 'formulasByName', keyPath: 'name', options: { unique: true } },
                    { name: 'formulasByFamily', keyPath: 'families', options: { multiEntry: true } },
                    { name: 'formulasByIngredients', keyPath: 'ingredients', options: { multiEntry: true } }
                ]
            }
        ]
    }
];