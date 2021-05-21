import { useState } from 'react';

const useVideo = (source: { url: string }[]) => {
  const [sourceArr] = useState(() =>
    source.map((thi) => {
      const vid = document.createElement('video');
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
