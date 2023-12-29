import React from "react";
import { Color, Size } from '../Theme/Theme'
import { useMobile } from "../Theme/Layout";

export const Container = ({ children, style }) => {

  const isMobile = useMobile();
  const respPadding = isMobile ? Size.large : Size.xxxxlarge;
  return (
    <div style={{ ...styles.container, ...{ padding: respPadding }, ...style }}>
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