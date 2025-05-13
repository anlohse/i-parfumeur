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
import { html, TemplateResult } from 'lit-html';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { assert } from '../util';

export interface CollapseData {
    id: string;
    title: string;
    body: TemplateResult<1>;
    showAddButton?: boolean;
    showExpandButton?: boolean;
    expanded?: boolean;
    onadd?: (e: Event) => void;
}

export function Collapse(data: CollapseData) {
    const defaultValues = {
        showAddButton: false,
        showExpandButton: true,
        expanded: true,
        onadd: (e: Event) => {
        }
    };
    data = {...defaultValues, ...data};
    
    assert(data,'id', 'Collapse component requires a unique "{field}" property.');
    assert(data,'title', 'Collapse component requires a "{field}" property.');
    assert(data,'body', 'Collapse component requires a "{field}" property.');
    return html`
        <div id="${data.id}-container" class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><strong id="${data.id}-title">${data.title}</strong></span>
                <div>
                    ${data.showAddButton ? html`
                        <button class="btn btn-sm btn-icon" title="Add" @click="${data.onadd}">
                            <i class="bi bi-plus icon"></i>
                        </button>
                    ` : ''}
                    ${data.showExpandButton ? html`
                        <button class="btn btn-sm btn-icon rotate-toggle" data-bs-toggle="collapse"
                                data-bs-target="#${data.id}"
                                aria-expanded="${data.expanded ? 'true' : 'false'}"
                                aria-controls="${data.id}"
                                title="Expand/Collapse">
                            <i class="bi bi-caret-up icon"></i>
                        </button>
                    ` : ''}
                </div>
            </div>

            <div class="collapse ${data.expanded ? 'show' : ''}" id="${data.id}">
                <div  id="${data.id}-body" class="card-body">
                ${data.body}
                </div>
            </div>
        </div>

        
    `;
}
