import type { SenderRole } from './enums';

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  sender_role: SenderRole;
  message_text: string;
  attachments: string[];
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
}

/** The other user in a conversation (provider when you're customer, customer when you're provider) */
export interface ConversationParty {
  id: string;
  full_name: string;
  profile_image: string | null;
}

/** A conversation as returned by GET /chat/conversations */
export interface Conversation {
  id: string;
  booking_number: string;
  service: { id: string; title: string };
  /** The person on the other side — NOT the logged-in user */
  other_party: ConversationParty;
  last_message: {
    id: string;
    message_text: string;
    sender_name: string;
    created_at: string;
    is_read: boolean;
  } | null;
  unread_count: number;
  total_messages: number;
  updated_at: string;
}
