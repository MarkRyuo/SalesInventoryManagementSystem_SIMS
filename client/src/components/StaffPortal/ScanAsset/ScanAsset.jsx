import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BiScan } from "react-icons/bi";

function ScanAsset() {

    const navigate = useNavigate();

    const handleAddNewAssets = () => navigate("") //* Add a page here 

    return (
        <div style={{ width: "100%", height: 100, alignContent: 'center' }}>
            <Button size='lg' variant="outline-success" onClick={handleAddNewAssets} style={{marginLeft: 50}}>
                <BiScan size={30}/>ScanAsset
            </Button>
        </div>
    )
}

export default ScanAsset;
