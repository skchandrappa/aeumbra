import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, IconButton, Collapse } from '@mui/material';
import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';

const DemoBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if we're using mock API
    const usingMockApi = localStorage.getItem('using_mock_api');
    if (usingMockApi === 'true') {
      setShowBanner(true);
    }
  }, []);

  const handleClose = () => {
    setShowBanner(false);
    localStorage.removeItem('using_mock_api');
  };

  if (!showBanner) return null;

  return (
    <Collapse in={showBanner}>
      <Alert
        severity="info"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ 
          mb: 2,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <AlertTitle>
          <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Demo Mode
        </AlertTitle>
        <strong>Backend not available</strong> - This app is running in demonstration mode with mock data. 
        To connect to a real backend, deploy your FastAPI server to Railway or another hosting service.
        <br />
        <small>
          <strong>Note:</strong> All data is simulated and will not persist between sessions.
        </small>
      </Alert>
    </Collapse>
  );
};

export default DemoBanner;
