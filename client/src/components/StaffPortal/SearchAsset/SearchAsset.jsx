import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { MdOutlineManageSearch } from "react-icons/md";

function SearchAssets() {

    const navigate = useNavigate();

    const handleAddNewAssets = () => navigate("") //* Add a page here 

    return (
        <div style={{ width: "100%", height: 100, alignContent: 'center' }}>
            <Button size='lg' variant="outline-success" onClick={handleAddNewAssets} style={{marginLeft: 40}}>
                <MdOutlineManageSearch size={30}/>SearchAsset
            </Button>
        </div>
    )
}

export default SearchAssets;
