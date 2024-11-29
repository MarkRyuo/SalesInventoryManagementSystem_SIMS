/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import StaffButtonsScss from './StaffButtons.module.scss' ;

function StaffButtons({ buttons }) {

    return (
        <>
            {buttons.map((button) => (
                <Link
                    key={button.id}
                    to={button.path}
                    className={StaffButtonsScss.MainStaffButtons}
                >
                    <span className='text-center' style={{ color: '#92E3B8' }}>{button.btnIcon}</span>
                    <span className='text-center'>{button.btnName}</span>
                </Link>
            ))}
        </>
    );
}

export default StaffButtons;
