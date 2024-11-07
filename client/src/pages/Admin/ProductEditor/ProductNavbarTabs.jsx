import {Nav} from 'react-bootstrap'

function ProductNavbarTabs() {
    return (
        <Nav justify variant="tabs" defaultActiveKey="/ProductEditor" className='mt-4'>
            <Nav.Item>
                <Nav.Link href="#">Product</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="#">Product Edit</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="#">Link</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}

export default ProductNavbarTabs ;
