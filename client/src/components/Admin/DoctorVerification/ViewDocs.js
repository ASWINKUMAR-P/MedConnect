import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default function ViewDocs() {

    const params = useParams();
    const [docs, setDocs] = useState([]);

    const getDocs = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/getAllDocs/${params.requestId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }
            const data = await response.json();
            setDocs(data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    useEffect(() => {
        getDocs();
    }, []);

    

    return (
        <div className="main-part" style={{ height: "100%", marginTop: "13vh", zIndex: 1, backgroundColor: "white",marginLeft:"200px" }}>
                    <div style={{ display: 'block' }}>
                        <div className="mb-3 d-flex justify-content-center">
                            <div style={{width:"500px",height:"800px"}}>
                                <DocViewer
                                    documents={docs}
                                    renderers={DocViewerRenderers}
                                />
                            </div>
                        </div>
                    </div>
        </div>
    );
}
