//Method Decorator - Autobind
function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalDescriptor = descriptor.value;
  const adjustedDescriptior: PropertyDescriptor = {
    configurable: true,
    //Method so that we can excute some extra logic on our value property when users try to access this proeprty
    //We will use this to create an autobind feature to our code
    get() {
      //This in the getter method refers to whatever is responsbiel for triggering this getter method -> the getter method will be triggered by the concrete object to which it belongs (the object where we defined the getter)
      //This's context now will not be overwrriten by an event listeiner  becuase the getter is like an extra layer btween the fn being executed, the object to which it belongs and the event listeiner
      return originalDescriptor.bind(this); // bind the original method to this in context of its object
    },
  };
  //This descriptior object will overwrite the old descriptor/configuration the decorator is applied to (done by TS in background).
  return adjustedDescriptior;
}
//Validate Object Interface
interface Validatable {
  value: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
//Validate function
const validation = (validateInput: Validatable) => {
  let isValid = true;

  if (validateInput.required) {
    isValid = isValid && validateInput.value.toString().trim().length !== 0;
  }
  //!= null is same as checking does not equal undefined or null (does not check for truthy ness)
  if (
    validateInput.minLength != null &&
    typeof validateInput.value === "string"
  ) {
    isValid =
      isValid && validateInput.value.trim().length >= validateInput.minLength;
  }
  if (
    validateInput.maxLength != null &&
    typeof validateInput.value === "string"
  ) {
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

//Project State Mgmt Class (created with singelton principal learned in this course). Guarantees that we always work with the exact same object and will always only have 1 object of the class in the entire app

//Listiner Type - > in a function type -> define the param types and the reutrn type
type Listeiner = (items: Project[]) => void;

class ProjectState {
  private listeiners: Listeiner[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addListeiner(listeiner: Listeiner) {
    this.listeiners.push(listeiner);
  }

  //Add item to the list whenever submit button clicked
  addProject(title: string, desc: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      desc,
      people,
      "active"
    );
    this.projects.push(newProject);

    for (const listeiner of this.listeiners) {
      //.slice returns copy of the array
      listeiner(this.projects.slice());
    }
  }
}
//Global Constant - can be used anywhere in the file
const projectState = ProjectState.getInstance();

//Status Type for Projects made with Enums
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public people: number,
    public status: "active" | "finished"
  ) {}
}

//Project List Class
//Goal -> Get access to a template, and to get access to the id=app div and then redner the template in the app div + manage project list
class ProjectList {
  hostElm: HTMLDivElement;
  templateElm: HTMLTemplateElement;
  listElm: HTMLElement;
  projectList: Project[] = [];

  //Dyanamic ID as we will have more than one list of projects (active and inactive). We used a litteral union type as the dynamic id
  constructor(private type: "active" | "finished") {
    this.templateElm = document.getElementById(
      "project-list"
    ) as HTMLTemplateElement;
    this.hostElm = document.getElementById("app") as HTMLDivElement;
    const importedNode = document.importNode(this.templateElm.content, true);
    //Store section elm to listElm property
    this.listElm = importedNode.firstElementChild as HTMLElement;
  }

  render() {
    //Give form elm css styling
    this.listElm.id = `${this.type}-projects`;
    const listId = `${this.type}-projects-list`;

    //We are overwriting the projectList with the new projects which i get becausae something changed in project state
    projectState.addListeiner((projects: Project[]) => {
      this.projectList = projects;
      this.renderProjects();
    });
    //Add content to section html
    //add H2 title
    this.listElm.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
    //Add projects to list + give id to list html
    this.listElm.querySelector("ul")!.id = listId;
    this.hostElm.insertAdjacentElement("beforeend", this.listElm);
  }

  private renderProjects() {
    const relevantProjects = this.projectList.filter((project) => {
      return project.status === this.type;
    });
    this.listElm.querySelector("ul")!.innerHTML = "";
    for (const projectItm of relevantProjects) {
      let listItem = document.createElement("li");
      listItem.textContent = projectItm.title;
      this.listElm.querySelector("ul")!.appendChild(listItem);
    }
  }
}

//Project Input Class
//Goal -> Get access to a template, and to get access to the id=app div and then redner the template in the app div + manage user input
class ProjectInput {
  hostElm: HTMLDivElement;
  templateElm: HTMLTemplateElement;
  formElm: HTMLFormElement;
  titleInputElm: HTMLInputElement;
  descInputElm: HTMLInputElement;
  peopleInputElm: HTMLInputElement;

  constructor() {
    this.templateElm = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement;
    this.hostElm = document.getElementById("app") as HTMLDivElement;

    //Select and get content from tempalte Node
    //importedNode = pointer at your template element -> by adding true as a second arg, importNode essentially creates a deep copy/reference to an HTML elem
    const importedNode = document.importNode(this.templateElm.content, true);
    //Get the form content/element from template node
    this.formElm = importedNode.firstElementChild as HTMLFormElement;

    //Get form input elms
    this.titleInputElm = this.formElm.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descInputElm = this.formElm.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElm = this.formElm.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
  }

  @AutoBind
  private submitHandler(event: Event) {
    //Prevent default form submission -> which is an http request
    event.preventDefault();
    const userProject = this.gatherUserInput();
    if (userProject) {
      const [title, desc, people] = userProject;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  //Take user input and clean the data
  private gatherUserInput(): [string, string, number] | void {
    const userTitle = this.titleInputElm.value;
    const userDesc = this.descInputElm.value;
    const userPeople = parseInt(this.peopleInputElm.value);

    const titleValidateable: Validatable = {
      value: userTitle,
      required: true,
    };
    const descValidateable: Validatable = {
      value: userDesc,
      required: true,
    };

    const peopleValidateable: Validatable = {
      value: userPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validation(titleValidateable) ||
      !validation(peopleValidateable) ||
      !validation(descValidateable)
    ) {
      alert("There was an error in your input. Please try again.");
      return;
    } else {
      alert("Project saved");
      return [userTitle, userDesc, userPeople];
    }
  }

  private clearInputs() {
    this.titleInputElm.value = "";
    this.descInputElm.value = "";
    this.peopleInputElm.value = "";
  }

  //Add event listeiner
  private configure() {
    this.formElm.addEventListener("submit", this.submitHandler);
  }

  //Render a tempalte node and its content to app div
  render() {
    //Give form elm css styling
    this.formElm.id = "user-input";
    //Render the content and node form
    //InsertAdjacentElm method is a default method provided by browser to insert an HTML element. First takes desc of where to insert it, second arg is what node you want to insert
    this.hostElm.insertAdjacentElement("afterbegin", this.formElm);
  }
}

const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
const projectInput = new ProjectInput();
projectInput.render();
activeProjectList.render();
finishedProjectList.render();
