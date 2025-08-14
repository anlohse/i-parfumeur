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
import {Collapse} from './components/collapse';
import { Material, noteClassLabels, NoteType, olfactoryFamilies } from './types';
import { Messages, update } from './util';
import { MaterialDao } from 'persistence/materials-dao';
import { MultiSelect } from 'components/multiselect';

let editing = false; 

/**
 * MaterialsView component displays a list of materials and allows the user to create, edit, and delete materials.
 * It also provides a search functionality to filter materials based on various criteria.
 */
export const MaterialsView = () => html`
  <h2>🧪 - Materials</h2>
  <div class="messages-container"></div>
  <div class="container">
    <div class="row">
      ${editing ? MaterialsEditView() : MaterialsSearchView()}
    </div>
  </div>
`;

/**
 * MaterialsEditView component displays a form to create or edit a material.
 * It includes fields for identifier, name, note classification, olfactory family, color, and drops per ml.
 */
const MaterialsEditView = () => html`
    <div class="col">
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="materialIdentifier" name="id" placeholder="Identifier" @change="${changeMaterial}" value="${material.id!}">
            <label for="materialIdentifier">Identifier</label>
        </div>
        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="materialName" name="name" placeholder="Material name" @change="${changeMaterial}" autocomplete="off" value="${material.name}">
            <label for="materialName">Name</label>
        </div>
        <div class="form-floating mb-3">
            ${MultiSelect({
                id: 'noteClassification',
                placeholder: 'Note Classification',
                className: 'form-control',
                style: 'width: 100%',
                values: material.notes.map((note) => {
                    return { id: note, name: noteClassLabels[note] };
                }),
                fetchOptions: async () => {
                    return Object.entries(noteClassLabels).map((note) => {
                        return { id: note[0], name: note[1] };
                    });
                },
                onSelect: changeNotesEditing
            })}
            <label for="noteClassification">Note Classification</label>
        </div>

        <div class="form-floating mb-3">
            <select class="form-select" id="olfactoryFamily" name="family" @change="${changeMaterial}">
                <option selected></option>
                ${ olfactoryFamilies.map(e => html`<option .selected="${e.value == material.family}" value="${e.value}">${e.label}</option>`)}
            </select>
            <label for="olfactoryFamily">Olfactory Family</label>
        </div>
        
        <div class="row mb-3">
            <label for="colorPicker" class="mt-2 col-10 fw-bold text-start" style="font-size: 1.2rem">Color</label>
            <input type="color" id="colorPicker" class="form-control form-control-color col-2" name="color" 
                    title="Choose your color" @change="${changeMaterial}" value="${material.color}">
        </div>

        <div class="form-floating mb-3">
            <input type="number" class="form-control" id="dropsPerMl" name="dropsPerMl" placeholder="Drops Per Ml" 
                    min="0" max="1000" step="1" @change="${changeMaterial}" value="${material.dropsPerMl}">
            <label for="dropsPerMl">Drops Per Ml</label>
        </div>

        <div class="d-flex justify-content-center gap-4 ps-3 pe-3">
            <button type="button" class="btn btn-outline-light btn-secondary col-6" @click="${cancelEdit}">Cancel</button>
            <button type="button" class="btn btn-outline-light btn-primary col-6" @click="${saveMaterial}">Ok</button>
        </div>
    </div>
`;

/**
 * MaterialsSearchView component displays a list of materials with filters for searching.
 * It includes fields for filtering by name, note classification, and olfactory family.
 */
const MaterialsSearchView = () => html`
  <div class="accordion col" id="accordionExample">
        ${Collapse({
            id: "filtersCollapse",
            title: "Filters",
            body: html`
           <div class="accordion-body">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="materialsByName" name="materialsByName" placeholder="Name" @change="${changeFilters}">
                    <label for="materialsByName">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="materialsByNotes" name="materialsByNotes" placeholder="Note Classification" @change="${changeFilters}">
                    <label for="materialsByNotes">Note Classification</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="materialsByFamily" name="materialsByFamily" placeholder="Ofactory Family" @change="${changeFilters}">
                    <label for="materialsByFamily">Ofactory Family</label>
                </div>
            </div>
           `,
            expanded: true,
            showExpandButton: true
        })}
; 
        ${Collapse({
            id: "resultsCollapse",
            title: "Results",
            body: html`
                <table class="table">
                    <tbody>
                        ${materials.map(m => html`
                            <tr>
                                <td class="col-4">
                                    <p>${m.name}</p>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-icon" title="Edit" @click="${() => editMaterial(m)}">
                                        <i class="bi bi-pencil icon-sm"></i>
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-icon" title="Remove" @click="${() => removeMaterial(m)}">
                                        <i class="bi bi-trash icon-sm"></i>
                                    </button>
                                </td> 
                            </tr>
                        `)}
                    </tbody>
                </table>
            `,
            expanded: true,
            showExpandButton: true
        })}
        </div>
        <div class="d-flex justify-content-center gap-4 ps-3 pe-3">
            <button type="button" class="btn btn-outline-light btn-primary col-6" @click="${createNew}">Create New</button>
        </div>
      `; 

       
const materialDao = new MaterialDao();

let materials: Material[] = [];
let material: Material = createNewMaterial();
let lastFilters: Record<string, string> = {};

/**
 * Initialize the materials list on component load
 * This function fetches all materials from the database and sets the materials variable.
 */
function createNewMaterial(): Material {
    return {
        id: undefined,
        name: '',
        color: '',
        notes: [] as NoteType[],
        dropsPerMl: 20,
        family: 'floral',
        createdAt: new Date().toISOString()
    };
}

/**
 * Load materials when the component is initialized
 * This function fetches all materials from the database and sets the materials variable.
 */
function createNew() {
    editing = true;
    material = createNewMaterial();
    update();
}

// Cancel the editing mode and reset the material
// This function is called when the user clicks the cancel button in the edit form.
// It resets the editing state and the material variable to a new empty material.
// It also updates the view to reflect the changes.
function cancelEdit() {
    editing = false;
    update();
}

async function validateSave() {
    let mats = await materialDao.findByIndexes({"materialsByName": material.name});
    if (mats.length > 0) {
        Messages.add('There is already a material with this name', 'error');
        return false;
    }
    return true;
}

// Save the material and reset the form
// This function is called when the user clicks the save button in the edit form.
// It updates the material's updatedAt timestamp, saves it to the database, and resets the material variable.
// It also adds a success message to the Messages component and updates the view.
// After saving, it resets the material variable to a new empty material.
async function saveMaterial() {
    editing = false;
    if (await validateSave()) {
        material.updatedAt = new Date().toISOString();
        await materialDao.save(material);
        materials.push(material);
        Messages.add('Material saved', 'success');
        material = createNewMaterial();
        update();
    }
}

// Handle changes in the material form fields
// This function updates the material variable based on the input field changes.
// It listens for changes in the input fields and updates the corresponding properties of the material object.
function changeMaterial(e: Event) {
    const target = e.target as HTMLInputElement;
    (<any>material)[target.name] = target.value;
    console.log('changeMaterial', material);
}

// Handle changes in the notes selection
// This function updates the material's notes based on the selected notes from the MultiSelect component.
// It maps the selected notes to their IDs and updates the material variable accordingly.
// It also logs the changes to the console for debugging purposes.
function changeNotesEditing(notes: {id: string; name: string}[]) {
    console.log('changeNotesEditing', notes);
    material.notes = notes.map((note) => note.id as NoteType);
    console.log('material', material);
}

// Handle changes in the filters for searching materials
// This function updates the lastFilters object with the values from the input fields and calls loadMaterials to fetch the filtered materials.
// It listens for changes in the input fields and updates the filters accordingly.
// It also removes any filters that are undefined or empty.
function changeFilters(e: Event) {
    const target = e.target as HTMLInputElement;
    const filters = {
        ...lastFilters,
        [target.name]: target.value
    };
    Object.keys(filters).forEach(key => {
        if (filters[key] === undefined || filters[key] === '') {
            delete filters[key];
        }
    });
    loadMaterials(filters);
}

/**
 * Load materials based on the provided filters.
 * If no filters are provided, it loads all materials.
 * It updates the materials list and the lastFilters variable.
 */
async function loadMaterials(filters: Record<string, string>) {
    console.log('loadMaterials', filters);
    materials = Object.keys(filters).length === 0 ? await materialDao.findAll() : await materialDao.findByIndexes(filters);
    console.log('materials', materials);
    lastFilters = filters
    update();
}

// Edit a material by setting it to the editing state and updating the material variable
// This function is called when the user clicks the edit button on a material in the list.
async function editMaterial(m: Material) {
    material = m;
    editing = true;
    update();
}

// Remove a material by deleting it from the database and reloading the materials list
// This function is called when the user clicks the remove button on a material in the list.
async function removeMaterial(m: Material) {
    console.log('removeMaterial', m);
    await materialDao.delete(m.id!);
    loadMaterials(lastFilters);
}