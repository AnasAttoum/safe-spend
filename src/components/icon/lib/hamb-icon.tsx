import IconWrapper, { IconWrapperProps } from '../icon-wrapper';

export default function HambIcon(props: Omit<IconWrapperProps, 'children'>) {
    return (
        <IconWrapper {...props}>
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path id="primary" d="M21,19H9a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Zm0-6H9a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Zm0-6H9A1,1,0,0,1,9,5H21a1,1,0,0,1,0,2Z" style={{ fill: "#00b2ca000000" }}></path>
                <path id="secondary" d="M5,6A1.5,1.5,0,1,1,3.5,4.5,1.5,1.5,0,0,1,5,6ZM3.5,10.5A1.5,1.5,0,1,0,5,12,1.5,1.5,0,0,0,3.5,10.5Zm0,6A1.5,1.5,0,1,0,5,18,1.5,1.5,0,0,0,3.5,16.5Z"></path>
            </g>
        </IconWrapper>
    )
}