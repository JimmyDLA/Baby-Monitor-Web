
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import QRCode from "react-qr-code";
import { v4 as uuidV4 } from 'uuid'



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
export const CreateFreq = () => {
  const room = uuidV4()

  return (
    <div style={styles.container} >
      <h1>Create Frequency</h1>
      <h4>Scan QR code to join frequency</h4>
      <QRCode size={200} value={room} />
      <h4>OR</h4>
      <h4>Type frequncy ID to join:</h4>
      <h4>{room}</h4>
    </div>
  )
}