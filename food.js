import {
  doc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

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

export const pushItems = async (data) => {
  try {
    await addDoc(collection(db, "orderItem"), data);
  } catch (error) {
    console.log(error.message);
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

export const getUserOrder = async (id) => {
  try {
    const q = query(collection(db, "orderItem"), where("userId", "==", id));
    const allUserOrder = await getDocs(q);
    const allOrder = [];
    allUserOrder.forEach((order) =>
      allOrder.push({ orderId: order.id, ...order.data() })
    );
    return allOrder;
  } catch (er) {
    console.log(er);
  }
};

export const getAllOrderItem = async () => {
  try {
    let allOrderItem = [];
    const items = await getDocs(collection(db, "orderItem"));
    items.forEach((item) => {
      allOrderItem.push({ id: item.id, ...item.data() });
    });
    return allOrderItem;
  } catch (err) {
    console.log(err);
  }
};
export const deleteOrderItem = async (docId) => {
  try {
    await deleteDoc(doc(db, "orderItem", docId));
  } catch (error) {
    console.log(error);
  }
};
