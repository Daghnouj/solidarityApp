import type { Video } from "../types";
import { extractYouTubeId, formatDate } from "../utils";

interface VideoCardProps {
  video: Video;
  onClick: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <article
      className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
      onClick={() => onClick(video.id)}
    >
      {/* YouTube Video */}
      <div className="relative pb-[56.25%]">
        <iframe
          src={`https://www.youtube.com/embed/${extractYouTubeId(
            video.videoUrl
          )}?modestbranding=1&rel=0&controls=1&autohide=1`}
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
          title={video.title}
        />
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-3 min-h-[3.5em] line-clamp-2">
          {video.title}
        </h3>

        <div className="flex justify-between text-gray-500 text-sm">
          <span>
            <span className="mr-1">👁️</span>
            {video.views.toLocaleString()}
          </span>

          <time dateTime={video.createdAt}>{formatDate(video.createdAt)}</time>
        </div>
      </div>
    </article>
  );
};
