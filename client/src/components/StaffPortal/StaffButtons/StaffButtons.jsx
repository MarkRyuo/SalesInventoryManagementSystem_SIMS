/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import StaffButtonsScss from './StaffButtons.module.scss'

function StaffButtons({ buttons }) {

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getStyle = () => {
        // Default styles for large screens
        let style = {
            display: "flex",
            flexDirection: "column",
            padding: 30,
            boxShadow: '2px 2px 5px #e2dfdf',
            borderRadius: 20,
            width: 250,
            height: 125,
            justifyContent: 'center',
            color: 'black',
            textDecoration: 'none',
            borderLeft: '1px solid #92E3B8',
            boxSizing: 'border-box',
        };

        return style;
    };

    return (
        <>
            {buttons.map((button) => (
                <Link
                    key={button.id}
                    to={button.path}
                    style={getStyle()}
                >
                    <span className='text-center' style={{ color: '#92E3B8' }}>{button.btnIcon}</span>
                    <span className='text-center'>{button.btnName}</span>
                </Link>
            ))}
        </>
    );
}

export default StaffButtons;
