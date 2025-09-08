import { IntakeForm } from '../types/chat';

export interface ComprehensiveRecord {
  contact_info: {
    name?: string;
    location?: string;
    loved_one_name?: string;
    collected_at: string;
  };
  situation_discovery: {
    question: string;
    answer: string;
    timestamp: string;
  }[];
  lifestyle_discovery: {
    question: string;
    answer: string;
    timestamp: string;
  }[];
  readiness_discovery: {
    question: string;
    answer: string;
    timestamp: string;
  }[];
  priorities_discovery: {
    question: string;
    answer: string;
    timestamp: string;
  }[];
  visit_scheduling: {
    question: string;
    answer: string;
    timestamp: string;
  }[];
  last_updated: string;
}

export interface VisitInfo {
  email?: string;
  mailingAddress?: string;
  preferredContact?: string;
  collectedAt?: string;
}

// Test function to verify mapping works correctly
export const testFormMapping = () => {
  const testData = {
    contact_info: {
      collected_at: "2025-08-14T19:31:30.231Z",
      name: "Chris",
      location: "Houston, TX",
      loved_one_name: "Jane"
    },
    situation_discovery: [
      {
        question: "What made you decide to reach out about senior living today?",
        answer: "ok, ask me",
        timestamp: "2025-08-14T19:33:28.398Z"
      },
      {
        question: "What's your biggest concern about Jane right now?",
        answer: "I'm finding a place my mom can move",
        timestamp: "2025-08-14T19:35:05.099Z"
      },
      {
        question: "How is this situation impacting your family?",
        answer: "Everybody concerns",
        timestamp: "2025-08-14T19:36:49.610Z"
      },
      {
        question: "Where does Jane currently live?",
        answer: "She lives in FL",
        timestamp: "2025-08-14T19:37:48.884Z"
      }
    ],
    lifestyle_discovery: [
      {
        question: "Tell me about your loved one. What does a typical day look like for them?",
        answer: "She lives in FL",
        timestamp: "2025-08-14T19:37:58.817Z"
      },
      {
        question: "What are some things they love doing?",
        answer: "She loves gardening",
        timestamp: "2025-08-14T19:39:07.017Z"
      },
      {
        question: "What's something they've always enjoyed but may have stopped doing recently?",
        answer: "She loves eating but don't like nowadays",
        timestamp: "2025-08-14T19:40:13.139Z"
      }
    ],
    readiness_discovery: [
      {
        question: "Is your loved one aware that you're looking at options?",
        answer: "She loves eating but don't like nowadays",
        timestamp: "2025-08-14T19:40:21.762Z"
      },
      {
        question: "How does your loved one feel about the idea of moving?",
        answer: "She agrees",
        timestamp: "2025-08-14T19:41:29.223Z"
      },
      {
        question: "Who else is involved in helping make this decision?",
        answer: "Me and my sister",
        timestamp: "2025-08-14T19:43:09.258Z"
      }
    ],
    priorities_discovery: [
      {
        question: "What's most important to you regarding the community you may choose?",
        answer: "Me and my sister",
        timestamp: "2025-08-14T19:43:17.976Z"
      },
      {
        question: "What would make you feel confident that this is the right decision for your family?",
        answer: "I'm finding clear environment",
        timestamp: "2025-08-14T19:45:13.248Z"
      }
    ],
    visit_scheduling: [
      {
        question: "What time would work best for your visit?",
        answer: "Tuesday 2PM",
        timestamp: "2025-08-14T19:50:00.000Z"
      }
    ],
    last_updated: "2025-08-14T19:45:14.568Z"
  };

  const result = mapComprehensiveRecordToForm(testData as ComprehensiveRecord, null);
  console.log('Test mapping result:', result);
  return result;
};

// Map comprehensive record data to form fields
export const mapComprehensiveRecordToForm = (
  comprehensiveRecord: ComprehensiveRecord | null,
  visitInfo: VisitInfo | null
): Partial<IntakeForm> => {
  const formData: Partial<IntakeForm> = {};

  if (comprehensiveRecord?.contact_info) {
    formData.name = comprehensiveRecord.contact_info.name || '';
    formData.location = comprehensiveRecord.contact_info.location || '';
    formData.familyMemberName = comprehensiveRecord.contact_info.loved_one_name || '';
  }

  if (visitInfo) {
    formData.email = visitInfo.email || '';
    formData.mailingAddress = visitInfo.mailingAddress || '';
    formData.preferredContactMethod = (visitInfo.preferredContact as 'phone' | 'email' | 'mail') || '';
  }

  // Map situation discovery questions to form fields
  if (comprehensiveRecord?.situation_discovery) {
    for (const entry of comprehensiveRecord.situation_discovery) {
      const question = entry.question;
      const answer = entry.answer;

      if (question === "What made you decide to reach out about senior living today?") {
        formData.reasonForCall = answer;
      } else if (question.includes("What's your biggest concern about") && question.includes("right now?")) {
        formData.greatestConcern = answer;
      } else if (question === "How is this situation impacting your family?") {
        formData.impact = answer;
      } else if (question.includes("Where does") && question.includes("currently live?")) {
        formData.currentResidence = answer;
      }
    }
  }

  // Map lifestyle discovery questions to form fields
  if (comprehensiveRecord?.lifestyle_discovery) {
    for (const entry of comprehensiveRecord.lifestyle_discovery) {
      const question = entry.question;
      const answer = entry.answer;

      if (question === "Tell me about your loved one. What does a typical day look like for them?") {
        formData.dailyRoutine = answer;
      } else if (question === "What does he/she enjoy doing?") {
        formData.enjoysDoing = answer;
      }
    }
  }

  // Map readiness discovery questions to form fields
  if (comprehensiveRecord?.readiness_discovery) {
    for (const entry of comprehensiveRecord.readiness_discovery) {
      const question = entry.question;
      const answer = entry.answer;

      if (question === "Is your loved one aware that you're looking at options?") {
        formData.awareLooking = answer.toLowerCase().includes('yes') ? 'yes' : 'no';
      } else if (question === "How does your loved one feel about the idea of moving?") {
        formData.feelingsAboutMove = answer;
      } else if (question === "Who else is involved in helping make this decision?") {
        formData.othersInvolved = answer;
      }
    }
  }

  // Map priorities discovery questions to form fields
  if (comprehensiveRecord?.priorities_discovery) {
    for (const entry of comprehensiveRecord.priorities_discovery) {
      const question = entry.question;
      const answer = entry.answer;

      if (question === "What's most important to you regarding the community you may choose?") {
        formData.mostImportant = answer;
      } else if (question === "What would make you feel confident that this is the right decision for your family?") {
        formData.confidenceFactors = answer;
      }
    }
  }

  // Generate a recap based on the collected information
  if (comprehensiveRecord) {
    const recapParts = [];
    
    if (comprehensiveRecord.contact_info?.loved_one_name) {
      recapParts.push(`${comprehensiveRecord.contact_info.loved_one_name} is your loved one`);
    }
    
    if (comprehensiveRecord.situation_discovery?.length > 0) {
      const concerns = comprehensiveRecord.situation_discovery
        .filter(entry => entry.question.includes("biggest concern"))
        .map(entry => entry.answer);
      if (concerns.length > 0) {
        recapParts.push(`Your main concern is: ${concerns[0]}`);
      }
    }
    
    if (comprehensiveRecord.lifestyle_discovery?.length > 0) {
      const activities = comprehensiveRecord.lifestyle_discovery
        .filter(entry => entry.question.includes("love doing"))
        .map(entry => entry.answer);
      if (activities.length > 0) {
        recapParts.push(`They love: ${activities[0]}`);
      }
    }
    
    if (recapParts.length > 0) {
      formData.recap = `It sounds like ${recapParts.join(', ')}.`;
    }
  }

  return formData;
}; 