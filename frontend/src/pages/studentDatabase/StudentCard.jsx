import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api'; 
import { 
    User, MapPin, Phone, Mail, Calendar, 
    BookOpen, Shield, Pencil, Save, X, Loader2 
} from 'lucide-react';

// --- Shadcn Components ---
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
// Ensure you have this hook
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner";

const StudentProfilePage = () => {
    const { id } = useParams(); 



    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // --- Editing State ---
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchStudentData();
    }, [id]);

    const fetchStudentData = async () => {
        try {
            const response = await api.get(`studentdetails/${id}/`);
            setStudent(response.data);
            setFormData(response.data); // Initialize form data
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch student", error);
            setLoading(false);
        }
    };

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit updates to the backend
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // We use PATCH to update only the changed fields
            const response = await api.patch(`studentdetails/${id}/`, formData);
            
            setStudent(response.data); // Update local view with new server data
            setIsEditing(false);
            
        toast.success("Profile Updated", {
                description: "Student details saved successfully.",
            });

        } catch (error) {
            console.error("Update failed", error);
            toast.error("Update Failed", {
                description: "Could not save changes. Please check your inputs.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(student); // Revert changes
        setIsEditing(false);
    };

    if (loading) return <ProfileSkeleton />;
    if (!student) return <div className="p-6 text-center">Student not found.</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl flex justify-center">
            <Card className="w-full shadow-lg">
                {/* --- Header --- */}
                <CardHeader className="bg-muted/30 p-6 flex flex-col md:flex-row gap-6 items-start border-b">
                    <Avatar className="w-28 h-28 border-4 border-white shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.fullName}`} />
                        <AvatarFallback>{student.fullName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl font-bold tracking-tight mb-1">
                                    {isEditing ? (
                                        <Input 
                                            name="fullName" 
                                            value={formData.fullName} 
                                            onChange={handleInputChange} 
                                            className="text-2xl font-bold h-10"
                                        />
                                    ) : student.fullName}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <User className="w-4 h-4" /> Index: {student.indexNumber}
                                </CardDescription>
                            </div>

                            {/* Edit Buttons */}
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                                            <X className="w-4 h-4 mr-1" /> Cancel
                                        </Button>
                                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1"/> : <Save className="w-4 h-4 mr-1" />}
                                            Save
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                        <Pencil className="w-4 h-4 mr-1" /> Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> {student.enrolledClass_str || "No Class"}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                {/* --- Content --- */}
                <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                    
                    {/* Left: Personal Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                            <User className="w-5 h-5" /> Personal Details
                        </h3>
                        
                        <EditableRow 
                            label="Date of Birth" 
                            name="dateOfBirth"
                            value={formData.dateOfBirth} 
                            isEditing={isEditing} 
                            onChange={handleInputChange}
                            type="date"
                            icon={<Calendar className="w-4 h-4" />}
                        />
                        <EditableRow 
                            label="Email Address" 
                            name="email"
                            value={formData.email} 
                            isEditing={isEditing} 
                            onChange={handleInputChange}
                            type="email"
                            icon={<Mail className="w-4 h-4" />}
                        />
                        <EditableRow 
                            label="Mobile Number" 
                            name="mobileNumber"
                            value={formData.mobileNumber} 
                            isEditing={isEditing} 
                            onChange={handleInputChange}
                            icon={<Phone className="w-4 h-4" />}
                        />
                        <EditableRow 
                            label="Residential Address" 
                            name="address"
                            value={formData.address} 
                            isEditing={isEditing} 
                            onChange={handleInputChange}
                            icon={<MapPin className="w-4 h-4" />}
                            fullWidth
                        />
                    </div>

                    {/* Right: Guardian Details (Read Only for now) */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                            <Shield className="w-5 h-5" /> Guardian Information
                        </h3>
                        <div className="p-4 bg-muted/20 rounded-lg space-y-3 border">
                            {/* Accessing nested guardian object from your updated serializer */}
                            <DetailRow label="Name" value={student.guardian?.guardianName} />
                            <DetailRow label="Relation" value={getGuardianLabel(student.guardian?.guardianType)} />
                            <DetailRow label="Contact" value={student.guardian?.guardianContactNumber} icon={<Phone className="w-4 h-4"/>} />
                            <DetailRow label="Email" value={student.guardian?.guardianEmail} icon={<Mail className="w-4 h-4"/>} />
                            <p className="text-xs text-muted-foreground mt-2 italic">
                                * Guardian details cannot be edited from this quick view.
                            </p>
                        </div>
                    </div>
                </CardContent>
                
                <Separator />
                <CardContent className="p-4 bg-muted/10 text-xs text-center text-muted-foreground">
                    Student Record ID: {student.indexNumber} • Enrolled: {student.enrollmentDate}
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
};

// --- Helper Components ---

const EditableRow = ({ label, name, value, isEditing, onChange, type = "text", icon, fullWidth }) => (
    <div className={`space-y-1 ${fullWidth ? 'col-span-2' : ''}`}>
        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            {icon} {label}
        </Label>
        {isEditing ? (
            <Input 
                name={name} 
                value={value || ''} 
                onChange={onChange} 
                type={type} 
                className="h-9"
            />
        ) : (
            <div className="text-sm font-medium py-1">{value || 'N/A'}</div>
        )}
    </div>
);

const DetailRow = ({ label, value, icon }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground flex items-center gap-2">
            {icon} {label}:
        </span>
        <span className="text-sm font-medium">{value || 'N/A'}</span>
    </div>
);

const getGuardianLabel = (type) => {
    const types = { 'M': 'Mother', 'F': 'Father', 'G': 'Guardian' };
    return types[type] || type;
};

const ProfileSkeleton = () => (
    <div className="container mx-auto p-6 max-w-4xl flex justify-center">
        <Card className="w-full">
            <CardHeader className="p-6 border-b flex gap-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </CardContent>
        </Card>
    </div>
);

export default StudentProfilePage;