import React, { useState, useEffect } from 'react';
import { listWorkers } from '../services/WorkerService';
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState({});
    const [workers, setWorkers] = useState([]);
    const [nonAdminWorkers, setNonAdminWorkers] = useState([]);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [deletingWorker, setDeletingWorker] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { adminid } = useParams();

    useEffect(() => {
        loadAdmin();
        loadWorkers();
    }, []);

    const loadAdmin = async () => {
        try {
            const response = await axios.get(`http://localhost:6900/api/workers/${adminid}`);
            setAdmin(response.data);
        } catch (error) {
            console.error('Error fetching admin:', error);
        }
    };

    const loadWorkers = async () => {
        try {
            const response = await listWorkers();
            setWorkers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const filteredWorkers = workers.filter(worker => worker.designation !== 'ADMIN');
        setNonAdminWorkers(filteredWorkers);
    }, [workers]);

    const handleLogOut = () => {
        navigate("/");
    };

    const handleMyProfile = () => {
        setShowProfileModal(true);
    };

    const handleDelete = (id) => {
        const workerToDelete = workers.find(worker => worker.id === id);
        setDeletingWorker(workerToDelete);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:6900/api/workers/${id}`);
            loadWorkers();
            setShowDeleteModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddWorker = () => {
        navigate("/addworker");
    };

    return (
        <div>
            <nav className="navbar navbar-dark bg-dark" style={{ height: '80px', paddingLeft: '20px' }}>
                <div className="navbar-brand">
                    Employee Leave Management
                </div>
                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{ marginRight: '30px', borderRadius: '9px', width: '100px', height: '45px', fontSize: '18px', backgroundColor: 'white', color: 'black', border: 'solid' }}>
                                            <strong>{admin.userName}</strong>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={handleMyProfile}>My Profile</Dropdown.Item>
                                            <Dropdown.Item onClick={handleLogOut}>Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <section className="section" style={{ minHeight: 'calc(100vh - 80px)' }}>
                <div className='mt-4'>
                    <h2 className='text-center' style={{ marginBottom: '40px', marginTop: '20px' }}>Admin DashBoard</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>

                        {/* Add a button on the top left side */}
                        <button className="btn btn-secondary" onClick={handleAddWorker} style={{ marginBottom: '10px', marginRight: '800px', borderRadius: '9px', width: '150px', height: '45px', fontSize: '18px', border: 'solid', borderColor: 'black' }}>
                            Add Worker
                        </button>

                        {/* Table */}
                        <div>
                            <table className="table table-striped table-bordered" style={{ width: 'fit-content', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid black' }}>Sr. No</th>
                                        <th style={{ border: '1px solid black' }}>User Name</th>
                                        <th style={{ border: '1px solid black' }}>Email</th>
                                        <th style={{ border: '1px solid black' }}>Designation</th>
                                        <th style={{ border: '1px solid black' }}>Joining Date</th>
                                        <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nonAdminWorkers.map((worker, index) =>
                                        <tr key={worker.id}>
                                            <td style={{ border: '1px solid black' }}>{index + 1}</td>
                                            <td style={{ border: '1px solid black' }}>{worker.userName}</td>
                                            <td style={{ border: '1px solid black' }}>{worker.email}</td>
                                            <td style={{ border: '1px solid black' }}>{worker.designation}</td>
                                            <td style={{ border: '1px solid black' }}>{worker.joinDate}</td>
                                            <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                <Link className="btn btn-secondary" to={`/viewworker/${worker.id}`} style={{ marginLeft: '10px', marginRight: '20px', borderRadius: '9px', width: '90px', height: '45px', fontSize: '18px' }}>
                                                    View
                                                </Link>
                                                <Link className="btn btn-secondary" to={`/editworker/${worker.id}`} style={{ marginRight: '20px', borderRadius: '9px', width: '90px', height: '45px', fontSize: '18px' }}>
                                                    Edit
                                                </Link>
                                                <button className="btn btn-danger" onClick={(e) => handleDelete(worker.id)} style={{ marginRight: '10px', borderRadius: '9px', width: '90px', height: '45px', fontSize: '18px' }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </section>

            {/* Profile Modal */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{admin.userName}'s Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-8 offset-md-2 border rounded p-4 mt-2 shadow'>
                                <h2 className='text-center m-4'>Profile Details</h2>
                                <div className='card'>
                                    <div className='card-header'>
                                        Details:
                                        <ul className='list-group list-group-flush'>
                                            <li className='list-group-item'> <b>Name: </b>{admin.userName}</li>
                                            <li className='list-group-item'> <b>Password: </b>{admin.password}</li>
                                            <li className='list-group-item'> <b>Email: </b>{admin.email}</li>
                                            <li className='list-group-item'> <b>Designation: </b>{admin.designation}</li>
                                            <li className='list-group-item'> <b>Joining Date: </b>{admin.joinDate}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {deletingWorker && deletingWorker.userName}?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                    <button className="btn btn-danger" onClick={() => handleConfirmDelete(deletingWorker.id)}>Delete</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
