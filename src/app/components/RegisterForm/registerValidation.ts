import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
  email: Yup.string()
    .email("Nieprawidłowy adres email")
    .required("Email jest wymagany"),
  password: Yup.string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .max(15, "Hasło jest zbyt długie")
    .matches(/[A-Z]/, "Hasło musi zawierać co najmniej jedną dużą literę")
    .matches(/\d/, "Hasło musi zawierać co najmniej jedną cyfrę")
    .required("Hasło jest wymagane"),
    acceptedTerms: Yup.boolean()
    .oneOf([true], "Musisz zaakceptować regulamin i politykę prywatności"),
});
