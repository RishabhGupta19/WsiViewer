import React from "react";
import WSIViewer from "./components/WSIViewer";
import "./index.css";

const App = () => {
  return (
    <div className="App">

<nav class="custom-navbar">
  <div class="navbar-container">
    <span class="navbar-brand">Artigence Healthcare Systems Private Limited
    </span>
  </div>
</nav>


      <WSIViewer />
    </div>
  );
};

export default App;