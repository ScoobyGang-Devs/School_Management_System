import React, { useState, useEffect } from 'react';
import { 
    School, BookOpen, Save, 
    Loader2, LockKeyhole, Upload
} from 'lucide-react';
import api from '../../api.js'; // Importing your custom axios instance

// --- Shadcn Components ---
import { 
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const SettingsPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    // 1. Security Settings (Mock Data)
    const [security, setSecurity] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // 2. School Configuration (Real Data from Django)
    const [schoolConfig, setSchoolConfig] = useState({
        schoolName: "",
        motto: "",
        principalName: "",
        currentSignatureUrl: null 
    });
    
    // State for the new file upload
    const [signatureFile, setSignatureFile] = useState(null);

    // 3. Academic Management (Mock Data)
    const [academicConfig, setAcademicConfig] = useState({
        currentYear: "2025",
        currentTerm: "1"
    });

    // --- Fetch Data on Load using API ---
    useEffect(() => {
        getSchoolData();
    }, []);

    const getSchoolData = () => {
        api.get('settings/schooldetail/')
            .then((res) => res.data)
            .then((data) => {
                // Logic to find the active config (or the last one created)
                const activeConfig = data.find(item => item.isActive) || data[data.length - 1];
                
                if (activeConfig) {
                    setSchoolConfig({
                        schoolName: activeConfig.schoolName || "",
                        motto: activeConfig.motto || "",
                        principalName: activeConfig.principalName || "",
                        currentSignatureUrl: activeConfig.principlSignature // URL from Django
                    });
                }

                console.log(schoolConfig)
            })
            .catch((err) => {
                console.error(err);
                toast.error("Connection Error", { description: "Could not load school details." });
            });
    };

    // --- Handlers ---

    const handleSavePassword = () => {
        if (security.newPassword !== security.confirmPassword) {
            toast.error("Password Mismatch", { description: "New passwords do not match." });
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSecurity(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
            toast.success("Password Changed", { description: "Your account security has been updated." });
        }, 1000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "image/png") {
                toast.error("Invalid Format", { description: "Only PNG images are allowed for the signature." });
                e.target.value = null; 
                return;
            }
            setSignatureFile(file);
        }
    };

    const handleSaveSchoolConfig = () => {
        setIsLoading(true);

        const formData = new FormData();
        formData.append('schoolName', schoolConfig.schoolName);
        formData.append('motto', schoolConfig.motto);
        formData.append('principalName', schoolConfig.principalName);
        
        // Only append file if user selected a new one
        if (signatureFile) {
            formData.append('principlSignature', signatureFile);
        }

        // Axios handles the Content-Type for FormData automatically
        api.post('settings/schooldetail/', formData)
            .then((res) => {
                toast.success("System Updated", { description: "School configuration saved successfully." });
                
                // Update state with the new data from server response
                setSchoolConfig(prev => ({
                    ...prev,
                    currentSignatureUrl: res.data.principlSignature
                }));
                setSignatureFile(null); // Clear file input state
            })
            .catch((err) => {
                console.error(err);
                const errData = err.response?.data;
                
                // Display specific error if signature failed validation on backend
                if(errData && errData.principlSignature) {
                    toast.error("Signature Error", { description: errData.principlSignature[0] });
                } else {
                    toast.error("Update Failed", { description: "Please check your inputs." });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSaveAcademic = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Academic Settings Saved", { description: "Current academic year and term updated." });
        }, 800);
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage account security and system configurations.
                </p>
            </div>

            <Tabs defaultValue="security" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="school">School Config</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                </TabsList>

                {/* ================= SECURITY TAB (MOCK) ================= */}
                <TabsContent value="security">
                    <div className="max-w-2xl">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LockKeyhole className="w-5 h-5" /> Password
                                </CardTitle>
                                <CardDescription>Change your password to keep your account secure.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <Input 
                                        type="password" 
                                        value={security.currentPassword}
                                        onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input 
                                        type="password" 
                                        value={security.newPassword}
                                        onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm Password</Label>
                                    <Input 
                                        type="password" 
                                        value={security.confirmPassword}
                                        onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="border-t p-6">
                                <Button onClick={handleSavePassword} disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Password
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                {/* ================= SCHOOL CONFIG (REAL DATA) ================= */}
                <TabsContent value="school">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <School className="w-5 h-5 text-primary" /> School Configuration
                            </CardTitle>
                            <CardDescription>Global settings. Changing the signature will deactivate previous principals.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* School Name */}
                                <div className="space-y-2">
                                    <Label>School Name</Label>
                                    <Input 
                                        value={schoolConfig.schoolName} 
                                        placeholder="e.g. Moratuwa Central College"
                                        onChange={(e) => setSchoolConfig({...schoolConfig, schoolName: e.target.value})}
                                    />
                                </div>

                                {/* Principal Name */}
                                <div className="space-y-2">
                                    <Label>Principal's Name</Label>
                                    <Input 
                                        value={schoolConfig.principalName} 
                                        placeholder="e.g. Mrs. S. Perera"
                                        onChange={(e) => setSchoolConfig({...schoolConfig, principalName: e.target.value})}
                                    />
                                </div>

                                {/* Motto */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label>School Motto</Label>
                                    <Textarea 
                                        value={schoolConfig.motto} 
                                        placeholder="e.g. Wisdom is Power"
                                        onChange={(e) => setSchoolConfig({...schoolConfig, motto: e.target.value})}
                                    />
                                </div>

                                {/* Signature Upload */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Principal's Signature (PNG Only)</Label>
                                    <div className="flex items-center gap-4">
                                        <Input 
                                            type="file" 
                                            accept="image/png"
                                            onChange={handleFileChange}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                    
                                    {/* Preview Existing Signature */}
                                    {schoolConfig.currentSignatureUrl && (
                                        <div className="mt-4 p-4 border rounded-md bg-gray-50 w-fit">
                                            <p className="text-xs text-muted-foreground mb-2">Current Signature:</p>
                                            {/* Note: Adjust the base URL if your API doesn't return absolute URLs for media */}
                                            <img 
                                                src={`http://127.0.0.1:8000${schoolConfig.currentSignatureUrl}`} 
                                                alt="Principal Signature" 
                                                className="h-16 object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t p-6 flex justify-end">
                            <Button onClick={handleSaveSchoolConfig} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Configuration
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* ================= ACADEMIC MANAGEMENT (MOCK) ================= */}
                <TabsContent value="academic">
                    <div className="max-w-3xl">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" /> Academic Cycle
                                </CardTitle>
                                <CardDescription>
                                    Control the current academic year and term. Changing this affects all gradebooks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Academic Year</Label>
                                        <Select 
                                            value={academicConfig.currentYear} 
                                            onValueChange={(val) => setAcademicConfig({...academicConfig, currentYear: val})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2024">2024</SelectItem>
                                                <SelectItem value="2025">2025</SelectItem>
                                                <SelectItem value="2026">2026</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Current Term</Label>
                                        <Select 
                                            value={academicConfig.currentTerm}
                                            onValueChange={(val) => setAcademicConfig({...academicConfig, currentTerm: val})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Term" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Term 1</SelectItem>
                                                <SelectItem value="2">Term 2</SelectItem>
                                                <SelectItem value="3">Term 3</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t p-6 flex justify-end">
                                <Button onClick={handleSaveAcademic} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Update Academic Settings
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
            <Toaster />
        </div>
    );
};

export default SettingsPage;