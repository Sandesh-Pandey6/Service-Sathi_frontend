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
