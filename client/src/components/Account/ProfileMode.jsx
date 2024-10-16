import { Image, Button } from "react-bootstrap"
import { MainLayout } from "../../layout/MainLayout"

function ProfileMode() {
    return (
        <MainLayout>
            <div style={{ border: '1px solid', padding: '20px' }}>

                <div className="content" style={{ border: '1px solid' }}>
                    <div style={{ display: "flex", border: '1px solid red', padding: 20}}>
                        <Image style={{ width: "100%", maxWidth: '100px' }} src="https://i.pinimg.com/564x/01/19/1f/01191fd3ece2dcd44122ff6d88149abc.jpg" roundedCircle />
                        <div style={{display: 'flex', border: '1px solid', width: '100%', justifyContent: "space-between", alignItems: "center"}}>
                            <div style={{ border: '1px solid', display: "flex", flexDirection: 'column' }}>
                                <p>Admin firstname</p>
                                <p>Administrator</p>
                            </div>
                            <Button variant="outline-primary" style={{height: 50}}>Edit Profile</Button>
                        </div>
                    </div>


                    <div>
                        <p className="fs-4">Personal Information</p>
                        <hr />
                        <p>FirstName: <span></span></p>
                        <p>LastName: <span></span></p>
                        <p>Gender: <span></span></p>
                        <p>Username: <span></span></p>
                    </div>
                </div>

            </div>
        </MainLayout>
    )
}

export default ProfileMode
