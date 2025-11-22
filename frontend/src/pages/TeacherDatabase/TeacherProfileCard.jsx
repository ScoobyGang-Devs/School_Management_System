import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api'; 
import { 
    User, MapPin, Phone, Mail, Calendar, 
    GraduationCap, Briefcase, Pencil, Save, X, Loader2,
    Hash, Layers
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
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TeacherProfilePage = () => {
    const { id } = useParams(); 

    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // --- Editing State ---
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchTeacherData();
    }, [id]);

    const fetchTeacherData = async () => {
        try {
            // Assuming your backend has a specific detail view at this URL
            const response = await api.get(`teacherdetails/${id}/`);
            setTeacher(response.data);
            setFormData(response.data); 
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch teacher", error);
            toast.error("Error", { description: "Could not load teacher details." });
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // PATCH request to update details
            const response = await api.patch(`teacherdetails/${id}/`, formData);
            setTeacher(response.data);
            setIsEditing(false);
            toast.success("Profile Updated", { description: "Teacher details saved successfully." });
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Update Failed", { description: "Could not save changes." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(teacher); // Revert
        setIsEditing(false);
    };

    // Helper to render the assigned class string safely
    const renderClassString = (clsObj) => {
        if (!clsObj) return "Not Assigned";
        if (typeof clsObj === 'object' && clsObj.grade) {
            return `Grade ${clsObj.grade} - ${clsObj.className}`;
        }
        return clsObj; // Fallback if it's just a string/ID
    };

    if (loading) return <ProfileSkeleton />;
    if (!teacher) return <div className="p-6 text-center">Teacher not found.</div>;

    return (
        <div className="container mx-auto p-6 max-w-5xl flex justify-center">
            <Card className="w-full shadow-lg">
                {/* --- Header --- */}
                <CardHeader className="bg-muted/30 p-6 flex flex-col md:flex-row gap-6 items-start border-b">
                    <Avatar className="w-28 h-28 border-4 border-white shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.fullName}`} />
                        <AvatarFallback>{teacher.fullName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <Select 
                                                value={formData.title} 
                                                onValueChange={(val) => handleSelectChange('title', val)}
                                            >
                                                <SelectTrigger className="w-[80px] h-10">
                                                    <SelectValue placeholder="Title" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Mr">Mr</SelectItem>
                                                    <SelectItem value="Mrs">Mrs</SelectItem>
                                                    <SelectItem value="Ms">Ms</SelectItem>
                                                    <SelectItem value="Ven">Ven</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                name="fullName" 
                                                value={formData.fullName} 
                                                onChange={handleInputChange} 
                                                className="text-2xl font-bold h-10 w-full md:w-96"
                                            />
                                        </div>
                                    ) : (
                                        `${teacher.title || ''} ${teacher.fullName}`
                                    )}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <Hash className="w-4 h-4" /> Employee ID: {teacher.teacherId} 
                                    <span className="mx-2">•</span>
                                    <Briefcase className="w-4 h-4" /> {teacher.section || "General Staff"}
                                </CardDescription>
                            </div>

                            {/* Action Buttons */}
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
                        
                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <Badge variant={teacher.assignedClass ? "default" : "secondary"} className="px-3 py-1 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" /> 
                                {teacher.assignedClass ? `Class Teacher: ${renderClassString(teacher.assignedClass)}` : "Subject Teacher"}
                            </Badge>
                            <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                                <Layers className="w-3 h-3" /> Section: {teacher.section || "N/A"}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                {/* --- Content --- */}
                <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                    
                    {/* Left: Personal & Contact Details */}
                    <div className="space-y-5">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-primary border-b pb-2">
                            <User className="w-5 h-5" /> Personal Information
                        </h3>
                        
                        <div className="space-y-4">
                            <EditableRow 
                                label="Name with Initials" 
                                name="nameWithInitials"
                                value={formData.nameWithInitials} 
                                isEditing={isEditing} 
                                onChange={handleInputChange}
                            />
                            <EditableRow 
                                label="NIC Number" 
                                name="nic_number" // Ensure this matches your API key
                                value={formData.nic_number} 
                                isEditing={isEditing} 
                                onChange={handleInputChange}
                            />
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
                                label="Gender" 
                                name="gender"
                                value={formData.gender === 'M' ? 'Male' : 'Female'}
                                // Gender usually hard to edit via text, keeping read-only logic or needing select
                                isEditing={false} 
                                onChange={handleInputChange}
                            />
                        </div>

                        <h3 className="font-semibold text-lg flex items-center gap-2 text-primary border-b pb-2 mt-6">
                            <Phone className="w-5 h-5" /> Contact Details
                        </h3>
                        <div className="space-y-4">
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
                    </div>

                    {/* Right: Academic/Professional Details */}
                    <div className="space-y-5">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-primary border-b pb-2">
                            <Briefcase className="w-5 h-5" /> Professional Info
                        </h3>
                        
                        <div className="bg-muted/10 rounded-lg p-5 space-y-4 border">
                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Assigned Section</Label>
                                {isEditing ? (
                                    <Input name="section" value={formData.section || ''} onChange={handleInputChange} className="h-9 bg-white" />
                                ) : (
                                    <div className="font-medium">{teacher.section || 'Unassigned'}</div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-medium text-muted-foreground">Date Joined</Label>
                                <div className="font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 opacity-50" />
                                    {teacher.enrollmentDate || 'N/A'}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-muted-foreground">Currently Teaching Classes</Label>
                                <div className="flex flex-wrap gap-2">
                                    {teacher.teachingClasses && teacher.teachingClasses.length > 0 ? (
                                        teacher.teachingClasses.map((cls, idx) => (
                                            <Badge key={idx} variant="outline" className="bg-white">
                                                {renderClassString(cls)}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground italic">No specific classes assigned.</span>
                                    )}
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2">
                                    * Class assignments are managed via the Roster page.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                
                <Separator />
                <CardContent className="p-4 bg-muted/10 text-xs text-center text-muted-foreground">
                    Teacher Record ID: {teacher.teacherId} • Joined: {teacher.enrollmentDate}
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

const ProfileSkeleton = () => (
    <div className="container mx-auto p-6 max-w-5xl flex justify-center">
        <Card className="w-full">
            <CardHeader className="p-6 border-b flex gap-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-32 w-full" />
            </CardContent>
        </Card>
    </div>
);

export default TeacherProfilePage;