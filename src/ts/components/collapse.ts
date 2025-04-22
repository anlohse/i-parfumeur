import { html, TemplateResult } from 'lit-html';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

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
    return html`
        <div class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><strong>${data.title}</strong></span>
                <div>
                    ${data.showAddButton ? html`
                        <button class="btn btn-sm btn-icon" title="Adicionar" @click="${data.onadd}">
                            <i class="bi bi-plus icon"></i>
                        </button>
                    ` : ''}
                    ${data.showExpandButton ? html`
                        <button class="btn btn-sm btn-icon rotate-toggle" data-bs-toggle="collapse"
                                data-bs-target="#${data.id}"
                                aria-expanded="${data.expanded ? 'true' : 'false'}"
                                aria-controls="${data.id}"
                                title="Expandir/Recolher">
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
