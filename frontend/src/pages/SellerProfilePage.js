import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  Home, 
  User, 
  MessageCircle, 
  LogOut,
  List,
  Bell,     
  Box,
  Camera,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Edit,
  Save,
  Upload
} from 'lucide-react';


// Seller Profile Management Page
const SellerProfile = () => {
  // Initial profile state
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Seller Street, Marketplace City, ST 12345',
    businessName: 'Doe\'s Online Auctions',
    taxId: '12-3456789',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Experienced online seller with 5+ years in e-commerce and auctions.',
    
    // Seller verification details
    verificationStatus: {
      documentVerified: true,
      addressVerified: true,
      paymentVerified: false
    }
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Temporary state for editing
  const [editProfile, setEditProfile] = useState({...profile});

  // Profile image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const saveProfile = () => {
    setProfile({...editProfile});
    setIsEditing(false);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar selectedItem="Profile" />

      {/* Main Profile Content */}
      <div className="ml-64 w-full bg-gray-50 min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Profile Header */}
          <div className="flex items-center mb-8">
            <div className="relative">
              <img 
                src={profile.profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600">
                  <Camera size={20} />
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-600">{profile.businessName}</p>
            </div>
            <div className="ml-auto">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  <Edit size={20} className="mr-2" /> Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveProfile}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    <Save size={20} className="mr-2" /> Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2 text-blue-600" size={24} /> 
                Personal Information
              </h2>
              {!isEditing ? (
                <>
                  <p><strong>First Name:</strong> {profile.firstName}</p>
                  <p><strong>Last Name:</strong> {profile.lastName}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone}</p>
                </>
              ) : (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={editProfile.firstName}
                    onChange={(e) => setEditProfile(prev => ({...prev, firstName: e.target.value}))}
                    placeholder="First Name"
                    className="w-full p-2 border rounded-lg"
                  />
                  <input 
                    type="text" 
                    value={editProfile.lastName}
                    onChange={(e) => setEditProfile(prev => ({...prev, lastName: e.target.value}))}
                    placeholder="Last Name"
                    className="w-full p-2 border rounded-lg"
                  />
                  <input 
                    type="email" 
                    value={editProfile.email}
                    onChange={(e) => setEditProfile(prev => ({...prev, email: e.target.value}))}
                    placeholder="Email"
                    className="w-full p-2 border rounded-lg"
                  />
                  <input 
                    type="tel" 
                    value={editProfile.phone}
                    onChange={(e) => setEditProfile(prev => ({...prev, phone: e.target.value}))}
                    placeholder="Phone Number"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Business Information */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Box className="mr-2 text-blue-600" size={24} /> 
                Business Details
              </h2>
              {!isEditing ? (
                <>
                  <p><strong>Business Name:</strong> {profile.businessName}</p>
                  <p><strong>Tax ID:</strong> {profile.taxId}</p>
                  <p><strong>Address:</strong> {profile.address}</p>
                  <p className="mt-4">{profile.bio}</p>
                </>
              ) : (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={editProfile.businessName}
                    onChange={(e) => setEditProfile(prev => ({...prev, businessName: e.target.value}))}
                    placeholder="Business Name"
                    className="w-full p-2 border rounded-lg"
                  />
                  <input 
                    type="text" 
                    value={editProfile.taxId}
                    onChange={(e) => setEditProfile(prev => ({...prev, taxId: e.target.value}))}
                    placeholder="Tax ID"
                    className="w-full p-2 border rounded-lg"
                  />
                  <textarea 
                    value={editProfile.address}
                    onChange={(e) => setEditProfile(prev => ({...prev, address: e.target.value}))}
                    placeholder="Business Address"
                    className="w-full p-2 border rounded-lg"
                  />
                  <textarea 
                    value={editProfile.bio}
                    onChange={(e) => setEditProfile(prev => ({...prev, bio: e.target.value}))}
                    placeholder="Short Bio"
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shield className="mr-2 text-blue-600" size={24} /> 
              Verification Status
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-medium flex items-center">
                  <CreditCard className="mr-2 text-green-500" size={20} />
                  Document Verification
                </h3>
                <p className={`
                  font-semibold 
                  ${profile.verificationStatus.documentVerified 
                    ? 'text-green-600' 
                    : 'text-yellow-600'}
                `}>
                  {profile.verificationStatus.documentVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-medium flex items-center">
                  <MapPin className="mr-2 text-green-500" size={20} />
                  Address Verification
                </h3>
                <p className={`
                  font-semibold 
                  ${profile.verificationStatus.addressVerified 
                    ? 'text-green-600' 
                    : 'text-yellow-600'}
                `}>
                  {profile.verificationStatus.addressVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-medium flex items-center">
                  <Mail className="mr-2 text-green-500" size={20} />
                  Payment Verification
                </h3>
                <p className={`
                  font-semibold 
                  ${profile.verificationStatus.paymentVerified 
                    ? 'text-green-600' 
                    : 'text-yellow-600'}
                `}>
                  {profile.verificationStatus.paymentVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;