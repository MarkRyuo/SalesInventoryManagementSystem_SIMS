/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function StaffButtons({ buttons }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

        // Apply responsive styles
        if (windowWidth < 700) {
            style = {
                ...style,
                display: 'none'
            };
        } 

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
