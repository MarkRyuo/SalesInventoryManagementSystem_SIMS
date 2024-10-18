/* eslint-disable react/prop-types */
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function StaffButtons({buttons}) {
    
    return (
        <>
            {buttons.map((button) => (
                <div key={button.id}>
                    <Link size='lg' variant="outline-success" to={button.path}>
                        <span>{button.btnIcon}</span> 
                        {button.btnName}
                    </Link>
                </div>
            ))}
        </>
    )
}

export default StaffButtons;
