import React, { useEffect, useRef, useState } from 'react';
import { BiPlus, BiMinus } from 'react-icons/bi';
import { MdOutlineClose, MdOpenWith } from 'react-icons/md';
import { useConfig } from '../contexts/ConfigProvider';
import { useBoardState } from '../contexts/BoardStateProvider';

function DraggableDiv() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 300, y: 250 }); //this is the initial position when toggled on
  const [videoHeight, setVideoHeight] = useState(360);
  const [videoWidth, setVideoWidth] = useState(640);
  const { isVideoPlayerOpen, setIsVideoPlayerOpen } = useConfig();
  const [videoPlayerSize, setvideoPlayerSize] = useState(2); // range of values is 1,2,3, start at medium size (2)
  const { recentDraftedPlayer } = useBoardState();
  const divRef = useRef(null);

  // useEffect(() => {
  //   const videoFrame = document.getElementById('videoFrame');
  //   if (videoFrame) {
  //     videoFrame.setAttribute('src', recentDraftedPlayer.first);
  //   }
  // }, [recentDraftedPlayer]);

  const resizeSmaller = () => {
    if (videoPlayerSize === 3) {
      setVideoHeight(360);
      setVideoWidth(640);
      if (document.getElementById('videoFrame')) {
        document.getElementById('videoFrame').setAttribute('width', 640);
        document.getElementById('videoFrame').setAttribute('height', 360);
      }
      setvideoPlayerSize(2);
    } else if (videoPlayerSize === 2) {
      setVideoHeight(240);
      setVideoWidth(426);
      if (document.getElementById('videoFrame')) {
        document.getElementById('videoFrame').setAttribute('width', 426);
        document.getElementById('videoFrame').setAttribute('height', 240);
      }
      setvideoPlayerSize(1);
    }
  };

  const resizeBigger = () => {
    if (videoPlayerSize === 1) {
      setVideoHeight(360);
      setVideoWidth(640);
      if (document.getElementById('videoFrame')) {
        document.getElementById('videoFrame').setAttribute('width', 640);
        document.getElementById('videoFrame').setAttribute('height', 360);
      }
      setvideoPlayerSize(2);
    } else if (videoPlayerSize === 2) {
      setVideoHeight(480);
      setVideoWidth(854);
      if (document.getElementById('videoFrame')) {
        document.getElementById('videoFrame').setAttribute('width', 854);
        document.getElementById('videoFrame').setAttribute('height', 480);
      }
      setvideoPlayerSize(3);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);

    const startX = e.clientX - divRef.current.getBoundingClientRect().left;
    const startY = e.clientY - divRef.current.getBoundingClientRect().top;

    document.onmousemove = (e) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      setPosition({ x: newX, y: newY });
    };

    document.onmouseup = () => {
      setIsDragging(false);
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  if (isVideoPlayerOpen) {
    return (
      <div
        ref={divRef}
        style={{
          width: videoWidth,
          height: videoHeight,
          backgroundColor: 'rgba(0, 0, 0, 0.90)',
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          borderRadius: '10px',
        }}
        onMouseDown={handleMouseDown}>
        <div style={{ height: '30px' }}>
          <div style={{ float: 'left' }}>
            <MdOpenWith
              style={{ padding: '2px' }}
              size={30}
              color='white'
            />
          </div>
          <div style={{ color: 'white', float: 'left', paddingLeft: '30px' }}>
            {recentDraftedPlayer.firstName === 'Current' ? 'No player has been drafted yet' : recentDraftedPlayer.first + ' ' + recentDraftedPlayer.last}
          </div>
          <div style={{ float: 'right' }}>
            <MdOutlineClose
              style={{ float: 'right' }}
              onClick={() => setIsVideoPlayerOpen(false)}
              size={30}
              color='white'
            />
            <BiPlus
              onClick={resizeBigger}
              size={30}
              style={{ float: 'right' }}
              color='white'
            />
            <BiMinus
              onClick={resizeSmaller}
              size={30}
              style={{ float: 'right' }}
              color='white'
            />
          </div>
        </div>
        {recentDraftedPlayer.firstName !== 'Current' ? (
          <iframe
            width={videoWidth}
            height={videoHeight}
            title='test'
            id='videoFrame'
            src={recentDraftedPlayer.url}></iframe>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
export default DraggableDiv;
