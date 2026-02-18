import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface SocialShareProps {
    url: string;
    title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
    const shareLinks = [
        {
            name: 'Facebook',
            icon: <FaFacebookF />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'bg-[#1877F2]'
        },
        {
            name: 'Twitter',
            icon: <FaTwitter />,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out this article: ${title}`)}&via=SolidarityApp`,
            color: 'bg-[#1DA1F2]'
        },
        {
            name: 'LinkedIn',
            icon: <FaLinkedinIn />,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            color: 'bg-[#0A66C2]'
        },
        {
            name: 'WhatsApp',
            icon: <FaWhatsapp />,
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Hey, I found this interesting article on Solidarity: *${title}*\n\nRead it here: ${url}`)}`,
            color: 'bg-[#25D366]'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.color} text-white p-3 rounded-full hover:scale-110 transition-transform shadow-md`}
                    title={`Share on ${link.name}`}
                >
                    {link.icon}
                </a>
            ))}
            <button
                onClick={copyToClipboard}
                className="bg-gray-200 text-gray-700 p-3 rounded-full hover:bg-gray-300 hover:scale-110 transition-all shadow-md"
                title="Copy link"
            >
                <FaLink />
            </button>
        </div>
    );
};

export default SocialShare;
