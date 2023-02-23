import { auth, db } from "../../firebase.js";
import {
  setDoc,
  doc,
  query,
  serverTimestamp,
  getDoc,
  getDocs,
  where,
  addDoc,
  collection,
  deleteDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import { useCollectionData,useDocumentData } from "react-firebase-hooks/firestore";

//Get barber appointment of a user
export const getBarberIdFromUser = async (userId) => {
  try {
    const q = query(collection(db, "barber"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const barberAppointment = [];
    querySnapshot.forEach(doc => barberAppointment.push(doc.data()));
    return barberAppointment[0];
  } catch(err) {
    console.log(err);
  }
};
//Book Appointment from barber
export const bookBarber = async (data) => {
  try {
    const { uid, name, hostel } = data;

    //check if the barber appointment already exists
    const result = getBarberIdFromUser(uid);
    if(result) {
      console.log('Appointment already exists')
      return
    }

    //else add the appointment
    await addDoc(collection(db, "barber"), {
      userId: uid,
      name: name,
      hostel: hostel,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.log(err);
  }
};

//Update barber appointment
export const updateBarberAppointment = async (uid, time) => {
  try {
    //get appointment id
    const appointment = getBarberIdFromUser(uid);
    await setDoc(
      doc(db, "barber", appointment.id),
      {
        ...appointment,
        time: time,
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.log(err);
  }
};

//delete barber appointment
export const deleteBarberAppointment = async (uid) => {
  try {
    const appointment = getBarberIdFromUser(uid);
    await deleteDoc(doc(db, "barber", appointment.id));
  } catch (err) {
    console.log(err);
  }
};

//get all realtime appointments
export const getAllAppointment = async () => {
  try {
    let appointments = [];
    const unsub =  onSnapshot(
      collection(db, "barber", orderBy("timestamp"), (doc) =>
        appointments.push(doc.data())
      )
    );
    console.log("data", appointments);
    return appointments;
    // return { unsub, appointments };
  } catch (err) {
    console.log(err);
  }
};
