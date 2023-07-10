//Method Decorator - Autobind
function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalDescriptor = descriptor.value;
  const adjustedDescriptior: PropertyDescriptor = {
    //Method so that we can excute some extra logic on our value property when users try to access this proeprty
    //We will use this to create an autobind feature to our code
    get() {
      //This in the getter method refers to whatever is responsbiel for triggering this getter method -> the getter method will be triggered by the concrete object to which it belongs (the object where we defined the getter)
      //This's context now will not be overwrriten by an event listeiner  becuase the getter is like an extra layer btween the fn being executed, the object to which it belongs and the event listeiner
      return originalDescriptor.bind(this);
    },
  };
  //This descriptior object will overwrite the old descriptor/configuration the decorator is applied to (done by TS in background).
  return adjustedDescriptior;
}

//Goal -> Get access to a template, and to get access to the id=app div and then redner the template in the app div
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

    console.log(this.titleInputElm.value);
    console.log(this.descInputElm.value);
    console.log(this.peopleInputElm.value);
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
class ProjectList {}

const projectInput = new ProjectInput();
projectInput.render();
