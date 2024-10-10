import { useNavigate }  from 'react-router-dom' ;



function AddNewAssets() {

    const navigate = useNavigate() ;
    
    const handleAddNewAssets = () => navigate("/") //* Add a page here 

    return (
        <a onClick={handleAddNewAssets} style={{border: "1px solid"}}> 
            Add New Assets
        </a>
    )
}

export default AddNewAssets ;
