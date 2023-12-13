import React from "react";
import { Color, Size } from '../Theme/Theme'

export const Container = ({ children, style }) => {

  return (
    <div style={{ ...styles.container, ...style }}>
      {children}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    padding: Size.xxxxlarge,
    backgroundColor: Color.background

  },
}