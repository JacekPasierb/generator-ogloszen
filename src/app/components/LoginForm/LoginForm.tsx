import {ErrorMessage, Field, Form, Formik, useField} from "formik";
import React from "react";
import styles from "../CardAuth/CardAuth.module.css";
import {loginValidationSchema} from "./loginValidation";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import BtnAuth from "../BtnAuth/BtnAuth";

interface FormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const initialValues: FormValues = {
    email: "",
    password: "",
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Błąd logowania");

        return;
      }
      toast.success("Zalogowano pomyślnie");
      resetForm();
      router.push("/");
    } catch {
      toast.error("Wystąpił błąd serwera");
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
      onSubmit={handleSubmit}
    >
      {({isSubmitting}) => (
        <Form className={styles.form} autoComplete="off">
          <InputField name="email" type="email" placeholder="Email" />
          <InputField name="password" type="password" placeholder="Hasło" />
          <BtnAuth isSubmitting={isSubmitting}>Zaloguj</BtnAuth>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
