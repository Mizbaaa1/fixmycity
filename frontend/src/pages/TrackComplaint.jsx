import { useEffect, useState } from "react";

function TrackComplaint() {
    const [issues, setIssues] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/issues")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch complaints");
                }
                return response.json();
            })
            .then((data) => {
                setIssues(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError("Unable to load complaints.");
                setLoading(false);
            });
    }, []);

    return (
        <div className="track-page">
            <h1>Track Complaints</h1>

            <p className="track-description">
                View the complaints submitted through FixMyCity.
            </p>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Enter Complaint ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />

                <button
                    onClick={() => {
                        if (searchId.trim() === "") {
                            return;
                        }

                        const foundIssue = issues.find(
                            (issue) => issue._id === searchId.trim()
                        );

                        if (foundIssue) {
                            setIssues([foundIssue]);
                        } else {
                            setIssues([]);
                            setError("Complaint not found.");
                        }
                    }}
                >
                    Search
                </button>

                <button
                    onClick={() => {
                        window.location.reload();
                    }}
                >
                    Clear
                </button>
            </div>

            {loading && <p>Loading complaints...</p>}

            {error && <p>{error}</p>}

            {successMessage && <p>{successMessage}</p>}

            {!loading && !error && issues.length === 0 && (
                <p>No complaints found.</p>
            )}

            {!loading && !error && issues.length > 0 && (
                <div className="complaints-list">
                    {issues.map((issue) => (
                        <div className="complaint-card" key={issue._id}>

                            <div className="complaint-header">
                                <h2>{issue.title}</h2>

                                <p>
                                    <strong>Complaint ID:</strong> {issue._id}
                                </p>

                                <select
                                    className={`status-select status-${issue.status
                                        .toLowerCase()
                                        .replace(" ", "-")}`}
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
                                            setSuccessMessage("Status updated successfully!");

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
                            </div>
                            <p>
                                <strong>Category:</strong> {issue.category}
                            </p>

                            <p>
                                <strong>Description:</strong> {issue.description}
                            </p>

                            <p>
                                <strong>Location:</strong>
                            </p>

                            <p>
                                Latitude: {issue.latitude}
                            </p>

                            <p>
                                Longitude: {issue.longitude}
                            </p>

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

export default TrackComplaint;