import weatherKey from "./config.js";

interface userLocation {
  ip: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface weatherData {
  [key: string]: any;
  weather: Weather[];
}

type Weather = {
  icon: string;
  id: number;
  description: string;
  main: string;
};

class Widget {
  private widgetContainer: HTMLElement;
  private btnConteiner: HTMLElement;
  private weatherDisplay: HTMLElement;
  private userLocation: userLocation | undefined;
  private readonly weatherAPIKey: string = weatherKey;
  private weatherData: weatherData;

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
    this.weatherDisplay = document.createElement("section");
    this.weatherDisplay.classList.add("display", "flex-col");
    this.widgetContainer.append(this.weatherDisplay);

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
    this.weatherDisplay.innerHTML = "Loading...";
  }

  async fetchIP() {
    const responce = await fetch("https://ipapi.co/json/");
    const data = await responce.json();
    const { ip, city, country, latitude, longitude } = data;
    this.userLocation = { ip, city, country, latitude, longitude };
  }

  async fetchWeather() {
    const { latitude, longitude } = this.userLocation!;
    if (!latitude || !longitude) {
      console.log("No weather data is available for fetching");
    } else {
      const responce = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.weatherAPIKey}&units=metric`
      );
      const data = await responce.json();
      this.weatherData = data;
    }
  }

  aggregateData() {
    const {
      main: { temp, feels_like, pressure, humidity },
      weather,
      visibility,
      wind,
    } = this.weatherData;
    return {
      temp,
      feels_like,
      pressure,
      humidity,
      weather: weather[0],
      visibility,
      wind,
    };
  }

  setMainInfo() {
    const widgetData = this.aggregateData();
    console.log(widgetData);
    const iconURL = `https://openweathermap.org/img/wn/${widgetData.weather.icon}@2x.png`;
    const iconEl = document.createElement("img");
    iconEl.src = iconURL;
    iconEl.alt = widgetData.weather.description;
    const conditionEl = document.createElement("h3");
    conditionEl.innerText = widgetData.weather.description;

    const mainLeftEl = document.createElement("div");
    mainLeftEl.classList.add("flex-col");
    mainLeftEl.append(iconEl, conditionEl);

    const mainRightEl = document.createElement("div");
    mainRightEl.classList.add("flex-col");
    const tempEl = document.createElement("h2");
    tempEl.innerText = widgetData.temp + " °C";
    const feelsLikeEl = document.createElement("p");
    feelsLikeEl.innerText = "Feels like: " + widgetData.feels_like + " °C";
    mainRightEl.append(tempEl, feelsLikeEl, conditionEl);

    const mainDivEl = document.createElement("div");
    mainDivEl.classList.add("flex", "widget-main");
    mainDivEl.append(iconEl, mainRightEl);

    this.weatherDisplay.innerHTML = "";
    this.weatherDisplay.prepend(mainDivEl);
  }

  setAdditionalInfo() {
    const widgetData = this.aggregateData();

    const tableEl = document.createElement("section");
    tableEl.classList.add("flex-col", "widget-table");
    const firstRowEl = document.createElement("div");
    firstRowEl.classList.add("flex");
    const secondRowEl = document.createElement("div");
    secondRowEl.classList.add("flex");
    tableEl.append(firstRowEl, secondRowEl);

    this.weatherDisplay.append(tableEl);

    firstRowEl.innerHTML = `
    <div class="flex-grow-1">
      <p>Humidity, %</p>
      <h4>
      ${widgetData.humidity}
      </h4>
    </div>
    <div class="flex-grow-1">
    <p>Pressure, hPa</p>
    <h4>
    ${widgetData.pressure}
    </h4>
    </div>`;

    secondRowEl.innerHTML = `
    <div class="flex-grow-1">
      <p>Wind, m/s</p>
      <h4>
      ${widgetData.wind.speed}
      </h4>
    </div>
    <div class="flex-grow-1">
    <p>Visibility, m</p>
    <h4>
    ${widgetData.visibility}
    </h4>
    </div>
    `;
  }
}

export default Widget;
