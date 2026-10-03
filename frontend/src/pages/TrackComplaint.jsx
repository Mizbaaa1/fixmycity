import { useEffect, useState } from "react";

function TrackComplaint() {
    const [issues, setIssues] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [locations, setLocations] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        fetch("http://localhost:5000/api/issues", {
            headers: {
                "user-id": user.id,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch complaints");
                }
                return response.json();
            })
            .then((data) => {
                setIssues(data);

                data.forEach((issue) => {
                    if (issue.latitude && issue.longitude) {
                        getLocationName(
                            issue.latitude,
                            issue.longitude,
                            issue._id
                        );
                    }
                });

                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError("Unable to load complaints.");
                setLoading(false);
            });
    }, []);
    const getLocationName = async (latitude, longitude, issueId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/location?latitude=${latitude}&longitude=${longitude}`
            );

            if (!response.ok) {
                throw new Error("Failed to get location");
            }

            const data = await response.json();

            setLocations((currentLocations) => ({
                ...currentLocations,
                [issueId]: data.location || "Location unavailable",
            }));
        } catch (error) {
            console.error("Error getting location:", error);

            setLocations((currentLocations) => ({
                ...currentLocations,
                [issueId]: "Location unavailable",
            }));
        }
    };
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

                                <p>
                                    <strong>Status:</strong> {issue.status}
                                </p>
                            </div>
                            <p>
                                <strong>Category:</strong> {issue.category}
                            </p>

                            <p>
                                <strong>Description:</strong> {issue.description}
                            </p>

                            <p>
                                <strong>📍 Location:</strong>{" "}
                                {locations[issue._id] || "Getting location..."}
                            </p>
                            <p>
                                <strong>Submitted:</strong>{" "}
                                {new Date(issue.createdAt).toLocaleString()}
                            </p>
                            {issue.status === "Resolved" && issue.resolvedPhoto && (
                                <div style={{ marginTop: "20px" }}>
                                    <p>
                                        <strong>📷 Resolved Work Photo:</strong>
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
                    ))}
                </div>
            )}
        </div>
    );
}

export default TrackComplaint;