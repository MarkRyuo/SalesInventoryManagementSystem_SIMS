import {Button, Image, } from 'react-bootstrap'


const MyProfileComp = () => {
    return (
        <div 
            style={{
                border: "1px solid",
                display: 'flex',
                }}>
            <div style={{width: "150px", marginRight: "15px" }}> 
                <Image src="https://www.pngkey.com/png/full/22-223848_businessman-vector-person-logo-png.png" thumbnail style={{width: "auto"}}/>
            </div>
            <div style={{border: "1px solid", width: "100%", maxWidth: "250px", alignContent: 'center'}}>
                <p className='fs-3 m-0'>Ramil Reyes</p>
                <p>Example@email.com</p>
                <Button>Upload Image</Button>
            </div>
        </div>
    );
}

export default MyProfileComp;