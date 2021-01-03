import React, { Component } from "react";
import "./Answer.css";
import Button from "@material-ui/core/Button";

class Answer extends Component {
  render() {
    const responses = this.props.responses;
    return (
      <div className="answer">
        <div className="answer-inner">
          <ul>
            {responses.forEach((value, key) => {
              return (
                <li>
                  {key} {value}
                </li>
              );
            })}
          </ul>
          <Button
            className="button button-answer"
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

export default Answer;
