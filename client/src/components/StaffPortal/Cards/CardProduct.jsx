/* eslint-disable react/prop-types */

function CardProduct({ cardProduct }) {
    return (
        <>
            {cardProduct.map((cardProducts) => (
                <div
                    key={cardProducts.id}
                    style={{
                        width: 'auto',
                        padding: 25,
                        boxShadow: '1px 1px 5px #e2dfdf',
                        borderRadius: 15,
                        flexShrink: 0,
                        borderLeft: '2px solid #92E3B8',
                        boxSizing: "border-box"
                    }}
                >
                    <span>{cardProducts.productIcon}</span>
                    <p className="fs-6 m-0">{cardProducts.productName}</p>
                    <p className="fs-6 m-0">SKU: {cardProducts.productValue}</p>
                    <p className="fs-6 m-0">Price: {cardProducts.price}</p> {/* Display price here */}
                    <p className="fs-6 m-0">Quantity: {cardProducts.Quantity}</p>
                </div>
            ))}
        </>
    );
}

export default CardProduct;
