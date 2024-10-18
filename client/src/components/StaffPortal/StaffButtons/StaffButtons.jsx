/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

function StaffButtons({buttons}) {
    
    return (
        <>
            {buttons.map((button) => (
                    <Link 
                        key={button.id} 
                        to={button.path} 
                        style={{ display: "flex", flexDirection: "column", padding: 20, boxShadow: '2px 2px 5px #e2dfdf', borderRadius: 20, width: 250, height: 150, justifyContent: 'center', color: 'black', textDecoration: 'none' }}>
                        <span className='text-center'>{button.btnIcon}</span>
                        <span className='text-center'>{button.btnName}</span>
                    </Link>
            ))}
        </>
    )
}

export default StaffButtons;
