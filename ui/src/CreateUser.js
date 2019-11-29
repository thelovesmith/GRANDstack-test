import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import { Mutation } from "react-apollo";

const CreateUser = () => {
  const [name, setName] = useState("");

  return (
    <>
      <form>
        <input
          name="Name"
          value={name}
          onChange={e => setName({ name: e.target.value })}
          placeholder="Name"
          type="text"
        />
      </form>
    </>
  );
};

export default CreateUser;
