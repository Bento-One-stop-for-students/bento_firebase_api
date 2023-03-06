import { auth, db } from "../../firebase.js";
import {
  setDoc,
  doc,
  query,
  serverTimestamp,
  getDocs,
  where,
  addDoc,
  collection,
  deleteDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";



//Get barber appointment of a user
export const getBarberAppointmentData = async (userId) => {
  try {
    const q = query(collection(db, "barber"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const barberAppointment = [];
    querySnapshot.forEach(doc => barberAppointment.push({'barberId':doc.id,...doc.data()}));
    return barberAppointment[0];
  } catch(err) {
    console.log(err);
  }
};
//Book Appointment from barber
export const bookBarber = async (data) => {
  try {
    const { uid, name, hostel,hair,beard,massage } = data;
    const serviceTime = hair*20 + beard*10 + massage*10

    //else add the appointment
    await addDoc(collection(db, "barber"), {
      userId: uid,
      name: name,
      hostel: hostel,
      hair,
      beard,
      massage,
      serviceTime,
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
    const {barberId} = await getBarberIdFromUser(uid)
    await deleteDoc(doc(db, "barber", barberId));
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


// const cloudFunction = (req)=>{
//   let data = req.data;

//   let allData = firestore.data; 

//   let newEstimated = prev.service + pre.estimated;


// }