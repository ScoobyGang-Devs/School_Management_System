import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api.js'; // Adjusted path to fix resolution error
import { 
    Search, Plus, MoreHorizontal, Shield, 
    UserCheck, UserX, Lock, Mail, Filter, Users 
} from 'lucide-react';

// --- Shadcn Components ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Table, TableBody, TableCell, TableHead, 
    TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Skeleton } from '@/components/ui/skeleton';

const UserManagementMain = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // --- Fetch Data from API ---
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('users/'); 
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
            toast.error("Error loading users");
        } finally {
            setLoading(false);
        }
    };

    // --- Filtering Logic ---
    const filteredUsers = users.filter(user => {
        const searchTerm = search.toLowerCase();
        // Mapping to your serializer fields: userName, email
        const nameMatch = user.userName?.toLowerCase().includes(searchTerm) || false;
        const emailMatch = user.email?.toLowerCase().includes(searchTerm) || false;
        
        // Role Filtering
        const roleMatch = roleFilter === "all" || user.role === roleFilter;

        return (nameMatch || emailMatch) && roleMatch;
    });

    // --- Helpers ---
    const getRoleBadgeVariant = (role) => {
        switch(role) {
            case 'Admin': return "destructive";     // Red for High privilege
            case 'Staff': return "default";         // Black/Primary
            case 'Teacher': return "secondary";     // Gray/Secondary
            default: return "outline";
        }
    };

    const formatLastLogin = (dateString) => {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Shield className="w-8 h-8" /> User Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage system access, roles, and account security.
                    </p>
                </div>
                <div className="flex gap-3">

                </div>
            </div>

            {/* 2. Stats Card (Only Total Users as requested) */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                <Card className="shadow-sm border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total System Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Toolbar (Search & Filters) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by name or email..." 
                            className="pl-8" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[160px]">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <SelectValue placeholder="Role" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Staff">Staff</SelectItem>
                            <SelectItem value="Teacher">Teacher</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 4. Main Data Table */}
            <div className="rounded-md border shadow-sm bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead className="w-[300px]">User Profile</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            // Loading Skeleton Rows
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="flex gap-3"><Skeleton className="h-9 w-9 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div></div></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No users found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user, index) => (
                                <TableRow key={index} className="group hover:bg-muted/20 transition-colors">
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border">
                                            {/* Seed avatar with username for consistency */}
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.userName}`} />
                                            <AvatarFallback>{user.userName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-foreground">{user.userName}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                {user.email !== "Null" ? user.email : "No Email Linked"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell>
                                        <Badge variant={getRoleBadgeVariant(user.role)} className="shadow-none">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    
                                    <TableCell>
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                            user.status === 'Active' 
                                                ? 'bg-green-50 text-green-700 border-green-200' 
                                                : 'bg-gray-50 text-gray-600 border-gray-200'
                                        }`}>
                                            {user.status === 'Active' ? (
                                                <UserCheck className="w-3 h-3 mr-1" />
                                            ) : (
                                                <UserX className="w-3 h-3 mr-1" />
                                            )}
                                            {user.status}
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="text-muted-foreground text-sm font-mono">
                                        {formatLastLogin(user.last_login)}
                                    </TableCell>
                                    
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                                                    <Mail className="mr-2 h-4 w-4" /> Copy Email
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <Lock className="mr-2 h-4 w-4" /> Reset Password
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <Toaster />
        </div>
    );
};

export default UserManagementMain;