import React, { Component } from "react";
import "./Answer.css";
import { Button } from 'antd';

class Answer extends Component {
  render() {
    const responses = this.props.responses;
    return (
      <div className="answer">
        <div className="answer-inner">
          <div className="upload">
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
          </div>
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

export default Answer;
