import {auth,db} from '../../firebase.js'
import {setDoc, doc, query,serverTimestamp,getDoc,getDocs,addDoc,collection,deleteDoc,onSnapshot, orderBy} from 'firebase/firestore'

//Get barber appointment of a user
export const getBarberIdFromUser = async(userId) => {
    try {
        const q = query(collection(db,'barber'),where('userId','==',userId))
        const querySnapshot = await getDoc(q);
        return querySnapshot
    }catch(err) {
        console.log(err)
    }
}
//Book Appointment from barber
export const bookBarber = async(data) => {
    try {
        const {uid,name,hostel,time} = data;
        await addDoc(collection(db,'barber'),{
            'userId':uid,
            'name':name,
            'hostel':hostel,
            'time':time,
            'timestamp':serverTimestamp()
        })
    }catch(err) {
        console.log(err)
    }
}

//Update barber appointment
export const updateBarberAppointment = async(uid,time) => {
    try {
        //get appointment id
        const appointment = getBarberIdFromUser(uid);
        await setDoc(doc(db,'barber',appointment.id),{
            ...appointment,
            'time':time,
            'timestamp':serverTimestamp()
        },{merge:true})
    }catch(err) {
        console.log(err)
    }
}

//delete barber appointment
export const deleteBarberAppointment = async(uid) => {
    try {
        const appointment = getBarberIdFromUser(uid);
        await deleteDoc(doc(db,'barber',appointment.id))
    }catch(err) {
        console.log(err)
    }
}

//get all realtime appointments
export const getAllAppointment = async() => {
    try {
        let appointments = []
        const unsub = querySnapshot(collection(db,'barber',orderBy('time'),orderBy('timestamp'),(doc)=>appointments.push(doc.data())))
        return {unsub,appointments};
    }catch(err) {
        console.log(err)
    }
}

