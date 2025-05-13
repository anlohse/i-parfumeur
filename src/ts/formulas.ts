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
import { html, render } from 'lit-html';
import { FormulaDao } from './persistence/formulas-dao';
import { MaterialDao } from './persistence/materials-dao';
import { Formula, Ingredient, Material, NoteType, olfactoryFamilies } from './types';
import { Messages, sleep } from './util';
import { Collapse } from './components/collapse';
import { update } from './util';
import { AutoSelect } from 'components/autoselect';
import { MultiSelect } from 'components/multiselect';

let editing = false;

// page html
export const FormulasView = () => html`
    <h2>📋 - My Formulas</h2>
    <div class="messages-container"></div>
    <div class="container">
        <div class="row">

            ${editing ? FormulasEditView() : FormulasSearchView()}

        </div>
    </div>
`;

const FormulasSearchView = () => html`
    <div class="col">
        ${Collapse({
            id: "filtersCollapse",
            title: "Filters",
            body: html`
           <div class="accordion-body">
                <div class="form-floating mb-3">
                    <input name="formulasByName" type="text" class="form-control" id="name" placeholder="Name" @change="${changeFilters}">
                    <label for="floatingInput">Name</label>
                </div>
                <div class="form-floating mb-3">
                    ${AutoSelect({
                        id: 'ingredients',
                        placeholder: 'Ingredients',
                        className: 'form-control',
                        style: 'width: 100%',
                        fetchOptions: async (term: string) => {
                            return await materialDao.findByPartial('name', term);
                        },
                        onSelect: changeMaterialFilter
                    })}
                    <label for="floatingInput">Ingredients</label>
                </div>
                <div class="form-floating mb-3">
                    ${MultiSelect({
                        id: 'families',
                        placeholder: 'Families',
                        className: 'form-control',
                        style: 'width: 100%',
                        fetchOptions: async () => {
                            return olfactoryFamilies.map((family) => {
                                return { id: family.value, name: family.label };
                            });
                        },
                        onSelect: changeFamilyFilter
                    })}
                    <label for="floatingInput">Family</label>
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
                            ${formulas && formulas.length ? formulas.map((formula) => html`
                                <tr>
                                    <td class="col-4">
                                        <p>${formula.name}</p>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-icon" title="edit" @click="${() => loadFormula(formula.id!)}">
                                            <i class="bi bi-pencil icon-sm"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-icon" title="Remove" @click="${() => deleteFormula(formula!)}">
                                            <i class="bi bi-trash icon-sm"></i>
                                        </button>
                                    </td> 
                                </tr>
                            `) : html`
                                <tr>
                                    <td class="col">
                                        <p>No formulas found</p>
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
            `,
            expanded: true,
            showExpandButton: true
        })}
        <div class="col me-ms-2">
            <button class="btn btn-primary col-12" @click="${createNew}">Create new</button>
        </div>
    </div>

`;

function MaterialTable(data: Ingredient[], containerId: string) {
    return html`
        <table class="table">
            <tbody>
                ${data.map((material, i) => html`
                    <tr>
                        <td class="col-4">
                            ${AutoSelect({
                                id: containerId + '-' + i,
                                placeholder: 'Material',
                                className: 'form-control',
                                fetchOptions: async (term: string) => {
                                    return (term || '').length > 0 ? await materialDao.findByPartial('name', term) : [] as Material[];
                                },
                                onSelect: (mat: Material) => {
                                    material.material = mat
                                }
                            })}
                        </td>
                        <td class="col-2">
                            <div class="input-group mb-3">
                                ${
                                    { 
                                        'drops': html`<input type="number"
                                                             min="0"
                                                             max="1000"
                                                             step="0.5"
                                                             class="form-control" 
                                                             aria-label="Sizing example input" 
                                                             aria-describedby="inputGroup-sizing-default" 
                                                             value="${material.drops!}" @input="${(e: Event) => updateIngredient(material, 'drops', e)}">`,
                                        'ml': html`<input type="number" 
                                                          min="0"
                                                          max="1000"
                                                          step="0.01"
                                                          class="form-control" 
                                                          aria-label="Sizing example input" 
                                                          aria-describedby="inputGroup-sizing-default" 
                                                          value="${material.ml!}" @input="${(e: Event) => updateIngredient(material, 'ml', e)}">`,
                                        'percent': html`<input type="number" 
                                                               min="0"
                                                               max="100"
                                                               step="0.1"
                                                               class="form-control" 
                                                               aria-label="Sizing example input" 
                                                               aria-describedby="inputGroup-sizing-default" 
                                                               value="${material.percent!}" @input="${(e: Event) => updateIngredient(material, 'percent', e)}">` 
                                    }[material.inputUnit]
                                }
                            </div>
                        </td>
                        <td class="col-2">
                            <button class="btn btn-sm btn-icon" title="Remove" @click="${() => removeIngredient(data, material, containerId)}">
                                <i class="bi bi-trash icon-sm"></i>
                            </button>
                        </td> 
                    </tr>
                `)}
            </tbody>
        </table>`;
}

const FormulasEditView = () => html`

            <div class="col">
                <div class="form-floating mb-3">
                    <input name="id" type="text" class="form-control" id="formulaId" placeholder="Identifier" @change="${changeFormula}" value="${formula.id!}">
                    <label for="formulaId">Identifier</label>
                </div>
                <div class="form-floating mb-3">
                    <input name="name" type="text" class="form-control" id="formulaName" placeholder="Name" @change="${changeFormula}" value="${formula.name!}">
                    <label for="formulaName">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input name="description" type="text" class="form-control" id="formulaDesc" placeholder="Description" @change="${changeFormula}" value="${formula.description!}">
                    <label for="formulaName">Description</label>
                </div>
                <div class="form-floating mb-3">
                    <input name="families" type="text" class="form-control" id="formulaFamilies" placeholder="Families" @change="${changeFormula}" value="${formula.families.join(', ')}">
                    <label for="formulaFamilies">Families</label>
                </div>
            </div>
            ${Collapse({
                id: 'top',
                title: 'Top - 0%',
                body: html`
                    <div id="topIngredients">
                        ${ MaterialTable(groupIngredients.top, 'topIngredients') }
                    </div>
                `,
                showAddButton: true,
                showExpandButton: true,
                expanded: true,
                onadd: (e: Event) => {
                    groupIngredients.top.push(newIngredient('top'));
                    const container = document.getElementById('topIngredients');
                    render(MaterialTable(groupIngredients.top, 'topIngredients'), container!);
                }
            })} 
   
            ${Collapse({
                id: 'heart',
                title: 'Heart - 0%',
                body: html`
                    <div id="heartIngredients">
                        ${ MaterialTable(groupIngredients.heart, 'heartIngredients') }
                    </div>
                `,
                showAddButton: true,
                showExpandButton: true,
                expanded: true,
                onadd: (e: Event) => {
                    groupIngredients.heart.push(newIngredient('heart'));
                    const container = document.getElementById('heartIngredients');
                    render(MaterialTable(groupIngredients.heart, 'heartIngredients'), container!);
                }
            })} 

            ${Collapse({
                id: 'base',
                title: 'Base - 0%',
                body: html`
                    <div id="baseIngredients">
                        ${ MaterialTable(groupIngredients.base, 'baseIngredients') }
                    </div>
                `,
                showAddButton: true,
                showExpandButton: true,
                expanded: true,
                onadd: (e: Event) => {
                    groupIngredients.base.push(newIngredient('base'));
                    const container = document.getElementById('baseIngredients');
                    render(MaterialTable(groupIngredients.base, 'baseIngredients'), container!);
                }
            })} 

            <div class="col me-ms-2">
                <button class="btn btn-secondary col-6" @click="${cancelEdit}">Cancel</button>
                <button class="btn btn-primary col-6" @click="${saveFormula}">Save</button>        
            </div>



`;

function createNew() {
    editing = true;
    formula = createNewFormula();
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
const materialDao = new MaterialDao();

let formulas: Formula[] = [];
let formula: Formula = createNewFormula();
let lastFilters: Record<string, string> = {};
const groupPercentages = {
    top: 0,
    heart: 0,
    base: 0
};

const groupIngredients : Record<NoteType, Ingredient[]>= {
    top: [] as Ingredient[],
    heart: [] as Ingredient[],
    base: [] as Ingredient[]
};
const groupLabels = {
    top: 'Top',
    heart: 'Heart',
    base: 'Base'
};

function createNewFormula(): Formula {
    return {
        id: undefined,
        name: 'Unamed fragrance',
        families: ['floral'],
        description: '',
        ingredients: [],
        createdAt: new Date().toISOString(),
        updatedAt: undefined
    };
}

const newIngredient = (note: NoteType): Ingredient => ({
    material: { id: '', name: '', color: '', notes: [], dropsPerMl: 0, family: 'floral', createdAt: '', updatedAt: '' },
    note: note,
    inputValue: 0,
    inputUnit: 'drops',
    drops: 0,
    ml: 0,
    percent: 0
});

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

function changeFilters(e: Event) {
    const target = e.target as HTMLInputElement;
    const filters = {
        ...lastFilters,
        [target.name]: target.value
    };
    loadFormulas(filters);
}

const changeMaterialFilter = (material: any) => {
    console.log('changeMaterialFilter', material);
    const filters : any = {
        ...lastFilters, 
        formulasByIngredients: material?.id
    };
    // clear undefined or blank filters
    Object.keys(filters).forEach(key => {
        if (filters[key] === undefined || filters[key] === '') {
            delete filters[key];
        }
    });
    loadFormulas(filters);
}

const changeFamilyFilter = (families: any) => {
    console.log('changeFamilyFilter', families);
    const filters : any = {
        ...lastFilters, 
        formulasByFamily: families?.map((f: any) => f.id)
    };
    // clear undefined or blank filters
    Object.keys(filters).forEach(key => {
        if (filters[key] === undefined || filters[key] === '') {
            delete filters[key];
        }
    });
    loadFormulas(filters);
}

function changeFormula(e: Event) {
    const target = e.target as HTMLInputElement;
    (<any>formula)[target.name] = target.value;
}

async function loadFormulas(filters: Record<string, string>) {
    console.log('loadFormulas', filters);
    formulas = Object.keys(filters).length === 0 ? await formulaDao.findAll() : await formulaDao.findByIndexes(filters);
    console.log('formulas', formulas);
    lastFilters = filters
    update();
}

async function loadFormula(id: string) {
    let opFormula = await formulaDao.findById(id);
    if (opFormula) {
        formula = opFormula;
        editing = true;
        update();
    } else {
        Messages.add('Formula not found', 'error');
    }
}

function removeIngredient(data: Ingredient[], material: Ingredient, containerId: string) {
    const index = data.indexOf(material);
    if (index > -1) {
        data.splice(index, 1);
    }
    const container = document.getElementById(containerId);
    render(MaterialTable(data, containerId), container!);
}

function updateIngredient(material: Ingredient, key: keyof Ingredient, e: Event) {
    const target = e.target as HTMLInputElement;
    let val = parseFloat(target.value);
    (material as any)[key] = Number.isNaN(val) ? 0 : val;
    updatePercentages(material, key);
}

function updatePercentages(material: Ingredient, key: keyof Ingredient) {
    formula.ingredients = groupIngredients.top.concat(groupIngredients.heart).concat(groupIngredients.base);
    let total = formula.ingredients.reduce((acc, ing) => acc + (ing as any)[key], 0);
    if (total === 0) {
        total = 1; // Avoid division by zero
    }
    Object.keys(groupIngredients).forEach(group => {
        const groupTotal = groupIngredients[group as NoteType].reduce((acc, ing) => acc + (ing as any)[key], 0);
        const percentage = (groupTotal / total) * 100;
        groupPercentages[group as NoteType] = percentage;
        const title = group + '-title';
        const container = document.getElementById(title);
        container!.innerHTML = `${groupLabels[group as NoteType]} - ${percentage.toFixed(2)}%`;
    });
}