import { Image, Button } from "react-bootstrap"
import { MainLayout } from "../../layout/MainLayout"
import { Link } from "react-router-dom"

function ProfileMode() {
    return (
        <MainLayout>
            <div style={{ border: '1px solid', padding: '20px', marginTop: 100 }}>

                <div className="content" style={{ border: '1px solid' }}>
                    <div style={{ display: "flex", padding: 20}}>
                        <Image style={{ width: "100%", maxWidth: '100px', marginRight: 10 }} src="https://i.pinimg.com/564x/01/19/1f/01191fd3ece2dcd44122ff6d88149abc.jpg" roundedCircle />
                        <div style={{display: 'flex', width: '100%', justifyContent: "space-between", alignItems: "center"}}>
                            <div style={{ display: "flex", flexDirection: 'column' }}>
                                <p className="fs-4 m-0">Admin firstname</p>
                                <p className="fs-6 m-1">Administrator</p>
                            </div>
                            <Button as={Link} to={'/MyProfile'} variant="outline-primary">Edit Profile</Button>
                        </div>
                    </div>


                    <div style={{padding: 20}}>
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
