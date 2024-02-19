import { useEffect, useReducer, useState } from 'react';

const secondsPerQuestion = 30;

const Timer = ({appState, onHandleTimer}) => {
  const [seconds, setSeconds] = useState(secondsPerQuestion * appState.apiData.length);

  useEffect(() => {
    if(seconds === 0) {
      onHandleTimer({message: 'game_over'});
      return;
    }

    if(appState.status === 'finished') {
      return;
    }

    const id = setTimeout(() => setSeconds(prev => prev -1), 1000);
    return () => clearTimeout(id);
  }, [seconds, onHandleTimer, appState]);
 
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className='timer'>
      {mins < 10 ? `0${mins}` : mins}:{secs < 10 ? `0${secs}`: secs}
    </div>
  )
}

const reducer = (state, action) => {


  if(action.type === 'set_api_data') {
    return {...state, apiData: action.apiData}
  } 
  if(action.type === 'clicked_option') {
    return {
      ...state,
      clickedOption: action.index,
      userScore: action.index === state.apiData[state.currentQuestion].correctOption
         ? state.userScore + state.apiData[state.currentQuestion].points
         : state.userScore
    }
  }
   if(action.type === 'clicked_next_question') {
     const isLastQuestion = state.currentQuestion + 1 === state.apiData.length;
     return {
      ...state,
      currentQuestion: isLastQuestion ? 0 : state.currentQuestion + 1,
      clickedOption: null,
      appStatus: isLastQuestion ? 'finished' : state.appStatus
     }
   }  

   if(action.type === 'clicked_restart') {
    return {...state, userScore:0, appStatus:'ready', currentQuestion: 0, clickedOption: null};
   }

   if(action.type === 'clicked_start') {
    return {...state, appStatus: 'active'}
   }

   if(action.type === 'game_over') {
    return {...state, appStatus: 'finished'}
   }

  return state;
}

const initialState =  {currentQuestion: 0, apiData: [], clickedOption: null, userScore:0,
appStatus: 'ready'};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
 
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Roger-Melo/fake-data/main/videogame-questions.json')
      .then(response => response.json())
      .then(apiData => dispatch({type: 'set_api_data', apiData}))
      .catch(error => alert(error.message));
  }, []);


  const handleClickOption = index => dispatch({type: 'clicked_option', index});
  const handleClickNextQuestion = () => dispatch({type: 'clicked_next_question'});
  const handleClickRestart = () => dispatch({type: 'clicked_restart'});
  const handleTimer = ({message}) => dispatch({type: message});
  const handleClickStart = () => dispatch({type:'clicked_start'});
  const userHasAnswered = state.clickedOption !== null;
  const maxScore = state.apiData.reduce((acc, q) => acc + q.points, 0);
  const percentage = state.userScore / maxScore * 100;
  const progressValue = userHasAnswered ? state.currentQuestion + 1 : state.currentQuestion;

  return (
    <div className='app'>
      <header className='app-header'>
        <img src="https://cdn-icons-png.flaticon.com/512/5260/5260498.png" alt="logo do quiz" />
        <h1>Quiz dos Videogames</h1>
      </header>
      <main>
        {state.appStatus === 'ready' && (
          <div className='start'>
            <h2>Bem-vindo(a) ao Quiz dos Videogames!</h2>
            <h3>{state.apiData.length} questões para te testar</h3>
            <button onClick={handleClickStart} className='btn'>Bora começar</button>
          </div>
        )}
        {state.appStatus === 'finished' && (
          <>
             <div className='result'>
               <span>Você fez <b>{state.userScore}</b> pontos de {maxScore} ({percentage}%)</span>
             </div>
             <button onClick={handleClickRestart} className='btn btn-ui'>Reinicar quiz</button>
          </>
        )}
        {state.apiData.length > 0 && state.appStatus === 'active' && (
          <>
            <header className='progress'>
              <label>
                 <progress max={state.apiData.length} value={progressValue}>{progressValue}</progress>
                 <span>Questão <b>{state.currentQuestion + 1}</b> / {state.apiData.length}</span>
                 <span><b>{state.userScore}</b> / {maxScore}</span>
              </label>
            </header>
           <div>
            <h4>{state.apiData[state.currentQuestion].question}</h4>
            <ul className='options'>
              {state.apiData[state.currentQuestion].options.map((option, index) => 
                   <li key={option}><button 
                   onClick={() => handleClickOption(index)} 
                   className={`
                       btn 
                       btn-option 
                       ${state.clickedOption === index ? 'answer' : ''}
                       ${userHasAnswered
                         ? (state.apiData[state.currentQuestion]?.correctOption === index
                          ? 'correct'
                          : 'wrong'
                          )
                          :''
                         } 
                       `}
                   disabled={userHasAnswered}
                   >{option}
                   </button>
                   </li>)}
            </ul>
            </div>
           <div>
           <Timer appState={state} onHandleTimer={handleTimer}/>
            {userHasAnswered && (
               <button onClick={handleClickNextQuestion} className='btn btn-option btn-ui'>
                {state.currentQuestion === state.apiData.length - 1 ? 'Finalizar' : 'Próxima'}
               </button>
            )}
           </div>
          </>
        )}
      </main>
    </div>
  )
};


export{ App };
