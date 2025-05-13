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
export type MessageSeverity = 'success' | 'error' | 'warning' | 'info';

export interface MessagesType {
    message: string | undefined;
    type: MessageSeverity | undefined;
    fields: Record<string, { message: string, type: MessageSeverity }>;
}

export type InputMode = 'drops' | 'ml' | 'percent';

export type NoteType = 'top' | 'heart' | 'base';

export type OlfactoryFamily =
| 'citrus'
| 'floral'
| 'woody'
| 'oriental'
| 'aromatic'
| 'spicy'
| 'fruity'
| 'green'
| 'chypre'
| 'leather'
| 'gourmand'
| 'aquatic'
| 'aldehydic'
| 'amber'
| 'musk'
| 'fougere'
| 'ozonic'
| 'herbal'
| 'balsamic'
| 'animalic';

export const olfactoryFamilies : { value: OlfactoryFamily, label: string }[] = [
    { value: 'citrus', label: 'Citrus' },
    { value: 'floral', label: 'Floral' },
    { value: 'woody', label: 'Woody' },
    { value: 'oriental', label: 'Oriental' },
    { value: 'aromatic', label: 'Aromatic' },
    { value: 'spicy', label: 'Spicy' },
    { value: 'fruity', label: 'Fruity' },
    { value: 'green', label: 'Green' },
    { value: 'chypre', label: 'Chypre' },
    { value: 'leather', label: 'Leather' },
    { value: 'gourmand', label: 'Gourmand' },
    { value: 'aquatic', label: 'Aquatic' },
    { value: 'aldehydic', label: 'Aldehydic' },
    { value: 'amber', label: 'Amber' },
    { value: 'musk', label: 'Musk' },
    { value: 'fougere', label: 'Fougère' },
    { value: 'ozonic', label: 'Ozonic' },
    { value: 'herbal', label: 'Herbal' },
    { value: 'balsamic', label: 'Balsamic' },
    { value: 'animalic', label: 'Animalic' },
];
  

export interface Material {
    id: string;
    name: string;
    color: string;
    notes: NoteType[];
    dropsPerMl: number;
    family: OlfactoryFamily;
    createdAt: string;
    updatedAt?: string;
}

export interface InventoryBottle {
    id: string;
    amount: number;
    unit: 'drops' | 'ml' | 'g' | 'oz';
    inUse: boolean;
    openedAt?: string;
}
  
export interface InventoryItem {
    materialId: string;
    bottles: InventoryBottle[];
}
  

export interface Ingredient {
    material: Material;
    note: NoteType;
    inputValue: number;
    inputUnit: InputMode;
    drops?: number;
    ml?: number;
    percent?: number;
}

export interface Formula {
    id: string | undefined;
    name: string;
    description?: string;
    families: OlfactoryFamily[];
    ingredients: Ingredient[];
    createdAt: string;
    updatedAt?: string;
}

export interface Configuration {
    preferredInputUnit: InputMode;
    preferredStockUnit: InputMode;
    lowStockWarning: boolean;
    lowStockThreshold: number;
    language: string
}
