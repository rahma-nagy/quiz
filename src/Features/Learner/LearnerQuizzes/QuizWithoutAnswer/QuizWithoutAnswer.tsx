import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionsWithoutAnswers } from "../../../../Redux/Features/Learner/QuestionsWithoutAnswerSlice";
import joinQuiz from "../../../../Redux/Features/Learner/joinQuiz";
import { useNavigate, useParams } from "react-router-dom";
import { submitQuiz } from "../../../../Redux/Features/Learner/SubmitQuizSlice";

const QuizWithoutAnswer = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizId } = useParams();

  // const { data, loading, error } = useSelector((state) => state.joinQuizData) || {};

  const {
    questions: quiz,
    loading,
    error,
  } = useSelector((state) => state.questionWithoutAnswers);
  // console.log(quiz);
  // console.log(quiz?.questions);
  // console.log(quiz?.title);
  // submit quiz answers

  // const handleSubmitQuizAnswers = async (data) => {
  //   try {
  //     console.log("data:", data);

  //     const response = await dispatch(submitQuiz(data));
  //     // const quizId = response?.payload?.quiz;
  //     console.log(response);
  //     navigate(`/dashboard`);
  //     // console.log("navigate:", quizId);
  //   } catch (error) {
  //     console.error("Error submit quiz ans:", error);
  //   }
  // };
  // const handleSubmitQuizAnswers = async () => {
  //   try {
  //     const data = {
  //       quizId: quizId,
  //       answers: Object.entries(answers).map(([questionId, answer]) => ({
  //         question: questionId,
  //         answer: answer,
  //       })),
  //     };

  //     const response = await dispatch(submitQuiz(data));
  //     navigate(`/dashboard`);
  //   } catch (error) {
  //     console.error("Error submitting quiz answers:", error);
  //   }
  // };
  const handleSubmitQuizAnswers = async () => {
    try {
      const payload = {
        quizId: quizId,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question: questionId,
          answer: answer,
        })),
      };
  
      const response = await dispatch(submitQuiz(payload));
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error submitting quiz answers:", error);
    }
  };
  

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers((prevState) => ({
      ...prevState,
      [questionId]: selectedAnswer,
    }));
  };

  useEffect(() => {
    dispatch(fetchQuestionsWithoutAnswers(quizId));
  }, [dispatch, quizId]);

  return (
    <div className="p-5 flex justify-center items-center">
      <div className="w-3/4 grid gap-5" style={{ backgroundColor: "#fbfbfb" }}>
        {quiz?.questions &&
          quiz?.questions.map((question, index) => (
            <div key={question._id} className="bg-[#FFEDDF] p-3 rounded">
              <p className="border-b border-gray-300 mb-2 pb-2">
                {index + 1}.{question?.title}
              </p>

              <form className="bg-white p-3 rounded">
                {Object.entries(question?.options).map(
                  ([optionKey, optionValue]) => (
                    <div key={optionKey} className="mb-2">
                      {/* <input
                    type="radio"
                    id={optionKey}
                    name={`question_${index}`}
                    value={optionKey}
                    className="mr-2"
                    onChange={() => handleAnswerSelect(question._id, optionKey)}

                  /> */}
                      <input
                        type="radio"
                        id={optionKey}
                        name={`question_${index}`}
                        value={optionKey}
                        className="mr-2"
                        onChange={() =>
                          handleAnswerSelect(question._id, optionKey)
                        }
                      />
                      <label htmlFor={optionKey}>{optionValue}</label>
                    </div>
                  )
                )}
              </form>
            </div>
          ))}
        <button
          type="submit"
          onClick={() => handleSubmitQuizAnswers(answers)}
          className="bg-black hover:bg-orange-500 text-white font-bold py-2 rounded w-44"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default QuizWithoutAnswer;
