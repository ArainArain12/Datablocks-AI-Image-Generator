// /lib/deductCredit.js

import { db } from "@/app/utils/firebaseConfig";
import { ref, get, update } from "firebase/database";

export async function deductCredit(uid) {
  const userRef = ref(db, `users/${uid}/tokens`);
  const userSnapshot = await get(userRef);

  if (userSnapshot.exists() && userSnapshot.val() > 0) {
    await update(ref(db, `users/${uid}`), {
      tokens: userSnapshot.val() - 10
    });
    return true;
  } else {
    return false;
  }
}
