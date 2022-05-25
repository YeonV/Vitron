import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { ThemeProvider  } from '@mui/material/styles';
import App from './App';
import './styles/index.css';
import theme from './styles/theme';

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);

window.removeLoading && window.removeLoading()

// console.log('fs', window.fs);
// console.log('ipcRenderer', window.ipcRenderer);

// Usage of ipcRenderer.on
window.ipcRenderer && window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args);
});
