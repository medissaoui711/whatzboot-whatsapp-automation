
import { Conversation } from '../types';

export const initialConversations: Conversation[] = [
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
