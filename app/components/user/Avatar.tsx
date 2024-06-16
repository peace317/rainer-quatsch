'use client';

import { apiUrl } from '@/util/js-helper';
import { User, UserStatus } from '@prisma/client';
import { AvatarProps as PrimeAvatarProps, Avatar as PrimeAvatar } from 'primereact/avatar';

import { Badge } from 'primereact/badge';
import { useMemo } from 'react';

interface AvatarProps extends PrimeAvatarProps {
    user?: User;
    showStatusBatch?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ user, label, size = 'xlarge', showStatusBatch = false, ...props }) => {
    const isActive = useMemo(() => {
        return user?.status === UserStatus.ONLINE;
    }, [user]);

    const img = useMemo(() => (user?.avatar ? apiUrl('archive', user.avatar) : undefined), [user?.avatar]);

    const _label = useMemo(() => (label === undefined ? user?.displayName.charAt(0) : label), [user?.displayName, label]);

    return (
        <>
            <PrimeAvatar image={img} label={_label} size={size} shape="circle" icon="pi pi-user" {...props}>
                {isActive && showStatusBatch && (
                    <div className="p-avatar p-overlay-badge p-badge-dot absolute">
                        <Badge severity="success" />
                    </div>
                )}
            </PrimeAvatar>
        </>
    );
};

export default Avatar;
