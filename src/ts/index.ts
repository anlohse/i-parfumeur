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

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap';
import { html, render, TemplateResult } from 'lit-html';
import {Home} from './home';
import {FormulasView} from './formulas';
import {InventoryView} from './inventory';
import {MaterialsView} from './materials';
import {SettingsView} from './settings';

declare const cordova: any; 

function isCordovaEnvironment(): boolean {
  return !!(window as any).cordova;
}

if (isCordovaEnvironment()) {
  document.addEventListener('deviceready', onDeviceReady, false);
} else {
  console.warn('[DEV MODE] Cordova not detected. Simulating deviceready...');
  (window as any).cordova = { platformId: 'browser' };
  setTimeout(onDeviceReady, 3000); 
}

// Just a placeholder until Cordova is ready
render(html` `, document.getElementById('app')!);

document.addEventListener('deviceready', onDeviceReady, false);

function renderRoute() {
  const root = document.getElementById('app');
  const hash = location.hash.replace('#/', '');

  const routes: Record<string, () => TemplateResult<1>> = {
    'formulas': FormulasView,
    'inventory': InventoryView,
    'materials': MaterialsView,
    'settings': SettingsView,
    '': Home
  };

  const view = routes[hash] || Home;

  const appTemplate = html`
    <main>
      ${view()}
    </main>
  `;

  render(appTemplate, root!);
}

function onDeviceReady() {
  console.log('📱 Cordova is ready!');

  renderRoute();

  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('load', renderRoute);

}
