import { MdSpaceDashboard } from "react-icons/md";

//* Props
export const Buttons = () => {

    return (
        <div>
            <span>{<MdSpaceDashboard />}</span>
            {buttons.map((button) => (
                <link key={button.id}>
                    <p>{button.btnName}</p>
                </link>
            ))}
        </div>
    )
}