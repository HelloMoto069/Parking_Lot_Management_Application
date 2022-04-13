import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { GlobalContextWrapper } from "context";

ReactDOM.render(
  <GlobalContextWrapper>
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </GlobalContextWrapper>,
  document.getElementById("root")
);
