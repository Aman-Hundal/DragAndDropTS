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
        configurable: true,
        get() {
            return originalDescriptor.bind(this);
        },
    };
    return adjustedDescriptior;
}
const validation = (validateInput) => {
    let isValid = true;
    if (validateInput.required) {
        isValid = isValid && validateInput.value.toString().trim().length !== 0;
    }
    if (validateInput.minLength != null &&
        typeof validateInput.value === "string") {
        isValid =
            isValid && validateInput.value.trim().length >= validateInput.minLength;
    }
    if (validateInput.maxLength != null &&
        typeof validateInput.value === "string") {
        isValid =
            isValid && validateInput.value.trim().length <= validateInput.maxLength;
    }
    if (validateInput.min != null && typeof validateInput.value === "number") {
        isValid = isValid && validateInput.value >= validateInput.min;
    }
    if (validateInput.max != null && typeof validateInput.value === "number") {
        isValid = isValid && validateInput.value <= validateInput.max;
    }
    return isValid;
};
class ProjectState {
    constructor() {
        this.listeiners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new ProjectState();
            return this.instance;
        }
    }
    addListeiner(listeiner) {
        this.listeiners.push(listeiner);
    }
    addProject(title, desc, people) {
        const newProject = new Project(Math.random().toString(), title, desc, people, "active");
        this.projects.push(newProject);
        for (const listeiner of this.listeiners) {
            listeiner(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, desc, people, status) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.people = people;
        this.status = status;
    }
}
class ProjectList {
    constructor(type) {
        this.type = type;
        this.projectList = [];
        this.templateElm = document.getElementById("project-list");
        this.hostElm = document.getElementById("app");
        const importedNode = document.importNode(this.templateElm.content, true);
        this.listElm = importedNode.firstElementChild;
    }
    render() {
        this.listElm.id = `${this.type}-projects`;
        const listId = `${this.type}-projects-list`;
        projectState.addListeiner((projects) => {
            this.projectList = projects;
            this.renderProjects();
        });
        this.listElm.querySelector("h2").textContent = `${this.type.toUpperCase()} PROJECTS`;
        this.listElm.querySelector("ul").id = listId;
        this.hostElm.insertAdjacentElement("beforeend", this.listElm);
    }
    renderProjects() {
        const relevantProjects = this.projectList.filter((project) => {
            return project.status === this.type;
        });
        this.listElm.querySelector("ul").innerHTML = "";
        for (const projectItm of relevantProjects) {
            let listItem = document.createElement("li");
            listItem.textContent = projectItm.title;
            this.listElm.querySelector("ul").appendChild(listItem);
        }
    }
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
        const userProject = this.gatherUserInput();
        if (userProject) {
            const [title, desc, people] = userProject;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
    gatherUserInput() {
        const userTitle = this.titleInputElm.value;
        const userDesc = this.descInputElm.value;
        const userPeople = parseInt(this.peopleInputElm.value);
        const titleValidateable = {
            value: userTitle,
            required: true,
        };
        const descValidateable = {
            value: userDesc,
            required: true,
        };
        const peopleValidateable = {
            value: userPeople,
            required: true,
            min: 1,
            max: 5,
        };
        if (!validation(titleValidateable) ||
            !validation(peopleValidateable) ||
            !validation(descValidateable)) {
            alert("There was an error in your input. Please try again.");
            return;
        }
        else {
            alert("Project saved");
            return [userTitle, userDesc, userPeople];
        }
    }
    clearInputs() {
        this.titleInputElm.value = "";
        this.descInputElm.value = "";
        this.peopleInputElm.value = "";
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
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
const projectInput = new ProjectInput();
projectInput.render();
activeProjectList.render();
finishedProjectList.render();
