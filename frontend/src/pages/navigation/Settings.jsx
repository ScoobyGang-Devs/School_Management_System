import React, { useState } from 'react';
import { 
    School, BookOpen, Save, 
    Loader2, LockKeyhole
} from 'lucide-react';

// --- Shadcn Components ---
import { 
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const SettingsPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    // 1. Security Settings State (Notifications removed)
    const [security, setSecurity] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // 2. School Configuration (Singleton Data)
    const [schoolConfig, setSchoolConfig] = useState({
        schoolName: "SAMS Management Portal",
        contactEmail: "support@sams.edu",
        website: "www.sams.edu.lk",
        logoUrl: ""
    });

    // 3. Academic Management (Pass Mark & Locking removed)
    const [academicConfig, setAcademicConfig] = useState({
        currentYear: "2025",
        currentTerm: "1"
    });

    // --- Handlers ---

    const handleSavePassword = () => {

      //checking if the two passwords are not the same
        if (security.newPassword !== security.confirmPassword) {
            toast.error("Password Mismatch", { description: "New passwords do not match." });
            return;
        }

        //if they are the same ...
        //setislading-->true is used so that the user doesn't press the button twice!
        setIsLoading(true);
        //creates a delay of 1 second and then whatever;s inside starts...
        setTimeout(() => {
            setIsLoading(false);
            //updates the varibales
            setSecurity(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
            toast.success("Password Changed", {
                description: "Your account security has been updated."
            });
        }, 1000);
    };

    const handleSaveSchoolConfig = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("System Updated", {
                description: "Global school configuration saved."
            });
        }, 1000);
    };

    const handleSaveAcademic = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Academic Settings Saved", {
                description: "Current academic year and term updated."
            });
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

            {/* Default Tab is Security */}
            <Tabs defaultValue="security" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="school">School Config</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                </TabsList>

                {/* ================= SECURITY TAB ================= */}
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

                {/* ================= SCHOOL CONFIG (ADMIN) ================= */}
                <TabsContent value="school">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <School className="w-5 h-5 text-primary" /> School Configuration
                            </CardTitle>
                            <CardDescription>Global settings visible to all users on the portal.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>School Display Name</Label>
                                    <Input 
                                        value={schoolConfig.schoolName} 
                                        onChange={(e) => setSchoolConfig({...schoolConfig, schoolName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Official Website</Label>
                                    <Input 
                                        value={schoolConfig.website} 
                                        onChange={(e) => setSchoolConfig({...schoolConfig, website: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Support / Contact Email</Label>
                                    <Input 
                                        value={schoolConfig.contactEmail} 
                                        onChange={(e) => setSchoolConfig({...schoolConfig, contactEmail: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Logo URL</Label>
                                    <Input 
                                        value={schoolConfig.logoUrl} 
                                        placeholder="https://..."
                                        onChange={(e) => setSchoolConfig({...schoolConfig, logoUrl: e.target.value})}
                                    />
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

                {/* ================= ACADEMIC MANAGEMENT (CRITICAL) ================= */}
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