import { Button } from 'react-bootstrap';
import { TiDocumentAdd } from "react-icons/ti";
import { useState } from 'react';

function StaffButtons() {
    const [buttons, setButtons] = useState([
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={30} />, id: 1 },
    ])
    return (
        {buttons.map((button) => (
            
        ))}
    )
}

export default StaffButtons;
