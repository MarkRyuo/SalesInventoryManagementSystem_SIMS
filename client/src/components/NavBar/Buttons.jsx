/* eslint-disable react/prop-types */
import {Link} from 'react-router-dom' ;
import Navbars from './Navbar.module.css'

//* Props
export const Buttons = ({ buttons }) => {

    return (
        <div>
            {buttons.map((button) => (
                <Link className={Navbars.contentButtons} to={button.path} key={button.id} >
                    <span>{button.icon}</span>
                    {button.btnName}
                </Link>
            ))}
        </div>
    )
}