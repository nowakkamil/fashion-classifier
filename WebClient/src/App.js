import "./App.css";
import React from "react";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Start from "./components/Start";

import NavBar from "./components/NavBar";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1e90ff",
    },
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar />
      <div className="start">
        <Start />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
