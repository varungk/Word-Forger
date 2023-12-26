import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/config/auth'
import { useRouter } from 'next/router'
import { signUpSchema } from './schema/signup'

interface signUpTypes{
    name:string,
    email:string,
    pwd1:string,
    pwd2:string,
}


const SignUp = () => {

    const {user,signup,addUsers} = useAuth()
    const router = useRouter()
    
    const initialValues: signUpTypes = {
        name:"",
        email:"",
        pwd1:"",
        pwd2:"",

    }
    const onSubmit = async (values:any) =>{
        try{
            const temp = await signup(values.email,values.pwd1,values.name)
            const tempUser = temp.user
            const data = {
                name:values.name,
                email:values.email,
                photoUrl:'https://firebasestorage.googleapis.com/v0/b/word-forger.appspot.com/o/defaultIcon.jpg?alt=media&token=9419db27-e32c-46e8-833b-d55a116f5bdf',
                dp:'defaultIcon.jpg',
            }
            await addUsers(data,tempUser.uid)
            router.push('/')
        }catch(err){
            console.log(err);
            
        }
    }
  return (
    <>
        <div className='lg:px-[30%] md:px-[25%] md:py-[5%] px-[10%] py-[10%]'>
            <div className='bg-gray-200 lg:px-16 lg:py-10 md:px-10 md:py-10 py-10 px-5'>
                <p className='text-2xl text-center font-bold m-3'>Sign up</p>
                <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={signUpSchema}>
                    <Form>
                        <div className='grid grid-cols-1 gap-4'>
                            <div>
                                <Field type="text" id="name" className='rounded-md h-10 p-3 w-full' placeholder="Name" name="name"/>
                                <ErrorMessage component="div" name="name" className='text-red-700'/>
                            </div>
                            <div>
                                <Field type="email" id="email" className='rounded-md h-10 p-3 w-full' placeholder="Email" name="email"/>
                                <ErrorMessage component="div" name="email" className='text-red-700'/>
                            </div>
                            <div>
                                <Field type="password" id="pwd1" className='rounded-md h-10 p-3 w-full' placeholder="Password" name="pwd1"/>
                                <ErrorMessage component="div" name="pwd1" className='text-red-700'/>
                            </div>
                            <div>
                                <Field type="password" id="pwd2" className='rounded-md h-10 p-3 w-full' placeholder="Confirm password" name="pwd2"/>
                                <ErrorMessage component="div" name="pwd2" className='text-red-700'/>
                            </div>
                            <button type='submit' className='border-2 border-black text-xl bg-green-500 text-white p-2 rounded-xl px-7 text-center'>Create account</button>
                            <p className='md:text-lg text-md text-center pt-2'>Already have an account? <Link className='text-green-500 hover:text-green-700' href={'/login'}>Log in</Link></p>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    </>
  )
}

export default SignUp