import { useEffect, useReducer } from 'react';

const reducer = (state, action) => {
  if(action.type === 'set_api_data') {
    return {...state, apiData: action.apiData}
  } 
  if(action.type === 'clicked_option') {
    return {...state, clickedOption: action.index}
  }

  return state;
}


const App = () => {
  const [state, dispatch] = useReducer(reducer, {currentQuestion: 0, apiData: [], clickedOption: null});

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Roger-Melo/fake-data/main/videogame-questions.json')
      .then(response => response.json())
      .then(apiData => dispatch({type: 'set_api_data', apiData}))
      .catch(error => alert(error.message));
  }, []);

  const handleClickOption = index => dispatch({type: 'clicked_option', index});

  return (
    <div className='app'>
      <main>
        {state.apiData.length > 0 && (
          <>
            <h4>{state.apiData[state.currentQuestion].question}</h4>
            <ul className='options'>
              {state.apiData[state.currentQuestion].options.map((option, index) => 
                   <li key={option}><button onClick={() => handleClickOption(index)} className='btn btn-option'>{option}</button></li>)}
            </ul>
           <div>
            <button className='btn btn-option'>Próxima</button>
           </div>
          </>
        )}
      </main>
    </div>
  )
};


export{ App };
