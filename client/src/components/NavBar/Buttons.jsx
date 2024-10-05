import { useState } from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { Link } from 'react-router-dom' ;

//* Props
export const Buttons = () => {

    const [buttons, setBottons] = useState([
        { icon: "<MdSpaceDashboard />", btnName: "Dashboard", id:"b-1" },
    ])

    return (
        <div>
            {buttons.map((button) => (
                <div key={button.id} as={Link}>
                    <span>{button.icon}</span>
                    <p>{button.btnName}</p>
                </div>
            ))}
        </div>
    )
}