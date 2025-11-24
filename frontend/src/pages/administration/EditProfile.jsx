import { useState } from "react";
import request from "../../reqMethods"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function EditProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const status = localStorage.getItem("status");
  const isAdmin = status === "admin";

  const [formData, setFormData] = useState({
    title: storedUser.title || "",
    nameWithInitials: storedUser.nameWithInitials || "",
    fullName: storedUser.fullName || "",
    dateOfBirth: storedUser.dateOfBirth || "",
    gender: storedUser.gender || "",
    email: storedUser.email || "",
    address: storedUser.address || "",
    enrollmentDate: storedUser.enrollmentDate || "",
    mobileNumber: storedUser.mobileNumber || "",
    ...(isAdmin && {position: storedUser.position || ""})
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccess(false);
    
    try {
      const path = status === "teacher"? "teacher-profile":"admin-profile";
      const result = await request.POST(
        `http://localhost:8000/${path}/`, formData
      );

      console.log("Server Response:", result);
      if (result){
        localStorage.setItem("user", JSON.stringify(formData));
        console.log("Profile Updated:", formData);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "Failed to save profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(storedUser);
    setErrors({});
    setShowSuccess(false);
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Edit Teacher Profile</CardTitle>
          <CardDescription className="text-center">
            Update your profile information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Profile saved successfully!
              </AlertDescription>
            </Alert>
          )}

          {errors.submit && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name With Initials */}
              <div className="space-y-2">
                <Label htmlFor="nameWithInitials">Name with initials</Label>
                <Input
                  id="nameWithInitials"
                  name="nameWithInitials"
                  type="text"
                  value={formData.nameWithInitials}
                  onChange={handleChange}
                  placeholder="Ex: J.Smith"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ex: John Smith"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Select 
                  value={formData.title} 
                  onValueChange={(value) => handleSelectChange("title", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ven.">Ven.</SelectItem>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Ms.">Ms.</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              {/* Enrollment Date */}
              <div className="space-y-2">
                <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                <Input
                  id="enrollmentDate"
                  name="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* Address - Full Width */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows="3"
              />
            </div>

            {/* Position - Only for Admin */}
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select 
                  value={formData.position} 
                  onValueChange={(value) => handleSelectChange("position", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principal">Principal</SelectItem>
                    <SelectItem value="Vice Principal">Vice Principal</SelectItem>
                    <SelectItem value="Staff Admin">Staff Admin</SelectItem>
                    <SelectItem value="Section Head">Section Head</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="w-full md:w-40"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-40"
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}