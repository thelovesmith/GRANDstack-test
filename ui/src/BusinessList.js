import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  TableSortLabel,
  Typography,
  TextField
} from "@material-ui/core";

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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 300
  }
});

const GET_BUSINESS = gql`
  {
    Business {
      address
      name
      avgStars
      id
      categories {
        name
        _id
      }
    }
  }
`;

const Business = props => {
  const { classes } = props;
  const { loading, data, error } = useQuery(GET_BUSINESS);

  return (
    <>
      <Paper className={classes.root}>
        <Typography variant="h2" gutterBottom>
          Business List
        </Typography>
        {/* Accomadate for loading and errors */}
        {loading && !error && <p>Loading...</p>}
        {error && !loading && <p>Error</p>}
        {data && !loading && !error && (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">address</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Avg. Stars</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.Business.map(b => {
                return (
                  <TableRow key={b.id}>
                    <TableCell component="th" scope="row">
                      <strong>{b.name}</strong>
                    </TableCell>
                    <TableCell>{b.address}</TableCell>
                    <TableCell>{b.categories[0].name}</TableCell>
                    <TableCell numeric>
                      {b.avgStars ? b.avgStars.toFixed(2) : "-"}
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

export default withStyles(styles)(Business);
