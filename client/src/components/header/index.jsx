import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { auth, getNumberOfItem } from "../../firebase/firebase";

import logo from '../../assets/logo.png'
import cartIcon from "../../assets/cart.png"
import itemsIcon from "../../assets/items.png"
import './header.css'
import '../../micro_components/tooltip.css'


const Header = ({type}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [imgIcon, setImgIcon] = useState(cartIcon)
    const [link, setLink] = useState("/cart")
    const [itemPresents, setItemPresents] = useState(false)


    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if(user) {
                setIsLoggedIn(true)

                getNumberOfItem(user.uid).then((number) => {
                    if(number != 0) {
                        setItemPresents(true)
                    } else {
                        setItemPresents(false)
                    }
                })
            }
        });

        if(type == "CART_VIEW") {
            setImgIcon(itemsIcon)
            setLink("/home")
        } else {
            setImgIcon(cartIcon)
            setLink("/cart")
        }
    }, [type, link]);

    function handleCLick() {
        window.location.href = link
    }

//<button onClick={handleSignOut} className="primary-btn"> LOG OUT </button>

    return (
        <>
            {isLoggedIn ? 
                <div className='header'>
                    <div className='div-logo-button'>
                        <a href='/'><img src={logo} alt='Logo Pantere' className='logoPantere'/></a>
                    </div>

                    <div className="header-button-div">
                        <button href='' className='button-cart' onClick={handleCLick}>
                            {type == "CART_VIEW" ?  
                            <>
                                <img src={imgIcon} alt='icon' className='cartIcon'/>
                            </>
                            :
                            <>
                                <div className='icon-presents-item-on-cart'>
                                    <img src={imgIcon} alt='icon' className='cartIcon'/>
                                    {itemPresents ? <span className='badge-cart'></span> : <></>}
                                </div>
                            </>}
                        </button>
                    </div> 
                </div> : 

                <div className='header'>
                    <a href='/'><img src={logo} alt='Logo Pantere' className='logoPantere'/></a>
                </div>
            }
        </>
    )
}

export default Header 

Header.propTypes = {
    type: PropTypes.string
}