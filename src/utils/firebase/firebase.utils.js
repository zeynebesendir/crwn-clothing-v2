import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

//Data(Yazi),Document(Kagit),Folder (Dosya)
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeVv1JHmuZBxzfROq4DiMCoHyiVgRZgZg",
  authDomain: "crwn-clothing-db-3e10b.firebaseapp.com",
  projectId: "crwn-clothing-db-3e10b",
  storageBucket: "crwn-clothing-db-3e10b.appspot.com",
  messagingSenderId: "345365056149",
  appId: "1:345365056149:web:e6103ccaad3ce2ff59299c"
};

//init the firebase with the config
const firebaseApp = initializeApp(firebaseConfig);

//set up the authentication -first create the provider
//youcan have multiple provider
const provider = new GoogleAuthProvider();

//set up provider settings
//when someone reached, force them to select an account
provider.setCustomParameters({
  prompt: 'select_account',
});

//you will have only one auth
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);


//init firestore to acces DB
export const db = getFirestore();


export const createUserDocumentFromAuth = async (userAuth) => {

  //check If there is a document ref of the user in the db
  const userDocRef = doc(db, 'users', userAuth.uid);//DB, Collection(users), user uid

  //GETDOC = gets the document using the ref
  const userSnapshot = await getDoc(userDocRef);

  //Check if the document exists, if not creare it
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};