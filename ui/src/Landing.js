import React from "react";
import { Paper, Typography, Button, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import gql from "graphql-tag";

//Using Material Core's default theme
const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
});
const LandingPage = props => {
  const { classes } = props;
  return (
    <>
      <Paper className={classes.root}>
        <Typography>Landing Page</Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="outlined-helperText"
            label="Email"
            className={classes.textField}
            helperText="Please Enter your email"
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-password-input"
            label="Password"
            className={classes.textField}
            type="password"
            autoComplete="current-password"
            margin="normal"
            variant="outlined"
          />
        </form>
      </Paper>
    </>
  );
};

export default withStyles(styles)(LandingPage);
