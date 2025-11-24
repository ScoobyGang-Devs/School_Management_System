import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import request from "@/reqMethods";

export default function InternalMessaging() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderID: "John Smith",
      senderName: "john.smith@school.edu",
      subject: "Meeting Agenda for Friday",
      content: "Hi team, please review the meeting agenda attached for our Friday session.",
      timestamp: "2024-01-15 10:30 AM",
      isRead: true,
      category: "personal",
    },
    {
      id: 2,
      senderID: "Sarah Johnson",
      senderName: "sarah.j@school.edu",
      subject: "Project Deadline Extension",
      content: "The project deadline has been extended by one week.",
      timestamp: "2024-01-15 09:15 AM",
      isRead: false,
      category: "urgent",
    },
    {
      id: 3,
      senderID: "IT Department",
      senderName: "it@school.edu",
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
    recieverName: [],
    subject: "",
    content: "",
  });
  const [messageCategory, setMessageCategory] = useState("personal");
  const [actionType, setActionType] = useState(null); // NEW: 'reply' or 'forward'
  const [sentMessages, setSentMessages] = useState([
    {
      id: 100,
      senderID: "You",
      senderName: "you@school.edu", 
      subject: "Welcome to the messaging system",
      content: "This is a sample sent message to show how the Sent tab works.",
      recieverID: "team",
      recieverName: "team@school.edu",
      timestamp: "2024-01-16 09:00 AM",
      isRead: true,
      category: "personal",
    }
  ]);

  const [recipientList, setRecipientList] = useState([{id:"1",name:"John",uName:"John"},{id:"2",name:"Sam",uName:"Sam"}]);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const allData = JSON.parse(localStorage.getItem("user"));
        const userId = allData.userId;
        const response = await request.GET(`http://127.0.0.1:8000/chat/messages/inbox`,userId);

        if (response) {
          setMessages(response);
        }
      } catch (error) {
        console.error("Failed to load inbox", error);
        alert("Failed to load!");
      }
    };

    fetchInbox();
  }, []);

  useEffect(() => {
    const allUsers = async () => {
      try {
        const response = await request.GET(`http://127.0.0.1:8000/users`);

        if (response) {
          const users = response.map(data => ({
            id: data.userId,
            name: data.nameWithInitials,
            uName: data.username
          }));
          setRecipientList(users);
        }
      } catch (error) {
        console.error("Failed to load users", error);
      }
    };
    allUsers();
  }, []);

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m))
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Handle recipients
    let recipients;
    if (messageCategory === "announcement") {
      recipients = "ALL";
    } else {
      recipients = newMessage.recieverName.join(", ");
    }

    const body = {
      sender: "You",
      senderEmail: "you@school.edu",
      subject: newMessage.subject,
      content: newMessage.content,
      recieverName: recipients,
      timestamp: new Date().toLocaleString(),
      isRead: true,
      category: messageCategory,
    };

    try {
      const response = await request.POST("http://127.0.0.1:8000/chat/", body);

      if (response) {
        alert("✅ Mail sent");

        const savedMessage = {
          id: response.id,
          ...body,
        };

        // Update sent messages WITH backend ID
        setSentMessages((prev) => [savedMessage, ...prev]);

        // Reset UI
        setNewMessage({ recieverName: [], subject: "", content: "" });
        setActiveTab("inbox");
        setMessageCategory("personal");
        setActionType(null);

      } else {
        alert("Mail send Failed");
      }
    } catch (error) {
      console.error("Network Error", error);
      alert("⚠️ Network or server error. Please try again later.");
    }
  };

  const loadSentMessages = async () => {
    try {
      const userID = localStorage.getItem("UserID");
      const response = await request.GET(`http://127.0.0.1:8000/chat/sent/${userID}`);

      if (response) {
        setSentMessages(response);
      } else {
        console.warn("No sent messages received");
      }
    } catch (error) {
      console.error("Error loading sent messages:", error);
      alert("⚠️ Network or server error. Please try again later.");
    }
  };

  // Handle reply click
  const handleReply = (message) => {
    setActionType('reply');
    setActiveTab("compose");
    
    // Pre-fill the form for reply
    setNewMessage({
      recieverName: [message.senderEmail],
      subject: `Re: ${message.subject}`,
      content: ""
    });
    setMessageCategory("personal");
  };

  // Handle forward click
  const handleForward = (message) => {
    setActionType('forward');
    setActiveTab("compose");
    
    // Check if it's your own message
    const currentUserID = localStorage.getItem('UserID');
    const isMyOwnMessage = message.senderID === currentUserID;
    
    if (isMyOwnMessage) {
      // For your own messages - send as new (no forwarding headers)
      setNewMessage({
        recieverName: [], // Empty for new recipients
        subject: message.subject, // Keep original subject (no "Fwd:")
        content: message.content // Keep original content (no forwarding headers)
      });
    } else {
      // For others' messages - use forwarding format
      setNewMessage({
        recieverName: [], // Empty for forward
        subject: `Fwd: ${message.subject}`,
        content: `\n\n--- Forwarded Message ---\nFrom: ${message.sender}\nDate: ${message.timestamp}\nSubject: ${message.subject}\n\n${message.content}`
      });
    }
    setMessageCategory("personal");
  };

  // Handle cancel compose
  const handleCancelCompose = () => {
    setActiveTab("inbox");
    setNewMessage({ recieverName: [], subject: "", content: "" });
    setMessageCategory("personal");
    setActionType(null);
  };

  const getCategoryColor = (c) => {
    switch (c) {
      case "urgent":
        return "bg-red-500";
      case "announcement":
        return "bg-purple-500";
      default:
        return "bg-green-500";
    }
  };

  // Get compose title based on action type
  const getComposeTitle = () => {
    switch (actionType) {
      case 'reply':
        return "Reply to Message";
      case 'forward':
        return "Forward Message";
      default:
        return "Compose New Message";
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
              onClick={() => {
                setActiveTab("sent");
                loadSentMessages();
              }}
            >
              📤 Sent
            </Button>

            <Button
              variant={activeTab === "compose" ? "default" : "secondary"}
              onClick={() => {
                setActiveTab("compose");
                setActionType(null);
                setNewMessage({ recieverName: [], subject: "", content: "" });
              }}
            >
              ✏️ Compose
            </Button>
          </div>
        </div>

        {/* ------------------ MAIN LAYOUT ------------------ */}
        <div className="bg-background">
          {/* INBOX LAYOUT */}
          {activeTab === "inbox" && (
            <div className="grid grid-cols-1 md:grid-cols-3 h-[65vh]">
              {/* LEFT: MESSAGE LIST */}
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
                            {msg.senderID[0]}
                          </div>
                          <div>
                            <div className="text-sm">{msg.senderID}</div>
                            <div className="text-xs text-muted-foreground">{msg.senderName}</div>
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

              {/* RIGHT: MESSAGE VIEW */}
              <div className="col-span-2 p-4 h-[65vh] overflow-auto bg-background">
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
                      <Button 
                        variant="ghost"
                        onClick={() => handleReply(selectedMessage)}
                      >
                        Reply
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleForward(selectedMessage)}
                      >
                        Forward
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Select a message to read
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COMPOSE LAYOUT */}
          {activeTab === "compose" && (
            <div className="grid grid-cols-1 md:grid-cols-4 h-[65vh]">
              {/* LEFT: RECIPIENT SELECTOR */}
              <div className="col-span-1 border-r h-[65vh] overflow-auto bg-background">
                <div className="px-4 py-3 sticky top-0 bg-background z-10 border-b">
                  <h2 className="font-medium">Select Recipients</h2>
                </div>

                {recipientList.map((r) => (
                  <div
                    key={r.id}
                    className="m-2 px-4 py-2 rounded-full bg-muted cursor-pointer hover:bg-accent inline-block"
                    onClick={() => {
                      setNewMessage((prev) => ({
                        ...prev,
                        recieverName: prev.recieverName.includes(r.name)
                          ? prev.recieverName
                          : [...prev.recieverName, r.name],
                      }));
                    }}
                  >
                    {r.name}
                  </div>
                ))}
              </div>

              {/* RIGHT: COMPOSE FORM */}
              <div className="col-span-3 p-4 h-[65vh] overflow-auto bg-background">
                <div className="h-full overflow-auto bg-background">
                  <div className="flex-1">
                    <h2 className="text-lg font-medium mb-4">
                      {getComposeTitle()}
                    </h2>

                    <form onSubmit={handleSendMessage} className="space-y-4">
                      {/* Message Type */}
                      <div>
                        <label className="text-sm block mb-1 font-medium">Message Type</label>
                        <div className="flex gap-4 items-center text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="msgType"
                              value="personal"
                              checked={messageCategory === "personal"}
                              onChange={() => setMessageCategory("personal")}
                            />
                            Personal
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="msgType"
                              value="urgent"
                              checked={messageCategory === "urgent"}
                              onChange={() => setMessageCategory("urgent")}
                            />
                            Urgent
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="msgType"
                              value="announcement"
                              checked={messageCategory === "announcement"}
                              onChange={() => setMessageCategory("announcement")}
                            />
                            Announcement
                          </label>
                        </div>
                      </div>

                      {/* Recipient Input */}
                      {messageCategory !== "announcement" && (
                        <div>
                          <label className="text-sm block mb-1">Recipients</label>
                          <div className="p-2 border rounded-md bg-muted flex flex-wrap gap-2">
                            {newMessage.recieverName.length === 0 && (
                              <span className="text-sm text-muted-foreground">No recipients selected</span>
                            )}

                            {newMessage.recieverName.map((name, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-sm"
                              >
                                {name}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewMessage((prev) => ({
                                      ...prev,
                                      recieverName: prev.recieverName.filter((x) => x !== name),
                                    }));
                                  }}
                                  className="text-red-500 ml-2 hover:text-red-700"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Subject */}
                      <div>
                        <label className="text-sm block mb-1">Subject</label>
                        <Input
                          value={newMessage.subject}
                          onChange={(e) =>
                            setNewMessage({ ...newMessage, subject: e.target.value })
                          }
                          required
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="text-sm block mb-1">Message</label>
                        <Textarea
                          rows={8}
                          value={newMessage.content}
                          onChange={(e) =>
                            setNewMessage({ ...newMessage, content: e.target.value })
                          }
                          required
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <Button type="submit">Send Message</Button>
                        <Button variant="secondary" onClick={handleCancelCompose}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SENT LAYOUT */}
          {activeTab === "sent" && (
            <div className="h-[65vh] overflow-auto bg-background p-4">
              <h2 className="text-lg font-medium mb-4">Sent Messages</h2>
              {sentMessages.length > 0 ? (
                <div className="space-y-3">
                  {sentMessages.map((msg) => (
                    <div key={msg.id} className="border p-4 rounded-lg bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                            Y
                          </div>
                          <div>
                            <div className="text-sm font-medium">To: {Array.isArray(msg.to) ? msg.to.join(', ') : msg.to}</div>
                            <div className="text-xs text-muted-foreground">{msg.senderName}</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">{msg.timestamp}</div>
                      </div>
                      <div className="text-sm font-semibold mb-1">{msg.subject}</div>
                      <div className="text-sm text-muted-foreground">{msg.content}</div>
                      <div className="flex justify-between items-center mt-2">
                        <Badge className={`${getCategoryColor(msg.category)} text-white text-xs`}>
                          {msg.category}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleForward(msg)}
                        >
                          Forward
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No sent messages yet
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Floating Compose Button */}
      <Button
        className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full px-6 py-6"
        onClick={() => {
          setActiveTab("compose");
          setActionType(null);
          setNewMessage({ recieverName: [], subject: "", content: "" });
        }}
      >
        + Compose
      </Button>
    </div>
  );
}