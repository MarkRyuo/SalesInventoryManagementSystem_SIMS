
import StaffNavBar from "../StaffNavbar/StaffNavBar";

//? 1st See
function NewAssetsScanner() {

    return (
        <Container fluid className="p-0">
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)}/>
            <Container fluid='lg' className="mt-4" style={{border: "1px solid", width: "100%", height: "auto"}}>
                <h2>New Assets Scanner</h2>
            </Container>
        </Container>
    )
}

export default NewAssetsScanner
