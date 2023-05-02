import Widget from "./widget.js";

const app = async () => {
  const widget = new Widget();

  await widget.fetchIP();
  widget.initializeBtnSection();
  await widget.fetchWeather();
  widget.setMainInfo();
  widget.setAdditionalInfo();
};

app();
