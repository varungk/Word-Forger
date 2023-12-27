import { useAuth } from '@/config/auth'
import React, { useState } from 'react'
import router from 'next/router';
import { Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { ErrorMessage, Field, Form, Formik, FormikHandlers } from 'formik';
import  createSchema  from '../components/schema/create';

interface createTypes{
    lang:string,
    tone:string,
    desc:string,
    usecase:string,
    creativity:string,
    variants:string,
}

const Create = () => {
    const {user,getData} = useAuth()
    const [data,setData] = useState<any>()
    const [loading,setLoading] = useState(false)
    getData().then((e:any) => {
        setData(e[0]);
        setLoading(true)
    });
    if(user){

        const initialValues: createTypes = {
            lang:"",
            tone:"",
            desc:"",
            usecase:"",
            creativity:"",
            variants:"",
        }
        const onSubmit = (values:any) =>{
            console.log(values);
        }
        if(loading){

            return (
                <>
                    <div className='grid grid-cols-2'>
                        <div className='w-4/5 bg-gray-300 p-5 pt-24'>
                            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={createSchema}>
                                {props => (
                                    <form onSubmit={props.handleSubmit}>  
                                        <div className='grid grid-cols-2 pb-4'>
                                            <div>
                                                <Select onChange={(value) => props.setFieldValue('lang', value.target.value)} value={props.values.lang} name="lang"  label="Select language"  className="w-[90%]">
                                                    {data.language.map((v:string) =>
                                                        <SelectItem value={v} key={v}>{v}</SelectItem>
                                                    )}
                                                </Select>
                                                <ErrorMessage component="div" name="lang" className='text-red-700'/>
                                            </div>
                                            <div>
                                                <Select onChange={(value) => props.setFieldValue('tone', value.target.value)} value={props.values.tone} name="tone" label="Select tone"  className="w-[90%]">
                                                    {data.tone.map((v:string) =>
                                                        <SelectItem value={v} key={v}>{v}</SelectItem>
                                                    )}
                                                </Select>
                                                <ErrorMessage component="div" name="tone" className='text-red-700'/>
                                            </div>
                                        </div>
                                        <div>
                                            <Select onChange={(value) => props.setFieldValue('usecase', value.target.value)} value={props.values.usecase} name="usecase"  label="Choose use case"  className="w-[95%] pb-4">
                                                {data.usecase.map((v:string) =>
                                                    <SelectItem value={v} key={v}>{v}</SelectItem>
                                                )}
                                            </Select>
                                            <ErrorMessage component="div" name="usecase" className='text-red-700'/>
                                        </div>
                                        <div className='pb-4'>
                                            <Textarea onChange={props.handleChange} value={props.values.desc} name="desc" label="Description" className="max-w-md"/>
                                            <ErrorMessage component="div" name="desc" className='text-red-700'/>
                                        </div>
                                        <div className='grid grid-cols-2 pb-4'>
                                            <div>
                                                <Select onChange={(value) => props.setFieldValue('creativity', value.target.value)} value={props.values.creativity} name="creativity"  label="Creativity"  className="w-[90%]">
                                                    {data.Creativity.map((v:string) =>
                                                        <SelectItem value={v} key={v}>{v}</SelectItem>
                                                    )}
                                                </Select>
                                                <ErrorMessage component="div" name="creativity" className='text-red-700'/>
                                            </div>
                                            <div>
                                                <Select onChange={(value) => props.setFieldValue('variants', value.target.value)} value={props.values.variants} name="variants" label="Variants"  className="w-[90%]">
                                                    {data.variants.map((v:string) =>
                                                        <SelectItem value={v} key={v}>{v}</SelectItem>
                                                    )}
                                                </Select>
                                                <ErrorMessage component="div" name="variants" className='text-red-700'/>
                                            </div>
                                        </div>
                                        <br/>
                                        <button type='submit' className='border-2 border-black text-xl bg-gray-500 text-white p-2 rounded-xl px-7 text-center'>Forge</button>
                                    </form>
                                )}
                            </Formik>
                        </div>
                        <div className='w-3/5'>
                        </div>
                    </div>
                </>
            )
        }
    }
    else{
        router.push('/login')
    }
    
}

export default Create