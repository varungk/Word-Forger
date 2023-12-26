import * as yup from "yup"

export const createSchema = yup.object({
    lang:yup.string().required("Required"),
    tone:yup.string().required("Required"),
    desc:yup.string().max(200,"Max of 200 characters").required("Required"),
    usecase:yup.string().required("Required"),
    creativity:yup.string().required("Required"),
    variants:yup.string().required("Required"),
})