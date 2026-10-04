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
import {
  getTemplateById,
  getTemplatesForPortal,
} from "../../data/templates";
import { getPortalById, portals } from "../../data/portals";
import { compressImageToDataUrl } from "../../lib/image/compressImage";

const MAX_INPUT = 500;
const MAX_IMAGES = 3;

interface FormValues {
  input: string;
  templateId: string;
  portalId: string;
  variants: boolean;
  hasImage: boolean;
}

interface FormGeneratorProps {
  onNoCredits?: () => void;
}

const FormGenerator = ({ onNoCredits }: FormGeneratorProps) => {
  const { setResult } = useDescription();
  const { mutate } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageDataUrls, setImageDataUrls] = useState<string[]>([]);
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
        portalId: values.portalId,
        outputFormat: "full",
        imageDataUrls: imageDataUrls.length ? imageDataUrls : undefined,
        variants: values.variants,
      });
      setResult({
        description: data.description,
        title: data.title,
        short: data.short,
        keywords: data.keywords,
        features: data.features,
        checklist: data.checklist,
        variants: data.variants,
      });
      mutate();
      resetForm();
      setImageDataUrls([]);
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
        portalId: "olx",
        variants: false,
        hasImage: false,
      }}
      validationSchema={generateDescriptionSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, setFieldValue }) => {
        const activePortal = getPortalById(values.portalId);
        const availableTemplates = getTemplatesForPortal(values.portalId);
        const activeTemplate =
          availableTemplates.find((t) => t.id === values.templateId) ??
          availableTemplates[0] ??
          getTemplateById("default");

        const syncHasImage = (urls: string[]) => {
          setFieldValue("hasImage", urls.length > 0);
        };

        const clearImages = () => {
          setImageDataUrls([]);
          syncHasImage([]);
          if (fileInputRef.current) fileInputRef.current.value = "";
        };

        const removeImageAt = (index: number) => {
          setImageDataUrls((prev) => {
            const next = prev.filter((_, i) => i !== index);
            syncHasImage(next);
            return next;
          });
          if (fileInputRef.current) fileInputRef.current.value = "";
        };

        const onPickFiles = async (fileList: FileList | null) => {
          if (!fileList?.length) return;
          const remaining = MAX_IMAGES - imageDataUrls.length;
          if (remaining <= 0) {
            toast.info(`Możesz dodać maksymalnie ${MAX_IMAGES} zdjęcia`);
            return;
          }

          const files = Array.from(fileList).slice(0, remaining);
          setImageBusy(true);
          try {
            const urls: string[] = [];
            for (const file of files) {
              urls.push(await compressImageToDataUrl(file));
            }
            setImageDataUrls((prev) => {
              const next = [...prev, ...urls].slice(0, MAX_IMAGES);
              syncHasImage(next);
              return next;
            });
          } catch (err: unknown) {
            const message =
              err instanceof Error
                ? err.message
                : "Nie udało się wczytać zdjęcia";
            toast.error(message);
          } finally {
            setImageBusy(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        };

        const selectPortal = (portalId: string) => {
          setFieldValue("portalId", portalId);
          const nextTemplates = getTemplatesForPortal(portalId);
          if (!nextTemplates.some((t) => t.id === values.templateId)) {
            setFieldValue("templateId", "default");
          }
        };

        return (
          <Form className={styles.form}>
            <div className={styles.body}>
              <div className={styles.field}>
                <div className={styles.fieldHead}>
                  <label className={styles.label} id="portal-label">
                    Portal
                  </label>
                </div>

                <div
                  className={styles.segment}
                  role="radiogroup"
                  aria-labelledby="portal-label"
                >
                  {portals.map((p) => {
                    const selected = values.portalId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={`${styles.segmentBtn} ${
                          selected ? styles.segmentBtnActive : ""
                        }`}
                        onClick={() => selectPortal(p.id)}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>

                <div className={styles.tipClouds} aria-live="polite">
                  {activePortal.tips.map((tip) => (
                    <span key={tip} className={styles.tipCloud}>
                      {tip}
                    </span>
                  ))}
                </div>
                <Field type="hidden" name="portalId" />
              </div>

              {availableTemplates.length > 1 && (
                <div className={styles.field}>
                  <div className={styles.fieldHead}>
                    <label className={styles.label} id="template-label">
                      Typ oferty
                    </label>
                  </div>

                  <div
                    className={styles.chipRow}
                    role="radiogroup"
                    aria-labelledby="template-label"
                  >
                    {availableTemplates.map((t) => {
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

                  {activeTemplate.hint && (
                    <div className={styles.tipClouds} aria-live="polite">
                      <span className={styles.tipCloud}>
                        {activeTemplate.hint}
                      </span>
                    </div>
                  )}
                  <Field type="hidden" name="templateId" />
                </div>
              )}
              {availableTemplates.length <= 1 && (
                <Field type="hidden" name="templateId" />
              )}
              <Field type="hidden" name="hasImage" />

              <div className={styles.field}>
                <div className={styles.fieldHead}>
                  <span className={styles.label}>Zdjęcia</span>
                  <p className={styles.hint}>
                    Opcjonalnie · do {MAX_IMAGES} szt. · AI wyciągnie cechy
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className={styles.fileInput}
                  onChange={(e) => onPickFiles(e.target.files)}
                />

                {imageDataUrls.length > 0 ? (
                  <div className={styles.imageGrid}>
                    {imageDataUrls.map((url, index) => (
                      <div
                        key={`${index}-${url.slice(0, 24)}`}
                        className={styles.imagePreview}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Podgląd zdjęcia ${index + 1}`}
                          className={styles.imageThumb}
                        />
                        <button
                          type="button"
                          className={styles.imageRemove}
                          onClick={() => removeImageAt(index)}
                          disabled={imageBusy || isSubmitting}
                        >
                          Usuń
                        </button>
                      </div>
                    ))}
                    <div className={styles.imageMeta}>
                      <p className={styles.imageStatus}>
                        {imageBusy
                          ? "Przetwarzanie…"
                          : `${imageDataUrls.length}/${MAX_IMAGES}`}
                      </p>
                      {imageDataUrls.length < MAX_IMAGES && (
                        <button
                          type="button"
                          className={styles.imageRemove}
                          onClick={() => fileInputRef.current?.click()}
                          disabled={imageBusy || isSubmitting}
                        >
                          Dodaj
                        </button>
                      )}
                      <button
                        type="button"
                        className={styles.imageRemove}
                        onClick={clearImages}
                        disabled={imageBusy || isSubmitting}
                      >
                        Wyczyść
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
                    <span className={styles.uploadIcon} aria-hidden>
                      +
                    </span>
                    <span className={styles.uploadCopy}>
                      <span className={styles.uploadTitle}>
                        {imageBusy ? "Kompresuję…" : "Dodaj zdjęcia produktu"}
                      </span>
                      <span className={styles.uploadSub}>
                        JPG, PNG, WebP · max 8 MB
                      </span>
                    </span>
                  </button>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.fieldHead}>
                  <label className={styles.label} htmlFor="generator-input">
                    {values.hasImage
                      ? "Dodatkowe info"
                      : "Treść ogłoszenia"}
                  </label>
                  <p className={styles.hint}>
                    {values.hasImage
                      ? "Opcjonalnie — cena, lokalizacja, stan"
                      : "Kluczowe cechy, cena, lokalizacja"}
                  </p>
                </div>

                <div className={styles.composer}>
                  <Field
                    as="textarea"
                    id="generator-input"
                    name="input"
                    placeholder={
                      values.hasImage
                        ? "np. cena 1200 zł, Warszawa, faktura VAT…"
                        : "np. iPhone 13, 128 GB, bateria 89%, pudełko, Warszawa…"
                    }
                    aria-label="Pole do wpisania słów kluczowych ogłoszenia"
                    rows={5}
                    maxLength={MAX_INPUT}
                    className={styles.textarea}
                  />

                  <div className={styles.composerFooter}>
                    <div className={styles.tipClouds}>
                      <span className={styles.tipCloudMuted}>
                        {activePortal.name}
                      </span>
                      <span className={styles.tipCloudMuted}>
                        Tytuł ≤{activePortal.titleMax}
                      </span>
                    </div>
                    <p
                      className={styles.charCounter}
                      data-near={
                        values.input.length > MAX_INPUT * 0.9
                          ? "true"
                          : "false"
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
                  <span className={styles.optionTitle}>3 warianty opisu</span>
                  <span className={styles.optionDesc}>
                    Porównaj ton · nadal 1 kredyt
                  </span>
                </span>
                <span className={styles.switch}>
                  <Field
                    type="checkbox"
                    name="variants"
                    className={styles.switchInput}
                  />
                  <span className={styles.switchTrack} aria-hidden />
                </span>
              </label>
            </div>

            <div className={styles.footer}>
              <p className={styles.footerHint}>1 kredyt za generację</p>
              <div className={styles.submitRow}>
                <BtnAuth isSubmitting={isSubmitting || imageBusy}>
                  {values.hasImage
                    ? "Generuj ze zdjęcia"
                    : "Generuj ogłoszenie"}
                </BtnAuth>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormGenerator;
