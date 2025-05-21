import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikErrors,
  FormikTouched,
} from "formik";
import React from "react";
import styles from "../CardAuth/CardAuth.module.css";
import {registerValidationSchema} from "./registerValidation";
import Link from "next/link";
import RegulaminModal from "../ModalRegulamin/ModalRegulamin";

interface FormValues {
  email: string;
  password: string;
  acceptedTerms: boolean;
}

const RegisterForm = () => {
  const initialValues: FormValues = {
    email: "",
    password: "",
    acceptedTerms: false,
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
      validationSchema={registerValidationSchema}
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

          <label htmlFor="acceptedTerms" className={styles.checkboxLabel}>
            <Field
              type="checkbox"
              name="acceptedTerms"
              id="acceptedTerms"
              className={styles.checkbox}
            />
            <span>
              Akceptuję <RegulaminModal /> i{" "}
              <Link
                href="/polityka-prywatnosci"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                politykę prywatności
              </Link>
            </span>
          </label>
          <div style={{minHeight: "1em"}}>
            <ErrorMessage
              name="acceptedTerms"
              component="div"
              className={styles.errorMessage}
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Zarejestruj
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
