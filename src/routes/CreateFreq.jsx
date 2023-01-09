
import Button from '@mui/material/Button';
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
export const CreateFreq = () => {
  return (
    <div style={styles.container} >
      <h1>Create Frequency</h1>
      <div style={styles.buttonContainer}>
        {/* <Button style={styles.button} variant="contained"> <Link>Create Frequency</Link></Button>
      <Button style={styles.button} variant="outlined">Join Frequency</Button> */}
      </div>
    </div>
  )
}