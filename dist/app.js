"use strict";
class ProjectInput {
    constructor() {
        this.templateElm = document.getElementById("project-input");
        this.hostElm = document.getElementById("app");
        const importedNode = document.importNode(this.templateElm.content, true);
        this.formElm = importedNode.firstElementChild;
        this.titleInputElm = this.formElm.querySelector("#title");
        this.descInputElm = this.formElm.querySelector("#description");
        this.peopleInputElm = this.formElm.querySelector("#people");
        this.configure();
    }
    configure() {
        this.formElm.addEventListener("submit", (event) => {
            event.preventDefault();
            console.log(this.titleInputElm.value);
            console.log(this.descInputElm.value);
            console.log(this.peopleInputElm.value);
        });
    }
    render() {
        this.formElm.id = "user-input";
        this.hostElm.insertAdjacentElement("afterbegin", this.formElm);
    }
}
class ProjectList {
}
const projectInput = new ProjectInput();
projectInput.render();
