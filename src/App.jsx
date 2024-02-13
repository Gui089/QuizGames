import { useEffect, useReducer } from 'react';

const reducer = (state, action) => {
  if(action.type === 'set_api_data') {
    return {...state, apiData: action.apiData}
  }

  return state;
}


const App = () => {
  const [state, dispatch] = useReducer(reducer, {currentQuestion: 0, apiData: []});

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Roger-Melo/fake-data/main/videogame-questions.json')
      .then(response => response.json())
      .then(apiData => dispatch({type: 'set_api_data', apiData}))
      .catch(error => alert(error.message));
  }, []);

  return (
    <div className='app'>
      <main>
        {state.apiData.length > 0 && (
          <>
            <h4>{state.apiData[state.currentQuestion].question}</h4>
            <ul className='options'>
              {state.apiData[state.currentQuestion].options.map(option => 
                   <li key={option}><button className='btn btn-option'>{option}</button></li>)}
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
