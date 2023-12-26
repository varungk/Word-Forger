import { useAuth } from '@/config/auth';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Input, Select, SelectItem, Tab, Tabs, Textarea } from '@nextui-org/react';
import * as Yup from 'yup';
import DateTimePicker from 'react-datetime-picker';
import router from 'next/router';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import handler from './api/email';
import EmailReq from './api/email';
import  ChatCompletionRequestMessage from 'openai'
import { sendMessage } from '@/config/emailConfig';

// Sample data
const data = [
    { sender: ['Option1', 'Option2'] },
    { recipient: ['Option3', 'Option4', 'Option5'] },
    { reason: '' },
    // Assuming you have a 'date' field in your data
    { date: 1234567890 } // Sample number (timestamp)
];

const Create = () => {
    const { user, getEmailData, getEmailTypes,getData,createEmailHistory } = useAuth();
    const [emailType, setEmailType] = useState<string[]>([]);
    const [finalResult,setfinalResult] = useState<any>();
    const [loading,setLoading] = useState(false)
    const [selectedEmailType, setSelectedEmailType] = useState<string>('');
    const [formData, setFormData] = useState<Array<{ [key: string]: string[] | string }>>([]);
    const [commonData, setCommonData] = useState<Array<{ [key: string]: string[] | string }>>([]);

    useEffect(() => {
        if (!user) return;
        
        getEmailTypes().then((result: string[]) => {
            setEmailType(result);
        });
        if(finalResult != null){
            setLoading(false)
        }
    }, [getEmailTypes, user,setLoading,finalResult]);

    useEffect(() => {
        if (!selectedEmailType) return;

        getEmailData(selectedEmailType).then((result: any) => {
            setFormData(result);
        });
        getData().then((result: any) => {
            setCommonData(result);
        });
    }, [getEmailData, selectedEmailType,getData]);

    const initialValues: any = {};
    const validationSchema: any = {};

    formData.forEach((fieldObj) => {
        const key = Object.keys(fieldObj)[0];
        const value = fieldObj[key];

        initialValues[key] = '';
        validationSchema[key] = Yup.string().required('Field is required');

        if (Array.isArray(value)) {
            // If the value is an array, consider it as a Select field
            validationSchema[key] = Yup.string().required('Please select an option');
        } else if (typeof value === 'number') {
            // If the value is a number, consider it as a Date field
            initialValues[key] = new Date(); // Convert timestamp to milliseconds
        }
    });
    commonData.forEach((fieldObj) => {
        const key:any = Object.keys(fieldObj)[0];
        const value:any = fieldObj[key];

        initialValues[key] = '';
        validationSchema[key] = Yup.string().required('Field is required');

        if (Array.isArray(value)) {
            // If the value is an array, consider it as a Select field
            validationSchema[key] = Yup.string().required('Please select an option');
        } else if (typeof value === 'number') {
            // If the value is a number, consider it as a Date field
            initialValues[key] = new Date(); // Convert timestamp to milliseconds
        }
    });

    const handleEmailTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setSelectedEmailType(e.target.value);
    };

    const onSubmit = async (values: any) => {
        setLoading(true)
        let prompt = `Act as Professional Email Writer, and give me the email message with subject & message for the following context:\nType:${selectedEmailType}`;
        for(var i in values){
            const j = "\n"+i+":"+values[i]
            prompt = prompt.concat(j);
        }
        var temp = {"role": "user","content":prompt}
        var messages = [temp]
        var data = await apicall(messages)
        console.log(data.result)
        const hisData = {
            "input":values,
            "response":data.result,
        }
        createEmailHistory(hisData,user.uid)
        setfinalResult(data.result)
        console.log(finalResult)
        
    };

    const apicall = async(messages:any)=>{
        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages }),
            })
            var data =  await response.json()
            return(data)
            } catch (error) {
            console.log(error)
            }
    }

    return (
        <>
            {user ? (
                <div className='flex items-center'>
                    <div className='w-2/5 bg-gray-300 p-5 pt-10 max-h-[520px] min-h-[520px] overflow-auto whitespace-normal'>
                        <Tabs variant={"light"} aria-label="Tabs variants">
                            <Tab title="Input">
                                <Formik initialValues={initialValues} validationSchema={Yup.object(validationSchema)} onSubmit={onSubmit} enableReinitialize>
                                    {(formikProps) => (
                                        <Form>
                                            <div className=' '>
                                                {/* Select component for email type */}
                                                <Select
                                                    name="emailType"
                                                    label="Email Type"
                                                    className='w-[95%] pb-3 z-0'
                                                    onChange={handleEmailTypeChange}
                                                    value={selectedEmailType}
                                                >
                                                    {emailType.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            {formData.map((fieldObj, index) => {
                                                const key = Object.keys(fieldObj)[0];
                                                const value = fieldObj[key];

                                                if (Array.isArray(value)) {
                                                    return (
                                                        <div key={key} className=''>
                                                            <Select
                                                                name={key}
                                                                label={key}
                                                                className='w-[95%] pb-3 z-0'
                                                                onChange={(e) => formikProps.setFieldValue(key, e.target.value)}
                                                                value={formikProps.values[key]}
                                                            >
                                                                {value.map((option) => (
                                                                    <SelectItem value={option} key={option}>
                                                                        {option}
                                                                    </SelectItem>
                                                                ))}
                                                            </Select>
                                                            <ErrorMessage component='div' name={key} className='text-red-700' />
                                                        </div>
                                                    );
                                                } else if (typeof value === 'number') {
                                                    // For Date field
                                                    return (
                                                        <div key={key} className='p-4 mb-4 bg-gray-100 rounded-lg w-[95%] flex flex-col'>
                                                            <label className='text-gray-600 text-sm pb-2'>{key}</label>
                                                            <DateTimePicker
                                                                onChange={(val) => formikProps.setFieldValue(key, val)}
                                                                value={formikProps.values[key]}
                                                                className={'bg-gray-100 z-50'}
                                                                // minDate={new Date()}
                                                            />
                                                            <ErrorMessage component='div' name={key} className='text-red-700' />
                                                        </div>
                                                    );
                                                }

                                                // For other field types (string, etc.)
                                                return (
                                                    <div key={key} className='pb-4'>
                                                        <Field
                                                            as={Textarea} // Change the field type as needed
                                                            name={key}
                                                            label={key}
                                                            className='w-[95%]'
                                                        />
                                                        <ErrorMessage component='div' name={key} className='text-red-700' />
                                                    </div>
                                                );
                                            })}
                                            <div className='grid grid-cols-2'>
                                                {commonData.map((fieldObj, index) => {
                                                    const key = Object.keys(fieldObj)[0];
                                                    const value = fieldObj[key];

                                                    if (Array.isArray(value)) {
                                                        return (
                                                            <div key={key} className=''>
                                                                <Select
                                                                    name={key}
                                                                    label={key}
                                                                    className='w-[90%] pb-3 z-0'
                                                                    onChange={(e) => formikProps.setFieldValue(key, e.target.value)}
                                                                    value={formikProps.values[key]}
                                                                >
                                                                    {value.map((option) => (
                                                                        <SelectItem value={option} key={option}>
                                                                            {option}
                                                                        </SelectItem>
                                                                    ))}
                                                                </Select>
                                                                <ErrorMessage component='div' name={key} className='text-red-700' />
                                                            </div>
                                                        );
                                                    } else if (typeof value === 'number') {
                                                        // For Date field
                                                        return (
                                                            <div key={key} className='p-4 mb-4 bg-gray-100 rounded-lg w-[90%] flex flex-col'>
                                                                <label className='text-gray-600 text-sm pb-2'>{key}</label>
                                                                <DateTimePicker
                                                                    onChange={(val) => formikProps.setFieldValue(key, val)}
                                                                    value={formikProps.values[key]}
                                                                    className={'bg-gray-100 z-50'}
                                                                    // minDate={new Date()}
                                                                />
                                                                <ErrorMessage component='div' name={key} className='text-red-700' />
                                                            </div>
                                                        );
                                                    }

                                                    // For other field types (string, etc.)
                                                    return (
                                                        <div key={key} className='pb-4'>
                                                            <Field
                                                                as={Textarea} // Change the field type as needed
                                                                name={key}
                                                                label={key}
                                                                className='w-[90%]'
                                                            />
                                                            <ErrorMessage component='div' name={key} className='text-red-700' />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div>
                                                {loading ? (
                                                        <div>
                                                            <Button isLoading className='border-2 border-black text-xl bg-gradient-to-r from-orange-500 to-orange-900 text-white p-2 rounded-xl px-7 text-center'>Forge</Button>
                                                        </div>
                                                    ) : (
                                                    <div>
                                                        {selectedEmailType ? (
                                                            <button type='submit' className='border-2 border-black text-xl bg-gradient-to-r from-orange-500 to-orange-900 text-white p-2 rounded-xl px-7 text-center'>Forge</button>
                                                        ) : (
                                                            <Button isDisabled  className='border-2 border-black text-xl bg-gradient-to-r from-orange-500 to-orange-900 text-white p-2 rounded-xl px-7 text-center'>Forge</Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </Tab>
                            <Tab title="History">
                                <div>
                                    History
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                    <div className='w-3/5 p-3 max-h-[520px] overflow-auto whitespace-normal'>
                        {finalResult &&
                            <div dangerouslySetInnerHTML={{ __html: finalResult.replace(/\n/g, '<br />') }} />
                        }
                    </div>
                </div>
            ) : (
                router.push('/login')
            )}
        </>
    );
};

export default Create;
