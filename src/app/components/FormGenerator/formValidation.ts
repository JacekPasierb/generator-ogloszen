import * as Yup from "yup";

export const generateDescriptionSchema = Yup.object({
  hasImage: Yup.boolean().default(false),
  input: Yup.string()
    .max(500, "Opis może mieć maksymalnie 500 znaków")
    .when("hasImage", {
      is: true,
      then: (schema) => schema.trim(),
      otherwise: (schema) =>
        schema
          .trim()
          .required("Podaj słowa kluczowe albo dodaj zdjęcie")
          .min(10, "Opis musi mieć co najmniej 10 znaków"),
    }),
  templateId: Yup.string().required(),
  fullVersion: Yup.boolean(),
});
