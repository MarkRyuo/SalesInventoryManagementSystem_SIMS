/* eslint-disable react/prop-types */
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function StaffButtons({buttons, handleAddNewAssets}) {
    
    return (
        <>
            {buttons.map((button) => (
                <div key={button.id}>
                    <Link as={Button} size='lg' variant="outline-success" onClick={handleAddNewAssets} style={button.btnmargin}>
                        <span>{button.btnIcon}</span> 
                        {button.btnName}
                    </Link>
                </div>
            ))}
        </>
    )
}

export default StaffButtons;
