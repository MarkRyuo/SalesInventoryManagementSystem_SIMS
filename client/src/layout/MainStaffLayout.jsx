/* eslint-disable react/prop-types */


function MainStaffLayout({children}) {
    return (
        <div className="container">
            <div className="content"> {/**Content */}
                {children}
            </div>
        </div>
    )
}

export default MainStaffLayout
