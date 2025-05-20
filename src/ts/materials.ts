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

export const MaterialsView = () => html`
  <h2>🧪 - Materials</h2>
  <div class="container">
    <div class="row">
      ${editing ? MaterialsEditView() : MaterialsSearchView()}
    </div>
  </div>
`;

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

function createNew() {
    editing = true;
    material = createNewMaterial();
    update();
}

function cancelEdit() {
    editing = false;
    update();
}

async function saveMaterial() {
    editing = false;
    material.updatedAt = new Date().toISOString();
    await materialDao.save(material);
    materials.push(material);
    Messages.add('Material saved', 'success');
    material = createNewMaterial();
    update();
}

function changeMaterial(e: Event) {
    const target = e.target as HTMLInputElement;
    (<any>material)[target.name] = target.value;
    console.log('changeMaterial', material);
}

function changeNotesEditing(notes: {id: string; name: string}[]) {
    console.log('changeNotesEditing', notes);
    material.notes = notes.map((note) => note.id as NoteType);
    console.log('material', material);
}

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

async function loadMaterials(filters: Record<string, string>) {
    console.log('loadMaterials', filters);
    materials = Object.keys(filters).length === 0 ? await materialDao.findAll() : await materialDao.findByIndexes(filters);
    console.log('materials', materials);
    lastFilters = filters
    update();
}

async function editMaterial(m: Material) {
    material = m;
    editing = true;
    update();
}

async function removeMaterial(m: Material) {
    console.log('removeMaterial', m);
    await materialDao.delete(m.id!);
    loadMaterials(lastFilters);
}