import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import QuestionTitlePanel from '../../molecules/QuestionTitlePanel/QuestionTitlePanel';
import QuestionOptionsPanel from '../../molecules/QuestionOptionsPanel/QuestionOptionsPanel';
import CardPanel from '../../atoms/CardPanel/CardPanel';
import ScaleIconButton from '../../molecules/ScaleIconButton/ScaleIconButton';
import Timer from '../../atoms/Timer/Timer';
import Loading from '../../atoms/Loading/Loading';
import Cards from '../../atoms/Cards/Cards';
import Log from '../../utils/Log';

import './QuestionPanel.css';

class QuestionPanel extends Component {
  constructor(props) {
    super(props);
    this.log = new Log(this.constructor.name);
    this.state = { selectedAnswer: -1, time: 30, bitcoinPrice: 0, loading: false, question: null };
    this.getContent = this.getContent.bind(this);
    this.onCardSelected = this.onCardSelected.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.updateBitcoinPrice = this.updateBitcoinPrice;
    this.newQuestion = this.newQuestion.bind(this);
    this.cardNumberSelected = this.cardNumberSelected.bind(this);
    this.updateBitcoinPrice();
    this.getTimer = this.getTimer.bind(this);
    this.resetTime = false;
  }
  componentWillMount() {
    this.log.info('componentWillMount');
    this.setState({ question: this.getQuestion() });
  }
  componentDidMount() {
    this.log.info('componentDidMount');
    this.bitcoinTimerID = setInterval(() => this.updateBitcoinPrice(), (60000));
  }
  componentWillReceiveProps(nextProps) {
    this.log.info('componentWillReceiveProps');
    if (nextProps.shouldSkipQuestion) {
      this.newQuestion();
    }
  }
  shouldComponentUpdate() {
    this.log.info('shouldComponentUpdate');
    return true;
  }
  componentWillUpdate() {
    this.log.info('componentWillUpdate');
    this.log.info('WRONG ' + this.wrong);
    // console.log(`renderizando QuestionPanel: ${(this.state.selectedAnswer > -1)} 
    // time= ${this.state.time}`);
  }
  componentDidUpdate() {
    this.log.info('componentDidUpdate');
    this.resetTime = false;
  }
  componentWillUnmount() {
    this.log.info('componentWillUnmount');
    clearInterval(this.bitcoinTimerID);
    this.log.error('clearInterval');
  }
  onCardSelected(selectedAnswerIndex) {
    if (selectedAnswerIndex != null && selectedAnswerIndex > -1) {
      this.setState({ selectedAnswer: selectedAnswerIndex });
    }
  }
  getContent() {
    return (
      <div>
        <div className="row">
          <div className="col m12 zero-padding-left">
            <QuestionTitlePanel
              scaleIn={(this.state.selectedAnswer > -1)}
              question={this.state.question.question}
            />
            <div style={{ marginTop: '20px' }}>
              <ScaleIconButton
                onClick={this.checkAnswer}
                className="btn-floating btn-large waves-effect waves-light green"
                iconClassName="material-icons"
                scaleIn={(this.state.selectedAnswer > -1)}
                icon="done"
              />
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col m9 s11">
            <QuestionOptionsPanel
              onCardSelected={this.onCardSelected}
              options={this.state.question.options}
              questionId={this.state.question.id}
              removeWrongOptions={this.wrong}
              correctAnswer={this.state.question.correct}
            />
            {this.state.bitcoinPrice}
          </div>
          <div className="col m3">
            <CardPanel className="yellow darken-3 center" content={this.getTimer()} />
          </div>
        </div>
      </div>
    );
  }
  getQuestion() {
    const questions = [
      {
        id: 1,
        question: 'Qual das siglas significa quilômetro?',
        options: ['KO', 'KM', 'KK', 'KG'],
        correct: 1,
      },
      {
        id: 2,
        question: 'Quem foi autor do manifesto comunista?',
        options: ['Lenin', 'Gorbatchov', 'Karl Marx', 'Allan Kardec'],
        correct: 2,
      },
      {
        id: 3,
        question: 'Que compositora brasileira fez sucesso com a sua marcinha \'Abre alas\'?',
        options: ['Chiquita Bacana', 'Chiquinha Gonzaga', 'Chica da Silva', 'Chiquititas'],
        correct: 0,
      },
      {
        id: 4,
        question: 'Qual é o animal que representao signo de touro?',
        options: ['Hipopótamo', 'Cavalo', 'Touro', 'Galo'],
        correct: 2,
      },
      {
        id: 5,
        question: 'Como é chamada a doença que está clareando a pele de Michael Jackson?',
        options: ['Astigmatismo', 'Pedofilia', 'Vitiligo', 'Bruxismo'],
        correct: 2,
      },
      {
        id: 6,
        question: 'Quem é o parceiro de aventuras de Dom Quixote?',
        options: ['Sancho Pança', 'Guilherme Tell', 'Sigmund Freud', 'Lancelot'],
        correct: 0,
      },
      {
        id: 7,
        question: 'Violoncelo é um instrumento de:',
        options: ['Sopro', 'Cordas', 'Percussão', 'Repercussão'],
        correct: 1,
      },
      {
        id: 8,
        question: 'Que médico realizou a primeira cirgurgia de pont de safena no Brasil?',
        options: ['Dr. Zerbini', 'Dr. Fritz', 'Dr. Jatene', 'Dr. Calligari'],
        correct: 2,
      },
      {
        id: 9,
        question: 'Quem é a mulher do Tarzan?',
        options: ['Diana', 'Louis Lane', 'Jane', 'Chita'],
        correct: 2,
      },
      {
        id: 10,
        question: 'Que profissional conduz o elevador?',
        options: ['Condutor', 'Elevadorista', 'Ascensorista', 'Botonista'],
        correct: 2,
      },
      {
        id: 11,
        question: 'Como é chamado o homem sedutor o conquistador irresistível:',
        options: ['Dom Juan', 'Dom Dóca', 'Dom Galã', 'Dom Divino'],
        correct: 0,
      },
      {
        id: 12,
        question: 'Que fruta é ressecada para se tornar ameixa seca?',
        options: ['Ameixa', 'Uva', 'Pêssego', 'Melão'],
        correct: 0,
      },
      {
        id: 13,
        question: 'O que têm em comum rosa lilás e azul?',
        options: ['São vinhos', 'São flores', 'São cores', 'Sâo ilhas'],
        correct: 2,
      },
      {
        id: 14,
        question: 'Fôrma baguete e francês são:',
        options: ['Tipos de pão', 'Provas olímpicas', 'Línguas românticas', 'Queijos'],
        correct: 0,
      },
      {
        id: 15,
        question: 'O que é ornitorrinco?',
        options: ['Vulcão', 'Rio', 'Legume', 'Animal'],
        correct: 3,
      },
    ];
    // setTimeout(() => {
    this.setState({ loading: false });
    // }
    // , 2000);
    return (questions[Math.floor((Math.random() * questions.length))]);
  }
  getTimer() {
    return (<Timer onComplete={this.checkAnswer} time={this.state.time} reset={this.resetTime} />);
  }
  newQuestion() {
    this.resetTime = true;
    this.wrong = 0;
    this.setState({ selectedAnswer: -1, question: this.getQuestion() });
  }
  checkAnswer() {
    this.setState({ loading: true });
    clearInterval(this.bitcoinTimerID);
    if (this.state.selectedAnswer === this.state.question.correct) {
      this.log.info('E a resposta está... correta');
      setTimeout(() => {
        this.newQuestion();
      }, 1000);
    } else {
      this.log.info('E a resposta está... erradaaaa');
      setTimeout(() => {
        this.wrong = 0;
        this.setState({ loading: false, selectedAnswer: -1 });
      }, 1000);
    }
  }
  updateBitcoinPrice() {
    //https://www.cryptocompare.com/api/#introduction
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD,BRL')
      .then((response) => {
        this.setState({
          bitcoinPrice: ((1.0000 / response.data.BTC.BRL) * 1000000).toFixed(3),
        });
      })
      .catch((error) => {
        this.log.error(error);
      });
  }
  cardNumberSelected(number) {
    this.log.info(`carta selecionada ${number}`);
    this.wrong = number;
    { this.props.cardsCallback && this.props.cardsCallback(); }
  }
  render() {
    return (
      <div>
        {this.state.loading && <Loading />}
        {this.props.shouldShowCards && <Cards onComplete={this.cardNumberSelected} />}
        <CardPanel
          className="blue darken-3 zero-padding-left"
          content={this.getContent()}
        />
      </div>
    );
  }
}

export default QuestionPanel;

QuestionPanel.propTypes = {
  shouldSkipQuestion: PropTypes.bool,
  shouldShowCards: PropTypes.bool,
};

QuestionPanel.defaultProps = {
  shouldSkipQuestion: false,
  shouldShowCards: false,
};