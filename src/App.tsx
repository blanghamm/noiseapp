import React from 'react';
import Visuals from './views/visuals';
const App = (): JSX.Element => {
  return (
    <div className='App'>
      <p style={{ position: "absolute", color: 'white', zIndex: 2, padding: '50px', fontSize: '10px' }}>Click the cover to start</p>
      <Visuals />
    </div>
  );
};

export default App;
