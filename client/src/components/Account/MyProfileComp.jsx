import {Button, Image, } from 'react-bootstrap'


const MyProfileComp = () => {
    return (
        <div 
            style={{
                border: "1px solid",
                display: 'flex',
                }}>
            <div> <Image src="https://www.pngkey.com/png/full/22-223848_businessman-vector-person-logo-png.png" /></div>
            <div>
                <p>Admin Name</p>
                <p>Example@email.comw</p>
                <Button>Upload Image</Button>
            </div>
        </div>
    );
}

export default MyProfileComp;