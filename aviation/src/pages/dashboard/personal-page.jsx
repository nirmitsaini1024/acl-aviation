import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  User,
  Mail,
  Building,
  Users,
  Tag,
  Bell,
  Calendar,
  Clock,
} from "lucide-react";

const PersonalPage = ({ setUser, user }) => {
  const [initialSignature, setInitialSignature] = useState(user?.sig);
  const [signature, setSignature] = useState(user?.sig);
  const [initialProfilePicture, setInitialProfilePicture] = useState(
    user?.profilePic
  );
  const [profilePicture, setProfilePicture] = useState(user?.profilePic);
  const [hasChanges, setHasChanges] = useState(false);
  const signatureInputRef = useRef(null);
  const profilePictureInputRef = useRef(null);

  // Dummy user data from the form fields
  const userInfo = {
    domain: "Airport",
    department: "Security",
    firstName: "John",
    lastName: "Doe",
    email: "john.anderson@airport.com",
    title: "Airport Security Coordinator",
    reminder: "Weekly",
    joinDate: "January 15, 2020",
  };

  // Dummy group member data
  const groupMemberInfo = [
    {
      groupedIn: "Terminal Security Operations Group",
      reminder: "Daily",
    },
    {
      groupedIn: "Airport Security Coordinator Group",
      reminder: "Weekly",
    },
    {
      groupedIn: "TSA Group",
      reminder: "Daily",
    },
  ];

  // Check for changes whenever signature or profile picture changes
  useEffect(() => {
    if (
      signature !== initialSignature ||
      profilePicture !== initialProfilePicture
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [signature, profilePicture, initialSignature, initialProfilePicture]);
  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignature(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = () => {
    setInitialSignature(signature);
    setInitialProfilePicture(profilePicture);
    setHasChanges(false);
    setUser((user) => ({
      ...user,
      profilePic: profilePicture,
      sig: signature,
    }));
    alert("Changes saved successfully!");
  };
  const triggerSignatureUpload = () => {
    signatureInputRef.current.click();
  };
  const triggerProfilePictureUpload = () => {
    profilePictureInputRef.current.click();
  };
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h2>
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-blue-100">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="text-gray-400" size={48} />
              )}
            </div>
            <input
              type="file"
              ref={profilePictureInputRef}
              onChange={handleProfilePictureUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={triggerProfilePictureUpload}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg"
            >
              <Camera size={16} />
            </button>
          </div>
          {/* User Details */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {userInfo.firstName} {userInfo.middleName} {userInfo.lastName}
            </h3>
            <div className="flex gap-6 text-sm text-gray-600 items-center">
              <p className="text-lg text-blue-600 font-semibold mb-1">
                {userInfo.title}
              </p>
              •
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Joined on {userInfo.joinDate}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* User Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Professional Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building className="text-blue-600" />
            Personal Information
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Domain
              </label>
              <div className="flex items-center gap-2">
                <Building size={16} className="text-gray-400" />
                <span className="text-gray-800">{userInfo.domain}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Department
              </label>
              <div className="flex items-center gap-2">
                <Building size={16} className="text-gray-400" />
                <span className="text-gray-800">{userInfo.department}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Contact & Preferences */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Mail className="text-blue-600" />
            Contact & Preferences
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-800">{userInfo.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Reminder Frequency
              </label>
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-gray-400" />
                <span className="text-gray-800">{userInfo.reminder}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Member Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group-Member Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="text-blue-600" />
            Membership Information
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Grouped In
              </label>
              <div className="space-y-2">
                {groupMemberInfo.map((group, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center  bg-gray-50 px-3 py-2 rounded-md shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-800">
                        {group.groupedIn}
                      </span>
                    </div>
                    <div className="text-sm flex gap-1 items-center text-blue-500">
                      <Clock size={14} className="text-blue-500" />
                      Frequency Reminder -
                      <span className=" font-medium">
                        {group.reminder}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Digital Signature Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Upload className="text-blue-600" />
            Digital Signature
          </h4>
          <div className="space-y-4">
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-32 flex items-center justify-center">
              {signature ? (
                <img
                  src={signature}
                  alt="Signature"
                  className="max-h-24 max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-400 italic">No signature uploaded</p>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <input
                type="file"
                ref={signatureInputRef}
                onChange={handleSignatureUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={triggerSignatureUpload}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
              >
                <Upload size={18} />
                Upload Signature
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Save Button - Only shown when changes have been made */}
      {hasChanges && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg flex items-center gap-2 text-lg font-semibold"
          >
            <User size={20} />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalPage;
