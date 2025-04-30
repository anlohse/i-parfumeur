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
import {Collapse} from './components/collapse';
import {update} from './util';

let editing = false;

// page html
export const FormulasView = () => html`
    <h2>📋 - My Formulas</h2>
    <div class="messages-container"></div>
    <div class="container">
  <div class="row">

    <!-- TODO insert the frontend code her -->
    ${editing ? FormulasEditView() : FormulasSearchView()}

</div>
</div>
`;

const FormulasSearchView = () => html`
    <button @click="${createNew}">Create new</button>
    <div class="accordion col" id="accordionExample">
        ${Collapse({
            id: "filtersCollapse",
            title: "Filters",
            body: html`
           <div class="accordion-body">
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">ingredients</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">Style</label>
                </div>
            </div>
           `,
            expanded: true,
            showExpandButton: true
        })}

        ${Collapse({
            id: "resultsCollapse",
            title: "Results",
            body: html`
                    <table class="table">
                        <tbody>
                            <tr>
                            <td class="col-4">
                               <p>Formula 1</p>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-icon" title="edit">
                                    <i class="bi bi-pencil icon-sm"></i>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-icon" title="Remove">
                                    <i class="bi bi-trash icon-sm"></i>
                                </button>
                            </td> 
                            </tr>
                            <tr>
                            <td>
                               <p>Formula 2</p>
                        </td>
                        <td>
                                <button class="btn btn-sm btn-icon" title="edit">
                                    <i class="bi bi-pencil icon-sm"></i>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-icon" title="Remove">
                                    <i class="bi bi-trash icon-sm"></i>
                                </button>
                            </td> 
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                            <td>
                                <p>Formula 3</p>
                            </td>  
                            <td>
                                <button class="btn btn-sm btn-icon" title="edit">
                                    <i class="bi bi-pencil icon-sm"></i>
                                </button>
                            </td> 
                            <td>
                                <button class="btn btn-sm btn-icon" title="Remove">
                                    <i class="bi bi-trash icon-sm"></i>
                                </button>
                            </td> 
                            </tr>
                        </tbody>
                    </table>
            `,
            expanded: true,
            showExpandButton: true
        })}
    </div>

`;

const FormulasEditView = () => html`

            <div class="col">
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">Identifier</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">Description</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">Style</label>
                </div>
            </div>
            ${Collapse({
                id: 'Top',
                title: 'Top - 30%',
                body: html`
                    <table class="table">
                        <tbody>
                            <tr>
                            <td class= "col-6">
                                <select class="form-select" aria-label="Default select example">
                                <option selected>Vertiver</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                                </select>
                                 </td>
                            <td class="col-2">
                                <div class="input-group mb-3">
                                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                                
                                </div>
                            
                             </td>
                            <td>
                                <button class="btn btn-sm btn-icon" title="Remove">
                                    <i class="bi bi-trash icon-sm"></i>
                                </button>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                `,
                showAddButton: true,
                showExpandButton: true,
                expanded: true,
                onadd: (e: Event) => {
                    console.log('add', e);
                }
            })} 
   
   ${Collapse({
                id: 'Heart',
                title: 'Heart -48%',
                body: html`
                    <table class="table">
                        <tbody>
                            <tr>
                            <td class= "col-6">
                                <select class="form-select" aria-label="Material">
                                <option selected>Bergamot</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                                </select>
                            </td>
                            <td class= "col-2">                            
                                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-icon" title="Remove">
                                    <i class="bi bi-trash icon-sm"></i>
                                </button>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                `,
                showAddButton: true,
                showExpandButton: true,
                expanded: true,
                onadd: (e: Event) => {
                    console.log('add', e);
                }
            })} 

${Collapse({
                id: 'Base',
                title: 'Base -22%',
                body: html`
                    <table class="table">
                        <tbody>
                            <tr>
                            <td class= "col-6">
                                <select class="form-select" aria-label="Default select example">
                                <option selected>Lavanda</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                                </select>
                            </td>
                            <td class= "col-2">
                                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                                </td>
                                <td>
                                <button class="btn btn-sm btn-icon" title="Remove">
                                    <i class="bi bi-trash icon-sm"></i>
                                </button>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                `,
                showAddButton: true,
                showExpandButton: true,
                expanded: true,
                onadd: (e: Event) => {
                    console.log('add', e);
                }
            })} 

    <button @click="${cancelEdit}">Cancel</button>
        




`;

function createNew() {
    editing = true;
    update();
}

function cancelEdit() {
    editing = false;
    update();
}

(async function () {
    window.addEventListener('page-formulas', async () => {
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
