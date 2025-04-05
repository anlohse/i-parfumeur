import { html } from 'lit-html';

export const Home = () => html`
  <section class="dashboard">
    <h1>🌸 i-Parfumeur</h1>
    <div class="grid">
      ${menuItem('📋', 'My Formulas', 'my-formulas')}
      ${menuItem('🧴', 'Inventory', 'inventory')}
      ${menuItem('📅', 'Maturation', 'maturation')}
      ${menuItem('📦', 'Backup', 'backup')}
      ${menuItem('📊', 'Analytics', 'analytics')}
      ${menuItem('⚙️', 'Settings', 'settings')}
    </div>
  </section>
`;

const menuItem = (icon: string, label: string, route: string) => html`
  <div class="menu-item" @click=${() => handleMenuClick(route)}>
    <div class="icon">${icon}</div>
    <div class="label">${label}</div>
  </div>
`;

function handleMenuClick(route: string) {
    const menuEl = event?.currentTarget as HTMLElement;
    if (!menuEl) return;
  
    let div = document.createElement('div');

    let expLeft = menuEl.offsetWidth / 2 + menuEl.offsetLeft - 5;
    let expTop = menuEl.offsetHeight / 2 + menuEl.offsetTop - 5;

    div.className = 'expander';
    div.style.left = `${expLeft}px`;
    div.style.top = `${expTop}px`;

    document.body.appendChild(div);

    setTimeout(() => {
        div.classList.add('expended');
    }, 1);

    setTimeout(() => {
      // TODO troca de view
    }, 600);
  }
  