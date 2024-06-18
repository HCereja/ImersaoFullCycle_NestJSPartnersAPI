import { TicketKind } from '@prisma/client';

export class ReservarLugarRequest {
  spots: string[];
  ticket_kind: TicketKind;
  email: string;
}
