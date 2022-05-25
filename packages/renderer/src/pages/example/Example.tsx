import electronImg from '@/assets/electron.png';
import muiImg from '@/assets/mui.png';
import react from '@/assets/react.svg';
import vite from '@/assets/vite.svg';
import zustand from '@/assets/zustand.png';
import logoTitle from '@/assets/logotitle.svg';
import typescript from '@/assets/typescript.svg';
import immer from '@/assets/immer.svg';
import reactRouter from '@/assets/reactrouter.svg';
import styles from '@/styles/app.module.scss';
import pkg from '../../../../../package.json';
import { useState, useEffect } from 'react';
import { Avatar, Button, Paper, Typography, Box, Chip } from '@mui/material';
import { useStore } from '../../store/useStore';
import { Link as RouterLink } from 'react-router-dom';
import { InfoOutlined, Brightness4, Brightness7 } from '@mui/icons-material';
import HomeTour from '@/docs/HomeTour';

const ipcRenderer = window.ipcRenderer || false;

const Example = () => {
  // React's useState
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('hacked by Blade');
  const [data, setData] = useState(0);

  // Zustand-Store
  const { darkMode, setDarkMode } = useStore((state) => state.ui);
  const bears = useStore((state) => state.example.animals.bears);
  const increase = useStore((state) => state.example.increase);

  // Electron-Store
  const onClickSetStore = () => {
    ipcRenderer.send('set', ['count', count]);
    onClickGetStore();
  };
  const onClickGetStore = () => {
    ipcRenderer.send('get');
  };

  // IPC Example
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

  // DarkMode mui & nativeTheme
  const toggleDarkmode = () => {
    if (ipcRenderer) {
      ipcRenderer.sendSync('toggle-darkmode', 'try');
    } else {
      setDarkMode(!darkMode);
    }
  };

  // set React-state from Electron-Store
  useEffect(() => {
    if (ipcRenderer) {
      if (data) {
        setCount(data);
      }
    }
  }, [data]);

  // IPC init
  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on('ping-pong', (event: any, data: any) => {
        setMessage(data);
      });
      ipcRenderer.on('get', (event: any, data: any) => {
        setData(data.count);
      });
      async function getDarkMode() {
        const dark = await ipcRenderer.sendSync('get-darkmode');
        setDarkMode(dark === 'yes');
      }
      getDarkMode();
    }
    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('ping-pong');
        ipcRenderer.removeAllListeners('get');
      }
    };
  }, []);

  useEffect(() => {
    if (ipcRenderer) {
      onClickGetStore();
    }
  }, []);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowX: 'hidden',
      }}
      className={styles.app}>
      <header
        className={styles.appHeader}
        style={{
          minHeight:
            ipcRenderer && pkg.env.VITRON_CUSTOM_TITLEBAR
              ? 'calc(100vh - 30px)'
              : '100vh',
        }}>
        <div className={styles.logos}>
          <div className={styles.imgBox}>
            <img src={logoTitle} style={{ width: '480px', filter: darkMode ? 'invert(0)' : 'invert(1)' }} alt='Vitron' />
          </div>
        </div>

        <Box sx={{ mb: 5, mt: 2.5, maxWidth: 500 }}>
          {ipcRenderer && (
            <Chip
              avatar={<Avatar alt='Electron' src={electronImg} />}
              label='Electron'
            />
          )}
          <Chip avatar={<Avatar alt='Vite' src={vite} />} label='Vite' />
          <Chip avatar={<Avatar alt='React' src={react} />} label='React' />
          <Chip
            avatar={<Avatar alt='Typescript' src={typescript} />}
            label='Typescript'
          />
          <Chip
            avatar={<Avatar alt='Material UI' src={muiImg} />}
            label='Material UI'
          />
          <Chip
            avatar={<Avatar alt='Zustand' src={zustand} />}
            label='Zustand'
          />
          <Chip avatar={<Avatar alt='Immer' src={immer} />} label='Immer' />
          <Chip
            avatar={<Avatar alt='React Router' src={reactRouter} />}
            label='React Router'
          />
        </Box>

        {ipcRenderer && (
          <Paper elevation={3} sx={{ p: 2, m: 1, minWidth: 480 }}>
            <Button
              variant='outlined'
              size={'small'}
              sx={{ mr: 1, width: '250px', whiteSpace: 'nowrap' }}>
              Electron Store: {data}
            </Button>
            <Button sx={{ width: 100 }} onClick={() => setCount(data)}>
              Get
            </Button>{' '}
            <Button sx={{ width: 100 }} onClick={() => onClickSetStore()}>
              Set
            </Button>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 2, m: 1, minWidth: 480 }}>
          <Button
            variant='outlined'
            sx={{ mr: 1, width: '250px', whiteSpace: 'nowrap' }}>
            React useState: {count}
          </Button>
          <Button
            sx={{ width: 100 }}
            onClick={() => setCount((count: number) => count - 1)}>
            - 1
          </Button>{' '}
          <Button
            sx={{ width: 100 }}
            onClick={() => setCount((count: number) => count + 1)}>
            + 1
          </Button>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, m: 1, minWidth: 480 }}>
          <Button
            variant='outlined'            
            sx={{ mr: 1, fontSize: 17, width: '250px', whiteSpace: 'nowrap' }}>
            Zustand: {bears}
          </Button>
          <Button sx={{ width: 100 }} onClick={() => increase(-1)}>
            - 1
          </Button>{' '}
          <Button sx={{ width: 100 }} onClick={() => increase(1)}>
            + 1
          </Button>
        </Paper>       

        {ipcRenderer && (
          <Paper elevation={3} sx={{ p: 2, m: 1, minWidth: 480 }}>
            <Button
              variant='outlined'
              sx={{ mr: 1, width: '250px', whiteSpace: 'nowrap' }}>
              IPC messaging
            </Button>
            <Button sx={{ width: 100 }} onClick={onClickWithIpc}>
              async
            </Button>{' '}
            <Button sx={{ width: 100 }} onClick={onClickWithIpcSync}>
              sync
            </Button>
          </Paper>
        )}
        
        <Paper elevation={3} sx={{ p: 2, m: 1, minWidth: 480 }}>
          <Button
            variant='outlined'
            sx={{ mr: 1, width: '250px', whiteSpace: 'nowrap' }}>
            Extras
          </Button>
          <Button size={'large'} sx={{ width: 60 }} onClick={toggleDarkmode}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </Button>{' '}
          <Button size={'large'} sx={{ width: 60 }} component={RouterLink} to={"info"}>
            <InfoOutlined />
          </Button>{' '}
          {pkg.env.VITRON_TOURS && <HomeTour sx={{ width: 60 }} />}
        </Paper>

        {ipcRenderer && (
          <Paper elevation={1} sx={{ p: 2, m: 1, minWidth: 480 }}>
            <Typography color={'textSecondary'}>{message}</Typography>
          </Paper>
        )}
        
      </header>
    </Box>
  );
};

export default Example;
