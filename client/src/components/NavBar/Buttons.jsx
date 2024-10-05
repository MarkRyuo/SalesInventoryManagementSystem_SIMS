import { useState } from 'react';
import { MdSpaceDashboard } from "react-icons/md";

//* Props
export const Buttons = () => {

    const [buttons, setBottons] = useState([
        { icon: "<MdSpaceDashboard />", btnName: "Dashboard", id:"b-1" },
    ])

    return (
        <div>
            {buttons.map((button) => (
                <div key={button.id}>
                    <span>{button.icon}</span>
                    <p>{button.btnName}</p>
                </div>
            ))}
        </div>
    )
}