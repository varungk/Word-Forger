import * as yup from "yup"

const editSchema = yup.object({
    name:yup.string(),
})

export default editSchema