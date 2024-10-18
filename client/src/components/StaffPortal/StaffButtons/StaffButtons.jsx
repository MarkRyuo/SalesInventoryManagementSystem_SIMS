/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

function StaffButtons({buttons}) {
    
    return (
        <>
            {buttons.map((button) => (
                <div key={button.id}>
                    <Link to={button.path}>
                        <span>{button.btnIcon}</span> 
                        {button.btnName}
                    </Link>
                </div>
            ))}
        </>
    )
}

export default StaffButtons;
