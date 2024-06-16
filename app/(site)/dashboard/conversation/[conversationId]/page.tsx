/* eslint-disable @next/next/no-img-element */
import getConversationById from '@/actions/getConversationById';
import { ConversationProvider } from '@/layout/context/ConversationContext';
import Conversation from './Conversation';
import { Props } from '@/types';

const ConversationPage = async ({ params }: Props<'conversationId'>) => {
    const conversation = await getConversationById(params?.conversationId || '');

    return (
        <ConversationProvider conversation={conversation}>
            <Conversation id="conversation" />
        </ConversationProvider>
    );
};

export default ConversationPage;
