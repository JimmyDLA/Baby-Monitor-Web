import React, { useRef, useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader';
import { Button, TextField } from '@mui/material';

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

  const [data, setData] = useState('No result');
  const [input, setInput] = useState('');
  const [isCamScanning, setIsCamScanning] = useState(true);

  useEffect(() => {
    if (isCamScanning) {
      getVideo()
    }
    return () => console.log('unmount')
  }, [isCamScanning])

  const getVideo = () => {
    const constraints = {
      audio: false,
      video: {
        facingMode: 'user',
        width: 400
      }
    }
    navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
      let video = videoRef.current;
      video.srcObject = stream;
    });
    navigator.mediaDevices
      .getUserMedia(constraints)
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
        window.location.replace(`join-freq/${result.text}`)

      }
      if (!!error) {
        console.info(error, gotRes.current);
      }
    }
  }

  const handleInput = e => {
    console.log(e.target.value)
    setInput(e.target.value)
  }

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
      <TextField id="frequency-id" label="frequency" style={styles.input} variant="outlined" onChange={handleInput} />
      <a style={{ textDecoration: 'none' }} href={`join-freq/${input}`}>
        <Button style={styles.button} variant='contained'>
          Join Frequency
        </Button>
      </a>

    </div>
  )
}