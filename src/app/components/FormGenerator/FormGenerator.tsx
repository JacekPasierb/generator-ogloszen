"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import styles from "./FormGenerator.module.css";
import { generateDescriptionSchema } from "./formValidation";
import BtnAuth from "../BtnAuth/BtnAuth";
import { toast } from "react-toastify";
import { useDescription } from "../../context/DescriptionContext";
import { useUser } from "../../hooks/useUser";
import { generateDescription } from "../../services/aiService";
import { getTemplateById, templates } from "../../data/templates";
import { compressImageToDataUrl } from "../../lib/image/compressImage";

const MAX_INPUT = 500;
const OLX_HINT_CHARS = 750;

interface FormValues {
  input: string;
  templateId: string;
  fullVersion: boolean;
  hasImage: boolean;
}

interface FormGeneratorProps {
  onNoCredits?: () => void;
}

const FormGenerator = ({ onNoCredits }: FormGeneratorProps) => {
  const { setResult } = useDescription();
  const { mutate } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageBusy, setImageBusy] = useState(false);

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
        imageDataUrl: imageDataUrl || undefined,
      });
      setResult({
        description: data.description,
        title: data.title,
        short: data.short,
      });
      mutate();
      resetForm();
      setImagePreview(null);
      setImageDataUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
        hasImage: false,
      }}
      validationSchema={generateDescriptionSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, setFieldValue }) => {
        const activeTemplate = getTemplateById(values.templateId);

        const clearImage = () => {
          setImagePreview(null);
          setImageDataUrl(null);
          setFieldValue("hasImage", false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        };

        const onPickFile = async (file: File | null) => {
          if (!file) return;
          setImageBusy(true);
          try {
            const dataUrl = await compressImageToDataUrl(file);
            setImageDataUrl(dataUrl);
            setImagePreview(dataUrl);
            setFieldValue("hasImage", true);
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : "Nie udało się wczytać zdjęcia";
            toast.error(message);
            clearImage();
          } finally {
            setImageBusy(false);
          }
        };

        return (
          <Form className={styles.form}>
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <label className={styles.label} id="template-label">
                  Szablon branży
                </label>
                {activeTemplate.hint && (
                  <p className={styles.hint}>{activeTemplate.hint}</p>
                )}
              </div>

              <div
                className={styles.chipRow}
                role="radiogroup"
                aria-labelledby="template-label"
              >
                {templates.map((t) => {
                  const selected = values.templateId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`${styles.chip} ${
                        selected ? styles.chipActive : ""
                      }`}
                      onClick={() => setFieldValue("templateId", t.id)}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
              <Field type="hidden" name="templateId" />
              <Field type="hidden" name="hasImage" />
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <span className={styles.label}>Zdjęcie produktu</span>
                <p className={styles.hint}>
                  Opcjonalnie — AI rozpozna przedmiot na fotce. Możesz też dodać
                  słowa kluczowe poniżej.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={styles.fileInput}
                onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
              />

              {imagePreview ? (
                <div className={styles.imagePreview}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Podgląd zdjęcia produktu"
                    className={styles.imageThumb}
                  />
                  <div className={styles.imageMeta}>
                    <p className={styles.imageStatus}>
                      {imageBusy ? "Przetwarzanie…" : "Zdjęcie gotowe"}
                    </p>
                    <p className={styles.imageHint}>
                      Sprawdź i uzupełnij cechy w polu poniżej przed publikacją.
                    </p>
                    <button
                      type="button"
                      className={styles.imageRemove}
                      onClick={clearImage}
                      disabled={imageBusy || isSubmitting}
                    >
                      Usuń zdjęcie
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.uploadZone}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageBusy || isSubmitting}
                >
                  <span className={styles.uploadTitle}>
                    {imageBusy ? "Kompresuję zdjęcie…" : "Dodaj zdjęcie"}
                  </span>
                  <span className={styles.uploadSub}>
                    JPG, PNG lub WebP · max 8 MB · 1 kredyt
                  </span>
                </button>
              )}
            </div>

            <div className={styles.section}>
              <label className={styles.label} htmlFor="generator-input">
                {values.hasImage
                  ? "Dodatkowe słowa kluczowe (opcjonalnie)"
                  : "Słowa kluczowe i cechy oferty"}
              </label>

              <div className={styles.composer}>
                <Field
                  as="textarea"
                  id="generator-input"
                  name="input"
                  placeholder={
                    values.hasImage
                      ? "np. cena 1200 zł, Warszawa, faktura VAT…"
                      : "np. iPhone 13, 128 GB, bateria 89%, pudełko, faktura VAT, Warszawa…"
                  }
                  aria-label="Pole do wpisania słów kluczowych ogłoszenia"
                  rows={6}
                  maxLength={MAX_INPUT}
                  className={styles.textarea}
                />

                <div className={styles.composerFooter}>
                  <p className={styles.olxHint}>
                    Idealny opis pod OLX / Marketplace · do ~{OLX_HINT_CHARS}{" "}
                    znaków
                  </p>
                  <p
                    className={styles.charCounter}
                    data-near={
                      values.input.length > MAX_INPUT * 0.9 ? "true" : "false"
                    }
                  >
                    {values.input.length}/{MAX_INPUT}
                  </p>
                </div>
              </div>

              <div className={styles.errorContainer}>
                <ErrorMessage
                  name="input"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
            </div>

            <label className={styles.optionRow}>
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>Pełny pakiet treści</span>
                <span className={styles.optionDesc}>
                  Tytuł + wersja krótka i długa · 1 kredyt
                </span>
              </span>
              <span className={styles.switch}>
                <Field
                  type="checkbox"
                  name="fullVersion"
                  className={styles.switchInput}
                />
                <span className={styles.switchTrack} aria-hidden />
              </span>
            </label>

            <div className={styles.submitRow}>
              <BtnAuth isSubmitting={isSubmitting || imageBusy}>
                {values.hasImage ? "Generuj ze zdjęcia" : "Generuj opis"}
              </BtnAuth>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormGenerator;
