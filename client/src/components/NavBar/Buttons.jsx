import { MdSpaceDashboard } from "react-icons/md";

//* Props
export const Buttons = ({buttons, Icon}) => {

    return (
        <div>
            <span>{Icon}</span>
            {buttons.map((button) => (
                <a href="#" key={button.id}>
                    <p>{button.btnName}</p>
                </a>
            ))}
        </div>
    )
}