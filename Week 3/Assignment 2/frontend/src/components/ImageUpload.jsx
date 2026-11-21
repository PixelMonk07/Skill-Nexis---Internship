
import { useState } from "react";
import api from "../services/api";

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Preview selected image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setUploadedUrl("");
    setMessage("");
  };

  // Upload image to backend
  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      const response = await api.post("/upload", formData);

      setUploadedUrl(
        `http://localhost:3500${response.data.imageUrl}`
      );

      setMessage("Image uploaded successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload an Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {preview && (
        <div>
          <h3>Preview</h3>
          <img src={preview} alt="Preview" width="200" />
        </div>
      )}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {message && <p>{message}</p>}

      {uploadedUrl && (
        <div>
          <h3>Uploaded Image</h3>
          <img
            src={uploadedUrl}
            alt="Uploaded"
            width="200"
          />
        </div>
      )}
    </div>
  );
}
