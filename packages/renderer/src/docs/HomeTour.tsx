import { useState } from 'react';
import { Button, useTheme } from '@mui/material';
import Tour from 'reactour';
import { useStore } from '../store/useStore';
import { Help } from '@mui/icons-material';

const steps = (theme: any) => [
  {
    selector: '.step-one',
    content: (
      <div>
        <h2>Tour</h2>
        Let me guide you... 😊
      </div>
    ),
    style: {
      backgroundColor: theme.palette.background.paper || '#eeeeee',
      color: theme.palette.text.primary || '#000000',
    },
  },
  {
    selector: '.step-two',
    content: (
      <div>
        <h2>Step 2</h2>
        Can be attached to an element by adding `step-two` as css class
      </div>
    ),
    style: {
      backgroundColor: theme.palette.background.paper || '#eeeeee',
      color: theme.palette.text.primary || '#000000',
    },
  }
];
const electronSteps = (theme: any) => [
  {
    selector: '.step-three',
    content: (
      <div>
        <h2>Step 3</h2>
        Only visible in electron
      </div>
    ),
    style: {
      backgroundColor: theme.palette.background.paper || '#eeeeee',
      color: theme.palette.text.primary || '#000000',
    },
  },
];
const HomeTour = ({ sx }: any) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const setTour = useStore((state) => state.tours.setTour);
  const theme = useTheme();
  const wSteps = steps(theme);
  const eSteps = electronSteps(theme);
  return (
    <>
      <Button
        sx={sx}
        size={'large'}
        className='step-one'
        onClick={() => {
          setTour('home', true);
          setIsTourOpen(true);
        }}>
        <Help />
      </Button>
      <Tour
        steps={!!window.ipcRenderer ? [...wSteps, ...eSteps] : wSteps}
        // accentColor="#800000"
        isOpen={isTourOpen}
        onRequestClose={() => {
          setIsTourOpen(false);
          setTour('home', false);
        }}
      />
    </>
  );
};

export default HomeTour;
