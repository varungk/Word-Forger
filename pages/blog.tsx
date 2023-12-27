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

const Blog = () => {
    const { user, getBlogData,getBlogTypes,getData,createBlogHistory,getBlogHistory } = useAuth();
    const [blogType, setBlogType] = useState<string[]>([]);
    const [finalResult,setfinalResult] = useState<any>();
    const [loading,setLoading] = useState(false)
    const [historyData,setHistoryData] = useState<any>()
    const [historyTabClicked,setHistoryTabClicked] = useState(true)
    const [noOfgetBlog,setNoOfgetBlog] = useState(true)
    const [selectedBlogType, setSelectedBlogType] = useState<string>('');
    const [formData, setFormData] = useState<Array<{ [key: string]: string[] | string }>>([]);
    const [commonData, setCommonData] = useState<Array<{ [key: string]: string[] | string }>>([]);

    useEffect(() => {
        if (!user) return;
        
        if(noOfgetBlog){
            getBlogTypes().then((result: string[]) => {
                setBlogType(result);
                setNoOfgetBlog(false)
            });
        }
        if(finalResult != null){
            setLoading(false)
        }
        if(historyTabClicked){
            setHistoryTabClicked(false)
            console.log("history tab clicked")
            getBlogHistory(user.uid).then((result: any) => {
                if(result){
                    setHistoryData(result.history);
                }
            });
        }
    }, [getBlogTypes,noOfgetBlog, user,setLoading,finalResult,getBlogHistory,historyData,historyTabClicked]);

    useEffect(() => {
        if (!selectedBlogType) return;

        getBlogData(selectedBlogType).then((result: any) => {
            setFormData(result);
        });
        console.log("gerr")
        getData().then((result: any) => {
            setCommonData(result);
        });
    }, [getBlogData, selectedBlogType,getData]);

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

    const handleBlogTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setSelectedBlogType(e.target.value);
    };

    const displayHistory = (data:string) =>{
        setfinalResult(data)
    }

    const onSubmit = async (values: any) => {
        console.log("Button clicked")
        setLoading(true)
        setHistoryTabClicked(true)
        let prompt = `Act as Professional Blog Writer, and give me the blog for the following context:\nType:${selectedBlogType}`;
        for(var i in values){
            const j = "\n"+i+":"+values[i]
            prompt = prompt.concat(j);
        }
        var temp = {"role": "user","content":prompt}
        var messages = [temp]
        var data = await apicall(messages)
        console.log(data.result)
        if(data.result){
            const hisData = {
                "input":values,
                "response":data.result,
            }
            createBlogHistory(hisData,user.uid)
            setfinalResult(data.result)
        }
        console.log(finalResult)
        
    };

    const apicall = async(messages:any)=>{
        try {
            const response = await fetch('/api/openApi', {
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
                <div className='flex lg:flex-row md:flex-col flex-col'>
                    <div className='lg:w-2/5 md:w-full w-full bg-gray-300 p-5 pt-10 lg:max-h-[940px] lg:min-h-[940px] md:h-auto h-auto overflow-auto whitespace-normal'>
                        <Tabs variant={"light"} aria-label="Tabs variants">
                            <Tab title="Input">
                                <Formik initialValues={initialValues} validationSchema={Yup.object(validationSchema)} onSubmit={onSubmit} enableReinitialize>
                                    {(formikProps) => (
                                        <Form>
                                            <div className=' '>
                                                {/* Select component for email type */}
                                                <Select
                                                    name="blogType"
                                                    label="Blog Type"
                                                    className='w-[95%] pb-3 z-0'
                                                    onChange={handleBlogTypeChange}
                                                    value={selectedBlogType}
                                                >
                                                    {blogType.map((option) => (
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
                                                        {selectedBlogType ? (
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
                                    {historyData ? (
                                    <div className='grid grid-cols-1 gap-3'>
                                        {historyData.map((result:any, index:number) => (
                                        <div key={index}>
                                            <button onClick={() => displayHistory(result.response)} className='max-w-[95%] min-w-[95%] h-10 text-left border rounded-md p-4 pb-10 bg-gray-300 hover:bg-gray-400 overflow-hidden whitespace-nowrap truncate'>
                                            {result.input.Title}
                                            </button> 
                                        </div>
                                        ))}
                                    </div>
                                    ) : (
                                    <div>No history to show</div>
                                    )}
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                    <div className='lg:w-3/5 md:w-full w-full p-3 lg:max-h-[520px] md:h-auto h-auto overflow-auto whitespace-normal'>
                        {finalResult 
                        ?(<div dangerouslySetInnerHTML={{ __html: finalResult.replace(/\n/g, '<br />') }} />)
                        :(
                            <div>
                                {loading ? 
                                    (
                                        <div>Wait while we forge your content</div>
                                    )
                                :
                                    (
                                        <div className='md:text-3xl text-lg lg:pt-60 md:py-28 py-20 text-center'>Fill in the fields to start the forge!</div>
                                    )
                                }
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                router.push('/login')
            )}
        </>
    );
};

export default Blog;
