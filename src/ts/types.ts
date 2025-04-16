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

export interface Material {
    id: string;
    name: string;
    color: string;
    notes: ('top' | 'heart' | 'base')[];
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
    name: string;
    note: 'top' | 'heart' | 'base';
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
    family: OlfactoryFamily;
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
