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
import 'bootstrap';

export const InventoryView = () => html`
    <h2>🧴 - Inventory</h2>
    <div class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
            <span><strong>Materiais</strong></span>
            <div>
                <button class="btn btn-sm btn-icon" title="Adicionar">
                    <i class="bi bi-plus icon"></i>
                </button>
                <button class="btn btn-sm btn-icon rotate-toggle" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#materialsCollapse"
                        aria-expanded="false" 
                        aria-controls="materialsCollapse"
                        title="Expandir/Recolher">
                    <i class="bi bi-caret-up icon"></i>
                </button>
            </div>
        </div>

        <div class="collapse" id="materialsCollapse">
            <div class="card-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
            </div>
        </div>
    </div>

`;

