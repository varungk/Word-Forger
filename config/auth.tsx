import {createContext, useContext, useEffect, useState} from 'react'
import {createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile} from 'firebase/auth'
import { app, auth } from './firebase'
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';

//context is like a prop that can be used by all component without the need to pass it
const AuthContext = createContext<any>({})
const db = getFirestore(app);
const dbCol = collection(db, "users");

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({children}: {children:React.ReactNode}) => {

    // const [user,setUser] = useState<any>(null)
    const [id,setId] = useState<any>(null)
    const [loading,setLoading] = useState(true)
    const a = getAuth();
    var user =  a.currentUser
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth,(person) => {
            user = a.currentUser
            setLoading(false)
            setId(user?.uid)
            
        })
        return () => unSubscribe()

    })

    const signup = async (email:string, pwd:string,name:string) => {
        const temp = await createUserWithEmailAndPassword(auth,email,pwd)
        console.log("Inside signup");
        
        if(user){
            updateProfile(user, {
                displayName: name,
                photoURL:"https://firebasestorage.googleapis.com/v0/b/word-forger.appspot.com/o/defaultIcon.jpg?alt=media&token=9419db27-e32c-46e8-833b-d55a116f5bdf",
            })
        }
        return temp
    }

    const login = (email:string, pwd:string) => {
        return signInWithEmailAndPassword(auth,email,pwd)
    }

    const addUsers =  (userData:any,userId:any) => {
        const dbRef = doc(db, "users", userId );
        return setDoc(dbRef,userData)
    }

    const logout = async () => {
        await signOut(auth)
        console.log("current user after signout : ",user);
    }

    const editUser = async (userData:any,userId:any,authUserData:any,) => {
        const dbRef = doc(db, "users", userId );
        await updateDoc(dbRef, userData);
        if(user){
            updateProfile(user, authUserData)
        }
        
    }

    const getUserData = async (userId:any,) => {
        const docRef = doc(db, "users", userId);
        try {
            const docSnap = await getDoc(docRef);
            const data =  docSnap.data();
            return data
        } catch(error) {
            console.log(error)
        }
    }

    const getUseCaseData = async () => {
        const useCaseCol = collection(db, "useCaseCards");
        const docsSnap = await getDocs(useCaseCol);
        let data: any[] = []
        docsSnap.forEach(doc => {
            data.push(doc.data());
        })
        return data
        
    }

    const getData = async () => {
        const docRef = doc(db, "create", "common");
        try {
            const docSnap = await getDoc(docRef);
            
            const data =  docSnap.data();
            let dataArr: any[] = []
            for(var key in data){
                let obj:any = {}
                obj[key] = data[key];
                dataArr.push(obj)
            }
            console.log(dataArr)
            return dataArr
        } catch(error) {
            console.log(error)
        }
        
    }

    const getEmailData = async (emailType:any,) => {
        const docRef = doc(db, "email writer", emailType);
        try {
            const docSnap = await getDoc(docRef);
            
            const data =  docSnap.data();
            let dataArr: any[] = []
            for(var key in data){
                let obj:any = {}
                obj[key] = data[key];
                dataArr.push(obj)
            }
            console.log(dataArr)
            return dataArr
        } catch(error) {
            console.log(error)
        }
    }

    const getEmailTypes = async() => {
        let ids:any[] = []
        const querySnapshot = await getDocs(collection(db, "email writer"));
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        ids.push(doc.id)
        });
        return ids
    }

    const createEmailHistory = async(data:any,userId:any) => {
        const dbRef = doc(db, "email history", userId );
        const docSnap = await getDoc(dbRef)
        if(docSnap.exists()){
            const prevHistory = docSnap.data()?.history || []
            const updatedHistory = [...prevHistory,data]
            return updateDoc(dbRef,{history:updatedHistory})
        }
        else{
            return setDoc(dbRef,{
                history:arrayUnion(data)
            })
        }
    }

    const getEmailHistory = async (userId:any) => {
        const dbRef = doc(db, "email history", userId );
        const docSnap = await getDoc(dbRef);
        const data =  docSnap.data();
        return data
    }

    const getBlogData = async (Blogtype:any,) => {
        const docRef = doc(db, "blog writer", Blogtype);
        try {
            const docSnap = await getDoc(docRef);
            
            const data =  docSnap.data();
            let dataArr: any[] = []
            for(var key in data){
                let obj:any = {}
                obj[key] = data[key];
                dataArr.push(obj)
            }
            console.log(dataArr)
            return dataArr
        } catch(error) {
            console.log(error)
        }
    }

    const getBlogTypes = async() => {
        let ids:any[] = []
        const querySnapshot = await getDocs(collection(db, "blog writer"));
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        ids.push(doc.id)
        });
        return ids
    }

    const createBlogHistory = async(data:any,userId:any) => {
        const dbRef = doc(db, "blog history", userId );
        const docSnap = await getDoc(dbRef)
        if(docSnap.exists()){
            const prevHistory = docSnap.data()?.history || []
            const updatedHistory = [...prevHistory,data]
            return updateDoc(dbRef,{history:updatedHistory})
        }
        else{
            return setDoc(dbRef,{
                history:arrayUnion(data)
            })
        }
    }

    const getBlogHistory = async (userId:any) => {
        const dbRef = doc(db, "blog history", userId );
        const docSnap = await getDoc(dbRef);
        const data =  docSnap.data();
        return data
    }

    const getScriptData = async (ScriptType:any,) => {
        const docRef = doc(db, "script writer", ScriptType);
        try {
            const docSnap = await getDoc(docRef);
            
            const data =  docSnap.data();
            let dataArr: any[] = []
            for(var key in data){
                let obj:any = {}
                obj[key] = data[key];
                dataArr.push(obj)
            }
            console.log(dataArr)
            return dataArr
        } catch(error) {
            console.log(error)
        }
    }

    const getScriptTypes = async() => {
        let ids:any[] = []
        const querySnapshot = await getDocs(collection(db, "script writer"));
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        ids.push(doc.id)
        });
        return ids
    }

    const createScriptHistory = async(data:any,userId:any) => {
        const dbRef = doc(db, "script history", userId );
        const docSnap = await getDoc(dbRef)
        if(docSnap.exists()){
            const prevHistory = docSnap.data()?.history || []
            const updatedHistory = [...prevHistory,data]
            return updateDoc(dbRef,{history:updatedHistory})
        }
        else{
            return setDoc(dbRef,{
                history:arrayUnion(data)
            })
        }
    }

    const getScriptHistory = async (userId:any) => {
        const dbRef = doc(db, "script history", userId );
        const docSnap = await getDoc(dbRef);
        const data =  docSnap.data();
        return data
    }

    return (
        <AuthContext.Provider  value={
            {
                user,login,
                signup,logout,
                addUsers,editUser,
                getUserData,getUseCaseData,
                getData,
                getEmailData,getEmailTypes,createEmailHistory,getEmailHistory,
                getBlogData,getBlogTypes,createBlogHistory,getBlogHistory,
                getScriptData,getScriptTypes,createScriptHistory,getScriptHistory,
            }}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}