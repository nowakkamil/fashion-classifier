import React, { Component } from "react";
import "./Form.css";
import "./LastResult.css";
class LastResult extends Component {
  render() {
    const result = this.props.result;

    return (
      <div className="upload">
        {result.length >= 2 ? (
          <ul>
            <li>
              <p className="p-result">{result[1]}</p>
              <img
                src={URL.createObjectURL(result[0])}
                alt={result[0].name}
                className="img-result"
              ></img>
            </li>
          </ul>
        ) : null}
      </div>
    );
  }
}

export default LastResult;
