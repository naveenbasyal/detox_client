import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </Provider>
);
serviceWorkerRegistration.register();
