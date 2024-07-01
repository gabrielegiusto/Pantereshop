import './order_item.css'
import '../../../css/buttons.css'
import '../../../css/progressBar.css'

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatusFlag from './status_flag';

function Order_item({order, ID}) {
    const [itemsOnOrder, setItemsOnOrder] = useState([])

    const deleteOrder = () => toast.info('ORDINE ELIMINATO', {
                                        position: "top-right",
                                        autoClose: 2000,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: false,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
    });

    const modifyOrder = () => toast.success('ORDINE MODIFICATO', {
                                        position: "top-right",
                                        autoClose: 2000,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: false,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
    });
                    

    useEffect(() => {
        let items = order.items_ordered
        let itemsArray = []

        items.forEach((item) => {
            if(item.size) {
                let article = item.article
                let sizeChosen = item.size_chosen
                let price = item.cost
                let brand = item.brand
                let times = item.timesAddedItem

                itemsArray.push(
                    <div className='div-items-ordered' key={ID + article}>
                        <div className='div-item-ordered-info'>
                            <h4 className='delete-margin'>{article}</h4>
                            <h6 className='delete-margin'>{brand}</h6>
                        </div>

                        <div className='div-general-info'>
                            <div className='div-item-info'>
                                <h5 className='delete-margin'>{sizeChosen}</h5>
                            </div>

                            <div className='div-item-info'>
                                <h5 className='delete-margin'>n. {times}</h5>
                            </div>

                            <div className='div-item-info'>
                                <h5 className='delete-margin'>{price + "€"}</h5>
                            </div>

                        </div>
                    </div>
                )

            } else {
                let article = item.article
                let price = item.cost
                let brand = item.brand
                let times = item.timesAddedItem

                itemsArray.push(
                    <div className='div-items-ordered' key={ID + article}>
                        <div className='div-item-ordered-info'>
                            <h4 className='delete-margin'>{article}</h4>
                            <h6 className='delete-margin'>{brand}</h6>
                        </div>

                        <div className='div-general-info'>
                            <div className='div-item-info'>
                                
                            </div>

                            <div className='div-item-info'>
                                <h5 className='delete-margin'>n. {times}</h5>
                            </div>

                            <div className='div-item-info'>
                                <h5 className='delete-margin'>{price + "€"}</h5>
                            </div>
                        </div>
                    </div>
                )
            }
        });

        setItemsOnOrder(itemsArray)

    }, [order.items_ordered, ID])

  
  return (
    <>
        <div className='order-item'>
            <div className='general-div-info'>
                <div className='div-info-user-date-status' id={"order_info_" + ID}>

                    <div className='div-info-order-user-date'>
                        <div className='order-user'>
                            <h2 className='delete-margin'>{order.user}</h2>
                        </div>

                        <div className='order-date'>
                            <h4 className='delete-margin'>{order.day + "/" +  order.month + "/" + order.year}</h4> 
                        </div>
                    </div>

                    <div>
                        <h2>{order.total + "€"}</h2>
                    </div>

                </div>

                
                <StatusFlag ID={ID} STATUS={order.order_status}/>
            </div>

            <hr></hr>
            
            <div className='div-item-present' id={"items_ordered_" + ID}>
                {itemsOnOrder}
            </div>

            <hr></hr>

            <div className='modifyOrder'>
                <div>
                    <button className='button-to-delete' onClick={deleteOrder}>ELIMINA ORDINE</button>
                    <ToastContainer 
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        transition: Slide
                    />
                </div>

                <div>
                    <button className='button-to-modify' onClick={modifyOrder}>MODIFICA ORDINE</button>
                    <ToastContainer 
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        transition: Slide
                    />
                </div>



            </div>
        </div>
    </>
  )
}

export default Order_item

Order_item.propTypes = {
    order: PropTypes.object,
    ID: PropTypes.string
}