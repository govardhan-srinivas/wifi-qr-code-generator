import React from "react";
import Joi from "joi-browser";
import QRCode from "qrcode";
import Form from "./Components/common/form";
import "./App.css";

class App extends Form {
  canvas = null;
  state = {
    data: {
      ssid: "",
      password: "",
      encryption: "WPA",
    },
    errors: {},
    encryptionOptions: [
      { name: "WPA", value: "WPA" },
      { name: "WEP", value: "WEP" },
      { name: "No password", value: "nopass" },
    ],
    userOption: "display",
  };
  schema = {
    ssid: Joi.string().required().label("WiFi SSID"),
    password: Joi.string().required().label("WiFi password"),
    encryption: Joi.string().required().label("Encryption method"),
  };
  componentDidMount() {
    this.canvas = document.getElementById("canvas");
    this.genrateQRCode("Enter WiFi details below to generate QR code");
  }
  genrateQRCode = (text) => {
    QRCode.toCanvas(this.canvas, text, { width: 300 }, function (error) {
      if (error) console.error(error);
      // console.log("success! generated a new QR code");
    });
  };
  doSubmit = async () => {
    const { data } = this.state;
    try {
      this.setState({ data: data });
      // Just pipe the string `WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;` through the QR code generator of your choice
      await this.genrateQRCode(
        `WIFI:S:${data.ssid};T:${data.encryption};P:${data.password};;`
      );
      switch (this.state.userOption) {
        case "download":
          const downloadLink = document.createElement("a");
          downloadLink.setAttribute(
            "href",
            this.canvas.toDataURL("image/jpeg", 1.0)
          );
          downloadLink.setAttribute("download", data.ssid);
          downloadLink.click();
          break;
        case "print":
          setTimeout(() => window.print(), 0);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Checking error generating QR code", error);
    }
  };

  generateHandler = (option) => {
    this.setState({ userOption: option });
  };
  render() {
    return (
      <div className="app">
        <div className="container">
          <header className="text-center heading"></header>
          <main className="row">
            <section className="col-12 col-sm-6">
              <canvas id="canvas" width="300" height="300"></canvas>
            </section>
            <section className="col-12 col-sm-6">
              <form onSubmit={this.handleSubmit}>
                {this.renderInput("ssid", "WiFi SSID*")}
                {this.renderInput("password", "WiFi password*")}
                {this.renderSelect(
                  "encryption",
                  "Encryption",
                  this.state.encryptionOptions
                )}
                <div className="hide-in-print">
                  {this.renderButton("Generate", () =>
                    this.generateHandler("display")
                  )}{" "}
                  {this.renderButton("Generate & download", () =>
                    this.generateHandler("download")
                  )}{" "}
                  {this.renderButton("Generate & print", () =>
                    this.generateHandler("print")
                  )}
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
