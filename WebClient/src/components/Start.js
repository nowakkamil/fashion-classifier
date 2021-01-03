import React, { Component } from "react";
import Form from "./Form";
import Instruction from "./Instruction.js";

import "./Instruction.css";

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
    };
    this.togglePopup = this.togglePopup.bind(this);
    this.popup = React.createRef();
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }
  render() {
    return (
      <div className="intro">
        {" "}
        <React.Fragment>
          <p className="intro-text">Welcome to</p>
          <p className="intro-text">Fashion classifier</p>
          <br />
          <Form />
          <button className="popup" onClick={this.togglePopup}>
            i
          </button>
          {this.state.showPopup ? (
            <Instruction ref={this.popup} closePopup={this.togglePopup} />
          ) : null}
        </React.Fragment>
      </div>
    );
  }
}

export default Start;
