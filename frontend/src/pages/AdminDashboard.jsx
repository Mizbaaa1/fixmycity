import { useEffect, useState } from "react";

function AdminDashboard() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

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
    }, []);

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>

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