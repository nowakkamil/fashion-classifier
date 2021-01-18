import React, { Component } from "react";
import "./Form.css";
import "./LastResult.css";
class LastResult extends Component {
  render() {
    const responses = this.props.responses;

    if (!responses.length) {
      return null;
    }

    return (
      <div className="upload last-results">
        <p className="last-results-text">
          Last results
        </p>
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
    );
  }
}

export default LastResult;
