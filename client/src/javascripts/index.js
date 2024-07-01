import { removeItemDB } from "../firebase/firebase"

export function cart_view(view) {
    let itemsViewer = document.getElementById('itemViewer')
    let cart_view = document.getElementById('cartItemViewer')

    if(view == "VIEW-CART-ITEMS"){
        itemsViewer.style.display = 'none'
        cart_view.style.display = 'block'
    } else {
        itemsViewer.style.display = 'block'
        cart_view.style.display = 'none'
    }
}

export function control_if_size_chosen(item) {

    if(item.size) {
        if(item.size_chosen == "") {
            return 0
        } else {
            return 1
        }
    }
}

export function checkIfDeleteItem(itemCode, item) {
    if (confirm("Vuoi davvero cancellare questo articolo ?")) {
        let itemToRemove = document.querySelector("#" + itemCode)
        itemToRemove.style.display = "none"
        removeItemDB(item)

        window.alert("Articolo cancellato con successo!")

      } else {
        alert("Articolo non cancellato!")
      }
}