import { Button } from 'react-bootstrap';
import { TiDocumentAdd } from "react-icons/ti";

function StaffButtons() {

    return (
        <div style={{ width: "100%", height: 100, alignContent: 'center' }}>
            <Button size='lg' variant="outline-success" onClick={handleAddNewAssets} style={{ margin: 20 }}>
                <TiDocumentAdd size={30} /> Add New Assets
            </Button>
        </div>
    )
}

export default StaffButtons;
