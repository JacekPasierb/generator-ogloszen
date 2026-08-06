import { ErrorMessage, Field, Form, Formik, useField } from "formik";
import React from "react";
import styles from "../CardAuth/CardAuth.module.css";
import { registerValidationSchema } from "./registerValidation";
import Link from "next/link";
import RegulaminModal from "../ModalRegulamin/ModalRegulamin";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import BtnAuth from "../BtnAuth/BtnAuth";
import { registerUser } from "../../services/authService";

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
    label: string;
    placeholder: string;
    autoComplete: string;
  }> = ({ name, type, label, placeholder, autoComplete }) => {
    const [field, meta] = useField(name);
    const hasError = meta.touched && meta.error;
    const id = `register-${name}`;

    return (
      <div className={styles.inputBox}>
        <label htmlFor={id} className={styles.fieldLabel}>
          {label}
        </label>
        <div className={`${styles.input} ${hasError ? styles.errorInput : ""}`}>
          <Field
            {...field}
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
            className={styles.inputRegister}
            autoComplete={autoComplete}
          />
        </div>
        <div className={styles.errorSlot}>
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
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      await registerUser(values);
      toast.success("Zarejestrowano pomyślnie");
      resetForm();
      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Wystąpił błąd serwera");
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form} autoComplete="off">
          <InputField
            name="email"
            type="email"
            label="Email"
            placeholder="jan@firma.pl"
            autoComplete="email"
          />
          <InputField
            name="password"
            type="password"
            label="Hasło"
            placeholder="Min. 6 znaków"
            autoComplete="new-password"
          />

          <label htmlFor="acceptedTerms" className={styles.checkboxLabel}>
            <Field
              type="checkbox"
              name="acceptedTerms"
              id="acceptedTerms"
              className={styles.checkbox}
            />
            <span className={styles.termsText}>
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
          <div className={styles.errorSlot}>
            <ErrorMessage
              name="acceptedTerms"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <BtnAuth isSubmitting={isSubmitting}>Utwórz konto</BtnAuth>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
