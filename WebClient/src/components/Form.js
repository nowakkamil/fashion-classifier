import React, { Component } from "react";
import CustomButton from "./CustomButton";
import "./Form.css";
import axios from "axios";
import Loader from "react-loader-spinner";
import Answer from "./Answer";
import LastResult from "./LastResult";
import Image from "image-js";
const postAddress = "http://127.0.0.1:5000/";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "Choose files",
      images: [],
      archieves: [],
      converted: [],
      imageTypes: [
        "image/apng",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/svg+xml",
        "image/tiff",
        "image/webp",
        "image/x-icon",
      ],
      archieveTypes: ["application/x-zip-compressed"],
      isLoading: false,
      showAnswer: false,
      responses: [],
      lastResult: [],
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.archieveSelectedHandler = this.archieveSelectedHandler.bind(this);
    this.imageSelectedHandler = this.imageSelectedHandler.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.popup = React.createRef();
  }

  handleButtonClick = async () => {
    this.setState({ isLoading: true });

    let responsesFromServer = [];
    for (let file of this.state.converted) {
      await axios
        .post(postAddress, {
          data: file.encoded,
        })
        .then(
          (response) => {
            let model = {
              name: file.name,
              result: response.data.result,
              encoded: file.encoded,
            };
            responsesFromServer.push(model);
          },
          (error) => {
            console.log(error);
          }
        );
    }
    let last = this.state.converted[this.state.converted.length - 1];
    let img = this.state.images.filter((e) => e[0].name === last.name);

    if (img.length > 0) {
      let lastRes = [
        img[0][0],
        responsesFromServer.filter((e) => e.name === last.name)[0],
      ];
      this.setState({ lastResult: lastRes });
    }
    this.setState({ respones: responsesFromServer });
    this.togglePopup();
    this.setState({ isLoading: false });
  };

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }

  validImageType(file) {
    return this.state.imageTypes.includes(file.type);
  }

  validArchieveImageType(filename) {
    return this.state.imageTypes.includes("image/" + filename.split(".")[1]);
  }

  validArchieveType(file) {
    return this.state.archieveTypes.includes(file.type);
  }

  extractFile(file) {
    const new_zip = require("jszip")();
    new_zip.loadAsync(file).then((zip) => {
      for (let i in zip.files) {
        zip.files[i].async("base64").then(
          (content) => {
            if (this.validArchieveImageType(i)) {
              this.appendEncodedImage(content, i);
            }
          },
          (e) => {
            console.log("Error reading " + i + " : " + e.message);
          }
        );
      }
    });
  }

  createNodeForArchieve(file) {
    const listItem = document.createElement("li");
    const para = document.createElement("p");
    if (this.validArchieveType(file)) {
      para.textContent = `File name ${file.name}`;
      listItem.appendChild(para);
    } else {
      para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
      listItem.appendChild(para);
    }
    return listItem;
  }

  archieveSelectedHandler = async (event) => {
    const preview = document.querySelector(".preview-archieve");

    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
    const curFiles = event.target.files;
    if (curFiles.length === 0) {
      const para = document.createElement("p");
      para.textContent = "No files currently selected for upload";
      preview.appendChild(para);
    } else {
      const list = document.createElement("ol");
      preview.appendChild(list);
      for (const file of curFiles) {
        list.appendChild(this.createNodeForArchieve(file));
      }
      this.setState({
        archieves: event.target.files,
      });
    }

    for (let archieve of event.target.files) {
      this.extractFile(archieve);
    }
  };

  createNodeForImage(file) {
    const listItem = document.createElement("li");
    const para = document.createElement("p");
    if (this.validImageType(file)) {
      para.textContent = `File name ${file.name}`;
      const image = document.createElement("img");
      image.src = URL.createObjectURL(file);

      listItem.appendChild(image);
      listItem.appendChild(para);
    } else {
      para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
      listItem.appendChild(para);
    }
    return listItem;
  }

  imageSelectedHandler = async (event) => {
    const preview = document.querySelector(".preview-image");

    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    const curFiles = event.target.files;

    if (curFiles.length === 0) {
      const para = document.createElement("p");
      para.textContent = "No files currently selected for upload";
      preview.appendChild(para);
    } else {
      const list = document.createElement("ol");
      preview.appendChild(list);

      for (const file of curFiles) {
        list.appendChild(this.createNodeForImage(file));
      }
    }
    this.state.images.push(event.target.files);

    for (let f of event.target.files) {
      let base = await this.convertToBase64(f);
      this.appendEncodedImage(base, f.name);
    }
  };
  makeGray(img) {
    for (var pixel of img.values()) {
      var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
      pixel.setRed(avg);
      pixel.setGreen(avg);
      pixel.setBlue(avg);
    }
    return img;
  }
  transformImage(base) {
    var img = new Image();
    img.src = "";
    img.width = "28";
    img.height = "28";
    console.log(img);
    return this.convertToBase64(img);
  }

  appendEncodedImage(base, filename) {
    if (base.indexOf(",") !== -1) base = base.split(",")[1];
    let model = {
      name: filename,
      encoded: base,
    };
    this.state.converted.push(model);
  }
  convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  render() {
    return (
      <>
        <div className="upload">
          <div>
            <label htmlFor="archieve_uploads">Choose archives to upload</label>
            <input
              className="input-file input-archieve"
              type="file"
              id="archieve_uploads"
              name="archieve_uploads"
              accept=".zip"
              onChange={this.archieveSelectedHandler}
              multiple
            />
          </div>
          <div className="preview-archieve">
            <p>No archives currently selected for upload</p>
          </div>
        </div>
        <div className="upload">
          <div>
            <label htmlFor="image_uploads">
              Choose images to upload (PNG, JPG)
            </label>
            <input
              className="input-file input-image"
              type="file"
              id="image_uploads"
              name="image_uploads"
              accept=".jpg, .jpeg, .png"
              onChange={this.imageSelectedHandler}
              multiple
            />
          </div>
          <div className="preview-image">
            <p>No files currently selected for upload</p>
          </div>
        </div>
        {this.state.isLoading ? (
          <Loader type="Puff" color="#00BFFF" height={100} width={100} />
        ) : (
          <CustomButton handler={this.handleButtonClick} text="Send" />
        )}
        {this.state.showPopup ? (
          <Answer
            ref={this.popup}
            closePopup={this.togglePopup}
            responses={this.state.respones}
          />
        ) : null}
        <LastResult result={this.state.lastResult} />
      </>
    );
  }
}

export default Form;
