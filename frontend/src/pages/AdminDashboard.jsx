import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [issues, setIssues] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetch("http://localhost:5000/api/issues", {
            headers: {
                "user-id": user.id,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setIssues(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });

        fetch("http://localhost:5000/api/departments", {
            headers: {
                "user-id": user.id,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setDepartments(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
            <button
                onClick={() => {
                    localStorage.removeItem("user");
                    navigate("/login");
                }}
            >
                Logout
            </button>

            <p>
                Manage and monitor civic complaints submitted through FixMyCity.
            </p>

            {loading && <p>Loading complaints...</p>}

            {!loading && issues.length === 0 && (
                <p>No complaints found.</p>
            )}

            {!loading && issues.length > 0 && (
                <div className="complaints-list">
                    {issues.map((issue) => (
                        <div className="complaint-card" key={issue._id}>
                            <h2>{issue.title}</h2>

                            <p>
                                <strong>Complaint ID:</strong> {issue._id}
                            </p>

                            <p>
                                <strong>Category:</strong> {issue.category}
                            </p>

                            <p>
                                <strong>Description:</strong> {issue.description}
                            </p>

                            <p>
                                <strong>Status:</strong>
                            </p>

                            <select
                                value={issue.status}
                                onChange={async (e) => {
                                    const newStatus = e.target.value;

                                    try {
                                        const response = await fetch(
                                            `http://localhost:5000/api/issues/${issue._id}/status`,
                                            {
                                                method: "PUT",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "user-id": user.id,
                                                },
                                                body: JSON.stringify({
                                                    status: newStatus,
                                                }),
                                            }
                                        );

                                        if (!response.ok) {
                                            throw new Error("Failed to update status");
                                        }

                                        const data = await response.json();

                                        setIssues((currentIssues) =>
                                            currentIssues.map((currentIssue) =>
                                                currentIssue._id === issue._id
                                                    ? data.issue
                                                    : currentIssue
                                            )
                                        );
                                    } catch (error) {
                                        console.error(error);
                                        alert("Failed to update complaint status.");
                                    }
                                }}
                            >
                                <option value="Submitted">Submitted</option>
                                <option value="Verified">Verified</option>
                                <option value="Assigned">Assigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>

                            <p>
                                <strong>Department:</strong>
                            </p>

                            <select
                                value={issue.department || ""}
                                onChange={async (e) => {
                                    const departmentId = e.target.value;

                                    try {
                                        const response = await fetch(
                                            `http://localhost:5000/api/issues/${issue._id}/department`,
                                            {
                                                method: "PUT",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    "user-id": user.id,
                                                },
                                                body: JSON.stringify({
                                                    department: departmentId,
                                                }),
                                            }
                                        );

                                        if (!response.ok) {
                                            throw new Error("Failed to assign department");
                                        }

                                        const data = await response.json();

                                        setIssues((currentIssues) =>
                                            currentIssues.map((currentIssue) =>
                                                currentIssue._id === issue._id
                                                    ? data.issue
                                                    : currentIssue
                                            )
                                        );
                                    } catch (error) {
                                        console.error(error);
                                        alert("Failed to assign department.");
                                    }
                                }}
                            >
                                <option value="">Select Department</option>

                                {departments.map((department) => (
                                    <option key={department._id} value={department._id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                            {issue.department && (
                                <p>
                                    <strong>Assigned Department:</strong>{" "}
                                    {
                                        departments.find(
                                            (department) => department._id === issue.department
                                        )?.name
                                    }
                                </p>
                            )}
                            {issue.photo && (
                                <div>
                                    <p>
                                        <strong>Photo:</strong>
                                    </p>

                                    <img
                                        src={`http://localhost:5000${issue.photo}`}
                                        alt="Complaint evidence"
                                        style={{
                                            width: "300px",
                                            maxHeight: "250px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </div>
                            )}
                            {issue.latitude && issue.longitude && (
                                <div style={{ marginTop: "20px" }}>
                                    <p>
                                        <strong>📍 Complaint Location:</strong>
                                    </p>

                                    <MapContainer
                                        center={[issue.latitude, issue.longitude]}
                                        zoom={15}
                                        style={{
                                            height: "300px",
                                            width: "100%",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <TileLayer
                                            attribution='&copy; OpenStreetMap contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        <Marker position={[issue.latitude, issue.longitude]}>
                                            <Popup>
                                                <strong>{issue.title}</strong>
                                                <br />
                                                Complaint Location
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${issue.latitude},${issue.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: "inline-block",
                                            marginTop: "10px",
                                            padding: "10px 15px",
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                            textDecoration: "none",
                                            borderRadius: "6px",
                                        }}
                                    >
                                        🧭 Get Directions
                                    </a>
                                </div>
                            )}
                            <p>
                                <strong>Submitted:</strong>{" "}
                                {new Date(issue.createdAt).toLocaleString()}
                            </p>


                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;