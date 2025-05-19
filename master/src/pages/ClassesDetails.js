import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ClassesDetails.css';

const ClassesDetails = () => {
  const { classid } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postFile, setPostFile] = useState(null); // New state for file

  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate();

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/getclassbyid/${classid}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setClassroom(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch class details');
      }
    } catch (error) {
      toast.error('Error fetching class details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, [classid]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/getuser`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        toast.error('An error occurred while fetching user data');
      }
    };

    fetchUser();
  }, []);

  const handleAddPost = () => {
    setShowPopup(true);
  };

  const handleSubmitPost = async () => {
    if (!postTitle.trim() || !postDescription.trim()) {
      toast.error('Title and description cannot be empty.');
      return;
    }

    const formData = new FormData();
    formData.append('title', postTitle);
    formData.append('description', postDescription);
    formData.append('classId', classid);
    if (postFile) {
      formData.append('file', postFile);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/addpost`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Post created successfully');
        setPostTitle('');
        setPostDescription('');
        setPostFile(null);
        setShowPopup(false);
        fetchClassDetails();
      } else {
        toast.error(data.message || 'Failed to create post');
      }
    } catch (error) {
      toast.error('An error occurred while creating the post');
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleJoinRequest = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/request-to-join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classroomId: classid,
          studentEmail: user?.email,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setShowJoinPopup(false);
        setShowOtpPopup(true);
        toast.success('OTP sent to the class owner');
      } else {
        toast.error(data.message || 'Failed to send join request');
      }
    } catch (error) {
      toast.error('An error occurred while sending join request');
    }
  };

  const handleSubmitOtp = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classroomId: classid,
          studentEmail: user?.email,
          otp,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setOtp('');
        setShowOtpPopup(false);
        toast.success('Successfully joined the class');
        fetchClassDetails();
      } else {
        setOtpError(data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      toast.error('An error occurred while verifying OTP');
    }
  };

  const handleCloseOtpPopup = () => {
    setShowOtpPopup(false);
    setOtpError('');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const isStudent = classroom?.students?.includes(user?.email);
  const isOwner = classroom?.owner === user?._id;

  return (
    <div className="class-details">
      <div className="section1">
        <img
          src="https://img.freepik.com/free-vector/school-students-classroom_74855-7856.jpg"
          alt="Classroom"
          className="class-image"
        />
        <h1 className="class-name">{classroom?.name}</h1>
        <p className="class-description">{classroom?.description}</p>

        {isOwner && (
          <button className="add-post-btn" onClick={handleAddPost}>
            Add Post
          </button>
        )}

        {!isStudent && !isOwner && (
          <button className="add-post-btn" onClick={() => setShowJoinPopup(true)}>
            Join Class
          </button>
        )}
      </div>

      <div className="post-grid">
        {(isStudent || isOwner) && classroom?.posts?.length > 0 ? (
          classroom.posts.map((post, index) => (
            <div key={index} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              {post.fileUrl && (
                <a href={post.fileUrl} target="_blank" rel="noopener noreferrer">
                  📄 View Attached File
                </a>
              )}
              <small>{new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add Post</h3>
            <input
              type="text"
              placeholder="Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setPostFile(e.target.files[0])}
            />
            <div className="popup-buttons">
              <button onClick={handleSubmitPost}>Submit</button>
              <button onClick={handleClosePopup}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showJoinPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Join Request</h3>
            <p>Do you want to join this class? An OTP will be sent to the class owner for approval.</p>
            <div className="popup-buttons">
              <button onClick={handleJoinRequest}>Send Join Request</button>
              <button onClick={() => setShowJoinPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showOtpPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {otpError && <p className="otp-error">{otpError}</p>}
            <div className="popup-buttons">
              <button onClick={handleSubmitOtp}>Submit</button>
              <button onClick={handleCloseOtpPopup}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesDetails;
