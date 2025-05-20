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
import { sleep } from '../util';

export interface AutoSelectOptions {
    id: string;
    placeholder?: string;
    className?: string;
    style?: string;
    value?: { name: string };
    fetchOptions: (term: string) => Promise<{ name: string }[]>;
    onSelect?: (item: any) => void;
}

export function AutoSelect(autoselectOptions: AutoSelectOptions) {

    let debounceTimer: any;
    function debounceLoad(term: string) {
        console.log('debounceLoad', term);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            state.options = await autoselectOptions.fetchOptions(term);
            console.log('state.options', state.options);
            update();
        }, 300);
    }

    const state = {
        options: [] as { name: string }[],
        search: '',
    };

    function onSearchInput(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        state.search = value;
        debounceLoad(value); // async update
    }

    function selectItem(e: Event, callEventHandler = true) {
        console.log('selectItem', e.target);
        const item = (e.target as any).data;
        if (autoselectOptions.onSelect && callEventHandler) {
            autoselectOptions.onSelect(item);
        }
        state.search = item.name;
        (document.getElementById(autoselectOptions.id) as HTMLInputElement).value = item.name;
        (document.getElementById(autoselectOptions.id) as HTMLInputElement).toggleAttribute('readonly', true);
        (document.getElementById(autoselectOptions.id + '-clear') as HTMLButtonElement).style.display = 'block';
    }

    function clearSelection() {
        state.search = '';
        (document.getElementById(autoselectOptions.id) as HTMLInputElement).value = '';
        (document.getElementById(autoselectOptions.id) as HTMLInputElement).removeAttribute('readonly');
        (document.getElementById(autoselectOptions.id + '-clear') as HTMLButtonElement).style.display = 'none';
        if (autoselectOptions.onSelect) {
            autoselectOptions.onSelect(undefined);
        }
    }

    function update() {
        const list = document.getElementById(autoselectOptions.id + '-list') as HTMLUListElement;
        if (state.options.length) 
            render(html`${state.options.map(opt => html`<li class="list-group-item" .data="${opt}" @mousedown="${selectItem}">${opt.name}</li>`)}`, list);
        else
            render(html`<li class="list-group-item">No results</li>`, list);
    }
    
    if (autoselectOptions.value) {
        sleep(1).then(() => {
            state.search = autoselectOptions.value?.name || '';
            (document.getElementById(autoselectOptions.id) as HTMLInputElement).value = state.search;
            (document.getElementById(autoselectOptions.id) as HTMLInputElement).toggleAttribute('readonly', true);
            (document.getElementById(autoselectOptions.id + '-clear') as HTMLButtonElement).style.display = 'block';
        });
    }

    return html`
        <input id="${autoselectOptions.id}" 
               type="text" 
               @input=${onSearchInput} 
               placeholder="${autoselectOptions.placeholder!}" 
               class="autocomplete-input ${autoselectOptions.className!}" 
               style="${autoselectOptions.style!}" />
        <ul id="${autoselectOptions.id}-list" class="autocomplete-results list-group position-absolute w-100">
        </ul>
        <button id="${autoselectOptions.id}-clear" class="autocomplete-clear-btn" @click="${clearSelection}">
            <i class="bi bi-x"></i>
        </button>
    `;
}