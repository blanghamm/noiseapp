import { useState } from 'react';

const useVideo = (source: Array<string>) => {
  const [sourceArr] = useState(() =>
    source.map((thi) => {
      const vid = document.createElement('video');
      //@ts-ignore
      vid.src = thi.url;
      vid.crossOrigin = 'Anonymous';
      vid.loop = true;
      vid.muted = true;
      return vid;
    })
  );
  return sourceArr;
};

export default useVideo;
