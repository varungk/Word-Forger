import * as yup from "yup"

export const signUpSchema = yup.object({
    name:yup.string().required("Name is a required field"),
    email:yup.string().email().required("Email is a required field"),
    pwd1:yup.string().min(8,"Password must contain min 8 chararcters").required("Password is a required field"),
    pwd2:yup.string().oneOf([yup.ref('pwd1'), undefined], "Passwords don't match").required("Please confirm your password"),
})