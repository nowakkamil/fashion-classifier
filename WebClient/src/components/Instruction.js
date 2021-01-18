import React, { Component } from "react";
import "./Instruction.css";
import { Button } from 'antd';

class Instruction extends Component {
  render() {
    return (
      <div className="instruction">
        <div className="instruction-inner">
          <p className="instruction-text">Manual</p>
          <ol className="instruction-bullet-points">
            <li>
              Choose images you want to classify
              </li>
            <li>
              If they are zipped click the button "Choose archives to upload", else click "Choose images to upload"
              </li>
            <li>
              After files submission, click send
              </li>
            <li>
              Wait for results, they will be displayed in a pop-up
              </li>
          </ol>
          <Button
            className="button button-answer"
            type="primary"
            size="large"
            onClick={this.props.closePopup}
          >
            Return
          </Button>
        </div>
      </div>
    );
  }
}

export default Instruction;
