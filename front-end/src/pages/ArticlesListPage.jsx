import articles from "../article-content";
import ArticlesList from "../ArticlesList";

export default function ArticlesListPage() {
  return (
    <div>
      <h1>Articles</h1>
      <ArticlesList articles={articles} />
    </div>
  );
}
