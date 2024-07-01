import PropTypes from 'prop-types';

import './status_flag.css'
import arrowImg from '../../../../assets/right-arrow.png'
import { useEffect, useState } from 'react';
import { updateOrderStatus } from '../../../../firebase/firebase';



function StatusFlag({ID, STATUS}) {
    const [ordered, setOrdered] = useState(false)
    const [payed, setPayed] = useState(false)
    const [delivered, setDelivered] = useState(false)
    const [progress, setProgress] = useState(25)

    useEffect(() => {
        const items_ordered = document.querySelector("#items_ordered_" + ID)
        const order_info = document.querySelector("#order_info_" + ID)

        if(STATUS == "ORDERED") {
            setOrdered(true)
            setProgress(50)

        } else if(STATUS == "PAYED") {
            setOrdered(true)
            setPayed(true)
            setProgress(75)

        } else if(STATUS == "DELIVERED") {
            items_ordered.style.opacity = "0.4"
            order_info.style.opacity = "0.4"

            setOrdered(true)
            setPayed(true)
            setDelivered(true)
            setProgress(100)
        }

    }, [STATUS, ID])


    
    
    function handleClickStatusFlag() {
        if(!ordered) {
            updateOrderStatus(ID, "ORDERED")
            setOrdered(true)
            setProgress(50)

        } else if( ordered && !payed) {
            updateOrderStatus(ID, "PAYED")
            setPayed(true)
            setProgress(75)

        } else {
            const items_ordered = document.querySelector("#items_ordered_" + ID)
            const order_info = document.querySelector("#order_info_" + ID)
            items_ordered.style.opacity = "0.4"
            order_info.style.opacity = "0.4"

            updateOrderStatus(ID, "DELIVERED")
            setDelivered(true)
            setProgress(100)
        }
    }



  
    return (
    <>
        <div>
            <div className='general-div-status'>
                <div className='div-status-flag PROCESSING'>
                    <h5>DA ORDINARE</h5>
                </div>

                <div><img src={arrowImg} className='arrow-icon'/></div>

                {ordered ?  
                <div className='div-status-flag ORDERED'  style={{opacity: 1}}>
                    <h5>ORDINATO</h5>
                </div>
                :  
                <div className='div-status-flag ORDERED'>
                    <a onClick={() => handleClickStatusFlag()}><h5>ORDINATO</h5></a>
                </div>}

                <div><img src={arrowImg} className='arrow-icon'/></div>

                {payed ?  
                <div className='div-status-flag PAGATO'  style={{opacity: 1}}>
                    <h5>PAGATO</h5>
                </div>
                :  
                <div className='div-status-flag PAGATO'>
                    <a onClick={() => handleClickStatusFlag()}><h5>PAGATO</h5></a>
                </div>}

                <div><img src={arrowImg} className='arrow-icon'/></div>

                {delivered ?  
                <div className='div-status-flag CONSEGNATO' style={{opacity: 1}}>
                    <h5>CONSEGNATO</h5>
                </div>
                :  
                <div className='div-status-flag CONSEGNATO'>
                    <a onClick={() => handleClickStatusFlag()}><h5>CONSEGNATO</h5></a>
                </div>}
            </div>

            <progress max={100} value={progress}/>
        </div>
    </>
  )
}

export default StatusFlag

StatusFlag.propTypes = {
    ID: PropTypes.string,
    STATUS: PropTypes.string
}