import { Button } from "react-bootstrap";

function LogInCardPage() {
    return (
        <div className="LogInCardPageContainer">
            <form>
                <input type="text" placeholder="username" />
                <input type="password" placeholder="password" />
            </form>

            <Button variant="" class>
                Login
            </Button>

        </div>
    )
}

export default LogInCardPage;
