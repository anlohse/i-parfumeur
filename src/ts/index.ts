import { html, render } from 'lit-html';
import {Home} from './home'

declare const cordova: any; 

function isCordovaEnvironment(): boolean {
  return !!(window as any).cordova;
}

if (isCordovaEnvironment()) {
  document.addEventListener('deviceready', onDeviceReady, false);
} else {
  console.warn('[DEV MODE] Cordova not detected. Simulating deviceready...');
  (window as any).cordova = { platformId: 'browser' };
  setTimeout(onDeviceReady, 500); 
}

// Just a placeholder until Cordova is ready
render(html`<p>🔄 Waiting for Cordova...</p>`, document.getElementById('app')!);

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  console.log('📱 Cordova is ready!');

  const appTemplate = html`
    <main>
      ${Home()}
    </main>
  `;

  render(appTemplate, document.getElementById('app')!);
}
