import Search from "../components/Comps/Search";
import ProductCategory from "../components/Comps/ProductCategory";
import { Row, Col } from "react-bootstrap";


//* Props 
function ProductChart() {
    return (
        <>
            <div>
                <Search />
                <ProductCategory />
            </div>

            <Row>
                
            </Row>

            <div style={{border: "1px solid red"}}>
                Item 1 
                {/* Insert Logic */}
            </div>
        </>
    )
}

export default ProductChart ;
