import {ErrorMessage, Field, Form, Formik, useField} from "formik";
import React from "react";
import styles from "../CardAuth/CardAuth.module.css";
import {registerValidationSchema} from "./registerValidation";
import Link from "next/link";
import RegulaminModal from "../ModalRegulamin/ModalRegulamin";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import BtnAuth from "../BtnAuth/BtnAuth";

interface FormValues {
  email: string;
  password: string;
  acceptedTerms: boolean;
}

const RegisterForm = () => {
  const router = useRouter();
  const initialValues: FormValues = {
    email: "",
    password: "",
    acceptedTerms: false,
  };

  const InputField: React.FC<{
    name: keyof FormValues;
    type: string;
    placeholder: string;
  }> = ({name, type, placeholder}) => {
    const [field, meta] = useField(name);
    const hasError = meta.touched && meta.error;
    return (
      <div className={styles.inputBox}>
        <div className={`${styles.input} ${hasError ? styles.errorInput : ""}`}>
          <Field
            {...field}
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
  };

  const handleSubmit = async (
    values: FormValues,
    {resetForm}: {resetForm: () => void}
  ) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Błąd rejestracji");

        return;
      }
      toast.success("Zarejestrowano pomyślnie");
      resetForm();
      router.push("/login");
    } catch {
      toast.error("Wystąpił błąd serwera");
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerValidationSchema}
      onSubmit={handleSubmit}
    >
      {({isSubmitting}) => (
        <Form className={styles.form} autoComplete="off">
          <InputField name="email" type="email" placeholder="Email" />
          <InputField name="password" type="password" placeholder="Hasło" />

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
          <BtnAuth isSubmitting={isSubmitting}>Zarejestruj</BtnAuth>
   
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
