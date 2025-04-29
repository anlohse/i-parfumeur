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
import { Configuration, MessageSeverity } from "types";

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const Messages = {
    add: async (text: string, severity: MessageSeverity = 'info', selector?: string, timeSec?: number) => {
        const messagesContainer = document.querySelector(selector || '.messages-container') as HTMLElement;
        const message = document.createElement('div');
        message.style.display = 'block';
        message.innerHTML = text;
        messagesContainer.appendChild(message);
        message.className = 'message-text ' + severity;
        await sleep(1);
        message.classList.add('show');
        await sleep((timeSec || (text.length * 0.08 + 2))* 1000);
        message.classList.remove('show');
        await sleep(500);
        message.remove();
    }
}

const defaultConfig = `{
    "preferredInputUnit": "drops",
    "preferredStockUnit": "ml",
    "lowStockWarning": true,
    "lowStockThreshold": 10,
    "language": "en"
}`;

const _config: Configuration = JSON.parse(localStorage.getItem('_config') || defaultConfig);

export const config = new Proxy(_config, {
        get(target, prop, receiver) {
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            let r = Reflect.set(target, prop, value, receiver);
            localStorage.setItem('_config', JSON.stringify(_config));
            return r;
        }
    });


export function assert<T>(obj: T, prop: keyof T, messageFormat: string): void {
    if (obj[prop] === null || obj[prop] === undefined) {
        throw new Error(messageFormat.replace('{field}', String(prop)));
    }
}

export function listenEvents(listener: (e: Event) => void, events: string[]) {
    events.forEach(event => {
        window.addEventListener(event, listener);
    });
}

export function unlistenEvents(listener: (e: Event) => void, events: string[]) {
    events.forEach(event => {
        window.removeEventListener(event, listener);
    });
}

export function listenUpdate(listener: (e: Event) => void) {
    window.addEventListener('update', listener);
}

export function dispatchEvent(eventName: string, detail?: any) {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
}

export function update() {
    const updateEvent = new Event('update');
    window.dispatchEvent(updateEvent);
}
