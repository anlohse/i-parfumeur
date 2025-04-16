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
import {config} from './util';
import { InputMode } from 'types';

const formulaUnits: Record<string, string> = {
    drops: 'Drops',
    ml: 'mL (Milliliters)',
    g: 'g (Grams)',
    oz: 'oz (Ounces)'
};

export const SettingsView = () => html`
    <h2>⚙️ - Settings</h2>
    <div class="row">
        <div class="col">
            <div class="accordion" id="settingsAccordion">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseUnits" aria-expanded="true" aria-controls="collapseUnits">
                            Formulas Options
                        </button>
                    </h2>
                    <div id="collapseUnits" class="accordion-collapse collapse show" data-bs-parent="#settingsAccordion">
                        <div class="accordion-body">
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="formulaUnitsSelect" @change="${handleSelectFormulaUnit}">
                                    ${Object.keys(formulaUnits).map(unit => html`<option value="${unit}" ?selected=${unit === config.preferredInputUnit}>${formulaUnits[unit]}</option>`)}
                                </select>
                                <label for="formulaUnitsSelect">Formula unit</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseStock" aria-expanded="true" aria-controls="collapseStock">
                            Stock Options
                        </button>
                    </h2>
                    <div id="collapseStock" class="accordion-collapse collapse show" data-bs-parent="#settingsAccordion">
                        <div class="accordion-body">
                            <div class="form-floating mb-3">
                                <select class="form-select" aria-label="Default select example" id="stockUnitsSelect" @change="${handleSelectStockUnit}">
                                    ${Object.keys(formulaUnits).filter(unit => unit !== 'drops').map(unit => html`<option value="${unit}" ?selected=${unit == config.preferredStockUnit}>${formulaUnits[unit]}</option>`)}
                                </select>
                                <label for="stockUnitsSelect">Stock unit</label>
                            </div>
                            <div class="form-check text-start">
                                <input class="form-check-input" style="border: 1px solid #999" type="checkbox" value="" id="lowStockWarning" ?checked="${config.lowStockWarning}" @click="${handleClickLowStockWarning}">
                                <label class="form-check-label" for="lowStockWarning">
                                    Low Stock Warning
                                </label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="lowStockThreshold" placeholder="Low Stock Threshold" autocomplete="off"
                                       value="${config.lowStockThreshold}" @change="${handleChangeLowStockThreshold}">
                                <label for="lowStockThreshold">Low Stock Threshold</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

function handleSelectFormulaUnit(e: Event) {
    const select = e.currentTarget as HTMLSelectElement;
    config.preferredInputUnit = <InputMode>select.value;
}
function handleSelectStockUnit(e: Event) {
    const select = e.currentTarget as HTMLSelectElement;
    config.preferredStockUnit = <InputMode>select.value;
}
function handleClickLowStockWarning(e: Event) {
    const checkbox = e.currentTarget as HTMLInputElement;
    config.lowStockWarning = checkbox.checked;
}
function handleChangeLowStockThreshold(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    config.lowStockThreshold = parseInt(input.value);
}
