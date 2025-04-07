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
import {sleep} from './util';

export const Home = () => html`
  <section class="dashboard">
    <h1>🌸 i-Parfumeur</h1>
    <div class="grid">
      ${menuItem('📋', 'My Formulas', 'formulas')}
      ${menuItem('📅', 'Maturation', 'maturation')}
      ${menuItem('🧴', 'Inventory', 'inventory')}
      ${menuItem('🧪', 'Materials', 'materials')}
      ${menuItem('📊', 'Analytics', 'analytics')}
      ${menuItem('📦', 'Backup', 'backup')}
      ${menuItem('⚙️', 'Settings', 'settings')}
    </div>
  </section>
`;

const menuItem = (icon: string, label: string, route: string) => html`
  <div class="menu-item" @click=${(e: Event) => handleMenuClick(e, route)}>
    <div class="icon">${icon}</div>
    <div class="label">${label}</div>
  </div>
`;

async function handleMenuClick(e: Event, route: string) {
    const menuEl = e.currentTarget as HTMLElement;
    if (!menuEl) return;
  
    let div = document.createElement('div');

    let expLeft = menuEl.offsetWidth / 2 + menuEl.offsetLeft - 5;
    let expTop = menuEl.offsetHeight / 2 + menuEl.offsetTop - 5;

    div.className = 'expander';
    div.style.left = `${expLeft}px`;
    div.style.top = `${expTop}px`;

    document.body.appendChild(div);

    await sleep(1);
    div.classList.add('expended');

    await sleep(600);
    location.hash = `#/${route}`;
    div.classList.add('hide');
    await sleep(1);
    window.dispatchEvent(new Event('page-' + route));
    await sleep(599);
    div.remove();
}
  