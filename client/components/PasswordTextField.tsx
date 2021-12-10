import React from 'react';

import {
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
} from '@material-ui/core';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import clsx from 'clsx';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
export const useLoginStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1, 0),
    },
  })
);

interface Props {
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  className?: string;
}

export default function PasswordTexField({ onChange, className }: Props) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const classes = useLoginStyles({});
  return (
    <FormControl
      className={clsx(classes.margin, className)}
      variant="outlined"
      fullWidth
    >
      <InputLabel htmlFor="outlined-adornment-password" shrink>
        密码
      </InputLabel>
      <OutlinedInput
        type={showPassword ? 'text' : 'password'}
        onChange={onChange}
        labelWidth={40}
        autoComplete="current-password"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
