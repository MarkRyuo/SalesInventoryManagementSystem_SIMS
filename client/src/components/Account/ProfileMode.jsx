import { Container, Image } from "react-bootstrap"

function ProfileMode() {
    return (
        <Container fluid='lg' style={{border: '1px solid'}}>

            <div className="content" style={{border: '1px solid'}}>
                <div>
                    <div style={{width: '100%', maxWidth: 200}}>
                        <Image src="" roundedCircle />
                    </div>
                    <p>Admin Name</p>
                    <p>Administrator</p>
                </div>

                <div>
                    <p>Personal Information</p>
                    <p>FirstName: <span></span></p>
                    <p>LastName: <span></span></p>
                    <p>Gender: <span></span></p>
                    <p>FirstName: <span></span></p>
                    


                </div>
            </div>

        </Container>
    )
}

export default ProfileMode
