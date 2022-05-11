import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,

  GoogleAuthProvider,

  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,

  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

//Data(Yazi),Document(Kagit),Folder (Dosya)
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs
} from 'firebase/firestore';

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
//you can have multiple provider such as Facebook,Twitter etc
const googleProvider = new GoogleAuthProvider();

//set up provider settings
//when someone reached, force them to select an account
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

//you will have only one auth
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);


//init firestore to acces DB
export const db = getFirestore();

//to add our data automaticly to thr firebase db
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  //batch is used to ensure writing is completed both sides to consider it is a succesfull action
  //ex: bank money transfer example
  const batch = writeBatch(db);
  //create a collection in the db ('categories')
  //use the collection ref to add items 
  const collectionRef = collection(db, collectionKey);

  objectsToAdd.forEach((object) => {
    //create objects in the collection by using the collection ref
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  //await for the batch to finish
  await batch.commit();
  console.log('done');
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');

  //get the object for querying the collection
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);

  //reduce the docs to get category map
  const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, items } = docSnapshot.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, {});

  return categoryMap;
};

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {

  if (!userAuth) return;

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
        ...additionalInformation
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};

/*
We havent use the createUserWithEmailAndPassword directy as firebase could change the method names
User your own function (createAuthUserWithEmailAndPassword) in the app to keep the changes minimal   */
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

//interface layer 
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

//receive a callback and calls it whenever auth changes ex: login,logout
//it listen all the time. dont forget subscribing where you call
export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback)
}