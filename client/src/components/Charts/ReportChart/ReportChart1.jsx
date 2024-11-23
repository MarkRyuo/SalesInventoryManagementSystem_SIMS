import { useEffect, useState } from 'react';
import { FaReact } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import ReportChartcss from './ReportChart.module.scss';
import { fetchStockInOverview, fetchStockInByDate } from '../../../services/SalesReports/StockInReportService';  // Import the helpers

function ReportChart1() {
    const [totalStock, setTotalStock] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    // Fetch total stock when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const stock = await fetchStockInOverview();
                setTotalStock(stock);  // Set the total stock
            } catch (error) {
                console.error("Error fetching total stock:", error);
            }
        };
        fetchData();
    }, []);

    // Handle the filter action
    const handleFilter = async () => {
        try {
            const data = await fetchStockInByDate(startDate, endDate);
            setFilteredData(data); // Store the filtered data
        } catch (error) {
            console.error("Error filtering data:", error);
        }
    };

    // Download PDF function with detailed product info
    const downloadPDF = (data) => {
        const doc = new jsPDF();
        doc.text('Filtered Stock In Data', 10, 10);
        let y = 20;
        data.forEach((entry, index) => {
            doc.text(
                `${index + 1}. Product Name: ${entry.productName}, Barcode: ${entry.barcode}, SKU: ${entry.sku}, Date: ${entry.addedQuantityHistory.date}, Quantity: ${entry.addedQuantityHistory.quantity}, Price: ${entry.price}`,
                10, y
            );
            y += 10;
        });
        doc.save('stock_in_report.pdf');
    };

    // Download XLSX function with detailed product info
    const downloadXLSX = (data) => {
        const formattedData = data.map(entry => ({
            ProductName: entry.productName,
            Barcode: entry.barcode,
            SKU: entry.sku,
            Date: entry.addedQuantityHistory.date,
            Quantity: entry.addedQuantityHistory.quantity,
            Price: entry.price
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Stock In Data');
        XLSX.writeFile(wb, 'stock_in_report.xlsx');
    };

    return (
        <div className={ReportChartcss.containerChart1}>
            <div className={ReportChartcss.containerText}>
                <FaReact size={23} />
                <p className='m-0 p-0'>Stock Overview</p>
            </div>
            <div className={ReportChartcss.contentChart}>
                <p className="m-0 p-2">{`Total Stock: ${totalStock}`}</p>
            </div>
            <div className="d-flex justify-content-between">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Filter by Date
                </Button>
                <Button
                    variant="success"
                    onClick={() => downloadPDF(filteredData)}
                    disabled={filteredData.length === 0}
                >
                    Download PDF
                </Button>
                <Button
                    variant="success"
                    onClick={() => downloadXLSX(filteredData)}
                    disabled={filteredData.length === 0}
                >
                    Download XLSX
                </Button>
            </div>

            {/* Modal for date filtering */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Stock In by Date</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleFilter}>Filter</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ReportChart1;
