import styles from '@/styles/app.module.scss';
import { Button } from '@mui/material';
import { useStore } from '../../store/useStore';
import pkg from '../../../../../package.json';
import Box from '@mui/material/Box';
import { Link as RouterLink } from "react-router-dom";

const ipcRenderer = window.ipcRenderer || false;

const Zustand = () => {
  const bears = useStore((state) => state.example.animals.bears);
  const increase = useStore((state) => state.example.increase);
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
          <Button component={RouterLink} to="/" size={"large"}>Back</Button>
          <p>Zustand: {bears}</p>
          <div>
            <p>
              <Button onClick={() => increase(-1)}>- 1</Button>{' '}
              <Button onClick={() => increase(1)}>+ 1</Button>
            </p>
          </div>
        </header>
      </Box>
  );
};

export default Zustand;
