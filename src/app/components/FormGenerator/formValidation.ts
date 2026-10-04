import * as Yup from "yup";
import { VALID_PORTALS } from "../../data/portals";
import { VALID_TEMPLATES } from "../../data/templates";

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
  templateId: Yup.string().oneOf([...VALID_TEMPLATES]).required(),
  portalId: Yup.string().oneOf([...VALID_PORTALS]).required(),
  variants: Yup.boolean(),
});
