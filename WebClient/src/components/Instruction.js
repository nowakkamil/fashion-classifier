import React, { Component } from "react";
import "./Instruction.css";
import Button from "@material-ui/core/Button";

class Instruction extends Component {
  render() {
    return (
      <div className="instruction">
        <div className="instruction-inner">
          <p className="instruction-text">Instruction</p>
          <Button
            className="button button-instruction"
            color="primary"
            variant="contained"
            size="large"
            onClick={this.props.closePopup}
          >
            Close
          </Button>
        </div>
      </div>
    );
  }
}

export default Instruction;
