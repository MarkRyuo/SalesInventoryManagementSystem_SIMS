import {Button, Image, } from 'react-bootstrap'


const MyProfileComp = () => {
    return (
        <div 
            style={{ border: "1px solid" }}>
            <div style={{border: "1px solid", width: "100%", maxWidth: "500px", alignContent: 'center', minWidth: "px"}}>
                <p className='fs-3 m-0'>Ramil Reyes</p>
                <p>Example@email.com</p>
            </div>
        </div>
    );
}

export default MyProfileComp;