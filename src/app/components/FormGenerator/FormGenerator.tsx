import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import styles from "./FormGenerator.module.css";
import { generateDescriptionSchema } from "./formValidation";
import BtnAuth from "../BtnAuth/BtnAuth";
import { toast } from "react-toastify";
import { useDescription } from "../../context/DescriptionContext";
import { useUser } from "../../hooks/useUser";
import { generateDescription } from "../../services/aiService";
import { templates } from "../../data/templates";

const MAX_INPUT = 500;
const OLX_HINT_CHARS = 750;

interface FormValues {
  input: string;
  templateId: string;
  fullVersion: boolean;
}

interface FormGeneratorProps {
  onNoCredits?: () => void;
}

const FormGenerator = ({ onNoCredits }: FormGeneratorProps) => {
  const { setResult } = useDescription();
  const { mutate } = useUser();

  const handleSubmit = async (
    values: FormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (v: boolean) => void; resetForm: () => void }
  ) => {
    try {
      const data = await generateDescription({
        input: values.input,
        templateId: values.templateId,
        outputFormat: values.fullVersion ? "full" : "simple",
      });
      setResult({
        description: data.description,
        title: data.title,
        short: data.short,
      });
      mutate();
      resetForm();
    } catch (err: unknown) {
      const error = err as { message?: string };
      const errorMessage =
        error?.message || "Błąd generowania opisu - spróbuj za chwilę!";

      if (
        errorMessage.includes("Brak dostępnych kredytów") ||
        errorMessage.includes("403")
      ) {
        if (onNoCredits) {
          onNoCredits();
        } else {
          toast.error(
            "Brak dostępnych kredytów. Wybierz pakiet, aby kontynuować."
          );
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        input: "",
        templateId: "default",
        fullVersion: false,
      }}
      validationSchema={generateDescriptionSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="template">
              Szablon
            </label>
            <Field as="select" name="templateId" id="template" className={styles.select}>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Field>
          </div>

          <div className={styles.boxInput}>
            <Field
              as="textarea"
              name="input"
              placeholder="Opisz, co chcesz sprzedać lub zaoferować..."
              aria-label="Pole do wpisania opisu ogłoszenia"
              rows={5}
              maxLength={MAX_INPUT}
              className={styles.textarea}
            />
            <p className={styles.charCounter}>
              {values.input.length}/{MAX_INPUT}
            </p>
            <p className={styles.olxHint}>
              Po wygenerowaniu: opis do ~{OLX_HINT_CHARS} znaków idealny pod OLX / Facebook.
            </p>
          </div>
          <div className={styles.errorContainer}>
            <ErrorMessage
              name="input"
              component="div"
              className={styles.errorMessage}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.checkboxLabel}>
              <Field type="checkbox" name="fullVersion" />
              <span>Tytuł + wersja krótka i długa (1 kredyt)</span>
            </label>
          </div>

          <BtnAuth isSubmitting={isSubmitting}>Generuj opis AI</BtnAuth>
        </Form>
      )}
    </Formik>
  );
};

export default FormGenerator;
