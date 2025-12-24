import { Helmet } from "react-helmet-async";

import { Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import ArticleService from "../../../../services/admin/ArticleService";
import { UserContext } from "../../../../contexts/UserContext";
import { formatDateTimeToDMY } from "../../../../utils/formatDate";
function WatchHistory() {
  const { user } = useContext(UserContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);

      const data = await ArticleService.getArticlesViewedByUser(user.userId);

      const sortedData = data.sort(
        (a, b) => new Date(b.viewAt) - new Date(a.viewAt)
      );
      const formatData = sortedData.map((item) => ({
        ...item,
        viewAt: formatDateTimeToDMY(item.viewAt),
      }));
      setArticles(formatData);
    } catch (error) {
      console.log("Lỗi khi fetch news", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Tin đã xem</title>
      </Helmet>
      <Container fluid className="p-0 mt-1">
        <div
          style={{
            color: "#244892",
            fontSize: "20px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <h3 className="fw-bold mb-3">Tin đã xem</h3>
        </div>

        <div className="d-flex flex-column mt-3">
          {loading ? (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" className="text-primary" />
            </div>
          ) : articles.length === 0 ? (
            <p>Hiện chưa xem bài báo nào</p>
          ) : (
            articles.map((item) => (
              <div
                className="d-flex mb-3 pb-3 border-bottom"
                key={item.id}
                style={{ gap: "15px" }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="flex-shrink-0"
                  style={{
                    width: "clamp(125px, 20vw, 196px)",
                    height: "clamp(80px, 12vw, 125px)",
                  }}
                />
                <div>
                  <Link
                    to={`/news/${item.slug}`}
                    className="fw-bold text-dark h5 d-block mb-1"
                  >
                    {item.title}
                  </Link>
                  <p
                    className="mb-1 text-muted d-none d-md-block"
                    style={{ fontSize: "14px" }}
                  >
                    {item.summary.length > 120
                      ? item.summary.slice(0, 120) + "..."
                      : item.summary}
                  </p>
                  <small className="text-secondary d-none d-md-block">
                    Xem lúc: {item.viewAt}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </Container>
    </>
  );
}

export default WatchHistory;
