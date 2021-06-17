//@ts-nocheck
import React from 'react';
import { Html } from '@react-three/drei';
import { TextTitle } from '../../views/visuals/Styles';

const InfoText = ({ news }) => {
  return (
    <Html position={[1.5, 0, 0]}>
      <TextTitle>{news}</TextTitle>
    </Html>
  );
};

export default InfoText;
