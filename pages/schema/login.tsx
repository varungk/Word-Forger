import * as yup from "yup"

export const loginSchema = yup.object({
    email:yup.string().email().required(),
    pwd:yup.string().min(8,"Password must contain min 8 chararcters").required("Password is a required field"),
})
