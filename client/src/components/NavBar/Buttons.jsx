
//* Props
export const Buttons = ({ buttons }) => {

    return (
        <div>
            {buttons.map((button) => (
                <a href="#" key={button.id} style={{ border: "1px solid", display: "flex", alignItems: "center", height: "50px", textDecoration: "none" }}>
                    <span>{button.icon}</span>
                    {button.btnName}
                </a>
            ))}
        </div>
    )
}