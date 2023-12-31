import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  loadTests,
  getTest,
  postAnswer,
  score_test,
  overall_score_test,
  deleteCandidateTests,
  score_individual_test,
} from '../../actions/tests.js';
import { setAlert } from '../../actions/alert.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback } from 'react';
import Barchart from '../profiles/BarChart.js';
import { Chart as ChartJS } from 'chart.js/auto';

import PieChartCorrect from '../profiles/PieChartCorrect.js';
import PieChartUsed from '../profiles/PieChartUsed.js';
import ProgressBar from '../profiles/Progressbar.js';
import PieChartOverall from '../profiles/PieChartOverall.js';
import PieChartOverallCorrect from '../profiles/PieChartOverallCorrect.js';
import PieChartCorrectTopics from '../profiles/PieChartCorrectTopics.js';

const CurrentTestResult = () => {
  const dispatch = useDispatch();

  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [testName, setTestName] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const eachTopic = useSelector((state) => state.eachTopicScore.eachTopicScore);

  console.log('XXXXXX  eachTopic== ', eachTopic);

  const { trueAnswers, totalQuestions, topic } = useSelector(
    (state) => state.eachTopicScore.eachTopicScore
  );

  console.log(
    'topic, trueAnswers, totalQuestions ',

    eachTopic[0],
    eachTopic[1],
    eachTopic[2]
  );

  const tests = useSelector((state) => state.tests.tests);

  const selectedQuestions = useSelector((state) => state.selectedQuestions);

  //  const topicsData = useSelector((state) => state.scoreCandidate);
  const overAllScoreCandidateData = useSelector(
    (state) => state.overAllScoreCandidate.overAllScoreCandidate
  );
  console.log('overAllScoreCandidateData==== ', overAllScoreCandidateData);

  const scoreCandidate = useSelector((state) => state.scoreCandidate);

  console.log('I AM scoreCandidate:: ', scoreCandidate);
  const testScore = scoreCandidate;

  console.log('testScore:: ', testScore);
  //  const { questionCount, used, correct } = scoreCandidate.scoreCandidate;
  const questionCount = scoreCandidate.scoreCandidate[0];
  const correct = scoreCandidate.scoreCandidate[1];
  const usedValue = scoreCandidate.scoreCandidate[2];
  const testCount = scoreCandidate.scoreCandidate[3];

  console.log(
    'questionCount, usedValue, correct, testCount',
    questionCount,
    usedValue,
    correct,
    testCount
  );

  // Extract data from the scoreCandidate array
  const topics = overAllScoreCandidateData.map((item) => item.topic);
  const topicCounts = overAllScoreCandidateData.map((item) => item.topicCount);
  const correctCounts = overAllScoreCandidateData.map((item) => item.correct);
  const usedCounts = overAllScoreCandidateData.map((item) => item.used);
  const wrongCounts = overAllScoreCandidateData.map((item) => item.wrong);

  const isAdmin = localStorage.getItem('isAdmin');
  const userId = localStorage.getItem('id');

  // Initialize userAnswers inside a useEffect that depends on tests
  useEffect(() => {
    if (Array.isArray(tests)) {
      setUserAnswers(Array(tests.length).fill(''));
    }
  }, [tests]);

  useEffect(() => {
    console.log(' in useEffect dispatch(loadTests());');
    dispatch(loadTests());
  }, [dispatch]);

  //  useEffect(() => {
  //    dispatch(score_individual_test());
  //  }, [dispatch])

  const handleInputChange = (e) => {
    console.log('in handleInputChange: ', e.target.value);

    e.preventDefault();
    setTestName(e.target.value);

    //console.log('testName: ', testName);

    dispatch(getTest(e.target.value));
    if (tests.length === 0) {
      dispatch(loadTests());
    }
    //
    //setIsDisabled(true);
  };

  // Event handler to handle option selection
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleAnswer = (userAnswers, questionId, testName) => {
    //console.log('in handleAnswer: ', userAnswers, questionId, testName);
    dispatch(postAnswer(questionId, userAnswers, testName, userId));
  };

  const handleScore = (testName) => {
    dispatch(score_individual_test(testName, userId));
  };

  const handleOverallScore = (testName) => {
    console.log('in handleOverallScore');

    dispatch(overall_score_test(getOnlyName(testName)));
  };

  const cleanName = (testName) => {
    // Split the input string by hyphens ("-")
    const parts = testName.split('-');

    // Extract the desired portion (from the first character to the last hyphen)
    const extractedString = parts.slice(0, -1).join(' ');

    //console.log(extractedString); // Output: "Paul Fleischer-Djoleto"
    return extractedString;
  };

  const getOnlyName = () => {
    // Use the split method to split the string by the hyphen character
    const parts = testName.split('-');

    // The part before the hyphen is at index 0
    const extractedPart = parts[0];
    return extractedPart;
  };

  const deleteCandidate = (testname) => {
    if (testname) {
      const newTestName = getOnlyName(testName);
      const result = window.confirm(
        'Are you sure you want to delete this item?'
      );
      if (result) {
        dispatch(deleteCandidateTests(newTestName));
        dispatch(setAlert('Deletion successful!', 'success'));
        dispatch(loadTests());
      } else {
        dispatch(setAlert('Deletion aborted!', 'danger'));
      }
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <ul>
          <li
            style={{
              color: 'black',
              backgroundColor: 'white',
              fontWeight: 'bold',
            }}
          >
            <div className="form-group">
              Select a test:
              <select
                name="testName"
                value={testName}
                onChange={handleInputChange}
                className="select-element"
              >
                <option key="default" value=""></option>
                {tests.map((test) => (
                  <option key={test._id} value={test.test_name}>
                    {test.test_name}
                  </option>
                ))}
              </select>
              {isAdmin === 'true' && (
                <button
                  className="btn btn-danger"
                  onClick={() => deleteCandidate(testName)}
                >
                  Delete Old Candidate
                </button>
              )}
            </div>
          </li>

          {/*<li
            style={{
              color: 'black',
              backgroundColor: 'white',
              fontWeight: 'bold',
            }}
          >
            {Array.isArray(tests) ? (
              tests.map((question, index) => (
                <div key={question._id}>
                  <p>
                    Question {index + 1}: {question.question}
                  </p>

                  {isAdmin === 'true' && (
                    <div style={{ color: 'black', backgroundColor: 'white' }}>
                      <p style={{ color: 'red', backgroundColor: 'white' }}>
                        Answer: {question.answer}
                      </p>

                      <div>
                        Topic: {question.topic} <br />
                        Difficulty Level: {question.difficulty_level}
                        <br />
                        Question Id: {question.questionId}
                        <br />
                        Test Name: {question.test_name}
                      </div>

                      <div>
                        <label htmlFor="optionSelect">Select an option:</label>
                        <select
                          id="optionSelect"
                          value={userAnswers[index] || ''}
                          onChange={(e) => {
                            const updatedAnswers = [...userAnswers]; // Create a copy of the state array
                            updatedAnswers[index] = e.target.value; // Update the corresponding value
                            setUserAnswers(updatedAnswers); // Set the new state
                          }}
                          className="select-element"
                        >
                          <option value="">Select an option</option>
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>

                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() =>
                            handleAnswer(
                              userAnswers[index],
                              question.questionId,
                              question.test_name
                            )
                          }
                        >
                          Post Answer
                        </button>
                      </div>
                      <br />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No questions to display</p>
            )}
          </li>*/}
        </ul>

        <div>
          <div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={() => handleScore(testName)}
            >
              Show individual statistics
            </button>
            {/*<button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => handleOverallScore(testName)}
            >
              Show candidate overall statistics
            </button>*/}
          </div>
          <div style={{ color: 'black', backgroundColor: 'white' }}>
            {/*Topics:{' '}*/}
            {topics.map((topic, index) => (
              <span key={index}>
                {topic} {/* Add a space character here */}
              </span>
            ))}{' '}
            <br />
            <br />
            {/*Count of Topics:{' '}
            {topicCounts.map((topicCount, index) => (
              <span key={index}>{topicCount}, </span>
            ))}{' '}

          

            <br />
            Count of Correct Answers:{' '}
            {correctCounts.map((correctCount, index) => (
              <span key={index}>{correctCount}, </span>
            ))}{' '}
            <br />
            Count of Used Questions:{' '}
            {usedCounts.map((usedCount, index) => (
              <span key={index}>{usedCount}, </span>
            ))}{' '}
            <br />
            Count of Wrong Answers:{' '}
            {wrongCounts.map((wrongCount, index) => (
              <span key={index}>{wrongCount}, </span>
            ))}{' '}*/}
          </div>
        </div>
        <ul>
          {eachTopic.map((topicItem, index) => (
            <li key={index}>
              <PieChartCorrectTopics
                topic={topicItem.topic}
                correct={topicItem.trueAnswers}
                used={topicItem.totalQuestions}
              />
            </li>
          ))}
        </ul>
      </div>
      <br />
    </div>
  );
};

export default CurrentTestResult;
