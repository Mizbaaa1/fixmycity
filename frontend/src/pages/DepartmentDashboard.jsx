import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";

function DepartmentDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [issues, setIssues] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");

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

    const filteredIssues = selectedDepartment
        ? issues.filter(
            (issue) => String(issue.department) === String(selectedDepartment)
        )
        : issues;

    return (
        <div className="admin-page">
            <h1>Department Dashboard</h1>

            <button
                onClick={() => {
                    localStorage.removeItem("user");
                    navigate("/login");
                }}
            >
                Logout
            </button>
            <p>
                View complaints assigned to a department.
            </p>
            {selectedDepartment && (
                <h2>
                    {
                        departments.find(
                            (department) => department._id === selectedDepartment
                        )?.name
                    }
                </h2>
            )}
            {successMessage && (
                <p>
                    {successMessage}
                </p>
            )}

            <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
            >


                {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                        {department.name}
                    </option>
                ))}
            </select>

            {loading && <p>Loading complaints...</p>}

            {!loading && filteredIssues.length === 0 && (
                <p>No complaints assigned to this department.</p>
            )}

            {!loading && filteredIssues.length > 0 && (
                <div className="complaints-list">
                    {filteredIssues.map((issue) => (
                        <div className="complaint-card" key={issue._id}>
                            <h2>{issue.title}</h2>

                            <p>
                                <strong>Complaint ID:</strong>{" "}
                                {issue._id}
                            </p>

                            <p>
                                <strong>Category:</strong>{" "}
                                {issue.category}
                            </p>

                            <p>
                                <strong>Description:</strong>{" "}
                                {issue.description}
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
                                        setSuccessMessage("Complaint status updated successfully!");

                                        setTimeout(() => {
                                            setSuccessMessage("");
                                        }, 3000);
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

                            {issue.department && (
                                <p>
                                    <strong>Department:</strong>{" "}
                                    {
                                        departments.find(
                                            (department) =>
                                                department._id ===
                                                issue.department
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
                            {issue.status === "Resolved" && (
                                <div style={{ marginTop: "20px" }}>
                                    <p>
                                        <strong>📷 Upload Resolved Work Photo:</strong>
                                    </p>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];

                                            if (!file) {
                                                return;
                                            }

                                            try {
                                                const formData = new FormData();
                                                formData.append("resolvedPhoto", file);

                                                const response = await fetch(
                                                    `http://localhost:5000/api/issues/${issue._id}/resolved-photo`,
                                                    {
                                                        method: "PUT",
                                                        headers: {
                                                            "user-id": user.id,
                                                        },
                                                        body: formData,
                                                    }
                                                );

                                                if (!response.ok) {
                                                    throw new Error("Failed to upload resolved photo");
                                                }

                                                const data = await response.json();

                                                setIssues((currentIssues) =>
                                                    currentIssues.map((currentIssue) =>
                                                        currentIssue._id === issue._id
                                                            ? data.issue
                                                            : currentIssue
                                                    )
                                                );

                                                setSuccessMessage(
                                                    "Resolved photo uploaded successfully!"
                                                );

                                                setTimeout(() => {
                                                    setSuccessMessage("");
                                                }, 3000);
                                            } catch (error) {
                                                console.error(error);
                                                alert("Failed to upload resolved photo.");
                                            }
                                        }}
                                    />

                                    {issue.resolvedPhoto && (
                                        <div style={{ marginTop: "10px" }}>
                                            <p>
                                                <strong>Resolved Work Photo:</strong>
                                            </p>

                                            <img
                                                src={`http://localhost:5000${issue.resolvedPhoto}`}
                                                alt="Resolved work"
                                                style={{
                                                    width: "300px",
                                                    maxHeight: "250px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </div>
                                    )}
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DepartmentDashboard;