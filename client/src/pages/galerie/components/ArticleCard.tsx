// src/pages/galerie/components/ArticleCard.tsx

import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: (articleId: number) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onClick,
}) => {
  return (
    <article
      className="relative overflow-hidden rounded-3xl cursor-pointer h-[414px] shadow-[0_10px_15px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-1"
      onClick={() => onClick(article.id)}
    >
      <img
        src={article.image}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover brightness-95"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 flex items-end">
        <div className="p-6 w-full">
          <h3 className="text-white text-3xl font-bold text-center mb-6">
            {article.title}
          </h3>
        </div>
      </div>
    </article>
  );
};