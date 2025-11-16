import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function InternalMessaging() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Smith",
      senderEmail: "john.smith@school.edu",
      subject: "Meeting Agenda for Friday",
      content: "Hi team, please review the meeting agenda attached for our Friday session.",
      timestamp: "2024-01-15 10:30 AM",
      isRead: true,
      category: "work",
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      senderEmail: "sarah.j@school.edu",
      subject: "Project Deadline Extension",
      content: "The project deadline has been extended by one week.",
      timestamp: "2024-01-15 09:15 AM",
      isRead: false,
      category: "urgent",
    },
    {
      id: 3,
      sender: "IT Department",
      senderEmail: "it@school.edu",
      subject: "System Maintenance Notice",
      content: "There will be scheduled maintenance this weekend.",
      timestamp: "2024-01-14 03:45 PM",
      isRead: true,
      category: "announcement",
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("inbox");
  const [newMessage, setNewMessage] = useState({
    to: "",
    subject: "",
    content: "",
  });

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m))
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const id = Math.max(0, ...messages.map((m) => m.id)) + 1;

    const sent = {
      id,
      sender: "You",
      senderEmail: "you@school.edu",
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date().toLocaleString(),
      isRead: true,
      category: "personal",
    };

    setMessages((prev) => [sent, ...prev]);
    setNewMessage({ to: "", subject: "", content: "" });
    setActiveTab("inbox");
  };

  const getCategoryColor = (c) => {
    switch (c) {
      case "urgent":
        return "bg-red-500";
      case "work":
        return "bg-blue-500";
      case "announcement":
        return "bg-purple-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="w-full p-6">
      <Card className="overflow-hidden w-full">

        {/* ---------- TOP NAV BUTTON ROW ---------- */}
        <div className="w-full border-b bg-background">
          <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
            <Button
              variant={activeTab === "inbox" ? "default" : "secondary"}
              onClick={() => setActiveTab("inbox")}
            >
              📥 Inbox
            </Button>

            <Button
              variant={activeTab === "sent" ? "default" : "secondary"}
              onClick={() => setActiveTab("sent")}
            >
              📤 Sent
            </Button>

            <Button
              variant={activeTab === "compose" ? "default" : "secondary"}
              onClick={() => setActiveTab("compose")}
            >
              ✏️ Compose
            </Button>
          </div>
        </div>

        {/* ------------------ MAIN LAYOUT ------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-3 h-full bg-background">

          {/* -------- LEFT: MESSAGE LIST -------- */}
          {activeTab === "inbox" && (
            <div className="col-span-1 border-r h-[65vh] overflow-auto bg-background">
              <div className="px-4 py-3 sticky top-0 bg-background z-10 border-b">
                <h2 className="font-medium">Inbox</h2>
              </div>

              <div>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 border-b cursor-pointer hover:bg-accent flex flex-col gap-1
                      ${!msg.isRead ? "bg-muted/40 font-medium" : "bg-card"}
                      ${selectedMessage?.id === msg.id ? "ring-2 ring-primary/30" : ""}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm">
                          {msg.sender[0]}
                        </div>
                        <div>
                          <div className="text-sm">{msg.sender}</div>
                          <div className="text-xs text-muted-foreground">{msg.senderEmail}</div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">{msg.timestamp}</div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <div className="text-sm">{msg.subject}</div>
                        <div className="text-xs text-muted-foreground truncate w-40">{msg.content}</div>
                      </div>

                      <Badge className={`${getCategoryColor(msg.category)} text-white`}>
                        {msg.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------- RIGHT PANEL -------- */}
          <div className="col-span-2 p-4 h-[65vh] overflow-auto bg-background">

            {/* ---------- Inbox Message View ---------- */}
            {activeTab === "inbox" && (
              <>
                {selectedMessage ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{selectedMessage.subject}</h3>
                        <div className="text-sm text-muted-foreground">
                          From: {selectedMessage.sender} • {selectedMessage.senderEmail}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{selectedMessage.timestamp}</div>
                    </div>

                    <div className="bg-muted p-4 rounded-md text-sm">
                      {selectedMessage.content}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost">Reply</Button>
                      <Button variant="outline">Forward</Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Select a message to read
                  </div>
                )}
              </>
            )}

            {/* ---------- Compose View ---------- */}
            {activeTab === "compose" && (
              <div>
                <h2 className="text-lg font-medium mb-4">Compose New Message</h2>

                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="text-sm block mb-1">To</label>
                    <Input
                      value={newMessage.to}
                      onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Subject</label>
                    <Input
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm block mb-1">Message</label>
                    <Textarea
                      rows={8}
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Send Message</Button>
                    <Button variant="secondary" onClick={() => setActiveTab("inbox")}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* ---------- Sent ---------- */}
            {activeTab === "sent" && (
              <>
                <h2 className="text-lg font-medium">Sent Messages</h2>
                <p className="text-sm text-muted-foreground mt-4">No sent messages yet.</p>
              </>
            )}

            {/* ---------- Drafts ---------- */}
            {activeTab === "drafts" && (
              <>
                <h2 className="text-lg font-medium">Drafts</h2>
                <p className="text-sm text-muted-foreground mt-4">No drafts saved.</p>
              </>
            )}

          </div>
        </div>
      </Card>

      {/* Floating Compose Button */}
      <Button
        className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full px-6 py-6"
        onClick={() => setActiveTab("compose")}
      >
        + Compose
      </Button>
    </div>
  );
}
