// components/icons/IconWrapper.tsx
import { cn } from '@/lib/utils';
import React, { SVGProps } from 'react';
import { ClassNameValue } from 'tailwind-merge';

export type IconWrapperProps = {
    size?: number;
    color?: string;
    rotate?: boolean;
    className?: ClassNameValue;
    children: React.ReactNode;
    viewBox?: string
};

export default function IconWrapper({
    size = 20,
    color = 'var(--safeSpend-primary)',
    rotate = false,
    className = '',
    children,
    viewBox = "0 0 24 24"
}: IconWrapperProps) {
    return (
        <svg
            style={{ width: size, height: size }}
            className={cn(
                rotate && 'animate-spin [animation-duration:8s]',
                className
            )}
            viewBox={viewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(
                        child as React.ReactElement<SVGProps<SVGSVGElement>>,
                        { fill: color }
                    );
                }
                return child;
            })}
        </svg>
    );
}
