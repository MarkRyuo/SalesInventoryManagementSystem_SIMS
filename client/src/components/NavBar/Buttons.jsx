import { useState } from 'react';
import { MdSpaceDashboard } from "react-icons/md";

//* Props
export const Buttons = () => {

    const [buttons, setBottons] = useState([
        { btnName: "Dashboard", id:"b-1" },
    ])

    return (
        <div>
            <span>{}</span>
            {buttons.map((button) => (
                <link key={button.id}>
                    <p>{button.btnName}</p>
                </link>
            ))}
        </div>
    )
}