import {doc,setDoc} from 'firebase/firestore';
import { db } from "../../firebase.js";

export const updateServiceStatus = async(uid,status) => {
    try {
        await setDoc(doc(db,'status',uid), {
            status
        },{merge:true})
    }catch(err) {
        console.log(err)
    }
}

