import React from 'react';

// Basic styling for the spinner. You can make this much fancier.
const spinnerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw',
  fontSize: '1.5rem',
  color: '#555',
};

const FullPageSpinner = () => {
  return (
    <div style={spinnerStyles}>
      <p>Loading...</p>
    </div>
  );
};

export default FullPageSpinner;
