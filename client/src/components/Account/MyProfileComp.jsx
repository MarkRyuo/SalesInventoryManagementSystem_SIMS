import {Button, Image, } from 'react-bootstrap'


const MyProfileComp = () => {
    return (
        <div 
            style={{
                border: "1px solid",
                display: 'flex',
                }}>
            <div> <Image src="https://placekitten.com/171/180" /></div>
            <div>
                <p>Admin Name</p>
                <p>Example@email.comw</p>
                <Button>Upload Image</Button>
            </div>
        </div>
    );
}

export default MyProfileComp;