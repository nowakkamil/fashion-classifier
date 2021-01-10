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
            {responses.map((value, key) => {
              return (
                <li key={key}>
                  <p className="p-result">
                    {value.name} with result {value.result}
                  </p>
                  <img
                    src={value.encoded}
                    alt={value.name}
                    className="img-result"
                  ></img>{" "}
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
