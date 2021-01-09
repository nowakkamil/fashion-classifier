import React, { Component } from "react";
import Button from "@material-ui/core/Button";

class CustomButton extends Component {
  render() {
    return (
      <Button
        className="button"
        color="primary"
        variant="outlined"
        size="large"
        onClick={() => this.props.handler(this.props.optional)}
      >
        {this.props.text}
      </Button>
    );
  }
}

export default CustomButton;
