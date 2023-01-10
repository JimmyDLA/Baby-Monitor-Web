import React, { useRef, useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader';
import { Button, TextField } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

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
  },
  input: {
    margin: 30,
    width: 300,
  }
};



export const EnterFreq = () => {
  const videoRef = useRef(null);
  const gotRes = useRef(false)

  const navigate = useNavigate();

  const [data, setData] = useState('No result');
  const [isCamScanning, setIsCamScanning] = useState(true);
  // const [gotRes, setGotRes] = useState(false);

  useEffect(() => {
    if (isCamScanning) {
      getVideo()
    }
    return () => console.log('unmount')
  }, [isCamScanning])




  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 400 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };

  const handleCamToggle = () => {
    setIsCamScanning(!isCamScanning)
  };

  const handleQRCode = (result, error) => {
    if (!gotRes.current) {
      if (!!result) {
        setData(result?.text);
        gotRes.current = true
        window.location.replace('join-freq')

      }
      if (!!error) {
        console.info(error, gotRes.current);
      }
    }
  }

  // const handleJoin = () => {
  //   console.log('join')
  //   window.location.replace('join-freq')
  //   // window.history.pushState({}, "", "join-freq");
  // }

  return isCamScanning ? (
    <div style={styles.container} >
      <h1>Join Frequency</h1>
      <h4>Scan QR code to join frequency</h4>
      <QrReader
        onResult={handleQRCode}
        style={{ width: '100%' }}
      />
      <video ref={videoRef} />
      <p>{data}</p>
      <Button style={styles.button} variant='contained' onClick={handleCamToggle}>
        Enter Frequency ID Manually
      </Button>
    </div>
  ) : (
    <div style={styles.container}>
      <h1>Enter Frequency</h1>
      <Button style={styles.button} variant='outlined' onClick={handleCamToggle}>
        Scan Frequency
      </Button>
      <TextField id="frequency-id" label="frequency" style={styles.input} variant="outlined" />
      <a style={{ textDecoration: 'none' }} href={'join-freq'}>
        <Button style={styles.button} variant='contained'>
          Join Frequency
        </Button>
      </a>

    </div>
  )
}