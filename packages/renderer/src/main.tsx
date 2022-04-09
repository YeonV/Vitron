import { StrictMode, useState, useMemo } from 'react';
import { render } from 'react-dom';
import { ThemeProvider  } from '@mui/material/styles';
import App from './App';
import './styles/index.css';
import theme from './theme';

render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root'),
  window.removeLoading
);

// console.log('fs', window.fs);
// console.log('ipcRenderer', window.ipcRenderer);

// Usage of ipcRenderer.on
window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args);
});
