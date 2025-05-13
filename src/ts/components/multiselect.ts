import {html, render} from 'lit-html'

export interface MultiselectOptions {
    id: string;
    placeholder?: string;
    className?: string;
    style?: string;
    fetchOptions: () => Promise<{ name: string }[]>;
    onSelect?: (item: any[]) => void;
}

export function MultiSelect(multiselectOptions: MultiselectOptions) {
    
    setTimeout(async () => {
        state.options = await multiselectOptions.fetchOptions();
        console.log('state.options', state.options);
        update();
    }, 1);

    const state = {
        options: [] as { name: string }[],
        selectedItems: [] as { name: string }[],
        search: '',
    };

    function selectItem(e: Event) {
        console.log('selectItem', e.target);
        const item = (e.target as any).data;
        state.selectedItems = Array.from(document.querySelectorAll('#' + multiselectOptions.id + '-list input[type="checkbox"]')).filter((chk: any) => chk.checked).map((chk: any) => chk.data);
        (document.getElementById(multiselectOptions.id) as HTMLInputElement).value = state.selectedItems.map(i => i.name).join(', ');
        if (multiselectOptions.onSelect) {
            multiselectOptions.onSelect(state.selectedItems);
        }
        state.search = item.name;
    }

    function showDropdown() {
        const dropdown = document.getElementById(multiselectOptions.id + '-list') as HTMLUListElement;
        dropdown.style.display = 'block';
    }
    
    function hideDropdownIfNoFocus() {
        const dropdown = document.getElementById(multiselectOptions.id + '-list') as HTMLUListElement;
        const input = document.getElementById(multiselectOptions.id) as HTMLInputElement;
        setTimeout(() => {
            const active = document.activeElement;
            if (!input.contains(active) && !dropdown.contains(active)) {
                dropdown.style.display = 'none';
            }
        }, 100);
    }    

    function update() {
        const list = document.getElementById(multiselectOptions.id + '-list') as HTMLUListElement;
        if (state.options.length) 
            render(html`
                    ${state.options.map(opt => html`<li class="list-group-item">
                                                        <label class="dropdown-item">
                                                            <input class="form-check-input" style="border: 1px solid #999" .data="${opt}" type="checkbox" 
                                                                    @blur="${hideDropdownIfNoFocus}"
                                                                    @focus="${showDropdown}"
                                                                    @change="${selectItem}"/> ${opt.name}
                                                        </label>
                                                    </li>`)}`, list);
        else
            render(html`<li class="list-group-item">No results</li>`, list);
    }
 
    return html`
        <input id="${multiselectOptions.id}" 
               type="text" 
               placeholder="${multiselectOptions.placeholder!}" 
               class="autocomplete-input ${multiselectOptions.className!}" 
               style="${multiselectOptions.style!}"
               @focus="${showDropdown}"
               @blur="${hideDropdownIfNoFocus}"
               readonly />
        <ul id="${multiselectOptions.id}-list" class="autocomplete-results list-group position-absolute w-100">
        </ul>
    `;
}