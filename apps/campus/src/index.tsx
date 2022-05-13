import * as React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { ColorModeScript } from '@chakra-ui/react';

import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

import App from './App';

Sentry.init({
  debug: process.env.NODE_ENV === 'development',
  dsn: process.env.NX_SENTRY_ID,
  environment: process.env.NODE_ENV,
  release: 'clevery@1.0.3', // 😅 process.env.npm_package_version is 'undefined'

  // This enables automatic instrumentation (highly recommended), but is not
  // necessary for purely manual usage
  integrations: [new Integrations.BrowserTracing()],

  // To set a uniform sample rate
  tracesSampleRate: 0.2,
});

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="system" />

    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
