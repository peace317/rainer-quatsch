'use client';

import { User } from "@prisma/client";
import { AvatarGroup as PrimeAvatarGroup } from 'primereact/avatargroup';
import Avatar from "./Avatar";

interface AvatarGroupProps {
  users?: User[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users = []
}) => {
  const slicedUsers = users.slice(0, 3);

  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }

  return (
    <div>
      <PrimeAvatarGroup >
        {slicedUsers.map((user, index) => (
          <Avatar key={index} user={user} />
        ))}
      </PrimeAvatarGroup>
    </div>
  );
}

export default AvatarGroup;