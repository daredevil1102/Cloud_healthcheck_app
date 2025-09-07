// applications/frontend/src/pages/ChatPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext';

const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
  height: calc(100vh - 8rem);
  display: flex;
  flex-direction: column;
`;

const ChatContainer = styled.div`
  display: flex;
  flex: 1;
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  overflow: hidden;
`;

const RoomsList = styled.div`
  width: 300px;
  border-right: 1px solid ${props => props.theme.colors.gray[200]};
  background: ${props => props.theme.colors.gray[50]};
`;

const RoomsHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  font-weight: 600;
  color: ${props => props.theme.colors.gray[900]};
`;

const RoomItem = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  transition: background-color 0.2s ease;

  ${props => props.active && `
    background: ${props.theme.colors.primary}20;
    border-left: 3px solid ${props.theme.colors.primary};
  `}

  &:hover {
    background: ${props => props.theme.colors.gray[100]};
  }
`;

const RoomName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const RoomInfo = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  background: white;
`;

const ChatTitle = styled.h2`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ChatSubtitle = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray[500]};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.gray[50]};
`;

const Message = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};

  ${props => props.isOwn && `
    flex-direction: row-reverse;
  `}
`;

const MessageAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  max-width: 70%;
`;

const MessageBubble = styled.div`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.isOwn ? props.theme.colors.primary : 'white'};
  color: ${props => props.isOwn ? 'white' : props.theme.colors.gray[900]};
  box-shadow: ${props => props.theme.shadows.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const MessageMeta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.gray[500]};
  ${props => props.isOwn && `text-align: right;`}
`;

const MessageInput = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  background: white;
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const Input = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const SendButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.secondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ChatPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchRooms();
  }, [user]);

  useEffect(() => {
    if (roomId && rooms.length > 0) {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        setActiveRoom(room);
        fetchMessages(roomId);
      }
    } else if (rooms.length > 0 && !activeRoom) {
      setActiveRoom(rooms[0]);
      fetchMessages(rooms[0].id);
    }
  }, [roomId, rooms]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchRooms = async () => {
    try {
      // Mock chat rooms data
      const mockRooms = [
        {
          id: '1',
          name: 'General Discussion',
          description: 'General course discussions',
          participants: 45,
          lastMessage: 'Welcome to the course!',
          lastActivity: '2 minutes ago'
        },
        {
          id: '2',
          name: 'AWS Cloud Computing',
          description: 'AWS course discussions',
          participants: 32,
          lastMessage: 'Great question about EC2!',
          lastActivity: '15 minutes ago'
        },
        {
          id: '3',
          name: 'React Development',
          description: 'React course discussions',
          participants: 28,
          lastMessage: 'Check out this component pattern',
          lastActivity: '1 hour ago'
        }
      ];

      setRooms(mockRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      // Mock messages data
      const mockMessages = [
        {
          id: '1',
          text: 'Welcome everyone to our discussion room!',
          sender: 'Dr. Sarah Johnson',
          senderId: 'teacher1',
          timestamp: '2024-01-15T10:00:00Z',
          isOwn: false
        },
        {
          id: '2',
          text: 'Thank you! Excited to be here.',
          sender: 'John Doe',
          senderId: 'student1',
          timestamp: '2024-01-15T10:05:00Z',
          isOwn: false
        },
        {
          id: '3',
          text: 'Looking forward to learning!',
          sender: 'You',
          senderId: user?.id || 'current-user',
          timestamp: '2024-01-15T10:10:00Z',
          isOwn: true
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeRoom) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'You',
      senderId: user?.id || 'current-user',
      timestamp: new Date().toISOString(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Chat - AWS Education Platform</title>
        </Helmet>
        <PageContainer>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading chat rooms...
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Chat - AWS Education Platform</title>
      </Helmet>
      <PageContainer>
        <ChatContainer>
          <RoomsList>
            <RoomsHeader>Chat Rooms</RoomsHeader>
            {rooms.map(room => (
              <RoomItem
                key={room.id}
                active={activeRoom?.id === room.id}
                onClick={() => {
                  setActiveRoom(room);
                  fetchMessages(room.id);
                }}
              >
                <RoomName>{room.name}</RoomName>
                <RoomInfo>{room.participants} participants • {room.lastActivity}</RoomInfo>
              </RoomItem>
            ))}
          </RoomsList>

          <ChatArea>
            {activeRoom ? (
              <>
                <ChatHeader>
                  <ChatTitle>{activeRoom.name}</ChatTitle>
                  <ChatSubtitle>{activeRoom.description} • {activeRoom.participants} participants</ChatSubtitle>
                </ChatHeader>

                <MessagesContainer>
                  {messages.map(message => (
                    <Message key={message.id} isOwn={message.isOwn}>
                      <MessageAvatar>
                        {getInitials(message.sender)}
                      </MessageAvatar>
                      <MessageContent>
                        <MessageBubble isOwn={message.isOwn}>
                          {message.text}
                        </MessageBubble>
                        <MessageMeta isOwn={message.isOwn}>
                          {message.sender} • {formatTime(message.timestamp)}
                        </MessageMeta>
                      </MessageContent>
                    </Message>
                  ))}
                  <div ref={messagesEndRef} />
                </MessagesContainer>

                <MessageInput>
                  <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <SendButton type="submit" disabled={!newMessage.trim()}>
                      Send
                    </SendButton>
                  </form>
                </MessageInput>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                  <h3>Select a chat room to start messaging</h3>
                  <p>Choose from the available rooms on the left</p>
                </div>
              </div>
            )}
          </ChatArea>
        </ChatContainer>
      </PageContainer>
    </>
  );
};

export default ChatPage;