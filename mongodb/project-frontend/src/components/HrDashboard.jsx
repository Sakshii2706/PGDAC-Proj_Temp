import React, { useState, useEffect } from 'react';
import { listWorkers } from '../services/WorkerService';
import { useNavigate, useParams, Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

const HrDashboard = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [workers, setWorkers] = useState([]);
    const [hr, setHr] = useState({});
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deletingWorker, setDeletingWorker] = useState(null);
    const [filteredWorkers, setFilteredWorkers] = useState([]);

    useEffect(() => {
        loadWorkers();
        loadHr();
    }, []);

    useEffect(() => {
        const Employees = workers.filter(worker => worker.designation === 'EMPLOYEE');
        setFilteredWorkers(Employees);
    }, [workers]);

    const loadWorkers = async () => {
        try {
            const response = await listWorkers();
            setWorkers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadHr = async () => {
        try {
            const hrResp = await axios.get(`http://localhost:6900/api/workers/${id}`);
            setHr(hrResp.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogOut = () => {
        navigate("/");
    };

    const handleMyProfile = () => {
        setShowProfileModal(true);
    };

    const handleDeleteConfirmation = (worker) => {
        setDeletingWorker(worker);
        setShowDeleteConfirmation(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const handleDelete = async () => {
        try {
            if (deletingWorker) {
                await axios.delete(`http://localhost:6900/api/workers/${deletingWorker.id}`);
                loadWorkers();
            }
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddEmployee = () => {
        navigate("/addemployee");
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
                                            <strong>{hr.userName}</strong>
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
                    <h2 className='text-center' style={{ marginBottom: '40px', marginTop: '20px' }}>HR DashBoard</h2>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="btn btn-secondary" onClick={handleAddEmployee} style={{ marginBottom: '10px', marginRight: '1145px', borderRadius: '9px', width: '150px', height: '45px', fontSize: '18px', border: 'solid', borderColor: 'black' }}>
                            Add Employee
                        </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <table className="table table-striped table-bordered" style={{ width: 'fit-content', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid black' }}>Sr. No</th>
                                    <th style={{ border: '1px solid black' }}>Worker User Name</th>
                                    <th style={{ border: '1px solid black' }}>Worker Email</th>
                                    <th style={{ border: '1px solid black' }}>Worker Designation</th>
                                    <th style={{ border: '1px solid black' }}>Worker Joining Date</th>
                                    <th style={{ border: '1px solid black', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWorkers.map((worker, index) =>
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
                                            <Link className="btn btn-secondary" to={`/hr/${id}/manageleave/${worker.id}`} style={{ marginRight: '20px', borderRadius: '9px', width: '145px', height: '45px', fontSize: '18px' }}>
                                                Manage Leave
                                            </Link>
                                            <button className="btn btn-danger" onClick={() => handleDeleteConfirmation(worker)} style={{ marginRight: '10px', borderRadius: '9px', width: '90px', height: '45px', fontSize: '18px' }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{hr.userName}'s Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                                <h2 className='text-center m-4'>Profile Details</h2>
                                <div className='card'>
                                    <div className='card-header'>
                                        Details:
                                        <ul className='list-group list-group-flush'>
                                            <li className='list-group-item'> <b>Name: </b>{hr.userName}</li>
                                            <li className='list-group-item'> <b>Password: </b>{hr.password}</li>
                                            <li className='list-group-item'> <b>Email: </b>{hr.email}</li>
                                            <li className='list-group-item'> <b>Designation: </b>{hr.designation}</li>
                                            <li className='list-group-item'> <b>Joining Date: </b>{hr.joinDate}</li>
                                            <li className='list-group-item'> <b>Sick Leave Balance: </b>{hr.sickLeaveBalance}</li>
                                            <li className='list-group-item'> <b>casual Leave Balance: </b>{hr.casualLeaveBalance}</li>
                                            <li className='list-group-item'> <b>Privileged Leave Balance: </b>{hr.privilegeLeaveBalance}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onHide={handleCancelDelete} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {deletingWorker && deletingWorker.userName}?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HrDashboard;
