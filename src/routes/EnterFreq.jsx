import React, { useRef, useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader';
import { TextField } from '@mui/material';
import { Container, Button, Input } from '../Components';
import { Font, Size } from '../Theme/Theme'
import { useMobileOrTablet } from "../Theme/Layout";


export const EnterFreq = () => {
  const videoRef = useRef(null);
  const gotRes = useRef(false)
  const isMobileOrTablet = useMobileOrTablet();

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
    <Container>
      <QrReader
        onResult={handleQRCode}
        style={{ width: '100%' }}
      />
      <h1 style={styles.header}>Scan QR code to join baby's room</h1>
      <video ref={videoRef} />
      <div style={{ ...styles.buttonContainer, ...{ flexDirection: isMobileOrTablet ? 'column' : 'row' } }}>
        <Button primary text="Join Recent" />
        <Button secondary onClick={handleCamToggle} text="Type in Room ID" />
      </div>
    </Container>
  ) : (
    <Container>
      <h1>Enter Room ID</h1>
      <Input handleOnChange={handleInput} />
      <div style={{ ...styles.buttonContainer, ...{ flexDirection: isMobileOrTablet ? 'column' : 'row' } }}>
        <Button onClick={handleCamToggle} primary text="Scan QR code" />
        <Button secondary route={`join-freq/${input}`} text="Join Room" />
      </div>

    </Container>
  )
}

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  header: {
    marginBottom: Size.xxxxlarge,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: Size.xxxlarge,
  },
  button: {
    margin: 30
  },
  input: {
    margin: 30,
    width: 300,
  }
};