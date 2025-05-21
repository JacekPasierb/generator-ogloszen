import {ErrorMessage, Field, Form, Formik, FormikErrors, FormikTouched} from "formik";
import React from "react";
import styles from "../CardAuth/CardAuth.module.css";
import {loginValidationSchema} from "./loginValidation";

interface FormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  const renderInputField = (
    name: keyof FormValues,
    type: string,
    placeholder: string,
    touched: FormikTouched<FormValues>,
    errors: FormikErrors<FormValues>
  ) => (
    <div className={styles.inputBox}>
      <div
        className={`${styles.input} ${
          touched[name] && errors[name] ? styles.errorInput : ""
        }`}
      >
        <Field
          type={type}
          name={name}
          placeholder={placeholder}
          className={styles.inputRegister}
          autoComplete={
            name === "password"
              ? "current-password"
              : name === "email"
              ? "username"
              : "off"
          }
        />
      </div>
      <div style={{minHeight: "1em"}}>
        <ErrorMessage
          name={name}
          component="div"
          className={styles.errorMessage}
        />
      </div>
    </div>
  );
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
      onSubmit={(values, {setSubmitting}) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({isSubmitting, errors, touched}) => (
        <Form className={styles.form} autoComplete="off">
          {renderInputField("email", "email", "Email", touched, errors)}
          {renderInputField("password", "password", "Hasło", touched, errors)}

          <button type="submit" disabled={isSubmitting}>
            Zaloguj
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
