import React from 'react';

interface UITypes {
  handleReturn: () => void;
}

const UI = (): JSX.Element => {
  return (
    <div>
      {/* <button onClick={() => handleReturn()}>GO BACK</button> */}
      <h1>Noise</h1>
      <p>
        Noise is a three js app looking at the removal of narrative techniques
        within new articles. A combination of the chaotic nature and noise that
        surrounds news daily
      </p>
    </div>
  );
};

export default UI;
