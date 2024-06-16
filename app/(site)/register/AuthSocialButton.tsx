import { IconType } from 'react-icons';

interface AuthSocialButtonProps {
    icon: IconType;
    onClick: () => void;
    label: string;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({ icon: Icon, onClick, label }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
        inline-flex
        w-full 
        justify-center 
        border-round-md
        bg-white 
        px-8 
        py-2
        text-gray-500 
        border-1 
        ring-inset 
        border-gray-300
        hover:bg-gray-50 
        focus:outline-offset-0
        text-xl
      "
      style={{}}
        >
            <div className='grid mt-1'>
            <Icon />
            <label className='ml-2'>{label}</label>
            </div>
        </button>
    );
};

export default AuthSocialButton;
