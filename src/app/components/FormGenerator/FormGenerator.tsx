import {ErrorMessage, Field, Form, Formik} from "formik";
import React from "react";
import styles from "./FormGenerator.module.css";
import {generateDescriptionSchema} from "./formValidation";

const FormGenerator = () => {
  const maxLength = 300;

  const handleSubmit = () => {};
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
            {/* <ErrorMessage
              name="input"
              component="div"
              className={styles.error}
            /> */}
            <p className={styles.charCounter}>
              {values.input.length}/{maxLength} znaków
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.generateButton}
          >
            {isSubmitting ? "Generowanie..." : "Generuj opis AI"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormGenerator;
