import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import React, { useState }

export const addTransaction = async (userId, stockTicker, stockData, orderType) => {
  const userRef = doc(db, "user_test", userId);
  const orderId = Math.random().toString(36).substr(2, 9);
  try{
    await updateDoc(userRef, {
      [`Orders.${orderId}`]: [orderType, stockTicker, stockData]
    })
    console.log(`${orderId} has been successfully processed`)
  } catch (error) {
    console.error(error)
    throw error
  }
};
