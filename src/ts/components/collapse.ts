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
        <div class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><strong>${data.title}</strong></span>
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
                <div class="card-body">
                ${data.body}
                </div>
            </div>
        </div>

        
    `;
}
