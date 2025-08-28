export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'grace';
  timestamp: Date;
  metadata?: {
    responseStatus?: string;
    stage?: string;
    askedQuestion?: string;
    [key: string]: any;
  };
}

export type DialogStep =
  | 'trust_building'
  | 'situation_discovery'
  | 'lifestyle_discovery'
  | 'readiness_discovery'
  | 'priorities_discovery'
  | 'needs_matching'
  | 'info_sharing'
  | 'schedule_visit'
  | 'visit_transition';

export interface IntakeForm {
  name: string;
  phone: string;
  familyMemberName: string;
  reasonForCall: string;
  greatestConcern: string;
  impact: string;
  currentResidence: string;
  dailyRoutine: string;
  enjoysDoing: string;
  awareLooking: 'yes' | 'no' | '';
  feelingsAboutMove: string;
  othersInvolved: string;
  mostImportant: string;
  confidenceFactors: string;
  recap: string;
  email: string;
  mailingAddress: string;
  preferredContactMethod: 'phone' | 'email' | 'mail' | '';
  referralSource: string;
} 