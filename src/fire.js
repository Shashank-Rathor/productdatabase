import firebase from 'firebase';
import 'firebase/storage';
import 'firebase/firestore';


 var firebaseConfig = {
   apiKey: "AIzaSyD4r2KCJOq9w10p2pvecH4GTjOBRMWY73o",
    authDomain: "productmanagement-55fd8.firebaseapp.com",
    databaseURL: "https://productmanagement-55fd8.firebaseio.com",
    projectId: "productmanagement-55fd8",
    storageBucket: "productmanagement-55fd8.appspot.com",
    messagingSenderId: "311858462058",
    appId: "1:311858462058:web:621b9b0f71f6dddd4ab913"
};

const fire = firebase.initializeApp(firebaseConfig);
 const projectStorage = firebase.storage();
 const db = firebase.firestore();

export {fire, projectStorage, db};
