import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
  Toast,
  ToastBody,
  ToastHeader,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { FaUserShield, FaBook, FaUserCircle, FaCheckCircle, FaBan, FaBalanceScale } from 'react-icons/fa'; // Change to FaUserCircle

const Tables = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateData, setUpdateData] = useState({ name: "", email: "", role: "", status: "" });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 5; // Set the number of users per page to 5

  useEffect(() => {
    fetchUsers(currentPage); // Fetch users when the component mounts or the page changes
  }, [currentPage]);

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/users/list-users?page=${page}&limit=${usersPerPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.totalUsers / usersPerPage)); // Calculate total pages based on the total number of users
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "" }), 3000);
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setUpdateData({ name: user.name, email: user.email, role: user.role, status: user.status });
    toggleModal();
  };

  const handleAdminAction = async (actionType, userId, data = {}) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      let url, method, requestData;
      switch (actionType) {
        case "changeRole":
          url = `http://localhost:5000/api/users/change-role`;
          method = "PUT";
          requestData = { userId, newRole: data.newRole };
          break;
        case "banUser":
          url = `http://localhost:5000/api/users/ban-user`;
          method = "PUT";
          requestData = { userId, ban: data.ban };
          break;
        case "deleteUser":
          url = `http://localhost:5000/api/users/delete-user/${userId}`;
          method = "DELETE";
          requestData = null;
          break;
        case "updateUser":
          url = `http://localhost:5000/api/users/update-user-info`;
          method = "PUT";
          requestData = { userId, updates: data.updates };
          break;
        default:
          return;
      }

      await axios({
        method,
        url,
        data: requestData,
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUsers(currentPage); // Refresh user list after action
      toggleModal(); // Close modal after successful update
      showToast("Action completed successfully", "success");
    } catch (err) {
      console.error("Error during admin action:", err.message);
      setError("Admin action failed");
      showToast("Failed to perform action", "danger");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="text-primary" />;
      case "Chercheur":
        return <FaBook className="text-info" />;
      case "Décideurs politiques":
        return <FaBalanceScale className="text-warning" />;
      case "user":
        return <FaUserCircle className="text-success" />; // Use FaUserCircle and set color to something non-white
      default:
        return <FaUserCircle className="text-success" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FaCheckCircle className="text-success" />;
      case "banned":
        return <FaBan className="text-danger" />;
      default:
        return <FaCheckCircle className="text-muted" />;
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h1 className="mb-0">User Management</h1>
              </CardHeader>
              {loading ? (
                <div className="text-center my-5">
                  <Spinner color="primary" />
                </div>
              ) : error ? (
                <p className="text-danger text-center">{error}</p>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col">Status</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          {getRoleIcon(user.role)} {user.role}
                        </td>
                        <td>
                          <Badge color="" className="badge-dot mr-4">
                            {getStatusIcon(user.status)} {user.status}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                onClick={() =>
                                  handleAdminAction("changeRole", user._id, { newRole: "admin" })
                                }
                              >
                                <i className="fas fa-user-shield"></i> Make Admin
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleAdminAction("banUser", user._id, { ban: true })
                                }
                              >
                                <i className="fas fa-ban"></i> Ban User
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleAdminAction("deleteUser", user._id)
                                }
                              >
                                <i className="fas fa-trash"></i> Delete User
                              </DropdownItem>
                              <DropdownItem onClick={() => openUpdateModal(user)}>
                                <i className="fas fa-edit"></i> Update User
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <CardFooter className="py-4">
                <Pagination className="pagination justify-content-end mb-0" listClassName="justify-content-end mb-0">
                  {[...Array(totalPages).keys()].map(pageNumber => (
                    <PaginationItem key={pageNumber}  active={pageNumber + 1 === currentPage}>

                      <PaginationLink className={currentPage === pageNumber +1 ? 'pag-active' : 'pag-notactive'}  onClick={() => handlePageChange(pageNumber + 1)}>
                        {pageNumber + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </Pagination>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Modal for Updating User */}
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Update User</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            value={updateData.name}
            onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
            placeholder="Name"
          />
          <Input
            type="email"
            value={updateData.email}
            onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
            placeholder="Email"
          />
          <Input
            type="select"
            value={updateData.role}
            onChange={(e) => setUpdateData({ ...updateData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="Chercheur">Chercheur</option>
            <option value="Décideurs politiques">Décideurs politiques</option> {/* Add new role */}
          </Input>
          <Input
            type="select"
            value={updateData.status}
            onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => handleAdminAction("updateUser", selectedUser._id, { updates: updateData })}
          >
            Save Changes
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`toast-container position-fixed bottom-0 end-0 p-3`}>
          <Toast isOpen={toast.visible}>
            <ToastHeader icon={toast.type}>{toast.type === "success" ? "Success" : "Error"}</ToastHeader>
            <ToastBody>{toast.message}</ToastBody>
          </Toast>
        </div>
      )}
    </>
  );
};

export default Tables;
