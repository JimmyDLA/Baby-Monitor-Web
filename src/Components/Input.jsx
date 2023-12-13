import React from 'react'
import { TextField } from '@mui/material';

export const Input = ({ handleOnChange }) => {

  return (
    <TextField
      label='Room ID'
      id="room-id"
      style={styles.input}
      onChange={handleOnChange}
    />
  )
}

const styles = {
  input: {
    margin: 30,
    width: 400,
  },
}