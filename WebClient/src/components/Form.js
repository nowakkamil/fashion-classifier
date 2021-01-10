import React, { Component } from "react";
import CustomButton from "./CustomButton";
import "./Form.css";
import axios from "axios";
import Loader from "react-loader-spinner";
import Answer from "./Answer";
import LastResult from "./LastResult";
import jsZip from "jszip";
const postAddress = "http://127.0.0.1:5000/";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      archives: [],
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
      resultType: [
        "T-shirt/top",
        "Trouser",
        "Pullover",
        "Dress",
        "Coat",
        "Sandal",
        "Shirt",
        "Sneaker",
        "Bag",
        "Ankle boot",
      ],
      archiveTypes: ["application/x-zip-compressed"],
      isLoading: false,
      showAnswer: false,
      responses: [],
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.archiveSelectedHandler = this.archiveSelectedHandler.bind(this);
    this.imageSelectedHandler = this.imageSelectedHandler.bind(this);
    this.clearArchives = this.clearArchives.bind(this);
    this.clearImages = this.clearImages.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.popup = React.createRef();
  }

  handleButtonClick = async () => {
    this.setState({ isLoading: true });

    let responsesFromServer = [];
    for (let file of this.state.converted) {
      await axios
        .post(postAddress, {
          data: this.removeHeader(file.encoded),
        })
        .then(
          (response) => {
            let model = {
              name: file.name,
              result: this.state.resultType[response.data.result],
              encoded: file.encoded,
            };
            responsesFromServer.push(model);
          },
          (error) => {
            console.log(error);
          }
        );
    }
    this.setState({ responses: responsesFromServer });
    this.togglePopup();
    this.setState({ isLoading: false });
  };

  removeHeader(base) {
    return base.split(",")[1];
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }

  validImageType(file) {
    return this.state.imageTypes.includes(file.type);
  }

  validArchiveImageType(filename) {
    return this.state.imageTypes.includes("image/" + filename.split(".")[1]);
  }

  validArchiveType(file) {
    return this.state.archiveTypes.includes(file.type);
  }

  extractFile(file) {
    jsZip.loadAsync(file).then((zip) => {
      for (let i in zip.files) {
        zip.files[i].async("base64").then(
          (content) => {
            if (this.validArchiveImageType(i)) {
              content =
                "data:image/" +
                zip.files[i].name.split(".")[1] +
                ";base64," +
                content;
              this.appendEncodedImage(content, i, true);
            }
          },
          (e) => {
            console.log("Error reading " + i + " : " + e.message);
          }
        );
      }
    });
  }

  createNodeForArchive(file) {
    const listItem = document.createElement("li");
    const para = document.createElement("p");
    if (this.validArchiveType(file)) {
      para.textContent = `File name ${file.name}`;
      listItem.appendChild(para);
    } else {
      para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
      listItem.appendChild(para);
    }
    return listItem;
  }

  archiveSelectedHandler = async (event) => {
    let conv = this.state.converted.filter((e) => !e.isZipped);
    this.setState({ converted: conv });
    const preview = document.querySelector(".preview-archive");

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
        list.appendChild(this.createNodeForArchive(file));
      }
      this.setState({
        archives: event.target.files,
      });
    }

    for (let archive of event.target.files) {
      this.extractFile(archive);
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
    let conv = this.state.converted.filter((e) => e.isZipped);
    this.setState({ converted: conv });
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

    for (let f of event.target.files) {
      let base = await this.convertToBase64(f);
      this.appendEncodedImage(base, f.name, false);
    }
  };

  appendEncodedImage(base, filename, isZipped) {
    let model = {
      name: filename,
      encoded: base,
      isZipped: isZipped,
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

  clearImages() {
    let preview = document.querySelector(".preview-image");
    if (!preview) return;
    const para = document.createElement("p");
    para.textContent = "No files currently selected for upload";
    var child = preview.lastElementChild;
    while (child) {
      preview.removeChild(child);
      child = preview.lastElementChild;
    }
    preview.appendChild(para);
    let conv = this.state.converted.filter((e) => e.isZipped);
    this.setState({ converted: conv });
  }

  clearArchives() {
    const preview = document.querySelector(".preview-archive");
    if (!preview) return;
    const para = document.createElement("p");
    para.textContent = "No files currently selected for upload";
    var child = preview.lastElementChild;
    while (child) {
      preview.removeChild(child);
      child = preview.lastElementChild;
    }
    preview.appendChild(para);
    let conv = this.state.converted.filter((e) => !e.isZipped);
    this.setState({ converted: conv });
  }
  render() {
    return (
      <>
        <button onClick={this.clearArchives}>Clear</button>

        <div className="upload">
          <div>
            <label htmlFor="archive_uploads">Choose archives to upload</label>
            <input
              className="input-file input-archive"
              type="file"
              id="archive_uploads"
              name="archive_uploads"
              accept=".zip"
              onChange={this.archiveSelectedHandler}
              multiple
            />
          </div>
          <div className="preview-archive">
            <p>No archives currently selected for upload</p>
          </div>
        </div>
        <button onClick={this.clearImages}>Clear</button>

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
            responses={this.state.responses}
          />
        ) : null}
        <LastResult responses={this.state.responses} />
      </>
    );
  }
}

export default Form;
