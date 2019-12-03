import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { BrowserRouter } from "react-router-dom";

// Apollo link to connect to our graphql api
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI
});

//create an Apollo link to grab out wuthtoken from locak storage and add it to each request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  //chain the apollo links together
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const Main = () => (
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);

ReactDOM.render(<Main />, document.getElementById("root"));
registerServiceWorker();
