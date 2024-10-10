import { useNavigate }  from 'react-router-dom' ;
import { Button } from 'react-bootstrap';
import { TiDocumentAdd } from "react-icons/ti";


function AddNewAssets() {

    const navigate = useNavigate() ;
    
    const handleAddNewAssets = () => navigate("") //* Add a page here 

    return (
        <div style={{ border: "1px solid" ,width: "100%", height: 100, alignContent: 'center' }}>
            <Button size='lg' variant="outline-success" onClick={handleAddNewAssets} style={{margin: 20}}>
                <TiDocumentAdd size={30}/> Add New Assets
            </Button>
        </div>
    )
}

export default AddNewAssets ;
