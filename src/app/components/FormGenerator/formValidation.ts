import * as Yup from "yup";

export const generateDescriptionSchema = Yup.object({
  input: Yup.string()
    .required("Opis jest wymagany")
    .min(10, "Opis musi mieć co najmniej 10 znaków")
    .max(300, "Opis może mieć maksymalnie 300 znaków"),
});
