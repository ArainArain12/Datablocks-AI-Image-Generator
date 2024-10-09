import { db } from "@/app/utils/firebaseConfig";
import { ref, set, get } from "firebase/database"; // Import get function

export async function addUserToDatabase(uid) {
  try {
    const userRef = ref(db, `users/${uid}`);
    
    // Check if the user already exists
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return; // User already exists, exit the function
    }

    // If the user does not exist, add them to the database
    await set(userRef, {
      tokens: 0,     // Initialize tokens
    });
  } catch (error) {
    console.error("Error adding user: ", error);
  }
}
