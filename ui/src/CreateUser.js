import React, { useState } from "react";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

const User_Mutation = gql`
  mutation UserMutation($name: String!) {
    CreateUser(name: $name) {
      name
      id
    }
  }
`;

const GET_USER = gql`
  {
    User {
      name
      id
      avgStars
    }
  }
`;

const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto"
  },
  form: {
    minWidth: 500,
    display: "flex",
    flexDirection: "column"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 300
  },
  button: {
    width: 100,
    border: "1px solid black"
  }
});

const CreateUser = props => {
  const { classes } = props;
  const [name, setName] = useState("");
  const { loading, error, data } = useQuery(GET_USER);

  const [CreateUser] = useMutation(User_Mutation, {
    update: (proxy, { data: { CreateUser } }) => {
      const data = proxy.readQuery({ query: GET_USER });

      data.User.push(CreateUser);
      proxy.writeQuery({
        query: GET_USER,
        data
      });
    }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <>
      <Paper className={classes.root}>
        <Typography variant="h2" gutterBottom>
          Create User
        </Typography>
        <form
          className={classes.form}
          onSubmit={e => {
            e.preventDefault();
            CreateUser({ variables: { name: name } });
            setName("");
          }}
        >
          <TextField
            name="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            type="text"
          />
          <Button className={classes.button} type="submit">
            Create
          </Button>
        </form>
        {data && !loading && !error && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">AvgStars</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.User.map(u => {
                return (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.id}</TableCell>
                    <TableCell numeric="true">
                      {" "}
                      {u.avgStars ? u.avgStars.toFixed(2) : "-"}{" "}
                    </TableCell>
                    <TableCell>
                      <Button>Delete</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    </>
  );
};

export default withStyles(styles)(CreateUser);
