import React, { Component } from "react";
import CustomButton from "./CustomButton";
import "./Form.css";
import axios from "axios";
import Loader from "react-loader-spinner";
import Answer from "./Answer";
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
      responses: new Map(),
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.archieveSelectedHandler = this.archieveSelectedHandler.bind(this);
    this.imageSelectedHandler = this.imageSelectedHandler.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.popup = React.createRef();
  }

  handleButtonClick = async () => {
    this.setState({ isLoading: true });
    for (let archieve of this.state.archieves) {
      this.extractFile(archieve);
    }
    let responsesFromServer = new Map();

    for (let file of this.state.converted) {
      await axios
        .post(postAddress, {
          data: file.encoded,
        })
        .then(
          (response) => {
            //console.log(response.data.result);
            responsesFromServer.set(file.name, response.data.result);
          },
          (error) => {
            console.log(error);
          }
        );
    }

    console.log("CONVERTED");
    console.log(this.state.converted);
    console.log(responsesFromServer);
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
    console.log(file.type);
    return this.state.archieveTypes.includes(file.type);
  }

  extractFile(file) {
    const new_zip = require("jszip")();
    new_zip.loadAsync(file).then(async (zip) => {
      for (let i in zip.files) {
        zip.files[i].async("base64").then(
          (content) => {
            if (this.validArchieveImageType(i)) {
              let model = {
                name: i,
                encoded: content,
              };
              this.state.converted.push(model);
            }
          },
          (e) => {
            console.log("Error reading " + i + " : " + e.message);
          }
        );
      }
    });
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
        const listItem = document.createElement("li");
        const para = document.createElement("p");
        if (this.validArchieveType(file)) {
          para.textContent = `File name ${file.name}`;
          listItem.appendChild(para);
        } else {
          para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
          listItem.appendChild(para);
        }
        list.appendChild(listItem);
      }
      this.setState({
        archieves: event.target.files,
      });
    }
  };
  execute(files) {
    let greyImages = [];
    for (let file of files) {
      let image = Image.file(file);
      greyImages.push(image.grey()); // convert the image to greyscale.
      // .resize({ width: 200 }); // resize the image, forcing a width of 200 pixels. The height is computed automatically to preserve the aspect ratio.
    }
    return greyImages;
  }
  convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  imageSelectedHandler = async (event) => {
    const preview = document.querySelector(".preview-image");

    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
    /*let imageFiles = [];
    for (let f of event.target.files) {
      let base = await this.convertToBase64(f);
      let img = new Image();
      console.log(base);
      img.src = base;
      imageFiles.push(img);
    }
    console.log("A");
    console.log(imageFiles);*/
    const curFiles = event.target.files;

    if (curFiles.length === 0) {
      const para = document.createElement("p");
      para.textContent = "No files currently selected for upload";
      preview.appendChild(para);
    } else {
      const list = document.createElement("ol");
      preview.appendChild(list);

      for (const file of curFiles) {
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
        list.appendChild(listItem);
      }
    }
    this.state.images.push(event.target.files);

    for (let f of event.target.files) {
      let base = await this.convertToBase64(f);
      base = base.split(",")[1];
      let model = {
        name: f.name,
        encoded: base,
      };
      this.state.converted.push(model);
    }
  };

  render() {
    return (
      <>
        <div className="upload">
          <div>
            <label for="archieve_uploads">Choose archieves to upload</label>
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
            <p>No archieves currently selected for upload</p>
          </div>
        </div>
        <div className="upload">
          <div>
            <label for="image_uploads">
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
          <div class="preview-image">
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
      </>
    );
  }
}

export default Form;
