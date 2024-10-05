/* eslint-disable react/prop-types */
import {Link} from 'react-router-dom' ;
import Navbars from './Navbar.module.css'

//* Props
export const Buttons = ({ buttons }) => {

    return (
        <div>
            {buttons.map((button) => (
                <Link className="fs-6" to={button.path} key={button.id} style={{ border: "1px solid", display: "flex", alignItems: "center", height: "50px", textDecoration: "none", width: "100%", minWidth: "200px" }}>
                    <span>{button.icon}</span>
                    {button.btnName}
                </Link>
            ))}
        </div>
    )
}