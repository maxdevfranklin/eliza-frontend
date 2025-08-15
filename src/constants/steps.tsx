import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import StyleIcon from '@mui/icons-material/Style';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InfoIcon from '@mui/icons-material/Info';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { DialogStep, IntakeForm } from '../types/chat';

export const dialogSteps: DialogStep[] = [
  'trust_building',
  'situation_discovery',
  'lifestyle_discovery',
  'readiness_discovery',
  'priorities_discovery',
  'needs_matching',
  'schedule_visit',
  'visit_transition',
];

export const stepLabels: Record<DialogStep, string> = {
  trust_building: 'Building Trust',
  situation_discovery: 'Understanding You',
  lifestyle_discovery: 'Your Lifestyle',
  readiness_discovery: 'Your Readiness',
  priorities_discovery: 'Your Priorities',
  needs_matching: 'Needs Matching',
  info_sharing: 'Info Sharing',
  schedule_visit: 'Schedule Visit',
  visit_transition: 'Next Steps',
};

export const stepDescriptions: Record<DialogStep, string> = {
  trust_building: 'Setting the tone & Earning trust',
  situation_discovery: 'Unnderstanding youur situation & motivations',
  lifestyle_discovery: 'Understanding the prospect lifestyle',
  readiness_discovery: 'Gauging your awareness & Readiness',
  priorities_discovery: 'Understanding priorities in a community',
  needs_matching: 'Connecting priorities to community',
  info_sharing: 'Sharing information about Grand Villa',
  schedule_visit: 'Confirm contact information',
  visit_transition: 'Transitioning to a visit',
};

export const stepIcons: Record<DialogStep, React.ReactNode> = {
  trust_building: <FavoriteIcon />,
  situation_discovery: <PersonIcon />,
  lifestyle_discovery: <StyleIcon />,
  readiness_discovery: <TrendingUpIcon />,
  priorities_discovery: <StarIcon />,
  needs_matching: <AutoAwesomeIcon />,
  info_sharing: <InfoIcon />,
  schedule_visit: <ScheduleIcon />,
  visit_transition: <TrendingFlatIcon />,
};

// Form steps and field mappings used in the left-bar stepper form
export const formSteps: DialogStep[] = [
  'trust_building',
  'situation_discovery',
  'lifestyle_discovery',
  'readiness_discovery',
  'priorities_discovery',
  'needs_matching',
  'visit_transition',
];

export const formStepFieldMap: Record<DialogStep, Array<keyof IntakeForm>> = {
  trust_building: ['name', 'phone', 'familyMemberName'],
  situation_discovery: ['reasonForCall', 'greatestConcern', 'impact', 'currentResidence'],
  lifestyle_discovery: ['dailyRoutine', 'enjoysDoing'],
  readiness_discovery: ['awareLooking', 'feelingsAboutMove', 'othersInvolved'],
  priorities_discovery: ['mostImportant', 'confidenceFactors'],
  needs_matching: ['recap'],
  info_sharing: [],
  schedule_visit: [],
  visit_transition: ['mailingAddress', 'preferredContactMethod', 'referralSource'],
};

export const fieldLabels: Record<keyof IntakeForm, string> = {
  name: 'Name',
  phone: 'Phone number',
  familyMemberName: "Family member's name",
  reasonForCall: 'What made you decide to call us today?',
  greatestConcern: 'What\'s your greatest concern at this time?',
  impact: 'How is this impacting you?',
  currentResidence: 'Where does your family member currently live?',
  dailyRoutine: 'Tell me about your family member\'s daily routine',
  enjoysDoing: 'What does he/she enjoy doing?',
  awareLooking: 'Is he/she aware that you\'re looking?',
  feelingsAboutMove: 'How does he/she feel about the move?',
  othersInvolved: 'Is anyone else going to be involved in supporting you to make this decision?',
  mostImportant: 'What\'s most important to you regarding the community you may choose?',
  confidenceFactors: 'What would make you feel confident that this is the right decision for your family?',
  recap: 'Recap (It sounds like...)',
  email: 'Email',
  mailingAddress: 'Mailing address',
  preferredContactMethod: 'Preferred contact method',
  referralSource: 'How did you hear about us?',
}; 