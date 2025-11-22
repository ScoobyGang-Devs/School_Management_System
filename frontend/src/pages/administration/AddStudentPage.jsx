import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api'; // Ensure this path is correct for your project
import { 
    UserPlus, Calendar, Mail, Phone, MapPin, 
    BookOpen, Shield, Save, Loader2, X, Hash, User, PlusCircle 
} from 'lucide-react';

// --- Shadcn Components ---
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// ===========================================================================
// SUB-COMPONENT: Add Guardian Modal
// Handles creating a guardian independently within the student page
// ===========================================================================
const AddGuardianModal = ({ onGuardianAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Model: GuardianDetail
    const initialGuardianState = {
        title: 'Mr',
        guardianNIC: '',
        guardianName: '',
        guardianType: 'F', // Default to Father
        guardianEmail: '',
        guardianContactNumber: '',
        alternativeContactNumber: '',
        jobTitle: '',
        permanentAddress: '',
        currentAddress: '',
    };

    const [formData, setFormData] = useState(initialGuardianState);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for this field if it exists
        if (errors[e.target.name]) setErrors({...errors, [e.target.name]: null});
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            // POST to your existing guardian endpoint
            const response = await api.post('guardiandetails/', formData);
            
            toast.success("Guardian Created Successfully");
            
            // Pass the newly created guardian object back to the parent component
            onGuardianAdded(response.data);
            
            setIsOpen(false); // Close modal
            setFormData(initialGuardianState); // Reset form
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                toast.error("Validation Error", { description: "Please check the fields highlighted in red." });
            } else {
                toast.error("Failed to create guardian");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-dashed border-2 flex gap-2 h-12 hover:bg-accent/50">
                    <PlusCircle className="w-4 h-4 text-primary" /> Register New Guardian
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Register New Guardian</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    
                    {/* Title & Name */}
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Select value={formData.title} onValueChange={(val) => handleSelectChange('title', val)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mr">Mr</SelectItem>
                                <SelectItem value="Mrs">Mrs</SelectItem>
                                <SelectItem value="Ms">Ms</SelectItem>
                                <SelectItem value="Ven">Ven</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Full Name <span className="text-red-500">*</span></Label>
                        <Input name="guardianName" value={formData.guardianName} onChange={handleChange} required />
                    </div>

                    {/* NIC & Relation */}
                    <div className="space-y-2">
                        <Label>NIC Number <span className="text-red-500">*</span></Label>
                        <Input name="guardianNIC" value={formData.guardianNIC} onChange={handleChange} required className={errors.guardianNIC ? "border-red-500" : ""} />
                        <FormError error={errors.guardianNIC} />
                    </div>
                    <div className="space-y-2">
                        <Label>Relationship</Label>
                        <Select value={formData.guardianType} onValueChange={(val) => handleSelectChange('guardianType', val)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="F">Father</SelectItem>
                                <SelectItem value="M">Mother</SelectItem>
                                <SelectItem value="G">Guardian</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                        <Label>Email <span className="text-red-500">*</span></Label>
                        <Input type="email" name="guardianEmail" value={formData.guardianEmail} onChange={handleChange} required className={errors.guardianEmail ? "border-red-500" : ""} />
                        <FormError error={errors.guardianEmail} />
                    </div>
                    <div className="space-y-2">
                        <Label>Job Title <span className="text-red-500">*</span></Label>
                        <Input name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label>Primary Contact <span className="text-red-500">*</span></Label>
                        <Input name="guardianContactNumber" value={formData.guardianContactNumber} onChange={handleChange} required placeholder="+94..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Alternative Contact <span className="text-red-500">*</span></Label>
                        <Input name="alternativeContactNumber" value={formData.alternativeContactNumber} onChange={handleChange} required placeholder="+94..." />
                    </div>

                    {/* Addresses - Full Width */}
                    <div className="space-y-2 md:col-span-2">
                        <Label>Permanent Address <span className="text-red-500">*</span></Label>
                        <Textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} required rows={2} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Current Address <span className="text-red-500">*</span></Label>
                        <Textarea name="currentAddress" value={formData.currentAddress} onChange={handleChange} required rows={2} />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} 
                            Save Guardian Details
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};


// ===========================================================================
// MAIN COMPONENT: Add Student Page
// ===========================================================================
const AddStudentPage = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({}); 
    const {id} = useParams()
    console.log(id)
    
    // Lists for Dropdowns
    const [classesList, setClassesList] = useState([]);
    const [guardiansList, setGuardiansList] = useState([]);
    const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);

    // Model: StudentDetail
    const initialFormState = {
        indexNumber: '',
        fullName: '',
        nameWithInitials: '',
        dateOfBirth: '',
        gender: 'M',
        email: '',
        mobileNumber: '',
        address: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        enrolledClass: `${id}`, 
        guardian: '', 
    };

    const [formData, setFormData] = useState(initialFormState);

    // --- 1. Load Data on Mount ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingDropdowns(true);
                // 1. Get Classes
                const classesRes = await api.get('classroom/'); // Or your specific options endpoint
                // 2. Get Guardians
                const guardiansRes = await api.get('guardiandetails/'); 
                
                // Adjust this mapping based on exactly what your API returns
                // If classroom/ returns raw data, you might need to map it:
                // setClassesList(classesRes.data.map(c => ({ id: c.id, name: `Grade ${c.grade}-${c.className}` })));
                
                // Assuming for now standard list return:
                setClassesList(classesRes.data); 
                setGuardiansList(guardiansRes.data);

            } catch (error) {
                console.error("Failed to fetch lists", error);
                toast.error("Network Error", { description: "Could not load drop-down lists." });
            } finally {
                setIsLoadingDropdowns(false);
            }
        };
        fetchData();
    }, []);

    // Add this NEW useEffect to handle the URL parameter translation
    useEffect(() => {
        // Only run if we have an ID from URL and the list has loaded
        if (id && classesList.length > 0) {
            
            // 1. Break "6A" into Grade (6) and Class (A)
            // This regex splits numbers from letters (e.g., "10B" -> ["10", "B"])
            const match = id.match(/(\d+)([a-zA-Z]+)/);
            
            if (match) {
                const urlGrade = parseInt(match[1]); // "6" becomes 6
                const urlClassLetter = match[2];     // "A" becomes "A"

                // 2. Find the matching object in your database list
                const foundClass = classesList.find(cls => 
                    cls.grade === urlGrade && cls.className === urlClassLetter
                );

                // 3. Set the ID (e.g., 1) as the selected value
                if (foundClass) {
                    setFormData(prev => ({
                        ...prev,
                        enrolledClass: foundClass.id.toString()
                    }));
                }
            }
        }
    }, [id, classesList]); // Runs whenever ID changes or the list finishes loading

    // --- 2. Handlers ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    // Called when the "Add Guardian" modal finishes successfully
    const handleNewGuardianAdded = (newGuardian) => {
        // Add new guardian to the existing list
        setGuardiansList(prev => [...prev, newGuardian]);
        // Automatically select this new guardian
        // Note: Using 'guardianId' because that is the PK in your Guardian Model
        setFormData(prev => ({ ...prev, guardian: newGuardian.guardianId.toString() }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setErrors({});

        if (!formData.guardian) {
            toast.error("Guardian Required", { description: "Please select or add a guardian." });
            setErrors({ guardian: "Guardian is required." });
            setIsSaving(false);
            return;
        }

        try {
            const response = await api.post('add/students/', formData);
            
            toast.success("Student Registered!", {
                description: `${response.data.fullName} has been added.`,
            });

            // Reset form
            setFormData(initialFormState);
            window.scrollTo(0,0);

        } catch (error) {
            console.error("Registration failed", error);
            if (error.response && error.response.status === 400) {
                setErrors(error.response.data);
                toast.error("Form Error", { description: "Please fix the errors in the form." });
            } else {
                 toast.error("Server Error", { description: "Something went wrong." });
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingDropdowns) {
        return <div className="flex h-screen justify-center items-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
    }

    console.log("URL ID:", id);
    console.log("Classes List:", classesList); 
// Does one of the items in classesList have { id: 6 }? 
// Or does it have { id: 25, name: "Grade 6" }?

    return (
        <div className="container mx-auto p-6 max-w-4xl flex justify-center">
            <Card className="w-full shadow-lg">
                <form onSubmit={handleSubmit}>
                
                {/* --- Header --- */}
                <CardHeader className="bg-muted/30 p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Register New Student</CardTitle>
                            <CardDescription>Create a new student record and assign a guardian.</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                {/* --- Content --- */}
                <CardContent className="p-6 space-y-8">
                    
                    {/* 1. Academic Info */}
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-primary mb-4">
                            <Hash className="w-5 h-5" /> Academic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormField label="Index Number *" name="indexNumber" type="number" value={formData.indexNumber} onChange={handleInputChange} error={errors.indexNumber} required />
                             
                             <FormField label="Enrollment Date" name="enrollmentDate" type="date" value={formData.enrollmentDate} onChange={handleInputChange} error={errors.enrollmentDate} />
                             
                             <div className="space-y-2">
                                <Label className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> Assign Class</Label>
                                <Select key={classesList.length} onValueChange={(val) => handleSelectChange('enrolledClass', val)} value={formData.enrolledClass}>
                                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>
                                        {classesList.map(cls => (
                                            // Logic: Handle if API returns object with ID or just ID. 
                                            // Adjust 'cls.id' and 'cls.name' based on your Classroom serializer
                                            <SelectItem key={cls.id} value={cls.id.toString()}>
                                                {cls.grade ? `Grade ${cls.grade}-${cls.className}` : cls.name || `Class ID ${cls.id}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                             </div>
                        </div>
                    </div>

                    <Separator />

                    {/* 2. Personal Details */}
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-primary mb-4">
                            <User className="w-5 h-5" /> Personal Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Full Name *" name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} className="md:col-span-2" required />
                            <FormField label="Name with Initials" name="nameWithInitials" value={formData.nameWithInitials} onChange={handleInputChange} error={errors.nameWithInitials} />
                             
                             <div className="grid grid-cols-2 gap-4">
                                <FormField label="Date of Birth *" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} error={errors.dateOfBirth} required />
                                <div className="space-y-2">
                                    <Label>Gender *</Label>
                                    <Select onValueChange={(val) => handleSelectChange('gender', val)} value={formData.gender}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">Male</SelectItem>
                                            <SelectItem value="F">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                             </div>
                        </div>
                    </div>

                    <Separator />

                    {/* 3. Contact Info */}
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-primary mb-4">
                            <MapPin className="w-5 h-5" /> Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormField label="Email Address *" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} required />
                             <FormField label="Mobile Number *" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} error={errors.mobileNumber} required />
                             
                             <div className="md:col-span-2 space-y-2">
                                <Label>Residential Address *</Label>
                                <Textarea name="address" value={formData.address} onChange={handleInputChange} className={errors.address ? "border-red-500" : ""} rows={2} required />
                                <FormError error={errors.address} />
                             </div>
                        </div>
                    </div>

                    <Separator />

                    {/* 4. Guardian Selection (With Integrated Modal) */}
                    <div className="bg-yellow-50/50 p-6 rounded-lg border border-yellow-100">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-yellow-800 mb-2">
                            <Shield className="w-5 h-5" /> Guardian Information (Required)
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Link a guardian to this student. Search below or add a new one.
                        </p>
                        
                        <div className="max-w-xl space-y-4">
                            <div className="space-y-2">
                                <Label>Select Existing Guardian</Label>
                                <Select onValueChange={(val) => handleSelectChange('guardian', val)} value={formData.guardian}>
                                    <SelectTrigger className={`bg-white ${errors.guardian ? "border-red-500" : ""}`}>
                                        <SelectValue placeholder="Search by name..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {guardiansList.length === 0 && <SelectItem value="none" disabled>No guardians found</SelectItem>}
                                        {guardiansList.map(g => (
                                            <SelectItem key={g.guardianId} value={g.guardianId.toString()}>
                                                {g.guardianName} ({g.guardianNIC})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormError error={errors.guardian} />
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase my-2">
                                <span className="w-full border-t border-yellow-200"></span>
                                <span>OR</span>
                                <span className="w-full border-t border-yellow-200"></span>
                            </div>

                            {/* The Modal Component is used here */}
                            <AddGuardianModal onGuardianAdded={handleNewGuardianAdded} />
                        </div>
                    </div>

                </CardContent>
                
                <CardFooter className="bg-muted/30 p-6 flex justify-end gap-4 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>
                        <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2" />}
                        Complete Registration
                    </Button>
                </CardFooter>
                </form>
            </Card>
            <Toaster />
        </div>
    );
};

// --- Helpers ---
const FormError = ({ error }) => {
    if (!error) return null;
    const message = Array.isArray(error) ? error[0] : error;
    return <p className="text-xs font-medium text-red-500 mt-1">{message}</p>;
};

const FormField = ({ label, name, value, onChange, error, type="text", className, required=false }) => (
    <div className={`space-y-2 ${className}`}>
        <Label>{label}</Label>
        <Input name={name} value={value} onChange={onChange} type={type} className={error ? "border-red-500" : ""} required={required} />
        <FormError error={error} />
    </div>
);

export default AddStudentPage;