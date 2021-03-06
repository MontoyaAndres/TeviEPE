import React, { useState, useEffect, memo } from "react";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import { withFormik, Form } from "formik";
import scrollIntoView from "smooth-scroll-into-view-if-needed";

import { necessityQuery } from "../../../graphql/queries/account";
import Loading from "../../shared/loading";
import meQuery from "../../../graphql/queries/me";
import { TextAreaField } from "../../shared/globalField";
import UpdateNecessityModal from "./updateNecessityModal";
import DeleteNecessityModal from "./deleteNecessityModal";
import Linkify from "../../shared/linkify";
import DropdownIcon from "../../shared/dropdrownIcon";
import normalizeErrors from "../../../utils/normalizeErrors";

const necessityMutation = gql`
  mutation NecessityMutation($finished: Boolean!, $comment: String!) {
    necessity(finished: $finished, comment: $comment) {
      path
      message
    }
  }
`;

const InputNecessity = ({ isSubmitting, handleSubmit }) => (
  <Form method="POST" onSubmit={handleSubmit}>
    <div className="box" style={{ marginTop: "0.1rem" }}>
      <label htmlFor="comment" className="label">
        Escribe qué es lo que necesitas.
      </label>
      <TextAreaField
        name="comment"
        id="comment"
        placeholder="Comentario"
        isRequired
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`button is-block is-primary is-large ${
          isSubmitting ? "is-loading" : ""
        }`}
      >
        Enviar
      </button>
    </div>
  </Form>
);

const index = ({
  loadingNecessity,
  loadingMe,
  dataNecessity,
  dataMe,
  fetchNecessity,
  id,
  isSubmitting,
  handleSubmit
}) => {
  const [state, setState] = useState({
    deleteNecessity: false,
    updateNecessity: false,
    idNecessity: null,
    hasMoreItems: true
  });

  useEffect(() => {
    if (dataNecessity.response && dataNecessity.response.length < 10) {
      setState({
        deleteNecessity: state.deleteNecessity,
        updateNecessity: state.updateNecessity,
        idNecessity: state.idNecessity,
        hasMoreItems: false
      });
    }

    return () => {
      if (dataNecessity.response && dataNecessity.response.length >= 10) {
        setState({
          deleteNecessity: state.deleteNecessity,
          updateNecessity: state.updateNecessity,
          idNecessity: state.idNecessity,
          hasMoreItems: true
        });
      }
    };
  }, [dataNecessity.response]);

  function handleAskDeleteNecessity(idNecessity = null) {
    setState({
      deleteNecessity: !state.deleteNecessity,
      updateNecessity: state.updateNecessity,
      idNecessity,
      hasMoreItems: state.hasMoreItems
    });
  }

  function handleAskUpdateNecessity(idNecessity = null) {
    setState({
      deleteNecessity: state.deleteNecessity,
      updateNecessity: !state.updateNecessity,
      idNecessity,
      hasMoreItems: state.hasMoreItems
    });
  }

  function handleLoadMore() {
    fetchNecessity({
      variables: {
        userId: id,
        limit: dataNecessity.response.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        if (fetchMoreResult.necessity.response.length < 10) {
          setState({
            deleteNecessity: state.deleteNecessity,
            updateNecessity: state.updateNecessity,
            idNecessity: state.idNecessity,
            hasMoreItems: false
          });
        }

        return Object.assign({}, prev, {
          necessity: {
            ...fetchMoreResult.necessity,
            response: [
              ...prev.necessity.response,
              ...fetchMoreResult.necessity.response
            ]
          }
        });
      }
    });
  }

  if (loadingNecessity || loadingMe) {
    return <Loading />;
  }

  return (
    <div className="container" style={{ padding: "0.75rem" }}>
      {dataMe.id === id && (
        <InputNecessity
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
      )}

      {/* Delete necessity modal */}
      {state.deleteNecessity && (
        <DeleteNecessityModal
          id={id}
          idNecessity={state.idNecessity}
          deleteNecessity={state.deleteNecessity}
          handleAskDeleteNecessity={handleAskDeleteNecessity}
        />
      )}

      {/* Update necessity modal */}
      {state.updateNecessity && (
        <UpdateNecessityModal
          id={id}
          dataNecessity={dataNecessity}
          idNecessity={state.idNecessity}
          updateNecessity={state.updateNecessity}
          handleAskUpdateNecessity={handleAskUpdateNecessity}
        />
      )}

      {dataNecessity && dataNecessity.response.length > 0 ? (
        <>
          {dataNecessity.response.map((neces, i) => (
            <div style={{ margin: "1.1rem 0" }} key={i}>
              <div className="card" style={{ borderRadius: 6 }}>
                <header className="card-header" style={{ borderRadius: 6 }}>
                  <div className="card-header-title">
                    <div className="media">
                      <div className="media-left">
                        <div>
                          {neces.finished ? (
                            <i
                              className="fas fa-2x fa-check is-medium"
                              style={{ color: "lightgreen" }}
                              aria-hidden="true"
                            />
                          ) : (
                            <i
                              className="fas fa-2x fa-clock is-medium"
                              style={{ color: "gray" }}
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </div>
                      <div className="media-content">
                        <div className="content">
                          <Linkify
                            decoraction="subtitle"
                            text={neces.comment}
                            length={80}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {dataMe.id === id && (
                    <DropdownIcon i={i}>
                      <div className="dropdown-menu" role="menu">
                        <div className="dropdown-content">
                          <a
                            className="dropdown-item"
                            onClick={() => handleAskUpdateNecessity(neces.id)}
                          >
                            Editar
                          </a>
                          <a
                            className="dropdown-item"
                            onClick={() => handleAskDeleteNecessity(neces.id)}
                          >
                            Eliminar
                          </a>
                        </div>
                      </div>
                    </DropdownIcon>
                  )}
                </header>
              </div>
            </div>
          ))}

          {state.hasMoreItems && (
            <div className="buttons has-addons is-centered">
              <button
                type="button"
                className="button is-block is-primary is-large"
                onClick={handleLoadMore}
              >
                Ver más
              </button>
            </div>
          )}
        </>
      ) : (
        <h2
          className="subtitle is-3"
          style={{ textAlign: "center", padding: 20 }}
        >
          No se ha encontrado información.
        </h2>
      )}
    </div>
  );
};

export default compose(
  graphql(necessityQuery, {
    options: ({ id }) => ({
      variables: { userId: id },
      fetchPolicy: "cache-and-network"
    }),
    props: ({ data }) => ({
      loadingNecessity: data.loading,
      dataNecessity: data.necessity,
      fetchNecessity: data.fetchMore
    })
  }),
  graphql(meQuery, {
    props: ({ data }) => ({
      loadingMe: data.loading,
      dataMe: data.me
    })
  }),
  graphql(necessityMutation, { name: "NECESSITY_MUTATION" }),
  withFormik({
    mapPropsToValues: () => ({ finished: false, comment: "" }),
    handleSubmit: async (
      values,
      { props: { id, NECESSITY_MUTATION }, setErrors, setSubmitting, resetForm }
    ) => {
      const { data } = await NECESSITY_MUTATION({
        variables: values,
        refetchQueries: [{ query: necessityQuery, variables: { userId: id } }]
      });

      // if necessity has data, it has the errors
      if (data.necessity && data.necessity.length) {
        setSubmitting(false);
        setErrors(normalizeErrors(data.necessity));
        const node = document.querySelector(
          `[name="${data.necessity[0].path}"]`
        );
        scrollIntoView(node);
      } else {
        setSubmitting(false);
        resetForm();
      }
    }
  })
)(memo(index));
