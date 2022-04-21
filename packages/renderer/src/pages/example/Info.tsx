import styles from '@/styles/app.module.scss';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useStore } from '../../store/useStore';
import pkg from '../../../../../package.json';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';

const ipcRenderer = window.ipcRenderer || false;

const Row = ({label, value}:any) => (
  <Box sx={{justifyContent: 'space-between', display: 'flex'}}>
    <Typography>{label}:</Typography>
    <Typography>{value}</Typography>
  </Box>
);
const Info = () => {
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
        <Paper elevation={3} sx={{ p: 5, m: 3, minWidth: 250 }}>
          <p>Info:</p>
          <Row label="Name" value={pkg.productName || pkg.name} />
          <Row label="Version" value={pkg.version} />
          <hr />
          <Row label="Host" value={pkg.env.VITE_DEV_SERVER_HOST} />
          <Row label="Port" value={pkg.env.VITE_DEV_SERVER_PORT} />
          <hr />
          <Row label="Custom Titlebar" value={pkg.env.VITRON_CUSTOM_TITLEBAR ? 'yes' : 'no'} />
          <Row label="Save Windowsize" value={pkg.env.VITRON_SAVE_WINDOWSIZE ? 'yes' : 'no'} />
          <Row label="Use Tray-Icon" value={pkg.env.VITRON_TRAY ? 'yes' : 'no'} />
          <hr />          
          <Row label="Author" value={pkg.author.split("<")[0]} />
        </Paper>
        <Button component={RouterLink} to='/' size={'large'}>
          Back
        </Button>
      </header>
    </Box>
  );
};

export default Info;
