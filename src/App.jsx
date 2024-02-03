const App = () => {
  const questions = [
    {
      question: 'Qual foi o primeiro video game lançado ?',
      true: 'Magnavox Odyssey',
      b:'Atari',
      c:'Master System',
      d:'Saturn'
    },
  ]

  return (
    <>
      <div className='app-header'>
         <h1>Quiz dos Games</h1>
      </div>
      <div className='app'>
         <ul>
           {
             questions.map(question => (
               <>
                  <h2 className=''>{question.question}</h2>
                  <li className='options btn btn-option'>{question.true}</li>
                  <li className='options btn btn-option'>{question.b}</li>
                  <li className='options btn btn-option'>{question.c}</li>
                  <li className='options btn btn-option'>{question.d}</li>
               </>
             ))
           }  
         </ul>
         <button className='btn btn-ui'>Próxima</button>
      </div>
    </>
  );
}

export{ App };
