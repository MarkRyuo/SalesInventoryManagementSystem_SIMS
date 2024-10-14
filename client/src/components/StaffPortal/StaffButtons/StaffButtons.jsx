/* eslint-disable react/prop-types */
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function StaffButtons({buttons}) {
    
    return (
        <>
            {buttons.map((button) => (
                <div key={button.id}>
                    <Button as={Link} size='lg' variant="outline-success" to={button.path}>
                        <span>{button.btnIcon}</span> 
                        {button.btnName}
                    </Button>
                </div>
            ))}
        </>
    )
}

export default StaffButtons;
