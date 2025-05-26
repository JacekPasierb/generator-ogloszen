import {ErrorMessage, Field, Form, Formik} from "formik";
import React from "react";
import styles from "./FormGenerator.module.css";
import {generateDescriptionSchema} from "./formValidation";
import BtnAuth from "../BtnAuth/BtnAuth";
import {toast} from "react-toastify";
import {useDescription} from "../../context/DescriptionContext";
import { useUser } from "../../hooks/useUser";

interface FormValues {
  input: string;
}

const FormGenerator = () => {
  const {setDescription} = useDescription();
  const { mutate } = useUser();
  const maxLength = 300;

  const handleSubmit = async (
    values: FormValues,
    {
      setSubmitting,
      resetForm,
    }: {setSubmitting: (v: boolean) => void; resetForm: () => void}
  ) => {
    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({input: values.input}),
      });

      const data = await res.json();
      setDescription(data.description);
      mutate(); 
      resetForm();
    } catch (err) {
      console.error("Błąd generowania opisu:", err);
      toast.error("Błąd generowania opisu - spróbuj za chwilę!")
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={{input: ""}}
      validationSchema={generateDescriptionSchema}
      onSubmit={handleSubmit}
    >
      {({values, isSubmitting}) => (
        <Form className={styles.form}>
          <div className={styles.boxInput}>
            <Field
              as="textarea"
              name="input"
              placeholder="Opisz, co chcesz sprzedać lub zaoferować..."
              rows={5}
              maxLength={maxLength}
              className={styles.textarea}
            />

            <p className={styles.charCounter}>
              {values.input.length}/{maxLength}
            </p>
          </div>
          <div style={{minHeight: "1em", marginBottom: "1rem"}}>
            <ErrorMessage
              name="input"
              component="div"
              className={styles.errorMessage}
            />
          </div>
          <BtnAuth isSubmitting={isSubmitting}>Generuj opis AI</BtnAuth>
        </Form>
      )}
    </Formik>
  );
};

export default FormGenerator;
