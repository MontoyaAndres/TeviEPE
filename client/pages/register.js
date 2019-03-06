import React from "react";
import { withFormik, Form } from "formik";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import omit from "lodash.omit";
import Link from "next/link";

import {
  TextField,
  SelectField,
  TextFieldAddonsCountry
} from "../components/shared/globalField";
import { RegisterValidation } from "../utils/validation";
import normalizeErrors from "../utils/normalizeErrors";
import checkLoggedIn from "../lib/checkLoggedIn";
import redirect from "../lib/redirect";
import RegisterContainer from "../containers/register";

const registerMutation = gql`
  mutation RegisterMutation(
    $name: String!
    $lastname: String!
    $telephoneCountry: Int!
    $telephone: BigInt!
    $identificationDocumentType: String!
    $identificationDocument: BigInt!
    $email: String!
    $password: String!
  ) {
    register(
      name: $name
      lastname: $lastname
      telephoneCountry: $telephoneCountry
      telephone: $telephone
      identificationDocumentType: $identificationDocumentType
      identificationDocument: $identificationDocument
      email: $email
      password: $password
    ) {
      path
      message
    }
  }
`;

const register = ({ values, handleSubmit, isSubmitting, setFieldValue }) => (
  <RegisterContainer
    registered={values.registered}
    errorRegistered={values.errorRegistered}
    setFieldValue={setFieldValue}
  >
    <Form method="POST" onSubmit={handleSubmit}>
      <TextField type="text" name="name" placeholder="Nombres" isRequired />

      <TextField
        type="text"
        name="lastname"
        placeholder="Apellidos"
        isRequired
      />

      <TextFieldAddonsCountry
        type="number"
        pattern="\d*"
        selectName="telephoneCountry"
        name="telephone"
        placeholder="Teléfono celular/fijo"
        isRequired
      />

      <SelectField
        name="identificationDocumentType"
        arrayPlaceholder={["Tarjeta de identidad", "Cédula de ciudadania"]}
        isRequired
      />

      <TextField
        type="number"
        pattern="\d*"
        name="identificationDocument"
        placeholder="Número de documento"
        isRequired
      />

      <TextField
        type="email"
        name="email"
        placeholder="Correo electrónico"
        isRequired
      />

      <TextField
        type="password"
        name="password"
        placeholder="Contraseña"
        isRequired
      />

      <label className="checkbox" style={{ paddingBottom: "1em" }}>
        <input type="checkbox" required /> He leido los{" "}
        <a href="#">terminos y condiciones</a>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`button is-block is-primary is-large is-fullwidth ${
          isSubmitting ? "is-loading" : ""
        }`}
      >
        Entrar
      </button>

      <label className="checkbox" style={{ padding: "1em" }}>
        <Link href="/register-business" prefetch>
          <a>Registrar nueva cuenta para empresas</a>
        </Link>
      </label>
    </Form>
  </RegisterContainer>
);

register.getInitialProps = async context => {
  const { loggedInUser } = await checkLoggedIn(context.apolloClient);

  if (loggedInUser.me) {
    redirect(context, "/");
  }

  return {};
};

export default compose(
  graphql(registerMutation),
  withFormik({
    mapPropsToValues: () => ({
      name: "",
      lastname: "",
      telephoneCountry: 57,
      telephone: "",
      identificationDocumentType: "Tarjeta de identidad",
      identificationDocument: "",
      email: "",
      password: ""
    }),
    validationSchema: RegisterValidation,
    validateOnBlur: false,
    validateOnChange: false,
    handleSubmit: async (
      values,
      { props: { mutate }, setSubmitting, setErrors, resetForm, setFieldValue }
    ) => {
      const { data } = await mutate({
        variables: omit(
          { ...values, telephoneCountry: Number(values.telephoneCountry) },
          ["registered", "errorRegistered"]
        )
      });

      // if register has data, it has the errors
      if (data.register && data.register.length) {
        setSubmitting(false);
        setFieldValue("registered", false, false);
        setFieldValue("errorRegistered", true, false);
        setErrors(normalizeErrors(data.register));
      } else {
        setSubmitting(false);
        resetForm();
        setFieldValue("registered", true, false);
        setFieldValue("errorRegistered", false, false);
      }

      window.scrollTo({
        top: document.getElementById("registered").offsetTop - 100,
        behavior: "smooth"
      });
    }
  })
)(register);
