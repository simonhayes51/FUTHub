import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Search, MoreVertical, ArrowLeft, Image, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

const ChatPanel = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "FlipKingFC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      lastMessage: "Check out the new market trend I posted!",
      timestamp: "2m ago",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      name: "SBCMaster",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      lastMessage: "Thanks for the tip on Mbappé!",
      timestamp: "1h ago",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      name: "MetaTraderPro",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      lastMessage: "When's the next market analysis dropping?",
      timestamp: "3h ago",
      unread: 1,
      online: true,
    },
  ];

  // Mock messages for selected conversation
  const messages: Message[] = selectedConversation
    ? [
        {
          id: "1",
          senderId: "other",
          content: "Hey! Did you see the latest market trends?",
          timestamp: "10:30 AM",
          isOwn: false,
        },
        {
          id: "2",
          senderId: "me",
          content: "Yes! Looking really promising. Thinking of investing in some icons.",
          timestamp: "10:32 AM",
          isOwn: true,
        },
        {
          id: "3",
          senderId: "other",
          content: "Check out the new market trend I posted!",
          timestamp: "10:35 AM",
          isOwn: false,
        },
      ]
    : [];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Implement send message API
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="h-[calc(100vh-120px)] flex bg-card border border-border rounded-2xl overflow-hidden">
      {/* Conversations List */}
      <div className={`${selectedConversation ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border-r border-border`}>
        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No conversations yet</p>
              <p className="text-muted-foreground text-xs mt-1">
                Subscribe to traders to start chatting
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-secondary/50 transition-colors ${
                  selectedConversation === conv.id ? "bg-secondary/50" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-12 h-12 rounded-full object-cover border border-border"
                  />
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground truncate">{conv.name}</p>
                    <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{conv.unread}</span>
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className={`${selectedConversation ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
        {selectedConversation && selectedConv ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-card">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <img
                    src={selectedConv.avatar}
                    alt={selectedConv.name}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                  {selectedConv.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedConv.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConv.online ? "Active now" : "Offline"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] ${msg.isOwn ? "order-2" : "order-1"}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${
                        msg.isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">{msg.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-gradient-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Image className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Smile className="w-5 h-5" />
                </Button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <Button
                  variant="hero"
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">Select a conversation</p>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
