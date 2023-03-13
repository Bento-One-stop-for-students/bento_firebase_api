import { db } from "../../firebase.js";
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
  getDoc
} from "firebase/firestore";


//Get barber appointment of a user
export const getBarberAppointmentData = async (userId) => {
  try {
    const appointment = await getDoc(doc(db,'barber',userId));
    return {id: appointment.id, ...appointment.data()}
  } catch (err) {
    console.log(err);
  }
};
//Book Appointment from barber
export const bookBarber = async (data) => {
  try {
    const { uid, name, hostel, hair, beard, massage } = data;
    const serviceTime = hair * 20 + beard * 10 + massage * 10;

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
    const appointment = getBarberAppointmentData(uid);
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
export const deleteBarberBooking = async (id) => {
  try {
    await deleteDoc(doc(db, "barber",id));
    return "booking deleted"
  } catch (err) {
    console.log(err);
  }
};

//get all realtime appointments
export const getAllAppointment = async () => {
  try {
    let appointments = [];
    const unsub = onSnapshot(
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


export const cutBarberAppointment = async (tokenNo) => {
  try {
    const q = query(collection(db, "barber"), where("tokenNo", "==", tokenNo));
    const allAppointment = await getDocs(q);
    allAppointment.forEach((appointment) => {
      deleteDoc(doc(db, "barber", appointment.id))
        .then(() => console.log("successfully deleted"))
        .catch((err) => console.log(err));
    });
  } catch (err) {
    console.log(err);
  }
};
