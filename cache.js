// Firebase config

let firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "stock-fb-api.firebaseapp.com",
  databaseURL: "https://stock-fb-api.firebaseio.com",
  projectId: "stock-fb-api",
  storageBucket: "",
  messagingSenderId: "790333962965",
  appId: "1:790333962965:web:cd6faf706ad6f6f497805c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const collection = "stock-data-cache";

// Get date

function getDate() {
  let date = new Date();
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let year = date.getFullYear();

  return year + "-" + month + "-" + day;
}

// Add/edit data

function setDataToFirebase(data, symbol) {
  db.collection(collection).doc(symbol).set({
    data: data,
    date: getDate()
  })
    .then(function () {
      showStatusCard(addedToCacheCard);
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

// Get data

function getDataFromFirebase(symbol) {
  db.collection(collection).doc(symbol).get().then(function (doc) {
    if (doc.exists) {
      let data = doc.data();
      if (data.date === getDate()) {
        showData(data.data);
        showStatusCard(fromCacheCard);
        showStatusCard(deleteCacheCard);
      }
    } else {
      getAssetDataFromAPI(symbol);
    }
  }).catch(function (error) {
    console.log("Error getting document:", error);
  });
}

// Remove data

function deleteDataFromFirebase(symbol) {
  db.collection(collection).doc(symbol).delete().then(function () {
    console.log("Document successfully deleted!");
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
}