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
import { html } from 'lit-html';
import { FormulaDao } from './persistence/formulas-dao';
import { Formula } from './types';
import { Messages, sleep } from './util';

// page html
export const FormulasView = () => html`
    <h2>📋 - My Formulas</h2>
    <div class="messages-container"></div>
    <!-- TODO insert the frontend code here -->
`;

(async function () {
    window.addEventListener('page-formulas', async() => {
        await sleep(600);
        Messages.add('Welcome to the formulas page', 'success');
    })
})();

// Storage functions
const formulaDao = new FormulaDao();

let formulas: Formula[] = [];
let formula: Formula = createNewFormula();
let lastFilters: Record<string, string> = {};

function createNewFormula(): Formula {
    return {
        id: undefined,
        name: 'Unamed fragrance',
        family: 'floral',
        description: '',
        ingredients: [],
        createdAt: new Date().toISOString(),
        updatedAt: undefined
    };
}

async function saveFormula() {
    formula.updatedAt = new Date().toISOString();
    await formulaDao.save(formula);
    formulas.push(formula);
    Messages.add('Formula saved', 'success');
    formula = createNewFormula();
}

async function deleteFormula(formula: Formula) {
    await formulaDao.delete(formula.id!);
    formulas = formulas.filter(f => f.id !== formula.id);
    await loadFormulas(lastFilters);
}

async function loadFormulas(filters: Record<string, string>) {
    formulas = await formulaDao.findByIndexes(filters);
    lastFilters = filters
}

async function loadFormula(id: string) {
    let opFormula = await formulaDao.findById(id);
    if (opFormula) {
        formula = opFormula;
    } else {
        Messages.add('Formula not found', 'error');
    }
}
