import React from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

const information = gql`
  query Information {
    information {
      necessity {
        finished
        comment
      }
    }
  }
`;

const necessity = () => (
  <Query query={information}>
    {({ loading, data }) => {
      if (loading) {
        return <span>Loading...</span>;
      }

      return (
        <div className="container">
          {!Object.keys(data.information).length ? (
            <div className="columns is-multiline">
              {data.information.necessity &&
              data.information.necessity.length ? (
                <div className="column is-6">
                  <div className="box" style={{ marginTop: "0.5rem" }}>
                    <p className="subtitle">
                      <strong>Establecimiento comercial:</strong>
                      {JSON.stringify(data.information.necessity)}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <h2
              className="subtitle is-3"
              style={{ textAlign: "center", padding: 20 }}
            >
              No se ha encontrado información al respecto.
            </h2>
          )}
        </div>
      );
    }}
  </Query>
);

export default necessity;