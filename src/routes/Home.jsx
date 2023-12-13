import React, { useEffect } from "react";
import { Container, Button } from '../Components'
import logo from '../Assests/baby-logo.png'
import { Font, Size } from '../Theme/Theme'
import { useMobileOrTablet } from "../Theme/Layout";

export const Home = () => {
  useEffect(() => {
    console.log('[INFO] home useEffect')
  }, [])

  const isMobileOrTablet = useMobileOrTablet();

  return (
    <Container>
      <div style={styles.container}>
        <img style={styles.img} src={logo} alt="logo" />

        <p style={styles.para}>
          Welcome to Baby Monitor. Now its easier than ever to monitor
          your baby while they sleep. Just use any 2 mobile device like
          your phone, tablet, and/or laptop.
        </p>

        <div style={{ ...styles.buttonContainer, ...{ flexDirection: isMobileOrTablet ? 'column' : 'row' } }}>
          <Button primary route="/create-freq" text="Baby's Room" />
          <Button secondary route="/enter-freq" text="Parent's Room" />
        </div>
      </div>
    </Container>
  )
}

const styles = {
  container: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column'
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
  para: {
    fontSize: Font.xxlarge,
    maxWidth: 600,
    marginTop: Size.xxxlarge,
  },
};
