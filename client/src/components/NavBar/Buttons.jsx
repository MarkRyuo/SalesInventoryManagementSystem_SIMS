import { MdSpaceDashboard } from "react-icons/md";

//* Props
export const Buttons = ({buttons}) => {

    return (
        <div style={{border: "1px solid", display: "flex", alignItems: "center"}}>
            {buttons.map((button) => (
                <a href="#" key={button.id}>
                    <span>{button.icon}</span>
                    <p>{button.btnName}</p>
                </a>
            ))}
        </div>
    )
}