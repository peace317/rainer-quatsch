import ConversationList from '../components/conversation/ConversationList';

const AppSidebar = () => {
    
    return (
        <nav className="mt-2 flex flex-column justify-between">
          <ConversationList />
      </nav>
      );
};

export default AppSidebar;
