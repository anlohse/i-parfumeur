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
    <div class="container">
  <div class="row">

    <!-- TODO insert the frontend code her -->
    ${FormulasEditView()}

</div>
</div>
`;

const FormulasSearchView = () => html`
    <div class="accordion col" id="accordionExample">
        <div class="accordion-item">
            <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Filters
            </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
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
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                    Results
                </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">Formula</th>
                            <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>-</td>
                            <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
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
    <div class="accordion" id="accordionPanelsStayOpenExample">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTop" aria-expanded="true" aria-controls="collapseTop">
                    Top -30%
                </button>
                <button class="btn" style="position: absolute">✚</button>

            </h2>

            <div id="collapseTop" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <table class="table">
                        <tbody>
                            <tr>
                            <td>-</td>
                            <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapsethree" aria-expanded="true" aria-controls="collapseTwo">
                    Heart 48%
                </button>
            </h2>
            <div id="collapsethree" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <table class="table">
                        <tbody>
                            <tr>
                            <td>-</td>
                            <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapsefour" aria-expanded="true" aria-controls="collapseTwo">
                    Base -22%
                </button>
            </h2>
            <div id="collapsefour" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <table class="table">
                        <tbody>
                            <tr>
                            <td>-</td>
                            <td>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="collapse-container mb-2">
        <div class="d-flex justify-content-between align-items-center bg-primary p-3">
            <span class="fs-5 fw-bold">Título do Collapse</span>
            <div>
                <button class="btn btn-icon btn-sm">
                    <i class="bi bi-plus"></i>
                </button>
                <button class="btn btn-icon btn-sm rotate-icon" style="font-size: 1.5em" data-bs-toggle="collapse" data-bs-target="#collapseContent">
                    <i class="bi bi-chevron-down" id="collapseIcon"></i>
                </button>
            </div>
        </div>
        <div class="collapse" id="collapseContent">
            <div class="card card-body">
            Este é o conteúdo do collapse. Aqui você pode adicionar qualquer coisa.
            </div>
        </div>
    </div>



`;


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
