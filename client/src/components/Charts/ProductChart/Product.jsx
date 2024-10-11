import Search from "../components/Comps/Search";


//* Props 
function ProductChart() {
    return (
        <>
            <div>
                <Search />
                <ProductCategory />
            </div>
            <div style={{border: "1px solid red"}}>
                Item 1 
                {/* Insert Logic */}
            </div>
        </>
    )
}

export default ProductChart ;
