"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { User } from "@/types/user";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.updateUser(user!._id, formData);
      // @ts-expect-error it keep giving the error
      setUser((prevData) => ({ ...prevData, ...formData }));
      if (response.success) {
        toast.success("successfully updated profile");
      }
      console.log(response);
    } catch (err) {
      setError("Failed to update user details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="bg-gray-50 p-6 md:w-1/3">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-4xl mb-4">
                {user?.name?.charAt(0) || "U"}
              </div>
              <h2 className="text-xl font-bold">Name: {user?.name}</h2>
              <p className="text-gray-600">Role: {user?.role}</p>
              <p className="text-gray-500 mt-1">Email: {user?.email}</p>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 md:w-2/3">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="name"
                    type="text"
                    className="form-input border rounded-md p-2 w-full"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input border rounded-md p-2 w-full"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* <div>
                  <label htmlFor="bio" className="form-label">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={6}
                    className="form-input border rounded-md p-2 w-full"
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div> */}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-4 py-2 mt-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
