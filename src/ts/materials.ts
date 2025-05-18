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
import { NoteClassification } from './types';
import { update } from './util';

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
    <input type="text" class="form-control" id="materialName" placeholder="Material name">
    <label for="materialName">Name</label>
  </div>
  <div class="form-floating mb-3">
    <input type="text" class="form-control" id="materialType" placeholder="Type">
    <label for="materialType">Identifier</label>
  </div>
    <div class="form-floating mb-3">
        <select class="form-select" id="noteClassification">
            <option selected></option>
            ${ Object.entries(noteClassLabels).map(e => html`<option value="${e[0]}">${e[1]}</option>`)}
        </select>
        <label for="noteClassification">Note Classification</label>
    </div>

    <div class="form-floating mb-3">
        <select class="form-select" id="OlfactoryFamily">
            <option selected></option>
            ${ Object.entries(noteClassLabels).map(e => html`<option value="${e[0]}">${e[1]}</option>`)}
        </select>
        <label for="OfactoryFamily">Olfactory Family</label>
    </div>
    
    <div class="row mb-3">
        <label for="colorPicker" class="mt-2 col-10 fw-bold text-start" style="font-size: 1.2rem">Color</label>
        <input type="color" id="colorPicker" class="form-control form-control-color col-2" title="Choose your color" />
    </div>


    <div class="form-floating mb-3">
        <input type="text" class="form-control" id="materialType" placeholder="Type">
        <label for="materialType">Drops Per Ml</label>
    </div>
    <div class="form-floating mb-3">
        <select class="form-select" id="Defaut Unity">
            <option selected></option>
            ${ Object.entries(noteClassLabels).map(e => html`<option value="${e[0]}">${e[1]}</option>`)}
        </select>
        <label for="DefautUnity">Default Unity</label>
    </div>
    <div class="d-flex justify-content-center gap-4 ps-3 pe-3">
        <button type="button" class="btn btn-outline-light btn-secondary col-6" @click="${edit}">Cancel</button>
        <button type="button" class="btn btn-outline-light btn-primary col-6">Ok</button>
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
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">Note Classification</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                    <label for="floatingInput">Ofactory Family</label>
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
                          <tr>
                          <td class="col-4">
                             <p>Material Name 1</p>
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
                             <p>Material Name 2</p>
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
                              <p>Material Name 3</p>
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
      <div class="d-flex justify-content-center gap-4 ps-3 pe-3">
        <button type="button" class="btn btn-outline-light btn-primary col-6">Create New</button>
    </div>
      `; 

                      

function edit() {
    editing = true;
    update();
}

const noteClassLabels : Record<NoteClassification, string> = {
    base: 'Base',
    heart: 'Heart',
    top: 'Top'
};

