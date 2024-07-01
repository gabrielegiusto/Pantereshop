import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { addItemToCart } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";
import { ToastContainer, toast } from 'react-toastify';
import Tag from '../../micro_components/tag';
import Badge from '../../micro_components/badge';

import './item.css'

const Item = (item) => {
    const [user, setUser] = useState();
    const [timesAdded, setTimesAdd] = useState(1)

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
        });
    });

    const addItemToast = () => {
        document.querySelector("#" + itemComponent.code).style.filter = 'blur(0.5rem)'
        document.querySelector('#button' + itemComponent.code).disabled = true;

        toast.success(itemComponent.item + ' AGGIUNTO', {
            icon: false,
            closeButton: false,
            className: "toast-add-item",
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            theme: "light",
            onClose: () => handleAdding()}
        )
    };

    let itemComponent = {
        item: item.item.item,
        code: item.item.code,
        brand: item.item.brand,
        cost: item.item.cost,
        tag: item.item.tag,
        img_src: item.item.img_src,
        size: item.item.size,
        size_chosen: "",
        size_form: item.item.size_form,
        timesAddedItem: timesAdded
    }

    let tags = []

    if(typeof(itemComponent.tag) == 'object'){
        for(let i = 0; i < itemComponent.tag.length; i++){
            tags.push(<Tag tag={itemComponent.tag[i]} key={i}/>)
        }
    } else {
        tags.push(<Tag tag={itemComponent.tag} key={1}/>)
    }

    function handleAdding() {
        document.querySelector("#" + itemComponent.code).style.filter = 'blur(0)'
        document.querySelector('#button' + itemComponent.code).disabled = false;
        addItemToCart(itemComponent, user);
        setTimesAdd(timesAdded + 1)
    }

    return (
        <>
        <div className="item" id={itemComponent.code}> 

            <div className="imgDiv">
                <img src={itemComponent.img_src} className="imgItem" alt={itemComponent.item}/>
                <span className="badgeItem badgeDiv" id={itemComponent.code}><Badge times={1} /></span>
            </div>

            <div className="itemInfo">

                <div className="divInfoItem">
                    <h3>{itemComponent.item}</h3>
                    <h6>{itemComponent.brand}</h6>
                </div>

                <div className="divCostItem">
                    <h3>{itemComponent.cost}€</h3>

                    <div>
                        <button className="addToOrderBtn" onClick={() => addItemToast()} type="submit" id={'button' + itemComponent.code}>AGGIUNGI</button>
                        <ToastContainer 
                            className="toast-container-add-item"
                            position="top-right"
                            autoClose={2000}
                            hideProgressBar
                            newestOnTop
                            closeOnClick={false}
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

            <div className="itemTags">
                {tags}
            </div>

        </div>
        </>
    )
}

export default Item

Item.propTypes = {
    item: PropTypes.object
}