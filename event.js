import {db} from '../firebase.js'
import {setDoc, doc, serverTimestamp, getDocs,collection,getDoc, query, where} from 'firebase/firestore'

//get all events
export const getAllEvents = async() => {
    try {
        let events = [];
        const eventsData = await getDocs(collection(db,'events'));
        eventsData.forEach(event => eventsData.push(event.data()));
        return events;
    }catch(err) {
        console.log(err)
    }
}