import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  loadTests,
  loadTestsUserid,
  getTest,
  postAnswer,
  score_test,
  overall_score_test,
  deleteCandidateTests,
} from '../../actions/tests.js';
import { setAlert } from '../../actions/alert.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback } from 'react';
import Barchart from '../profiles/BarChart.js';
import { Chart as ChartJS } from 'chart.js/auto';
//import BarChart from '../profiles/BarChart.js';
//import BarChartOverall from '../profiles/BarChartOverall.js';
//import PieChart2 from '../profiles/PieChart2.js';
import PieChartCorrect from '../profiles/PieChartCorrect.js';
import PieChartUsed from '../profiles/PieChartUsed.js';
import ProgressBar from '../profiles/Progressbar.js';
import PieChartOverall from '../profiles/PieChartOverall.js';
import PieChartOverallCorrect from '../profiles/PieChartOverallCorrect.js';

const ProfileTestResult = () => {
  const dispatch = useDispatch();

  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [testName, setTestName] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const overAllScoreCandidateData = useSelector(
    (state) => state.overAllScoreCandidate.overAllScoreCandidate
  );

  console.log('overAllScoreCandidateData==== ', overAllScoreCandidateData);

  const { questionCount, topicCountAnsweredBy } = overAllScoreCandidateData;
  console.log('questionCount==== ', overAllScoreCandidateData.questionCount);
  console.log(
    'topicCountAnsweredBy==== ',
    overAllScoreCandidateData.topicCountAnsweredBy
  );

  // Extract data from the scoreCandidate array
  const topics = overAllScoreCandidateData.map((item) => item.topic);
  const topicCounts = overAllScoreCandidateData.map((item) => item.topicCount);
  const correctCounts = overAllScoreCandidateData.map((item) => item.correct);
  const usedCounts = overAllScoreCandidateData.map((item) => item.used);
  const wrongCounts = overAllScoreCandidateData.map((item) => item.wrong);

  console.log('topicCounts==', topicCounts);
  console.log('usedCounts==', usedCounts);

  const tests = useSelector((state) => state.tests.tests);

  const selectedQuestions = useSelector((state) => state.selectedQuestions);

  //  const topicsData = useSelector((state) => state.scoreCandidate);

  const { scoreCandidate, loading } = useSelector(
    (state) => state.scoreCandidate
  );

  console.log('I AM scoreCandidate:: ', scoreCandidate);

  // Check if topicsData is empty
  const isScoreCandidateDataEmpty = scoreCandidate.length === 0;

  //  console.log('selectedQuestions:: ', selectedQuestions);

  //  console.log('tests.test_name:: ', tests.tests);

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

  const handleInputChange = (e) => {
    //console.log('in handleInputChange: ', e.target.value);

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
    dispatch(score_test(testName, userId));
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
            </div>
          </li>
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
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => handleOverallScore(testName)}
            >
              Show candidate overall statistics
            </button>
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
          </div>
        </div>
        <ul>
          {scoreCandidate.map((score, index) => (
            <li key={index}>
              <PieChartCorrect
                topic={score.topic}
                correct={score.correct}
                used={score.used}
              />

              <ProgressBar
                topic={score.topic}
                correct={score.correct}
                individualTopicCount={score.individualTopicCount}
              />
            </li>
          ))}
          <li>
            <PieChartOverall
              questionCount={overAllScoreCandidateData[0]}
              topicCountAnsweredBy={overAllScoreCandidateData[1]}
            />
            {/*<PieChartOverallCorrect
              topicCountWithFlagTrue={overAllScoreCandidateData[2]}
              questionCount={overAllScoreCandidateData[0]}            
            />*/}
          </li>
        </ul>
      </div>
      <br />
    </div>
  );
};

export default ProfileTestResult;