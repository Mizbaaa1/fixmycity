import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DepartmentDashboard() {
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/issues")
            .then((response) => response.json())
            .then((data) => {
                setIssues(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });

        fetch("http://localhost:5000/api/departments")
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
            (issue) => issue.department === selectedDepartment
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
                <option value="">All Departments</option>

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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DepartmentDashboard;