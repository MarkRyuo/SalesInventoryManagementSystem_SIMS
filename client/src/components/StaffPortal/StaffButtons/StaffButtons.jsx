/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

function StaffButtons({buttons}) {
    
    return (
        <>
            {buttons.map((button) => (
                <div key={button.id} style={{ display: "flex", flexDirection: "column", padding: 20, boxShadow: '2px 2px 5px #e2dfdf', borderRadius: 20, width: 250, height: 150 }}>
                    <Link to={button.path}>
                        {button.btnName}
                    </Link>
                </div>
            ))}
        </>
    )
}

export default StaffButtons;
