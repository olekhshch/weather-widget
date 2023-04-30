interface userLocation {
  ip: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

class Widget {
  private widgetContainer: HTMLElement;
  private btnConteiner: HTMLElement;
  private userLocation: userLocation | undefined;

  set newLocation(locationObj: userLocation) {
    this.userLocation = locationObj;
  }

  get locationData() {
    return this.userLocation;
  }

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
    this.btnConteiner.innerHTML = "";
    const locationEl = document.createElement("span");
    locationEl.classList.add("location");

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    this.btnConteiner.append(locationEl);
    this.btnConteiner.append(closeBtn);

    if (this.userLocation) {
      console.log(this.userLocation);
      const { city, country, ip } = this.locationData!;
      locationEl.textContent = city + ", " + country;
      locationEl.title = ip;
    }
  }

  private mountWidget() {
    document.body.append(this.widgetContainer);
    const styleEl = document.createElement("style");
    styleEl.innerHTML =
      "@import url('https://fonts.googleapis.com/css2?family=Dosis:wght@300;400;600&display=swap');";
    document.body.prepend(styleEl);
  }

  private setLoading() {
    this.widgetContainer.classList.add("loading");
  }

  async fetchIP() {
    const responce = await fetch("https://ipapi.co/json/");
    const data = await responce.json();
    const { ip, city, country, latitude, longitude } = data;
    this.userLocation = { ip, city, country, latitude, longitude };
  }
}

const app = async () => {
  const widget = new Widget();

  await widget.fetchIP();
  widget.initializeBtnSection();
};

app();
