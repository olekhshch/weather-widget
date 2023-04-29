class Widget {
  private widgetContainer: HTMLElement;
  private btnConteiner: HTMLElement;
  private userIP: string = "";

  constructor() {
    this.widgetContainer = document.createElement("article");
    this.widgetContainer.classList.add("widget");
    this.btnConteiner = document.createElement("section");
    this.btnConteiner.classList.add("btn-conteiner", "flex");
    this.widgetContainer.prepend(this.btnConteiner);

    this.mountWidget();
    this.setLoading();
    this.initializeBtnSection();
  }

  initializeBtnSection() {
    const locationEl = document.createElement("span");
    locationEl.classList.add("location");

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    this.btnConteiner.append(locationEl);
    this.btnConteiner.append(closeBtn);

    if (this.userIP === "") {
    }
  }

  private mountWidget() {
    document.body.append(this.widgetContainer);
  }

  private setLoading() {
    this.widgetContainer.classList.add("loading");
  }
}

const app = new Widget();
