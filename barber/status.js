import {doc,collection,query, where, getDocs,setDoc} from 'firebase/firestore';
import { db } from "../../firebase.js";

export const updateServiceStatus = async(uid,status,resume) => {
    try {
        const q = query(collection(db,'status'),where('uid','==',uid));
        const allServiceStatus = await getDocs(q);
        allServiceStatus.forEach(service => {
            setDoc(doc(db,'status',service.id), {
                ...service.data(),
                status,
                resume,
            },{merge:true})
        })
    }catch(err) {
        console.log(err)
    }
}

