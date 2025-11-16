import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useUser } from '../components/contexts/UserContext';
import { useToast } from '../components/contexts/ToastContext';
import { Conversation, Contact, User, ChatMessage, ConversationStatus } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { initialContacts } from '../data/mockData';

// Mock Data
const initialTeam: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@whatzboot.com', role: 'Admin', avatar: 'https://picsum.photos/seed/admin/100' },
  { id: '2', name: 'Marketing Molly', email: 'molly@example.com', role: 'Marketer', avatar: 'https://picsum.photos/seed/molly/100' },
  { id: '3', name: 'Support Steve', email: 'steve@example.com', role: 'Agent', avatar: 'https://picsum.photos/seed/steve/100' },
];

const initialConversations: Conversation[] = [
  {
    id: 'conv1',
    contactId: '1',
    status: 'Open',
    lastMessage: 'Great, thank you for your help!',
    lastMessageTimestamp: '10:45 AM',
    unreadCount: 0,
    assignedTo: '3',
    messages: [
      { id: 'msg1', text: 'Hello, I have a question about my recent order.', sender: 'contact', timestamp: '10:40 AM' },
      { id: 'msg2', text: 'Hi John, I can help with that. What is your order number?', sender: 'agent', agentId: '3', timestamp: '10:42 AM' },
      { id: 'msg3', text: 'It is #12345.', sender: 'contact', timestamp: '10:43 AM' },
      { id: 'msg4', text: 'Great, thank you for your help!', sender: 'contact', timestamp: '10:45 AM' },
    ],
  },
  {
    id: 'conv2',
    contactId: '2',
    status: 'Open',
    lastMessage: 'Can you tell me more about the new features?',
    lastMessageTimestamp: '11:15 AM',
    unreadCount: 2,
    assignedTo: null,
    messages: [
       { id: 'msg5', text: 'Can you tell me more about the new features?', sender: 'contact', timestamp: '11:15 AM' },
    ]
  },
   {
    id: 'conv3',
    contactId: '3',
    status: 'Closed',
    lastMessage: 'Problem solved, thanks!',
    lastMessageTimestamp: 'Yesterday',
    unreadCount: 0,
    assignedTo: '1',
     messages: [
       { id: 'msg6', text: 'Problem solved, thanks!', sender: 'contact', timestamp: 'Yesterday' },
    ]
  },
];


const TeamInbox: React.FC = () => {
    const { t, dir } = useLanguage();
    const { user } = useUser();
    const { addToast } = useToast();
    
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [contacts] = useState<Contact[]>(initialContacts);
    const [team] = useState<User[]>(initialTeam);
    const [selectedConvId, setSelectedConvId] = useState<string | null>('conv1');
    const [filter, setFilter] = useState<'all' | 'me' | 'unassigned'>('all');
    const [replyMessage, setReplyMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [selectedConvId, conversations]);

    const filteredConversations = useMemo(() => {
        return conversations.filter(conv => {
            if (filter === 'me') return conv.assignedTo === user?.id;
            if (filter === 'unassigned') return conv.assignedTo === null;
            return true;
        }).sort((a,b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime()); // This is a mock sort
    }, [conversations, filter, user]);

    const selectedConversation = useMemo(() => {
        return conversations.find(c => c.id === selectedConvId);
    }, [conversations, selectedConvId]);

    const selectedContact = useMemo(() => {
        return contacts.find(c => c.id === selectedConversation?.contactId);
    }, [contacts, selectedConversation]);

    const handleSelectConversation = (convId: string) => {
        setSelectedConvId(convId);
        // Mark as read
        setConversations(prev => prev.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c));
    };
    
    const handleStatusChange = (convId: string, status: ConversationStatus) => {
        setConversations(prev => prev.map(c => c.id === convId ? { ...c, status } : c));
    };

    const handleAssigneeChange = (convId: string, agentId: string | null) => {
        setConversations(prev => prev.map(c => c.id === convId ? { ...c, assignedTo: agentId } : c));
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim() || !selectedConvId) return;

        const newMessage: ChatMessage = {
            id: `msg${Date.now()}`,
            text: replyMessage,
            sender: 'agent',
            agentId: user?.id,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setConversations(prev => prev.map(c => {
            if (c.id === selectedConvId) {
                return {
                    ...c,
                    messages: [...c.messages, newMessage],
                    lastMessage: newMessage.text,
                    lastMessageTimestamp: newMessage.timestamp,
                }
            }
            return c;
        }));
        setReplyMessage('');
        addToast(t('notifications.message_sent'), { type: 'success' });
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex-shrink-0">
                <h2 className="text-3xl font-semibold text-dark-text-primary">{t('team_inbox.title')}</h2>
                <p className="mt-2 text-dark-text-secondary">{t('team_inbox.subtitle')}</p>
            </div>
            
            <div className="flex-grow mt-6 border border-dark-border rounded-xl flex overflow-hidden">
                {/* Left Panel: Conversation List */}
                <div className="w-1/4 border-r border-dark-border bg-dark-card flex flex-col">
                    <div className="p-4 border-b border-dark-border flex-shrink-0">
                         <div className="flex space-x-2 rtl:space-x-reverse bg-dark-input p-1 rounded-lg">
                            <button onClick={() => setFilter('all')} className={`w-full p-2 text-sm rounded-md ${filter === 'all' ? 'bg-whatsapp-green text-white' : 'text-dark-text-secondary'}`}>{t('team_inbox.filter_all')}</button>
                            <button onClick={() => setFilter('me')} className={`w-full p-2 text-sm rounded-md ${filter === 'me' ? 'bg-whatsapp-green text-white' : 'text-dark-text-secondary'}`}>{t('team_inbox.filter_me')}</button>
                            <button onClick={() => setFilter('unassigned')} className={`w-full p-2 text-sm rounded-md ${filter === 'unassigned' ? 'bg-whatsapp-green text-white' : 'text-dark-text-secondary'}`}>{t('team_inbox.filter_unassigned')}</button>
                        </div>
                    </div>
                    <div className="overflow-y-auto">
                        {filteredConversations.length > 0 ? filteredConversations.map(conv => {
                            const contact = contacts.find(c => c.id === conv.contactId);
                            return (
                                <div key={conv.id} onClick={() => handleSelectConversation(conv.id)}
                                    className={`p-4 cursor-pointer border-b border-dark-border flex space-x-3 rtl:space-x-reverse items-center ${selectedConvId === conv.id ? 'bg-whatsapp-green/10' : 'hover:bg-white/5'}`}>
                                    <div className="relative">
                                        <img src={`https://picsum.photos/seed/${contact?.id}/100`} alt={contact?.name} className="w-12 h-12 rounded-full" />
                                        {conv.unreadCount > 0 && <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full ring-2 ring-dark-card bg-red-500 text-white text-xs flex items-center justify-center">{conv.unreadCount}</span>}
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-dark-text-primary truncate">{contact?.name}</h4>
                                            <span className="text-xs text-dark-text-secondary flex-shrink-0">{conv.lastMessageTimestamp}</span>
                                        </div>
                                        <p className="text-sm text-dark-text-secondary truncate">{conv.lastMessage}</p>
                                    </div>
                                </div>
                            )
                        }) : (
                             <div className="p-4 text-center text-dark-text-secondary">{t('common.no_results')}</div>
                        )}
                    </div>
                </div>

                {/* Center Panel: Chat Window */}
                <div className="w-1/2 bg-dark-bg flex flex-col">
                    {selectedConversation && selectedContact ? (
                        <>
                            <div className="p-4 border-b border-dark-border flex-shrink-0 flex items-center space-x-3 rtl:space-x-reverse bg-dark-card">
                                <img src={`https://picsum.photos/seed/${selectedContact.id}/100`} alt={selectedContact.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <h3 className="font-semibold text-dark-text-primary">{selectedContact.name}</h3>
                                    <p className="text-sm text-dark-text-secondary">{selectedContact.phone}</p>
                                </div>
                            </div>
                            <div className="flex-grow p-6 overflow-y-auto space-y-4">
                               {selectedConversation.messages.map(msg => {
                                   const agent = team.find(a => a.id === msg.agentId);
                                   return (
                                        <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.sender === 'contact' && <img src={`https://picsum.photos/seed/${selectedContact.id}/100`} className="w-8 h-8 rounded-full"/>}
                                            <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'agent' ? 'bg-whatsapp-light-green text-gray-800 rounded-br-none' : 'bg-dark-card text-dark-text-primary rounded-bl-none'}`}>
                                                <p className="text-sm">{msg.text}</p>
                                                <p className={`text-xs opacity-60 mt-1 ${msg.sender === 'agent' ? 'text-right' : 'text-left'}`}>{agent?.name || ''} {msg.timestamp}</p>
                                            </div>
                                             {msg.sender === 'agent' && <img src={agent?.avatar} className="w-8 h-8 rounded-full"/>}
                                        </div>
                                   )
                               })}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 border-t border-dark-border bg-dark-card flex-shrink-0">
                                <form onSubmit={handleSendMessage} className="flex space-x-3 rtl:space-x-reverse">
                                    <input type="text" value={replyMessage} onChange={e => setReplyMessage(e.target.value)} placeholder={t('team_inbox.type_reply')} className="flex-grow p-3 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary" />
                                    <Button type="submit" icon={<i className="fa-solid fa-paper-plane"></i>}>{t('team_inbox.send_button')}</Button>
                                </form>
                            </div>
                        </>
                    ) : (
                       <EmptyState icon={<i className="fa-solid fa-comments"></i>} title={t('empty_states.select_conversation_title')} message={t('empty_states.select_conversation_message')}/>
                    )}
                </div>

                {/* Right Panel: Details */}
                <div className="w-1/4 border-l border-dark-border bg-dark-card overflow-y-auto">
                    {selectedConversation && selectedContact ? (
                        <div className="p-6 space-y-6">
                             <div>
                                <h4 className="font-semibold text-dark-text-primary mb-2">{t('team_inbox.status')}</h4>
                                <select value={selectedConversation.status} onChange={e => handleStatusChange(selectedConversation.id, e.target.value as ConversationStatus)} className="w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary">
                                    <option value="Open">{t('team_inbox.status_open')}</option>
                                    <option value="Pending">{t('team_inbox.status_pending')}</option>
                                    <option value="Closed">{t('team_inbox.status_closed')}</option>
                                </select>
                            </div>
                            <div>
                                <h4 className="font-semibold text-dark-text-primary mb-2">{t('team_inbox.assign_to')}</h4>
                                 <select value={selectedConversation.assignedTo || ''} onChange={e => handleAssigneeChange(selectedConversation.id, e.target.value || null)} className="w-full p-2 bg-dark-input border border-dark-border rounded-lg text-dark-text-primary">
                                    <option value="">{t('team_inbox.unassigned')}</option>
                                    {team.filter(m => m.role !== 'Marketer').map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                                </select>
                            </div>
                            <div className="border-t border-dark-border pt-6">
                                <h4 className="font-semibold text-dark-text-primary mb-4">{t('team_inbox.contact_info')}</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-dark-text-secondary">{t('team_inbox.phone')}</span>
                                        <span className="text-dark-text-primary font-mono">{selectedContact.phone}</span>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-dark-text-secondary mb-2">{t('team_inbox.tags')}</span>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedContact.tags.map(tag => <span key={tag} className="px-2 py-1 text-xs rounded-md bg-blue-500/20 text-blue-300">{tag}</span>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : <div className="p-6 text-center text-dark-text-secondary">...</div>}
                </div>
            </div>
        </div>
    );
};

export default TeamInbox;