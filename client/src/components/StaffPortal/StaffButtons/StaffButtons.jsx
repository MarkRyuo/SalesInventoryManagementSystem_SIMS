import { Button } from 'react-bootstrap';
import { TiDocumentAdd } from "react-icons/ti";
import { useState } from 'react';

function StaffButtons() {
    const [buttons, setButtons] = useState([
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={30} />, id: 1 },
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={30} />, id: 2 },
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={30} />, id: 3 },
    ])

    return (
        {buttons.map((button) => (
            <div key={button.id}>
                <Button size='lg' variant="outline-success" onClick={handleAddNewAssets} style={{ margin: 20 }}>
                    <TiDocumentAdd size={30} /> Add New Assets
                </Button>
            </div>
        ))}
    )
}

export default StaffButtons;
