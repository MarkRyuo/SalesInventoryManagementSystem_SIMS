import { Container, Image, Button } from "react-bootstrap"

function ProfileMode() {
    return (
        <Container fluid='lg' style={{border: '1px solid'}}>

            <div className="content" style={{border: '1px solid'}}>
                <div style={{display: "flex"}}>
                    <Image style={{width: "100%", maxWidth: '100px'}} src="https://i.pinimg.com/564x/01/19/1f/01191fd3ece2dcd44122ff6d88149abc.jpg" roundedCircle />
                    <div>
                        <p>Admin firstname</p>
                        <p>Administrator</p>
                    </div>
                </div>

                <Button variant="outline-primary">Edit Profile</Button>

                <div>
                    <p className="fs-4">Personal Information</p>
                    <hr/>
                    <p>FirstName: <span></span></p>
                    <p>LastName: <span></span></p>
                    <p>Gender: <span></span></p>
                    <p>Username: <span></span></p>
                </div>
            </div>

        </Container>
    )
}

export default ProfileMode
