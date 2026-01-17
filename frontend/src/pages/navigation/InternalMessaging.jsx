import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import request from "@/reqMethods";

const API_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export default function InternalMessaging() {
  const user = JSON.parse(localStorage.getItem("user"));
  const header = {"Authorization": `Bearer ${localStorage.getItem("access")}`};

  const [messages, setMessages] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("inbox");
  const [newMessage, setNewMessage] = useState({
    recipientId:[],
    recieverName:[],
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
      category: "personal",
    }
  ]);

  const [recipientList, setRecipientList] = useState([]);
  const [loadingRecipients, setLoadingRecipients] = useState(true);


  useEffect(() => {
    const allUsers = async () => {
      try {
        const response = await request.GET(`${API_BASE}/chat`,"userlist-chat",header);

        if (response) {
          const users = response.filter(data => data.id != user.userId && data.id != 1)
          .map(data => ({
            id: data.id,
            name: data.nameWithInitials,
            uName: data.username
          }));
          setRecipientList(users);
        }
      } catch (error) {
        console.error("Failed to load users", error);
      }
      finally{
        setLoadingRecipients(false);
      }
    };
    allUsers();
  }, []);

  useEffect(() => {
    if (loadingRecipients) return;
    const fetchInbox = async () => {
      try {
        const userId = user.userId;
        const tempRecipientList = recipientList;
        const inboxResponse = await request.GET(`${API_BASE}/chat/messages`,"inbox",header);

        if (inboxResponse) {
          const mappedMessages = inboxResponse.filter(msg => msg.sender_id != userId).map(msg => {
            let senderName = msg.sender_name;
            if (!senderName) {
              const sender = tempRecipientList.find(r => r.id == msg.sender_id);
              senderName = sender?.uName || "Unknown";
            }
            const date = new Date(msg.timestamp);
            const options = { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: true 
            };
            const formattedTimestamp = date.toLocaleString('en-GB', options);

            return {
              id: msg.id,
              senderID: msg.sender_id,
              senderName,
              subject: msg.subject,
              content: msg.content,
              timestamp: formattedTimestamp,
              isRead: msg.is_read,
              category: msg.category,
            };
          });
          setMessages(mappedMessages);
        }

        const sentboxResponse = await request.GET(`${API_BASE}/chat/messages`,"sent",header);
        if (sentboxResponse){
          const mappedMessages = sentboxResponse.map(msg => {
            let recipientsNames;
            if(msg.category == "announcement"){
              recipientsNames = ["Everyone"];
            } else{
              recipientsNames = msg.recipients.map(id => {
                const user = tempRecipientList.find(r => r.id == id);
                return user?.uName || "Unknown";
              });
            }
            const date = new Date(msg.timestamp);
            const options = { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: true 
            };
            const formattedTimestamp = date.toLocaleString('en-GB', options);
            
            return {
              id: msg.id,
              senderID: msg.sender_id,
              senderName: msg.sender_name,
              recipients: recipientsNames,
              subject: msg.subject,
              content: msg.content,
              timestamp: formattedTimestamp,
              category: msg.category,
            };
          });
          setSentMessages(mappedMessages);
        }

      } catch (error) {
        console.error("Failed to load", error);
        alert("Failed to load! Please Try Again or Login Again.");
      }
    };

    fetchInbox();
  }, [loadingRecipients]);

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    if(!message.isRead){
      const userId = Number(user.userId);
      try{
        const isReadResponse = await request.PATCH(`${API_BASE}/chat/messages/mark-as-read/`,{
          message_id: message.id,
          recipient_id: userId
        }, header)
      } catch (error){
        console.log(error)
      }
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m))
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (messageCategory !== "announcement" && newMessage.recipientId.length === 0) {
      alert("Please select at least one recipient");
      return;
    }

    // Handle recipients
    let recipients;
    if (messageCategory === "announcement") {
      recipients = "ALL";
    } else {
      recipients = newMessage.recipientId;
    }

    const body = {
      subject: newMessage.subject,
      content: newMessage.content,
      recipients: recipients,
      category: messageCategory,
    };

    try {
      const response = await request.POST(`${API_BASE}/chat/messages/send/`, body, header);

      if (response) {
        const responseData = JSON.stringify(response);
        alert("✅ Mail sent");

        const savedMessage = {
          id: responseData.message_id,
          senderID: responseData.sender_id,
          senderName: responseData.sender_name,
          timestamp: responseData.timestamp,
          ...body,
          recipients: body.recipients == "ALL"? "Everyone": body.recipients,
        };

        setSentMessages((prev) => [savedMessage, ...prev]);
        setNewMessage({recipientId: [] , recieverName:[],subject: "", content: "" });
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

  // Handle reply click
  const handleReply = (message) => {
    setActionType('reply');
    setActiveTab("compose");
    
    // Pre-fill the form for reply
    setNewMessage({
      recipientId: [message.senderId],
      recieverName: [message.senderName],
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
        recipientId: [],
        recieverName: [], // Empty for new recipients
        subject: message.subject, // Keep original subject (no "Fwd:")
        content: message.content // Keep original content (no forwarding headers)
      });
    } else {
      // For others' messages - use forwarding format
      setNewMessage({
        recipientId: [],
        recieverName: [], // Empty for forward
        subject: `Fwd: ${message.subject}`,
        content: `--- Forwarded Message ---\nFrom: ${message.senderName}\nDate: ${message.timestamp}\nSubject: ${message.subject}\n\n${message.content}`
      });
    }
    setMessageCategory("personal");
  };

  // Handle cancel compose
  const handleCancelCompose = () => {
    setActiveTab("inbox");
    setNewMessage({ recipientId: [], recieverName: [], subject: "", content: "" });
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
              }}
            >
              📤 Sent
            </Button>

            <Button
              variant={activeTab === "compose" ? "default" : "secondary"}
              onClick={() => {
                setActiveTab("compose");
                setActionType(null);
                setNewMessage({ recipientId: [] , recieverName: [], subject: "", content: "" });
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
                        ${!msg.isRead
                          ? "bg-yellow-50 dark:bg-yellow-900/30 font-semibold shadow-inner border-l-4 border-yellow-500"
                          : "bg-card opacity-80"
                        }
                        ${selectedMessage?.id === msg.id ? "ring-2 ring-primary/30" : ""}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm">
                            {msg.senderName[0].toUpperCase()}
                          </div>
                          <div>
                            <div className={`text-sm ${!msg.isRead ? "font-bold" : ""}`}>{msg.senderName}</div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">{msg.timestamp}</div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <div className={`text-sm ${!msg.isRead ? "font-bold" : ""}`}>{msg.subject}</div>
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
                          From: {selectedMessage.senderName}
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
                      const selectedName = r.name ? r.name : r.uName;
                      setNewMessage((prev) => {
                        const alreadySelected = prev.recipientId.includes(r.id);
                        if (alreadySelected) {
                          // remove
                          return {
                            ...prev,
                            recipientId: prev.recipientId.filter((id) => id !== r.id),
                            recieverName: prev.recieverName.filter((n) => n !== selectedName),
                          };
                        } else {
                          // add
                          return {
                            ...prev,
                            recipientId: [...prev.recipientId, r.id],
                            recieverName: [...prev.recieverName, selectedName],
                          };
                        }
                      });
                    }}
                  >
                    {r.name? r.name:r.uName}
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
                                    const found = recipientList.find(
                                      (item) => (item.name ? item.name : item.uName) === name
                                    );
                                    const idToRemove = found ? found.id : null;

                                    setNewMessage((prev) => ({
                                      ...prev,
                                      recieverName: prev.recieverName.filter((x) => x !== name),
                                      recipientId: idToRemove
                                        ? prev.recipientId.filter((id) => id !== idToRemove)
                                        : prev.recipientId,
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
                            You
                          </div>
                          <div>
                            <div className="text-sm font-medium">To: {Array.isArray(msg.recipients) ? msg.recipients.join(', ') : msg.recipients}</div>
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
          setNewMessage({ recipientId: [], recieverName: [], subject: "", content: "" });
        }}
      >
        + Compose
      </Button>
    </div>
  );
}