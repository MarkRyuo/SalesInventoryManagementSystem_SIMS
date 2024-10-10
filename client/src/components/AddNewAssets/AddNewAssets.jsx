import { useNavigate }  from 'react-router-dom' ;
import { Button } from 'react-bootstrap';


function AddNewAssets() {

    const navigate = useNavigate() ;
    
    const handleAddNewAssets = () => navigate("/") //* Add a page here 

    return (
        <div style={{ border: "1px solid", width: "100%", height: 100, alignContent: 'center' }}>
            <Button size='lg' variant='' onClick={handleAddNewAssets}>
                Add New Assets
            </Button>
        </div>
    )
}

export default AddNewAssets ;
