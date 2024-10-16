import { Container, Image, Button } from "react-bootstrap"

function ProfileMode() {
    return (
        <Container fluid='lg' style={{border: '1px solid'}}>

            <div className="content" style={{border: '1px solid'}}>
                <div>
                    <div style={{width: '100%', maxWidth: 200}}>
                        <Image src="" roundedCircle />
                    </div>
                    <p>Admin firstname</p>
                    <p>Administrator</p>
                </div>

                <Button variant="outline-primary"></Button>

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
