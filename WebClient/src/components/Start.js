import React, { Component } from "react";
import Form from "./Form";
import Instruction from "./Instruction.js";
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

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
        <React.Fragment>
          <Form />
          <Button
            className="popup"
            type="primary"
            icon={<InfoCircleOutlined style={{ fontSize: '20px' }} />}
            shape="circle"
            size="large"
            onClick={this.togglePopup}>
          </Button>
          {this.state.showPopup ? (
            <Instruction ref={this.popup} closePopup={this.togglePopup} />
          ) : null}
        </React.Fragment>
      </div>
    );
  }
}

export default Start;
