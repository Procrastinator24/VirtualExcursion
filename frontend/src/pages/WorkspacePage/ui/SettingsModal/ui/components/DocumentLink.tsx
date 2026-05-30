import { Download } from 'lucide-react';

interface DocumentLinkProps {
    fileName: string;
    url: string;
}

export const DocumentLink = ({ fileName, url }: DocumentLinkProps) => {
    const handleDownload = () => {
        window.open(url, '_blank');
    };

    return (
        <button
            onClick={handleDownload}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
            <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">
                {fileName}
            </span>
            <Download className="w-3.5 h-3.5 text-blue-600" />
        </button>
    );
};