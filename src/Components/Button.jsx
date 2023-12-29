import React from "react";
import { Size, Color, Font } from '../Theme/Theme';

export const Button = ({ onClick, route, primary, text, secondary, icon }) => {
  const buttonCont = {
    display: 'flex',
    borderRadius: Size.xxlarge,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: Size.xxxxlarge,
    backgroundColor: primary ? Color.primary : Color.secondary,
    border: 0,
    margin: 25,
    cursor: 'pointer'
  }

  const iconBackground = icon ? {
    backgroundColor: 'transparent',
    width: 'auto',
    height: 'auto',
  } : {}

  const buttonText = {
    color: secondary ? Color.black : Color.white,
    fontSize: Font.large,
    fontWeight: 'bold',
  }

  return route ? (
    <a href={route} style={styles.noDecor}>
      <button style={buttonCont}>
        <p style={buttonText}>
          {text}
        </p>
      </button>
    </a>
  ) : (
    <button onClick={onClick} style={{ ...buttonCont, ...iconBackground }}>
      {icon ? (
        <img src={icon} alt="icon button" />
      ) : (
        <p style={buttonText}>
          {text}
        </p>
      )}
    </button >

  )
}

const styles = {
  noDecor: {
    textDecoration: 'none',
    margin: 25,
  },
}