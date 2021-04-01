import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.render(
  <Auth0Provider
      domain="dev-1odthoac.us.auth0.com"
      clientId="08Ygwe2LYlbDQZSk2AnGNjpyPxUHZBMU"
      redirectUri={`${window.location.origin}/PostLogin`}
      audience="https://dev-1odthoac.us.auth0.com/api/v2/"
      scope="read:current_user"
    >
      <App />
    </Auth0Provider>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
