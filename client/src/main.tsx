import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'

import { store } from './app/store/store.ts';
import { Provider } from 'react-redux'

import { SettingsProvider } from './context/SettingsContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SettingsProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </SettingsProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
