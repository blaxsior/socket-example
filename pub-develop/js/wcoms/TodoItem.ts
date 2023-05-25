const template = document.createElement('template');
template.innerHTML = `

<label class='text-red-300'>
    <input type='checkbox'/>
    <slot></slot>
    <span name='description' class='bg-gray-400 font-light h-3'>
        <slot name='description'></slot>
    </span>
</label>`;

class TodoItem extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode:'open'});
        shadow.append(template.content.cloneNode(true));
        // template 자체가 아니라 content를 복사.
        // template에서 child는 slot으로 잡음
    }
}
 
customElements.define('todo-item', TodoItem);

/*
connectedCallback() {
  console.log('Custom square element added to page.');
  updateStyle(this);
}

disconnectedCallback() {
  console.log('Custom square element removed from page.');
}

adoptedCallback() {
  console.log('Custom square element moved to new page.');
}

attributeChangedCallback(name, oldValue, newValue) {
  console.log('Custom square element attributes changed.');
  updateStyle(this);
}

static get observedAttributes() { return ['c', 'l']; }
*/