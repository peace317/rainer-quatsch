import { Schedule, Conversation, Message, Archive, User } from "@prisma/client";

export type MessageType = Message & {
    sender: User;
    seen: User[];
};

export type ConversationType = Conversation & {
    users?: User[];
    messages?: MessageType[];
    archives?: Archive[];
};

export type ScheduleType = Schedule & {
    participants?: User[];
    conversations?: Conversation[];
};

export type ArchiveType = Archive & {
    uploader: User;
};