import React from 'react';

interface UITypes {
  handleReturn: () => void;
}

const UI = ({ handleReturn }: UITypes): JSX.Element => {
  return (
    <div>
      <button onClick={() => handleReturn()}>GO BACK</button>
    </div>
  );
};

export default UI;
