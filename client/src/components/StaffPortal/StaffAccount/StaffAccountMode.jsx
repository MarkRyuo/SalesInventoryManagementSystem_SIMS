import MainStaffLayout from "../../../layout/MainStaffLayout";
import { Image} from "react-bootstrap";

function ProfileMode() {

    return (
        <MainStaffLayout>
            <div style={{ marginTop: 100, boxShadow: '2px 5px 5px #E1E4E4 ', borderRadius: 15, width: '100%', minWidth: 400 }}>
                <div className="content">
                            <div style={{ display: "flex", padding: 15 }}>
                        <Image style={{ width: "100px", marginRight: 10 }} src="https://i.pinimg.com/564x/1c/ea/a9/1ceaa9f13fcff14ffcb5236be236972c.jpg" roundedCircle />
                                <div style={{ display: 'flex', width: '100%', justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", flexDirection: 'column' }}>
                                        <p className="fs-4 m-0">{/** Fetch firstname and lastname */}</p>
                                        <p className="fs-6 m-0">REYES ELECTRONICS Staff</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: 20 }}>
                                <p className="fs-4">Personal Information</p>
                                <hr />
                                <div style={{ borderRadius: 20, padding: 20, boxShadow: '1px 4px 5px #E1E4E4' }}>
                                    <p>FirstName: <span>{/** */}</span></p>
                                    <p>LastName: <span>{/** */}</span></p>
                                    <p>Gender: <span>{/** */}</span></p>
                                    <p>Username: <span>{/** */}</span></p>
                                </div>
                            </div>
                </div>
            </div>
        </MainStaffLayout>
    );
}

export default ProfileMode;
