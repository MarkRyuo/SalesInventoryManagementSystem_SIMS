import { Button } from 'react-bootstrap';

function StaffButtons({buttons}) {
    
    return (
        <>
            {buttons.map((button) => (
                <div key={button.id}>
                    <Button size='lg' variant="outline-success" onClick={handleAddNewAssets} style={{ margin: 20 }}>
                        <TiDocumentAdd size={30} /> Add New Assets
                    </Button>
                </div>
            ))}
        </>
    )
}

export default StaffButtons;
