import {
  doc,
  setDoc,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import axios from 'axios'

export const getAllFoodItems = async () => {
  try {
    let foodItems = [];
    const items = await getDocs(collection(db, "food"));
    items.forEach((item) => foodItems.push({ id: item.id, ...item.data() }));
    return foodItems;
  } catch (err) {
    console.log(err);
  }
};

export const createOrder = async (data) => {
  try {
    const {id,...rest} = data;
    const res = await axios.post(`https://us-central1-bento-5ad4e.cloudfunctions.net/app/api/order/${id}`, {...rest})
    return res.data;
  } catch (err) {
    throw err
  }
};

export const cancelUserOrder = async (userId, orderId) => {
  try {
    const delete1 = deleteDoc(
      doc(db, `users/${userId}/orders/${orderId}`)
    );
    const delete2 = deleteDoc(doc(db, "todayOrders", orderId));
    await Promise.all([delete1, delete2]);
  } catch (err) {
    throw err;
  }
};


export const updateAvailability = async (id, availability) => {
  try {
    await setDoc(
      doc(db, "food", id),
      {
        availability,
      },
      { merge: true }
    );
  } catch (err) {
    console.log(err);
  }
};

export const pushFoodItem = async (data) => {
  try {
    await addDoc(collection(db, "food"), data);
  } catch (err) {
    console.log(err);
  }
};

export const getUserOrders = async (id) => {
  try {
    const q = query(collection(db, `users/${id}/orders`),orderBy('timestamp','desc'));
    const allUserOrder = await getDocs(q);
    const allOrder = [];
    allUserOrder.forEach((order) =>
      allOrder.push({ orderId: order.id, ...order.data() })
    );
    return allOrder;
  } catch (err) {
    throw err;
  }
};

export const getAllTodayOrders = async () => {
  try {
    const allOrders = await getDocs(collection(db,'todayOrders'));
    let allOrdersData = allOrders.map(order => {
      return {orderId:order.id,...order.data()}
    })
    return allOrdersData;
  } catch (err) {
    console.log(err);
  }
};


