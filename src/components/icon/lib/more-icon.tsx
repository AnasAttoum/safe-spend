import IconWrapper, { IconWrapperProps } from '../icon-wrapper';

export default function MoreIcon(props: Omit<IconWrapperProps, 'children'>) {
    return (
        <IconWrapper {...props}>
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

            <g id="SVGRepo_iconCarrier"> <path opacity="0.1" d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" /> <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke={props.color||'var(--safeSpend-primary)'} fill='#0000' strokeWidth="2" /> <path d="M8 12H8.01" stroke={props.color||'var(--safeSpend-primary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M12 12H12.01" stroke={props.color||'var(--safeSpend-primary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M16 12H16.01" stroke={props.color||'var(--safeSpend-primary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </g>
        </IconWrapper>
    )
}