import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDFK4Uaszzf15t64l0ysCbgCChcLO3_KqU",
  authDomain: "kanban-11d56.firebaseapp.com",
  databaseURL: "https://kanban-11d56.firebaseio.com",
  projectId: "kanban-11d56",
  storageBucket: "kanban-11d56.appspot.com",
  messagingSenderId: "835524265579"
};

firebase.initializeApp(config);

export const db = firebase.database()