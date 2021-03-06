import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Link from "next/link";
import scrollIntoView from "smooth-scroll-into-view-if-needed";

import { TextField, RadioField } from "../components/shared/globalField";
import { LoginValidation } from "../utils/validation";
import normalizeErrors from "../utils/normalizeErrors";
import checkLoggedIn from "../lib/checkLoggedIn";
import redirect from "../lib/redirect";
import meQuery from "../graphql/queries/me";

const loginMutation = gql`
  mutation LoginMutation(
    $email: String!
    $password: String!
    $signInAS: TypeSignIn!
  ) {
    login(email: $email, password: $password, signInAS: $signInAS) {
      path
      message
    }
  }
`;

const login = () => {
  const [light, setLight] = useState(true);

  return (
    <div className="container has-text-centered">
      <div className="column is-4 is-offset-4">
        <h3 className="title has-text-grey">Entrar a Te Vi Colombia</h3>
        <div className="box animated bounceInLeft">
          <figure className="avatar">
            <img
              className="logo"
              src={
                light ? "/static/img/lightOn.svg" : "/static/img/lightOff.svg"
              }
              onClick={() => setLight(!light)}
              alt="login"
            />
          </figure>

          <Mutation mutation={loginMutation}>
            {mutate => (
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  signInAS: "Usuario"
                }}
                validationSchema={LoginValidation}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  const { data } = await mutate({
                    variables: {
                      ...values,
                      signInAS:
                        values.signInAS === "Usuario" ? "User" : "Business"
                    },
                    refetchQueries: [{ query: meQuery }]
                  });

                  // if login has data, it has the errors
                  if (data.login && data.login.length) {
                    setSubmitting(false);
                    setErrors(normalizeErrors(data.login));
                    const node = document.querySelector(
                      `[name="${data.login[0].path}"]`
                    );
                    scrollIntoView(node);
                  } else {
                    setSubmitting(false);
                    Router.push("/");
                  }
                }}
                render={({ isSubmitting }) => (
                  <Form method="POST">
                    <style jsx>{`
                      label {
                        text-align: initial;
                      }
                    `}</style>

                    <label className="label title is-5" htmlFor="email">
                      Correo electrónico
                    </label>
                    <TextField
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Correo electrónico"
                      isRequired
                    />

                    <label className="label title is-5" htmlFor="password">
                      Contraseña
                    </label>
                    <TextField
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Contraseña"
                      autoComplete="off"
                      isRequired
                    />

                    <label htmlFor="travel" className="label">
                      ¿Entrar como Usuario o Empresa?
                    </label>
                    <RadioField
                      name="signInAS"
                      id="signInAS"
                      arrayRadio={["Usuario", "Empresa"]}
                      isRequired
                    />
		    <br />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`button is-block is-primary is-large is-fullwidth ${
                        isSubmitting ? "is-loading" : ""
                      }`}
                    >
                      Entrar
                    </button>

                    <div style={{ padding: 10 }}>
                      <Link href="/password">
                        <a>¿Ha olvidado la contraseña?</a>
                      </Link>
                    </div>
                  </Form>
                )}
              />
            )}
          </Mutation>
        </div>
      </div>
    </div>
  );
};

login.getInitialProps = async context => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);

  if (loggedInUser.me) {
    redirect(context, "/");
  }

  return {};
};

export default login;
