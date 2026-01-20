import React, { useState, useEffect, useRef } from 'react';
import {
  Edit,
  Trash2,
  Copy,
  Share2,
  Download,
  Star,
  Archive,
  Eye,
  EyeOff,
  MoreVertical
} from 'lucide-react';

interface ContextMenuItem {
  label: string;
  icon: React.ElementType;
  action: () => void;
  color?: 'default' | 'danger' | 'warning';
  divider?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  triggerElement?: React.ReactNode;
  position?: { x: number; y: number };
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  triggerElement,
  position: externalPosition
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle right-click on trigger element
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  // Handle trigger button click
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPosition({ x: rect.right, y: rect.bottom });
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  // Use external position if provided
  useEffect(() => {
    if (externalPosition) {
      setPosition(externalPosition);
    }
  }, [externalPosition]);

  // Adjust menu position to keep it in viewport
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let { x, y } = position;

      // Adjust horizontal position
      if (x + menuRect.width > viewportWidth) {
        x = viewportWidth - menuRect.width - 10;
      }

      // Adjust vertical position
      if (y + menuRect.height > viewportHeight) {
        y = viewportHeight - menuRect.height - 10;
      }

      setPosition({ x, y });
    }
  }, [isOpen]);

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'danger':
        return 'text-red-600 hover:bg-red-50';
      case 'warning':
        return 'text-orange-600 hover:bg-orange-50';
      default:
        return 'text-gray-700 hover:bg-blue-50';
    }
  };

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.action();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger Element */}
      {triggerElement ? (
        <div onContextMenu={handleContextMenu} onClick={handleTriggerClick}>
          {triggerElement}
        </div>
      ) : (
        <button
          onClick={handleTriggerClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MoreVertical size={18} className="text-gray-600" />
        </button>
      )}

      {/* Context Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 min-w-[200px] animate-scaleIn"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider && (
                <div className="my-1 border-t border-gray-200"></div>
              )}
              <button
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${getColorClasses(
                  item.color
                )} ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                <item.icon size={16} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.15s ease-out;
        }
      `}</style>
    </>
  );
};

// Example usage component
export const ContextMenuExample: React.FC = () => {
  const cardContextMenuItems: ContextMenuItem[] = [
    {
      label: 'Edit',
      icon: Edit,
      action: () => console.log('Edit clicked')
    },
    {
      label: 'Copy',
      icon: Copy,
      action: () => console.log('Copy clicked')
    },
    {
      label: 'Share',
      icon: Share2,
      action: () => console.log('Share clicked')
    },
    {
      label: 'Download',
      icon: Download,
      action: () => console.log('Download clicked'),
      divider: true
    },
    {
      label: 'Add to Favorites',
      icon: Star,
      action: () => console.log('Favorite clicked'),
      color: 'warning'
    },
    {
      label: 'Archive',
      icon: Archive,
      action: () => console.log('Archive clicked')
    },
    {
      label: 'Delete',
      icon: Trash2,
      action: () => console.log('Delete clicked'),
      color: 'danger',
      divider: true
    }
  ];

  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-blue-900">Card with Context Menu</h3>
          <ContextMenu items={cardContextMenuItems} />
        </div>
        <p className="text-gray-600 text-sm">
          Right-click anywhere on this card or click the menu button to see the context menu
        </p>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <ContextMenu
            items={cardContextMenuItems}
            triggerElement={
              <div className="cursor-pointer">
                <p className="text-sm text-blue-900 font-medium">Try right-clicking here!</p>
                <p className="text-xs text-gray-600 mt-1">Or click the dots at the top</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ContextMenu;