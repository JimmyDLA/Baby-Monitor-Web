import React, { useRef, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { QrReader } from 'react-qr-reader';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    margin: 30
  }
};
export const JoinFreq = () => {
  const videoRef = useRef(null);

  // useEffect(() => {
  //   getVideo()
  // }, [])

  const [data, setData] = useState('No result');


  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };
  return (
    <div style={styles.container} >
      <h1>Join Frequency</h1>
    </div>
  )
}