import { useState } from "react";

function ReportIssue() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  const [location, setLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "GPS location is not supported by your browser."
      );
      return;
    }

    setLocationMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude: latitude,
          longitude: longitude,
        });

        setLocationMessage("Location found successfully!");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationMessage(
            "Location permission was denied. Please allow location access."
          );
        } else {
          setLocationMessage(
            "Unable to get your location. Please try again."
          );
        }
      }
    );
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!title || !category || !description) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!location) {
    alert("Please get your GPS location.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        category: category,
        description: description,
        latitude: location.latitude,
        longitude: location.longitude,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Backend response:", data);
      setSubmitted(true);
      alert("Civic issue submitted successfully!");
    } else {
      alert("Failed to submit the issue.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Cannot connect to the backend.");
  }
};
  return (
    <div className="report-page">
      <div className="report-card">

        <h1>Report an Issue</h1>

        <p className="report-description">
          Help improve your community by reporting a civic issue.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Issue Title */}
          <div className="form-group">
            <label>Issue Title</label>

            <input
              type="text"
              placeholder="Example: Street light not working"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Issue Category</label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Select a category</option>

              <option value="Road / Pothole">
                Road / Pothole
              </option>

              <option value="Street Light">
                Street Light
              </option>

              <option value="Garbage / Waste">
                Garbage / Waste
              </option>

              <option value="Water Supply">
                Water Supply
              </option>

              <option value="Drainage">
                Drainage
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>

            <textarea
              placeholder="Describe the issue in detail"
              rows="5"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            ></textarea>
          </div>

          {/* GPS Location */}
          <div className="form-group">
            <label>GPS Location</label>

            <button
              type="button"
              className="location-button"
              onClick={getCurrentLocation}
            >
              📍 Use My Current Location
            </button>

            {locationMessage && (
              <p className="location-message">
                {locationMessage}
              </p>
            )}

            {location && (
              <div className="location-result">
                <p>
                  <strong>Latitude:</strong>{" "}
                  {location.latitude}
                </p>

                <p>
                  <strong>Longitude:</strong>{" "}
                  {location.longitude}
                </p>
              </div>
            )}
          </div>

          {/* Photo */}
          <div className="form-group">
            <label>Upload Photo</label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setPhoto(event.target.files[0])
              }
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="report-submit"
          >
            Submit Issue
          </button>

        </form>

        {/* Success Message */}
        {submitted && (
          <div className="success-message">
            <h3>Issue Submitted Successfully!</h3>

            <p>
              Your complaint has been recorded.
            </p>

            <p>
              <strong>Title:</strong> {title}
            </p>

            <p>
              <strong>Category:</strong> {category}
            </p>

            <p>
              <strong>Latitude:</strong>{" "}
              {location.latitude}
            </p>

            <p>
              <strong>Longitude:</strong>{" "}
              {location.longitude}
            </p>

            {photo && (
              <p>
                <strong>Photo:</strong> {photo.name}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default ReportIssue;