import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Row, Card, CardHeader, CardBody, Spinner } from "reactstrap";
import Header from "components/Headers/Header.js";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/audit-logs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use correct token for auth
          },
        });
        setLogs(response.data.logs); // Use logs from response
        setLoading(false);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        setError('Failed to fetch audit logs.');
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/audit-logs/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob', // Important for downloading files
      });

      // Create a URL for the blob and download it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audit-logs.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Error exporting audit logs:', err);
      setError('Failed to export audit logs.');
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
              <h1 className="mb-0">Audit Logs</h1>
<p className="text-muted mt-2">
  Review all user activities and system interactions logged for security and transparency.
</p>
<p className="text-muted">
  You can see logs based on action, target user, or details.
</p>
<button onClick={handleExport} className="btn custom-btn">Export Logs</button>

              </CardHeader>
              {loading ? (
                <div className="text-center my-5">
                  <Spinner color="primary" />
                </div>
              ) : error ? (
                <p className="text-danger text-center">{error}</p>
              ) : (
                <CardBody>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Action</th>
                        <th scope="col">Performed By</th>
                        <th scope="col">Target User</th>
                        <th scope="col">Details</th>
                        <th scope="col">Timestamp</th>
                        <th scope="col">IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
  {logs.map((log, index) => (
    <tr key={index}>
      <td>{log.action}</td>
      <td>{log.performedBy ? `${log.performedBy.name} (${log.performedBy.email})` : 'N/A'}</td>
      <td>{log.targetUser ? `${log.targetUser.name} (${log.targetUser.email})` : 'N/A'}</td> {/* Utilisez 'targetUser' */}
      <td>{JSON.stringify(log.details)}</td>
      <td>{new Date(log.timestamp).toLocaleString()}</td>
      <td>{log.ipAddress || 'N/A'}</td> {/* Vérifiez que l'adresse IP est présente */}
    </tr>
  ))}
</tbody>


                  </Table>
                </CardBody>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default AuditLogs;
