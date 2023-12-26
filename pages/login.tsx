import React, { useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import Link from 'next/link'
import { loginSchema } from './schema/login'
import { useAuth } from '@/config/auth'
import { useRouter } from 'next/router'

interface loginFormType{
    email:string,
    pwd:string
}

const Login = () => {

    const {user,login} = useAuth()
    const [valid, setValid] = useState(true);
    const [msg,setMsg] = useState("")

    const router = useRouter()

    const printValidity = () => {
        setValid(false)
        setMsg("Invalid email/password")
    }

    const initialValues: loginFormType = {
        email:"",
        pwd:""
    }
    const onSubmit = async (values:any) => {
        setValid(true)
        try{
            await login(values.email,values.pwd)
            router.push('/')
        }catch(err:any){
            console.log(err.message)
            if(err.message == "Firebase: Error (auth/invalid-credential)."){
                printValidity()
            }
            else{
                setMsg(err.message)
            }
        }
    }

  return (
    <>
        <div className='bg-white lg:px-[30%] md:px-[20%] md:py-[5%] px-[10%] py-[10%]'>
            <div className='bg-gray-200 lg:px-16 lg:py-20 md:px-10 md:py-20 py-10 px-5'>
                <p className='text-xl font-bold pb-4'>Welcome back</p>
                <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={loginSchema}>
                    <Form>
                        <div className='grid grid-cols-1 gap-5'>
                            <div>
                                {valid ? null :(
                                    <div className='text-red-700 py-2 font-bold'>{msg}</div>
                                )}
                                <label>Email address</label><br/>
                                <Field type="email" name="email" id="email"className='rounded-md h-10 mt-2 p-3 w-full'/>
                                <ErrorMessage component="div" name="email" className='text-red-700'/>
                            </div>
                            <div>
                                <label>Password:</label><br/>
                                <Field type="password" name="pwd" id="pwd"className='rounded-md mt-2 h-10 p-3 w-full'/>
                                <ErrorMessage component="div" name="pwd" className='text-red-700'/>
                            </div>
                            <button type='submit' className='border-2 border-black text-xl bg-green-500 text-white p-2 rounded-xl px-7 text-center'>Login</button>
                            <p className='md:text-xl text-md text-center pt-2'>Don`t have an account?<Link className='text-green-500 hover:text-green-700' href={'/signup'}> Sign up</Link></p>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    </>
  )
}

export default Login