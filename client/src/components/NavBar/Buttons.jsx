import { MdSpaceDashboard } from "react-icons/md";

//* Props
export const Buttons = ({buttons, icon}) => {

    return (
        <div>
            <span>{Icon}</span>
            {buttons.map((button) => (
                <link key={button.id}>
                    <p>{button.btnName}</p>
                </link>
            ))}
        </div>
    )
}