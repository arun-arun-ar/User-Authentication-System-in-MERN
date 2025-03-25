import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../../api/api";

const UpdateProfileImage = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [imageId, setImageId] = useState(null); // Store the imageId
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch the user's current image to get the imageId
    const fetchUserImage = async () => {
      try {
        const response = await api.get("/images/user-images", { withCredentials: true });
        if (response.data.success && response.data.image.length > 0) {
          setImageId(response.data.image[0].id); // Set the imageId
        } else {
          setMessage("No existing image found. Please upload a new one.");
        }
      } catch (error) {
        setMessage("Failed to fetch user image.");
      }
    };

    fetchUserImage();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage("Please select an image to upload.");
      return;
    }

    if (!imageId) {
      setMessage("No image to update. Please upload a new image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await api.put(`/images/update/${imageId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setMessage("Image updated successfully!");
        // Redirect to the user profile page after updating the image
        navigate("/user-profile");
      } else {
        setMessage(response.data.message || "Failed to update image.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-xl font-bold mb-4 text-center">Update Profile Image</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition"
          >
            Upload
          </button>
        </form>
        {message && <p className="text-center text-sm mt-3 text-gray-300">{message}</p>}
      </div>
    </div>
  );
};

export default UpdateProfileImage;
