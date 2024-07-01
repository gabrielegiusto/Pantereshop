import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth"
import { getFirestore, setDoc, doc , collection, query, getDocs, updateDoc, increment, deleteDoc, addDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6ohIJoI8Dxp1x2w1WGefI507NcD52vPo",
  authDomain: "panterebaseball.firebaseapp.com",
  projectId: "panterebaseball",
  storageBucket: "panterebaseball.appspot.com",
  messagingSenderId: "672666353637",
  appId: "1:672666353637:web:71a2ae4ef6ab3197ebb90c",
  measurementId: "G-L1QNDGN797"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

//Funzione utilizzata per il logout dell'utente
export async function handleSignOut(e) {
  e.preventDefault();

  try {
    await signOut(auth);
    window.location.href = "/login";
    
  } catch (error) {
    console.log(error.message);
  }
}



/* 
      SEZIONE MODIFICA GENERALE DB
*/

//utilizzato per aggiungere l'articolo, dalla pagina home al carrello e quindi al database
export function addItemToCart(item, user) { 

  control_presents_item_on_cart(item, user).then((status) => {
    console.log(status, item)

    if(status) {
      //Se l'articolo è presente nel carrello, è presente anche il sommario ed anche il contatore degli articoli.
      //Andiamo solamente a modificare i valori

      updateDoc( doc(db, "Users/" + user.uid + "/cart-items", item.item),  {//Incremento la quantità dell'articolo in questioine
        timesAddedItem: increment(1)
      })

      updateDoc( doc(db, "Users/" + user.uid + "/order-summary", "order-summary"),  {//Incremento il costo totale
        total: increment(item.cost)
      })

      updateDoc( doc(db, "Users/" + user.uid  + "/order-summary", "number-of-item-on-cart"),  {//Incremento il numero degli articoli aggiunti
        items: increment(1)
      })


    } else {
      //L'articolo non è presente nel carrello, effettuo il controllo se l'articolo necessita di taglia o meno, saranno creati articoli differenti nel database in base a questa caratteristica

      if(item.size) {
        setDoc( doc(db, "Users/" + user.uid + "/cart-items", item.item), {
          article: item.item,
          code: item.code,
          brand: item.brand,
          cost: item.cost,
          tag: item.tag,
          img_src: item.img_src,
          size: item.size,
          size_chosen: "",
          size_form: item.size_form,
          timesAddedItem: item.timesAddedItem
        })
    
      } else {
        setDoc( doc(db, "Users/" + user.uid + "/cart-items", item.item), {
          article: item.item,
          code: item.code,
          brand: item.brand,
          cost: item.cost,
          tag: item.tag,
          img_src: item.img_src,
          size: item.size,
          timesAddedItem: item.timesAddedItem
        })
      }


      updateDoc( doc(db, "Users/" + user.uid + "/order-summary", "order-summary"),  {
        total: increment(item.cost)
      })

      updateDoc( doc(db, "Users/" + user.uid  + "/order-summary", "number-of-item-on-cart"),  {
        items: increment(1)
      })
    }
  })
}




//Cancella definitivamente l'articolo dal database
export function removeItemToCart(item, user) { 
  updateDoc( doc(db, "Users/" + user + "/order-summary", "order-summary"),  {
    total: increment(-item.cost)
  })

  updateDoc( doc(db, "Users/" + user  + "/order-summary", "number-of-item-on-cart"),  {
    items: increment(-1)
  })
  
  deleteDoc( doc(db, "Users/" + user + "/cart-items", item.article))
}

//Cancela definitivamente un articolo dal database, non sarà piu visibile da nessun utente
export function removeItemDB(item) { 
  deleteDoc( doc(db, "Items",  item.item))
}

//Azzera il documento  di riepilogo costi 
export function allToZero(user) { 
  setDoc( doc(db, "Users/" + user.uid + "/order-summary", "order-summary"),  {
    total: 0
  })

  setDoc( doc(db, "Users/" + user.uid  + "/order-summary", "number-of-item-on-cart"),  {
    items: 0
  })
}

//Funzione utilizzata al momento dell'invio dell'ordine; crea un documento negli ordini effettuati per poter essere visionato dall'admin, 
//cancella gli articoli dal carrello dell'utente e azzera il totale del carrello
export  function sendOrder(user, total) {
  const date = new Date()
  let thanks_quote = document.querySelector(".thanks")
  let cart_item_viewer = document.querySelector("#cartItemViewer")
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  getCartItem().then((items) => {
    let status = true

    items.forEach((item) => {
      if(item.size) {
        if(item.size_chosen == "" && status) {
            status = !status
        }
      }
    })

    if(status == false) {
      window.alert("Seleziona le taglie per tutti gli articoli")
    } else {

      cart_item_viewer.style.display = "none"
      thanks_quote.style.display = "block"

      setTimeout(function() {

        addDoc( collection(db, "Orders"), {
          user: user.displayName,
          day: day,
          month: month,
          year: year,
          items_ordered: items,
          order_status: "PROCESSING",
          total: total
        })

        items.forEach((item) => {
          deleteDoc( doc(db, "Users/" + user.uid + "/cart-items", item.article))
        })

        allToZero(user)
  
      }, 5000)
    }
  })
}





/* 
      SEZIONE FUNZIONI ARTICOLI HOMEPAGE
*/

//Utilizzata per aggiornare la quantità dell'articolo in questione e il totale che sarà cambiato a causa dell'aggiunta di un articolo
export function update_item(item, user_uid, times, cost) { 
  updateDoc( doc(db, "Users/" + user_uid + "/cart-items", item.article), {
    timesAddedItem: increment(times)
  })

  updateDoc( doc(db, "Users/" + user_uid + "/order-summary", "order-summary"),  {
    total: increment(cost)
  })

  updateDoc( doc(db, "Users/" + user_uid  + "/order-summary", "number-of-item-on-cart"),  {
    items: increment(times)
  })
}

//Controlla la presenza del sommario
export async function control_summary_order(user) {
  const q = query( doc(db, "Users/" + user.uid + "/order-summary", "order-summary"))
  const querySnapshot = await getDocs(q);

  return querySnapshot.empty
}


//Controlla la presenza di un articolo nel carrello
async function control_presents_item_on_cart(item, user) {
  const q = query( doc(db, "Users/" + user.uid + "/cart-items" , item.item))
  const querySnapshot = await getDoc(q);

  return querySnapshot.exists()
}




/* 
      SEZIONE FUNZIONI ARTICOLI CARRELLO
*/

//Mi ritorna tutti gli articoli prensenti nel carrello dell'utente
async function getCartItem() {
  let items = []
  const cart_items = query(collection(db, "Users/" + auth.currentUser.uid  + "/cart-items"))
  const querySnapshotCart = await getDocs(cart_items);

  querySnapshotCart.forEach((doc) => {
    items.push(doc.data())
  });

  return items
}

//Mi ritorna la quantità degli articoli presenti nel carrello
export async function getNumberOfItem(user_ID) {
  const numberOfItems = query( doc(db, "Users/" + user_ID  + "/order-summary", "number-of-item-on-cart"))
  const querySnapshotCart = await getDoc(numberOfItems);

  return querySnapshotCart.data().items
}

//Aggiorna la taglia da noi scelta per l'articolo selezionato
export function update_size_item(item, user_uid, size_chosen) {  
  updateDoc( doc(db, "Users/" + user_uid + "/cart-items", item.article), {
    size_chosen: size_chosen
  })
}

export async function getItem() {
  const q = query(collection(db, "Items"))
  const querySnapshot = await getDocs(q);
  let items = []

  querySnapshot.forEach((doc) => {
    items.push(doc.data())
  });

  return items
}




/* 
      SEZIONE FUNZIONI GENERALI ADMIN PAGE
*/


export function createItem(article, code, brand, cost, tags, fileName, size, size_form) {
  getDownloadURL(ref(storage, 'images/' + fileName))
  .then((url) => {
    
    setDoc(doc(db, "Items", article), {
      item: article,
      code: code,
      brand: brand,
      cost: cost,
      tag: tags,
      img_src: url,
      size: size,
      size_form: size_form
      
    })
  })
  .catch((error) => {
    console.log(error)
  });
}

export function deleteOrder(orderID) {
  deleteDoc( doc(db, "Orders/" + orderID))


}


//
export function updateItemFromModify(article, brand, cost, code, fileName) {
  if(fileName == undefined) {
    updateDoc( doc(db, "Items", article), {
      brand: brand,
      cost: cost,
      code: code
    })
  } else {
    getDownloadURL(ref(storage, 'images/' + fileName)).then((url) => {
      console.log("sono qui")
      
      updateDoc( doc(db, "Items", article), {
        brand: brand,
        cost: cost,
        code: code,
        img_src: url
      })
    })
    .catch((error) => {
      console.log(error)
    });
  }
}


//
export function updateOrderStatus(orderID, newStatus) {
  updateDoc(doc(db, "Orders", orderID), {
    order_status: newStatus
  })
}


//Crea il riferimento per l'immagine
export function createRef(fileName, blob) {
  const imgRef = ref(storage, 'images/' + fileName)

  console.log(fileName, blob)

  uploadBytes(imgRef, blob).then((snapshot) => {
    console.log(snapshot)
  })
}



export { app, auth, db };
