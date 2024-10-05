import {Button, Image, } from 'react-bootstrap'


const MyProfileComp = () => {
    return (
        <div style={{border: "1px solid"}}>
            <Image src="https://placekitten.com/171/180" />
            <p>Admin Name</p>
            <p>Example@email.comw</p>
            <Button>Upload Image</Button>
        </div>
    );
}

export default MyProfileComp;