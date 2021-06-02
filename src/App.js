import './App.css';
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import Headline from "./component/Headline"
function App() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [maxArticles, setMaxArticles] = useState(0);

  function applySearch() {
    fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=c6ffdbfe6a8e4f76aae34e3daf08431f&q=' + query + '&pageSize=10&page=' + (page + 1))
      .then(res => res.json())
      .then(body => {
        setMaxArticles(body.totalResults)
        setArticles(body.articles)
        setPage(0)
      })
  }

  useEffect(() => {
    fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=c6ffdbfe6a8e4f76aae34e3daf08431f&q=' + query + '&pageSize=10&page=' + (page + 1))
      .then(res => res.json())
      .then(body => {
        setMaxArticles(body.totalResults)
        setArticles(body.articles)
      })
  }, [page]);

  function renderHeadlines() {
    if (!articles) {
      return;
    }
    return articles.map(article => {
      return <Headline key={article.title} title={article.title} source={article.url}></Headline>;
    });
  }

  function iteratePage(value) {
    setPage(page + value)
  }

  function moveArticle(e) {
    if (!e.destination) return;
    let update = articles.slice(0, e.source.index);
    update.push(...articles.slice(e.source.index + 1, 10));
    
    let finalUpdate = update.slice(0, e.destination.index);
    finalUpdate.push(articles[e.source.index])
    finalUpdate.push(...update.slice(e.destination.index, 10))

    setArticles(finalUpdate)
  }

  return (
    <div className="App">
      <div className="QueryContainer">
        <input name="searchQuery" type="string" onChange={(e) => { setQuery(e.target.value) }}></input>
        <button name="Search" onClick={applySearch}>Search</button>
      </div>
      <div className="headlinesContainer">
        <DragDropContext onDragEnd={ moveArticle }>
          <Droppable droppableId="drop">
            {(provided, snapshot) => (

              <div
                ref={provided.innerRef}
                style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
                {...provided.droppableProps}
              >
                {articles.map((article, index) => (
                  <Draggable key={article.title} draggableId={article.title} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      > 
                        <Headline title={article.title} source={article.url}></Headline>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
            {/* {renderHeadlines()} */}
          </Droppable>
        </DragDropContext>
        <div className="pageIterator">
          <button className="prevButton" disabled={page === 0} onClick={() => iteratePage(-1)}>Prev</button>
          <button className="nextButton" disabled={page * 10 + 10 > maxArticles} onClick={() => iteratePage(1)}>Next</button>
        </div>
      </div>
    </div>

  );
}

export default App;
