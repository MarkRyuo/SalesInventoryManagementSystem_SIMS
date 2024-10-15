import { Container } from "react-bootstrap";

function ResetRendering() {
    return (
        <Container fluid="lg">
            <div>
                <h1>Cube Flipping Loader</h1>
                <div className="cube-wrapper">
                    <div className="cube-folding">
                        <span className="leaf1"></span>
                        <span className="leaf2"></span>
                        <span className="leaf3"></span>
                        <span className="leaf4"></span>
                    </div>
                    <span className="loading" data-name="Loading">Loading</span>
                </div>

                <div className="made-with-love">
                    Made with <i>♥</i> by
                    <a target="_blank" rel="noopener noreferrer" href="https://codepen.io/nikhil8krishnan">Nikhil Krishnan</a>
                </div>
            </div>
        </Container>
    );
}

export default ResetRendering;
