"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function AutoBind(_, _2, descriptor) {
    const originalDescriptor = descriptor.value;
    const adjustedDescriptior = {
        get() {
            return originalDescriptor.bind(this);
        },
    };
    return adjustedDescriptior;
}
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
    submitHandler(event) {
        event.preventDefault();
        console.log(this.titleInputElm.value);
        console.log(this.descInputElm.value);
        console.log(this.peopleInputElm.value);
    }
    configure() {
        this.formElm.addEventListener("submit", this.submitHandler);
    }
    render() {
        this.formElm.id = "user-input";
        this.hostElm.insertAdjacentElement("afterbegin", this.formElm);
    }
}
__decorate([
    AutoBind
], ProjectInput.prototype, "submitHandler", null);
class ProjectList {
}
const projectInput = new ProjectInput();
projectInput.render();
