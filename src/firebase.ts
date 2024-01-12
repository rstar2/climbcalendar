// Import the functionalities you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  Firestore,
  CollectionReference,
  Query,
  QuerySnapshot,
  Unsubscribe,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  signInWithCredential,
  Auth,
  User,
  NextOrObserver,
  GoogleAuthProvider,
} from "firebase/auth";

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
};

class Firebase {
  private readonly auth: Auth;
  private readonly db: Firestore;

  private readonly authGoogleProvider: GoogleAuthProvider;

  constructor(firebaseConfig: FirebaseConfig) {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    this.auth = getAuth(app);
    this.db = getFirestore(app);

    this.authGoogleProvider = new GoogleAuthProvider();
    this.authGoogleProvider.addScope(
      "https://www.googleapis.com/auth/calendar"
    );
  }

  // ---------- Auth ------------

  onAuthStateChanged(onNext: NextOrObserver<User>): Unsubscribe {
    return onAuthStateChanged(this.auth, onNext);
  }

  async signInWithGoogle(): Promise<void> {
    // just try to sign-in - no matter the result is Promise<UserCredential>
    return signInWithPopup(this.auth, this.authGoogleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)!;
        const accessToken = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        console.log(
          `Logged user: ${JSON.stringify(user)} , token: ${accessToken}`
        );

        fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
          method: "GET",
          headers: {
            "Authorization" : `Bearer ${accessToken}`
          }
        })
          .then((response) => response.json())
          .then((data) => console.log("???", data))
          .catch((error) => console.error(error));
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...

        throw error;
      });
  }

  async signOut(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser(): User | undefined {
    return this.auth.currentUser ?? undefined;
  }

  setGoogleCredential(idToken: string, accessToken?: string): void {
    const credential = GoogleAuthProvider.credential(idToken, accessToken);
    signInWithCredential(this.auth, credential)
  }

  // ---------- Firestore ------------

  collection(nameCol: string): CollectionReference {
    return collection(this.db, nameCol);
  }

  async getDocs(query: Query): Promise<QuerySnapshot> {
    return getDocs(query);
  }

  onSnapshot(
    query: Query,
    onNext: (snapshot: QuerySnapshot) => void
  ): Unsubscribe {
    return onSnapshot(query, onNext);
  }
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID!,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID!,
  appId: import.meta.env.VITE_FIREBASE_APP_ID!,
};

// create instance of the firebase service
export default new Firebase(firebaseConfig);

// utilities

export type Doc = Readonly<{
  id: string;
  [key: string]: unknown;
}>;

/**
 * Parse all users/activities
 */
export const parseDocs = (snapshot: QuerySnapshot): Doc[] => {
  const docs: Doc[] = [];
  snapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });
  return docs;
};
