
import { DripCampaign, MessageTemplate } from '../types';

export const initialCampaigns: DripCampaign[] = [
  {
    id: 'camp1',
    name: 'New User Onboarding',
    status: 'active',
    triggerType: 'tag_added',
    triggerValue: 'new-lead',
    steps: [
      { id: 'step1', delayDays: 0, delayHours: 1, templateId: '1' },
      { id: 'step2', delayDays: 2, delayHours: 0, templateId: '2' },
    ],
  },
   {
    id: 'camp2',
    name: 'Post-Purchase Follow-up',
    status: 'paused',
    triggerType: 'tag_added',
    triggerValue: 'purchased-item-x',
    steps: [
      { id: 'step3', delayDays: 7, delayHours: 0, templateId: '1' },
    ],
  },
];

export const mockTemplates: MessageTemplate[] = [
    { id: '1', name: 'Welcome Message', message: 'Hi there! Welcome to WhatzBoot. Let us know if you have any questions.', approvalStatus: 'Approved' },
    { id: '2', name: 'Feature Check-in', message: 'Just checking in! Have you tried our new Team Inbox feature yet?', approvalStatus: 'Approved' },
];
