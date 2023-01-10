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
  setTimeout(() => console.log('home timeout'), 5000)
  return (
    <div style={styles.container} >
      <h1>Baby Monitor</h1>
      <div style={styles.buttonContainer}>
        <a href='/create-freq' style={{ textDecoration: 'none' }}>
          <Button style={styles.button} variant="contained">
            Create Frequency
          </Button>
        </a>
        <a style={{ textDecoration: 'none' }} href={'enter-freq'}>
          <Button style={styles.button} variant="\outlined">
            Join Frequency
          </Button>
        </a>
      </div>
    </div>
  )
}