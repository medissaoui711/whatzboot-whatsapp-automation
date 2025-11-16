export interface DashboardStats {
  messagesSent: number;
  activeBots: number;
  groupsManaged: number;
  contacts: number;
}

export interface MessageTrend {
  name: string;
  sent: number;
  received: number;
}

export interface AutoResponderBot {
  id: string;
  name: string;
  trigger: string;
  response: string;
  status: 'active' | 'inactive';
  lastTriggered: string;
}

export interface GroupMember {
  id: string;
  name: string;
  phone: string;
  joined: string;
  isAdmin: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
}

export interface MessageTemplate {
    id: string;
    name: string;
    message: string;
    approvalStatus: 'Approved' | 'Pending' | 'Rejected';
}

export interface CampaignAnalytics {
    totalCampaigns: number;
    deliveryRate: number;
    readRate: number;
    replyRate: number;
}

export interface CampaignPerformance {
    id: string;
    name: string;
    sentDate: string;
    recipients: number;
    deliveryRate: number;
    readRate: number;
    replyRate: number;
}

export type Role = 'Admin' | 'Marketer' | 'Agent';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar: string;
    betaTester?: boolean;
}

export type WebhookEvent = 'message.received' | 'message.sent' | 'contact.created' | 'group.member.joined';

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  status: 'active' | 'inactive';
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Failed';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type FeedbackCategory = 'Bug Report' | 'Feature Suggestion' | 'General Feedback';

export type UpdateType = 'New' | 'Improvement' | 'Fix';

export interface Change {
  type: UpdateType;
  description: string;
}

export interface Update {
  version: string;
  date: string;
  changes: Change[];
}

export interface SystemMetric {
  apiStatus: 'Operational' | 'Degraded' | 'Outage';
  activeConnections: number;
  dbLatencyData: { time: string; latency: number }[];
  memoryUsage: number; // as a percentage
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  service: string;
  message: string;
  level: 'critical' | 'error' | 'warning';
}

export interface FeatureUsage {
  feature: string;
  usageCount: number;
}

export interface AffiliateStats {
  clicks: number;
  signups: number;
  conversionRate: number;
  totalEarnings: number;
  pendingPayout: number;
}

export interface Referral {
  id: string;
  email: string;
  signupDate: string;
  status: 'Pending' | 'Subscribed' | 'Canceled';
  commission: number;
}

export interface GlobalSearchResultItem {
  id: string;
  title: string;
  description: string;
  path: string;
}

export interface GlobalSearchResults {
  contacts: GlobalSearchResultItem[];
  bots: GlobalSearchResultItem[];
  campaigns: GlobalSearchResultItem[];
}

// --- Team Inbox Types ---
export type ConversationStatus = 'Open' | 'Pending' | 'Closed';

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  sender: 'contact' | 'agent';
  agentId?: string; // a user ID
}

export interface Conversation {
  id: string;
  contactId: string;
  status: ConversationStatus;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  assignedTo: string | null; // a user ID
  messages: ChatMessage[];
}

// --- Automations (Drip Campaigns) Types ---
export type DripCampaignTriggerType = 'tag_added';

export interface DripCampaignStep {
  id: string;
  delayDays: number;
  delayHours: number;
  templateId: string;
}

export interface DripCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused';
  triggerType: DripCampaignTriggerType;
  triggerValue: string; // e.g., the tag name
  steps: DripCampaignStep[];
}