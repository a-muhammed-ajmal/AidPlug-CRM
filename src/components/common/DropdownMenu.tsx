import React, { useState, useEffect, useRef } from 'react';

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  icon?: React.ReactNode;
}

export const DropdownMenuItem = ({
  children,
  onClick,
  className = '',
  icon,
}: DropdownMenuItemProps) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center ${className}`}
  >
    {icon} {children}
  </button>
);

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
}

const DropdownMenu = ({ trigger, children, placement = 'bottom-end' }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {trigger}
      </button>
      {isOpen && (
        <div className={`absolute w-48 bg-white rounded-md shadow-lg z-20 border ${
          placement === 'top-start' ? 'bottom-full left-0 mb-2' :
          placement === 'top-end' ? 'bottom-full right-0 mb-2' :
          placement === 'bottom-start' ? 'top-full left-0 mt-2' :
          'top-full right-0 mt-2'
        }`}>
          <div className="py-1">
            {React.Children.map(children, (child) =>
              React.isValidElement<DropdownMenuItemProps>(child)
                ? React.cloneElement(child, {
                    onClick: (e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (child.props.onClick) child.props.onClick(e);
                      setIsOpen(false);
                    },
                  })
                : child
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
