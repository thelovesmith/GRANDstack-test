import React, { useState } from "react";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Mutation } from "react-apollo";
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

const DELETE_USER = gql`
  mutation DeleteUser($id: ID) {
    DeleteUser(id: $id) {
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
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_USER);

  const [
    Delete,
    { loading: mutationLoading, error: mutationError, data: mutationData }
  ] = useMutation(DELETE_USER);

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

  const remove = id => {
    console.log("its hitting");
    console.log(id, "id ");
    Delete({ variables: { id } });
  };

  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error :(</p>;
  return (
    <>
      <Paper className={classes.root}>
        <Typography variant="h2" gutterBottom>
          Create & Delete User
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
        {data && !queryLoading && !queryError && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">AvgStars</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.User.map(({ id, name, avgStars }) => {
                return (
                  <TableRow key={id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{id}</TableCell>
                    <TableCell numeric="true">
                      {" "}
                      {avgStars ? avgStars.toFixed(2) : "-"}{" "}
                    </TableCell>
                    <TableCell>
                      <button onClick={() => remove(id)}>Delete</button>
                      <button onClick={() => Delete({ variables: { id } })}>
                        Delete Mutation
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        {mutationLoading && <p>Loading...</p>}
        {mutationError && <p>Error :( Please try again</p>}
      </Paper>
    </>
  );
};

export default withStyles(styles)(CreateUser);
