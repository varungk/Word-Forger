import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import  editSchema  from '../components/schema/edit'
import { useAuth } from '@/config/auth'
import {Button, Image, Progress, Spinner, Tooltip} from "@nextui-org/react";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import router from 'next/router';

interface editTypes{
    name:string,
}

const storage = getStorage();

const Edit = () => {
    const {user,editUser,getUserData} = useAuth()

    const [imgUpload, setimgUpload] = useState(
        user.photoURL != "https://firebasestorage.googleapis.com/v0/b/word-forger.appspot.com/o/defaultIcon.jpg?alt=media&token=9419db27-e32c-46e8-833b-d55a116f5bdf" ? true : false
    );
    const userData = getUserData(user.uid)
    const [picName,setPicName] = useState<string>("");
    const [userN,setUserN] = useState<string>("")
    const [picChanged,setPicChanged] = useState(false)
    const [prevPicName,setPrevPicName] = useState<string>("");
    const [imgToken,setImgToken] = useState(user.photoURL);
    const [picRef,setPicRef] = useState<any>();
    const [progress, setProgress] = useState(0);
    const [progressBar,setProgressBar] = useState(false);
    const [loading,setLoading] = useState<boolean>(false)
    if(user){
        const initialValues: editTypes = {
            name:"",
        }
        var temp;
        // if(user.photoURL != "https://firebasestorage.googleapis.com/v0/b/word-forger.appspot.com/o/defaultIcon.jpg?alt=media&token=9419db27-e32c-46e8-833b-d55a116f5bdf"){
        //     console.log("if has been called");
        //     temp = true
        // }
        
        if(picChanged == false){
            userData
                .then((e:any) => {
                    setPrevPicName(e.dp)
                    setPicName(e.dp)
                });
        }
        
        const uploadOptionFalse = () => {
            setimgUpload(false);
        }
        const onSubmit = (values:any) =>{
            var tempName = user.displayName
            if(values.name != user.displayName && values.name != ""){
                tempName = values.name
            }
            else{
                tempName = user.displayName
            }
            console.log("finally ",tempName);
            
            const data = {
                "name":tempName,
                "dp":picName,
                "photoUrl":imgToken,
            }
            console.log("bye "+tempName);
            const authData = {
                displayName: tempName,
                photoURL:imgToken,
    
            }
            if(picChanged){
                if (prevPicName != "defaultIcon.jpg"){
                    const prevPicRef = ref(storage,prevPicName)
                    console.log("prev pic ref "+prevPicName+"hello");
                    deleteObject(prevPicRef).then(() => {
                        console.log("previous pic deleted successfully");
                        
                      }).catch((error) => {
                        // Uh-oh, an error occurred!
                      });
                }
                else{
                    console.log("You are trying to delete the prev picture");
                }
            }
            editUser(data,user.uid,authData)
            setLoading(true)
            const myTimeout = setTimeout(() => {
                router.push('/');
                setLoading(false)
              }, 2000);
            
            
        }
        // if(user.photoURL != "https://firebasestorage.googleapis.com/v0/b/word-forger.appspot.com/o/defaultIcon.jpg?alt=media&token=9419db27-e32c-46e8-833b-d55a116f5bdf"){
        //     setimgUpload(true)
        // }
        const uploadImg = (e:any) => {
            const profilePic = ref(storage,e.target.files[0].name);
            setPicRef(profilePic)
            setPicName(e.target.files[0].name)
            setPicChanged(true)
            const file = e.target.files[0]
            const uploadTask = uploadBytesResumable(profilePic, file);
            uploadTask.on('state_changed', 
                (snapshot) => {
                    setProgressBar(true)
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    }
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                }, 
                () => {
                    setProgressBar(false)
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImgToken(downloadURL)
                    });
                }
                );
        }
    
        const cancelUpload = () =>{
            if(picRef != null){
                deleteObject(picRef).then(() => {
                    // File deleted successfully
                  }).catch((error) => {
                    // Uh-oh, an error occurred!
                  });
                  router.push('/')
            }
            else{
                router.push('/')
            }
            
        }
    
        return (
            <>
                <div className='lg:px-[30%] md:px-[25%] md:py-[5%] px-[10%] py-[10%]'>
                    <div className='bg-gray-200 lg:px-16 lg:py-10 md:px-10 md:py-10 py-10 px-5'>
                        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={editSchema}>
                            <Form>
                                <div className='grid grid-cols-1 gap-4'>
                                    <div>
                                        <p className='pb-2'>Name:</p>
                                        <Field type="text" id="name" className='rounded-md h-10 p-3 w-full' placeholder={user.displayName} name="name"/>
                                        <ErrorMessage component="div" name="name" className='text-red-700'/>
                                    </div>
                                    <div className='grid grid-cols-1'>
                                        {imgUpload == true &&
                                            <div className='w-full'>
                                                <Image width={100} height={100} alt="NextUI hero Image" src={user.photoURL}/>
                                                <Tooltip content="Delete Image"><button onClick={uploadOptionFalse} className='text-red-700 font-bold'>X</button></Tooltip>
                                            </div>
                                        }
                                        {imgUpload == false &&
                                            <div>
                                                <p className='pb-2'>Profile Icon:</p>
                                                <input type="file" id="myfile" name="myfile" onChange={uploadImg}/>
                                                {progressBar &&
                                                    <Progress
                                                    isStriped
                                                    aria-label="Loading..."
                                                    size="md"
                                                    value={progress}
                                                    showValueLabel={true}
                                                    className="max-w-md"
                                                    />
                                                }
                                                {imgToken != user.photoURL && 
    
                                                    <Image width={100} className='pt-3' height={100} alt="NextUI hero Image" src={imgToken}/>
                                                }
                                            </div>
                                        }
                                    </div>
                                    {loading ? (
                                    <Button size="lg" color="success" isLoading className='border-2 border-black text-xl text-white p-4 rounded-xl px-7 text-center'>Update account</Button>
                                    ) : (
                                    <Button size="lg"color="success" type='submit' className='border-2 border-black text-xl text-white p-4 rounded-xl px-7 items-center text-center'>Update account</Button>
                                    )}
                                    <button className='border-2 border-black text-xl bg-gray-500 text-white p-2 rounded-xl px-7 text-center' onClick={cancelUpload}>Cancel</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </>
        )
    }
    else{
        router.push('/login')
    }
}

export default Edit