/* eslint-disable react/prop-types */
import { Modal, Button } from "react-bootstrap";

const TermsModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Acceptance of Terms</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>By accessing and using the REYES ELECTRONICS website, you acknowledge and accept to be bound by these terms and conditions...</h5>

                <p>
                    <strong>Modifications:</strong> REYES ELECTRONICS reserves the right to modify these terms and conditions at any time without prior notice. Your continued use of the website after changes are made will be deemed as your acceptance of the updated terms.
                </p>

                <p>
                    <strong>Website Usage:</strong> As an admin or staff member, you agree to use the website only for lawful purposes and in compliance with these terms. You shall not:
                    <ul>
                        <li>Violate any local, state, national, or international law or regulation.</li>
                        <li>Infringe upon the intellectual property rights of others.</li>
                        <li>Transmit any harmful content, including viruses, worms, or malicious code.</li>
                        <li>Interfere with or disrupt the website or its servers.</li>
                        <li>Attempt to gain unauthorized access to the website or its systems.</li>
                    </ul>
                </p>

                <p>
                    <strong>User Content:</strong> You are solely responsible for any content you submit to the website. You represent and warrant that you own all rights to such content or have obtained all necessary permissions and licenses. You further agree not to submit any content that is illegal, obscene, defamatory, or otherwise objectionable.
                </p>

                <p>
                    <strong>Disclaimer:</strong> The website and its contents are provided "as is" and "as available," without warranty of any kind, express or implied. REYES ELECTRONICS disclaims all warranties, including, but not limited to, warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>

                <p>
                    <strong>Limitation of Liability:</strong> REYES ELECTRONICS shall not be responsible for any damages or losses arising from your access to and use of the website, including, but not limited to, direct, indirect, incidental, consequential, and punitive damages.
                </p>

                <p>
                    <strong>Indemnification:</strong> You agree to indemnify and hold harmless REYES ELECTRONICS, its officers, directors, employees, agents, and licensors from and against any and all claims, demands, losses, liabilities, costs, and expenses (including attorney's fees) arising out of or relating to your use of the website.
                </p>

                <p>
                    <strong>Governing Law:</strong> These terms and conditions shall be governed by and construed in accordance with the laws of the State of [State Name], without regard to its conflict of law provisions.
                </p>

                <p>
                    <strong>Entire Agreement:</strong> These terms and conditions constitute the entire agreement between you and REYES ELECTRONICS relating to your use of the website and supersede all prior or contemporaneous communications and proposals, whether oral or written.
                </p>

                <p>
                    <strong>Severability:</strong> If any provision of these terms and conditions is held to be invalid or unenforceable, such provision shall be struck from these terms and conditions, and the remaining provisions shall remain in full force and effect.
                </p>

                <p>
                    <strong>Contact Us:</strong> If you have any questions about these terms and conditions, please contact REYES ELECTRONICS at [Contact Information].
                </p>

                <p>
                    <strong>Effective Date:</strong> These terms and conditions are effective as of [Effective Date].
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Accept
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TermsModal;
