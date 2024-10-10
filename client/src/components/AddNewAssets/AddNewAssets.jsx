import { useNavigate }  from 'react-router-dom' ;



function AddNewAssets() {

    const navigate = useNavigate() ;
    
    const handleAddNewAssets = () => navigate("/") //* Add a page here 

    return (
        <a onClick={handleAddNewAssets}> 

        </a>
    )
}

export default AddNewAssets ;
