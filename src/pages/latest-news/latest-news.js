import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GET_LATEST_NEWS } from "../../redux/constants";
import News from "../../components/news/news";

const LatestNews = () => {
  const { latestNews } = useSelector(store => store?.news || {});
  const { latestNewsError } = useSelector(store => store?.errors || {});
  const { isLoadingData } = useSelector(store => store?.loader || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: GET_LATEST_NEWS });
  }, [dispatch]);

  return(
    <div>
      {isLoadingData ? <h3>Loading...</h3> : (
          <News news={latestNews} error={latestNewsError} title="Latest News" />
      )}
    </div>
  );
};

export default LatestNews;
