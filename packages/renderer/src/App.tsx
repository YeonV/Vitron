import electronImg from '@/assets/electron.png';
import muiImg from '@/assets/mui.png';
import react from '@/assets/react.svg';
import vite from '@/assets/vite.svg';
import styles from '@/styles/app.module.scss';
import { Button } from '@mui/material';
import { useState, useEffect, useMemo, useContext, createContext } from 'react';
import { useStore } from './store/useStore';
import pkg from '../../../package.json';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ipcRenderer = window.ipcRenderer || false;

const App = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('no ipc message');
  const [data, setData] = useState(0);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [darkmode, setDarkmode] = useState('');
  const inner = useStore((state) => state.outer.inner);
  const increase = useStore((state) => state.increase);
  const onClickSetStore = () => {
    ipcRenderer.send('set', ['count', count]);
    onClickGetStore();
  };
  const onClickGetStore = () => {
    ipcRenderer.send('get');
  };

  const onClickWithIpc = () => {
    ipcRenderer.send('ping-pong', 'some data from ipcRenderer');
  };

  const onClickWithIpcSync = () => {
    const message = ipcRenderer.sendSync(
      'ping-pong-sync',
      'some data from ipcRenderer'
    );
    setMessage(message);
  };

  const toggleDarkmode = () => {
    ipcRenderer.sendSync('toggle-darkmode', 'try');
  };

  // If we use ipcRenderer in this scope, we must check the instance exists
  if (ipcRenderer) {
    // In this scope, the webpack process is the client
  }

  useEffect(() => {
    if (ipcRenderer) {
      if (data) {
        setCount(data);
      }
    }
  }, [data]);

  useEffect(() => {
    if (ipcRenderer) {
      // register `ping-pong` event
      ipcRenderer.on('ping-pong', (event: any, data: any) => {
        setMessage(data);
      });
      ipcRenderer.on('get', (event: any, data: any) => {
        setData(data.count);
      });
      async function getDarkMode() {
        const dark = await ipcRenderer.sendSync('get-darkmode');        
        setDarkmode(dark);
        setMode(dark === 'yes' ? 'dark' : 'light');
      }
      getDarkMode();
    }
    return () => {
      if (ipcRenderer) {
        // unregister it
        ipcRenderer.removeAllListeners('ping-pong');
      }
    };
  }, []);

  useEffect(() => {
    if (ipcRenderer) {
      onClickGetStore();
    }
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
    <Box 
    sx={{
      bgcolor: 'background.default',
      color: 'text.primary',
      overflowX: 'hidden'
    }}className={styles.app}>
      <header
        className={styles.appHeader}
        style={{
          minHeight:
            ipcRenderer && pkg.env.VITE_CUSTOM_TITLEBAR
              ? 'calc(100vh - 30px)'
              : '100vh',
        }}>
        <div className={styles.logos}>
          {ipcRenderer && (
            <div className={styles.imgBox}>
              <img
                src={electronImg}
                style={{ height: '24vw' }}
                className={styles.appLogo}
                alt='electron'
              />
            </div>
          )}
          <div className={styles.imgBox}>
            <img src={vite} style={{ height: '19vw' }} alt='vite' />
          </div>
          <div className={styles.imgBox}>
            <img
              src={react}
              style={{ maxWidth: '100%' }}
              className={styles.appLogo}
              alt='logo'
            />
          </div>
          {!ipcRenderer && (
            <div className={styles.imgBox}>
              <img src={muiImg} style={{ height: '19vw' }} alt='vite' />
            </div>
          )}
        </div>
        <p>
          {ipcRenderer && 'Electron + '}Vite + React
          <br /> Typesscript + MUI + Zustand
        </p>
        {ipcRenderer && (
          <div>
            <p>Electron Store: {data}</p>
            <p>
              <Button
                size='small'
                variant='contained'
                onClick={() => setCount(data)}>
                Sync from store
              </Button>{' '}
              <Button
                size='small'
                variant='contained'
                onClick={() => onClickSetStore()}>
                Sync to store
              </Button>
            </p>
          </div>
        )}
        <p>React useState: {count}</p>
        <div>
          <p>
            <Button
              variant='contained'
              onClick={() => setCount((count: number) => count - 1)}>
              - 1
            </Button>{' '}
            <Button
              variant='contained'
              onClick={() => setCount((count: number) => count + 1)}>
              + 1
            </Button>
          </p>
        </div>
        <p>Zustand: {inner}</p>
        <div>
          <p>
            <Button variant='contained' onClick={() => increase(-1)}>
              - 1
            </Button>{' '}
            <Button variant='contained' onClick={() => increase(1)}>
              + 1
            </Button>
          </p>
        </div>
        {ipcRenderer && (
          <div>
            <p>IPC messaging</p>
            <Button variant='contained' onClick={onClickWithIpc}>
              send async
            </Button>{' '}
            <Button variant='contained' onClick={onClickWithIpcSync}>
              send sync
            </Button>
            <p>{message}</p>
          </div>
        )}
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            color: 'text.primary',
            borderRadius: 1,
            p: 3,
          }}>
          <IconButton sx={{ ml: 1 }} onClick={toggleDarkmode} color='inherit'>
            {darkmode === 'yes' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </header>
    </Box>
    </ThemeProvider>
  );
};

export default App;
