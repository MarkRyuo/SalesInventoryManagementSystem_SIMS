import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div>
            <div>
                <Link to={"/"}>
                    My Profile
                </Link>

                <Link to={"/"}>
                    Profiles
                </Link>

                <Link to={"/"}>
                    Create Account
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
