import MainStaffLayout from "../../../layout/MainStaffLayout";

function ProfileMode() {

    return (
        <MainStaffLayout>
            <div style={{ marginTop: 100, boxShadow: '2px 5px 5px #E1E4E4 ', borderRadius: 15, width: '100%', minWidth: 400 }}>
                <div className="content">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <p className="fs-4">Loading...</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "flex", padding: 15 }}>
                                <Image style={{ width: "100px", marginRight: 10 }} src="https://i.pinimg.com/564x/01/19/1f/01191fd3ece2dcd44122ff6d88149abc.jpg" roundedCircle />
                                <div style={{ display: 'flex', width: '100%', justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", flexDirection: 'column' }}>
                                        <p className="fs-4 m-0">{adminData ? adminData.firstname : 'N/A'} {adminData ? adminData.lastname : 'N/A'}</p>
                                        <p className="fs-6 m-0">Administrator</p>
                                    </div>
                                    <Button as={Link} to={'/MyProfile'} variant="outline-primary">Edit Profile</Button>
                                </div>
                            </div>

                            <div style={{ padding: 20 }}>
                                <p className="fs-4">Personal Information</p>
                                <hr />
                                <div style={{ borderRadius: 20, padding: 20, boxShadow: '1px 4px 5px #E1E4E4' }}>
                                    <p>FirstName: <span>{adminData ? adminData.firstname : 'N/A'}</span></p>
                                    <p>LastName: <span>{adminData ? adminData.lastname : 'N/A'}</span></p>
                                    <p>Gender: <span>{adminData ? adminData.gender : 'N/A'}</span></p>
                                    <p>Username: <span>{adminData ? adminData.username : 'N/A'}</span></p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MainStaffLayout>
    );
}

export default ProfileMode;
