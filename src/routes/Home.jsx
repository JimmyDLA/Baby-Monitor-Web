import logo from '../logo.svg';
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
export const Home = () => {
  return (
    <div style={styles.container} >
      <h1>Baby Monitor</h1>
      <div style={styles.buttonContainer}>
        <Link style={{ textDecoration: 'none' }} to={'create-freq'}>
          <Button style={styles.button} variant="contained">
            Create Frequency
          </Button>
        </Link>
        <Link style={{ textDecoration: 'none' }} to={'join-freq'}>
          <Button style={styles.button} variant="outlined">
            Join Frequency
          </Button>
        </Link>
      </div>
    </div>
  )
}