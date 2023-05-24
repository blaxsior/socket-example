class TodoItem extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = "Hi i am custom!";
    }
}

customElements.define('todo-item', TodoItem);
console.log("hello!");