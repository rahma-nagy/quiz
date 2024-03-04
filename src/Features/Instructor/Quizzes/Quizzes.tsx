import React, { useEffect, useState } from 'react';
import imagCard from '../../../assets/images/computer.jpg';
import style from './Quizzes.module.css';
import CustomLeftCard from '../../../Shared/CustomComponents/CustomLeftCard/CustomLeftCard';
import { ArrowCircleRightIcon } from "@heroicons/react/solid";
import newQuiz from '../../../assets/images/new quiz icon.png';
import questionBank from '../../../assets/images/Vault icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzesData } from '../../../Redux/Features/Instructor/Quizzes/getQuizzesSlice';
import { fetchCreateQuizz } from '../../../Redux/Features/Instructor/Quizzes/createQuizzesSlice';
import SharedModal from '../../../Shared/SharedModal/SharedModal';
import { useForm } from 'react-hook-form';
import { fetchGroups } from '../../../Redux/Features/Instructor/Groups/GroupsSlice';
import { fetchDeleteQuiz } from '../../../Redux/Features/Instructor/Quizzes/deleteQuizzesSlice';
import deleteImg from '../../../assets/images/QuestionDeleteIcon.svg'
import codeImg from '../../../assets/images/codeImg.png'
import { TrashIcon } from '@heroicons/react/solid';
import { fetchIncommingQuizzes } from '../../../Redux/Features/Instructor/Quizzes/incommingQuizSlice';
import { fetchcompletedQuizzes } from '../../../Redux/Features/Instructor/Quizzes/completedQuizzesSlice';
import { ClipboardCopyIcon, ClipboardListIcon } from '@heroicons/react/outline';
import Table from '../../../Shared/CustomComponents/Table/Table';
import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';


const Quizzes = () => {
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  const dispatch = useDispatch();
  const durationOptions = [10, 15, 30, 45, 60, 90, 120]; // Add more values as needed

  // Selector
  const { data: quiz, loading, error } = useSelector((state) => state.quizzesData) || {};
  const { data: incommingquiz } = useSelector((state) => state.incommingQuizData) || {};
  const { data: completequiz } = useSelector((state) => state.completedQuizData) || {};



  // Groups
  const groups = useSelector((state) => state.groupsSlice.data); // Assuming your slice is named GroupsData
  const questionNumbers = Array.from({ length: 10 }, (_, index) => index + 1); // Create an array from 1 to 10
  const scorePerQuestion = Array.from({ length: 10 }, (_, index) => index + 1); // Create an array from 1 to 10

  // Fetch groups on component mount
  // useEffect(() => {
  //   dispatch(fetchGroups());
  // }, [dispatch]);
  // Add Quizz

  // const handleCreateQuiz = (formData) => {
  //   const newQuizzData = {
  //     title: formData.title,
  //     description: formData.description,
  //     group: formData.group,
  //     questions_number: formData.questions_number,
  //     difficulty: formData.difficulty,
  //     type: formData.type,
  //     schadule: formData.schadule,
  //     duration: formData.duration,
  //     score_per_question: formData.score_per_question,
  //   };

  //   // Dispatch the fetchCreateQuizz action
  //   dispatch(fetchCreateQuizz(newQuizzData));

  //   dispatch(fetchQuizzesData());
  // };
  // ******* Modals***********
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'update'
  const [quizId, setQuizId] = useState(0);
  const [selectedQuizCode, setSelectedQuizCode] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [createdQuizCode, setCreatedQuizCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);


  //Modal --- Add Questions
  const openAddModal = () => {
    setModalType('add');
    setIsModalOpen(true);
  };


  //Modal --- Delete Question
  const openDeleteModal = (quiz) => {
    setModalType('delete');
    // setQuestionId(question._id);
    // setIsModalOpen(true);

    if (quiz._id !== undefined) {
      setQuizId(quiz._id);
      setIsModalOpen(true);
    } else {
      console.error('Question ID is undefined:', quiz);
    }
  };

  //Function  Add Quizz
  const handleCreateQuiz = (formData) => {
    const newQuizzData = {
      title: formData.title,
      description: formData.description,
      group: formData.group,
      questions_number: formData.questions_number,
      difficulty: formData.difficulty,
      type: formData.type,
      schadule: formData.schadule,
      duration: formData.duration,
      score_per_question: formData.score_per_question,
    };

    // Dispatch the fetchCreateQuizz action
    dispatch(fetchCreateQuizz(newQuizzData))
      .then((response) => {
        // Successfully created quiz
        const createdQuiz = response.payload.data;
        console.log(createdQuiz);
        setCreatedQuizCode(createdQuiz.code);
        closeModal();
        setIsCodeModalOpen(true);
      })
      .catch((error) => {
        // Handle error
        console.error("Error creating quiz:", error);
      });
  };

  // Function to handle copy action
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(createdQuizCode);
      setCopySuccess(true);
      toast.success("Code copied success")
    } catch (error) {
      console.error('Error copying code to clipboard:', error);
    }
  };
  // Function Delete Question
  const handleDeleteQuestion = async (quiz) => {
    // console.log("Question object:", quiz);
    try {
      await dispatch(fetchDeleteQuiz(quizId));
      // Optionally, you can handle success here
      dispatch(fetchQuizzesData());
      closeModal();
    } catch (error) {
      // Handle error
      console.error("Error deleting question:", error);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('add'); // Reset modal type to 'add' when closing
  };


  const data1 = {
    image: imagCard,
  };

  const navigate = useNavigate();
  const navigateToDetails = (quizId) => {
    navigate(`/dashboard/quizzes/quiz-details/${quizId}`);

    // console.log("Navigate to  details with ID:", quizId);
  };

  useEffect(() => {
    dispatch(fetchQuizzesData());
    dispatch(fetchIncommingQuizzes());
    dispatch(fetchcompletedQuizzes());
    dispatch(fetchGroups());
  }, [dispatch]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">

        {/* Left side */}
        <div className="col-span-1">
          {/* First card (25%) */}
          <div className="flex flex-wrap">
            <div className="w-full flex justify-center mb-3">
              <div
                className="w-1/2 md:w-1/4 border-2 py-5 mb-3 ml-2 flex flex-col items-center"
                style={{ border: "1px solid #ccc", borderRadius: "5px" }}
              >
                <button onClick={openAddModal}>
                  <img src={newQuiz} alt="setup new quizz" />
                </button>
                <span className="text-black  mt-2">setup new quizz</span>
              </div>

              {/* sec card (25%) */}
              <div
                className="w-1/2 md:w-1/4 border-2 py-5 mb-3 ml-2 flex flex-col items-center"
                style={{ border: "1px solid #ccc", borderRadius: "5px" }}
              >
                <Link to="/dashboard/quizzes/questions">
                  <button>
                    <img src={questionBank} alt="Question" />
                  </button>
                </Link>
                <span className="text-black  mt-2">Question Bank</span>
              </div>
            </div>
          </div>
          <div>
            {quiz.map((quiz) => (
              <div key={quiz._id} className="mb-4">
                <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <ClipboardListIcon className="h-8 w-8 text-black"
                        style={{
                          backgroundColor: "#FFEDDF",
                          borderRadius: "10px",

                        }} />
                      <div className="flex space-x-4">
                        <p className="text-lg font-semibold">{`${quiz.title}`}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="cursor-pointer"
                          onClick={() => openDeleteModal(quiz)}
                        >
                          <TrashIcon className="h-6 w-6 text-yellow-500 ml-2 " onClick={() => openDeleteModal(question)} />
                        </button>
                        {/* <Link to={`/dashboard/quizzes/quiz-details/${quiz._id}`}> */}
                        <button onClick={() => navigateToDetails(quiz._id)}>
                          <ArrowCircleRightIcon className="h-6 w-6 text-[#C5D86D] ml-2" />
                        </button>
                        {/* </Link> */}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="col-span-1">
          {/* Left upcoming quizzes */}
          <div className=''
          // className={style["left"]}
          >
            <div
              className={style["details"]}
            >
              <h2 className="font-medium">Upcoming quizzes</h2>
            </div>
            <div>
              {incommingquiz.map((quiz) => (
                <CustomLeftCard
                  key={quiz._id}
                  title={quiz.title}
                  date={quiz.schadule}
                  time={quiz.duration}
                  enrolledStudents={quiz.participants}
                  // image={quiz.image}
                  image={data1.image}
                  customWidth="500px"


                />
              ))}
            </div>
          </div>
          {/* Right table */}
          <div

          // className={style["left"]}

          >
            <div
            // className={style["details"]}
            >
              <h2 className="font-medium">Completed quizzes</h2>
              <Table
                data={completequiz.map((quiz) => ({
                  title: quiz.title,
                  status: quiz.status,
                  schadule: quiz.schadule,
                  participants: quiz.participants,
                }))}
              />
            </div>

            {/* <div className="overflow-x-auto mt-4">

              <table
                style={{ width: '500px' }} className="w-full text-sm border-separate table-fixed border">
                <thead>
                  <tr>
                    <th className="border border-slate-400 rounded-l-md bg-black text-white">Title</th>
                    <th className="border border-slate-400 px-2 bg-black text-white">Status</th>
                    <th className="border border-slate-400 px-2 bg-black text-white">Schadule</th>
                    <th className="border border-slate-400 px-2 bg-black text-white">Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {completequiz.map((quiz) => (
                    <tr key={quiz._id}>
                      <td className="border border-slate-300 px-2 rounded-l-md">{quiz.title}</td>
                      <td className="border border-slate-400 px-2">{quiz.status}</td>
                      <td className="border border-slate-400 px-2">{new Date(quiz.schadule).toLocaleString()}</td>
                      <td className="border border-slate-400 px-2">{quiz.participants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div> */}

          </div>
        </div>
      </div>


      {/* Add Modal */}
      {
        isModalOpen && modalType === 'add' && (
          <SharedModal closeModal={closeModal} onSave={handleSubmit(handleCreateQuiz)}
            width="1/2"
            onHide={closeModal}>
            {/* First Row: Input Title */}
            <div className="mb-4 ">
              <label htmlFor="title" className="block text-sm font-medium text-gray-600">Title</label>
              <div className="mb-1 relative">
                <input
                  type="text"
                  id="title"
                  className="p-2  w-full relative  border rounded-md"
                  {...register('title', { required: "Title is required" })}
                />
                {/* <div className="absolute left-1 top-1 bottom-1 bg-orange-200 rounded-md" style={{ width: '130px' }}></div> */}

                {errors.title && <p className="text-red-500">{errors.title.message}</p>}

              </div>
            </div>
            {/* Second Row: 3 Dropdowns */}
            <div className="flex mb-4">
              <div className="w-1/3 mr-2">
                <label htmlFor="dropdown1" className="block text-sm font-medium text-gray-600">Duration
                  <span className='text-orange-200'>(in min)</span></label>
                <select
                  id="duration"
                  {...register('duration', { required: "duration is required" })}
                  className="mt-1 p-2 w-full border rounded-md"
                // className="block w-full py-2.5 px-4 text-sm font-medium  dark:text-black bg-white dark:bg-orange-100
                // border border-gray-300  rounded-lg
                //   focus:outline-none"
                >
                  {durationOptions.map((value) => (
                    <option key={value} value={value}>
                      {value} minutes
                    </option>
                  ))}
                </select>
                {errors.duration && <p className="text-red-500">{errors.duration.message}</p>}

              </div>
              <div className="w-1/3 mx-2">
                <label htmlFor="dropdown2" className="block text-sm font-medium text-gray-600">Question Number</label>
                <select
                  id="questions_number"
                  {...register('questions_number', { required: "Question No required" })}
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  {questionNumbers.map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
                {errors.questions_number && <p className="text-red-500">{errors.questions_number.message}</p>}
              </div>
              <div className="w-1/3 ml-2">
                <label htmlFor="dropdown3" className="block text-sm font-medium text-gray-600">Score Per Question</label>
                <select
                  id="score_per_question"
                  {...register('score_per_question', { required: "Secore per question required" })}
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  {scorePerQuestion.map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
                {errors.score_per_question && <p className="text-red-500">{errors.score_per_question.message}</p>}
              </div>
            </div>

            {/* Third Row: Textarea */}
            <div className="mb-4">
              <label htmlFor="textarea" className="block text-sm font-medium text-gray-600">Description</label>
              <textarea
                id="textarea"
                className="mt-1 p-2 w-full border rounded-md"
                {...register('description')}
              ></textarea>
            </div>

            {/* ... Fourth and Fifth Rows and other rows as needed ... */}
            {/* Combined Schedule and Time Row */}
            <div className="mb-4">
              <label htmlFor="dateTime" className="block text-sm font-medium text-gray-600">Schedule</label>
              <div className="flex items-center">
                <input
                  type="datetime-local"
                  id="schedule"
                  className="mt-1 p-2 border rounded-md mr-2"
                  {...register('schadule', { required: "Schedule is required" })}
                />
                {errors.schadule && <p className="text-red-500">{errors.schadule.message}</p>}
              </div>
            </div>

            {/* Second Row: 3 Dropdowns */}
            <div className="flex mb-4">
              <div className="w-1/3 mr-2">
                <label htmlFor="dropdown1" className="block text-sm font-medium text-gray-600">Difficulty 1</label>
                <select
                  {...register("difficulty", { required: "type is required" })} id="dropdown" className="w-full border p-2 rounded focus:outline-none focus:border-blue-500">
                  <option value="" disabled defaultValue>Select Difficulty Level</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                {errors.difficulty && <p className="text-red-500">{errors.difficulty.message}</p>}
              </div>
              <div className="w-1/3 mx-2">
                <label className="block text-sm font-medium text-gray-600">Type:</label>
                <select
                  {...register("type", { required: "type is required" })} id="dropdown" className="w-full border p-2 rounded focus:outline-none focus:border-blue-500">
                  <option value="" disabled selected>Select Type</option>
                  <option value="BE">BE</option>
                  <option value="FE">FE</option>
                  <option value="DO">DO</option>
                </select>
                {errors.type && <p className="text-red-500">{errors.type.message}</p>}
              </div>
              <div className="w-1/3 ml-2">
                <label htmlFor="dropdown3" className="block text-sm font-medium text-gray-600">Groups</label>
                <select
                  id="group"

                  {...register('group')}
                  className="mt-1 p-2 w-full border rounded-md"
                >
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {errors.group && <p className="text-red-500">{errors.group.message}</p>}

              </div>
            </div>


          </SharedModal>
        )
      }

      {/* Delete Modal */}
      {isModalOpen && modalType === 'delete' && (
        <SharedModal closeModal={closeModal} onSave={handleSubmit(handleDeleteQuestion)} onHide={closeModal}>
          <div className="mb-4 text-center">
            <img src={deleteImg} width={100} alt="Update Image" className="mx-auto" />
            <p>Are you sure to delete this ?</p>
          </div>
        </SharedModal>
      )}
      {/*
      {isModalOpen && modalType === 'code' && (
        <SharedModal closeModal={closeModal} onSave={handleSubmit()} onHide={closeModal}>
          <div className="mb-4 text-center">
            <img src={deleteImg} width={100} alt="Update Image" className="mx-auto" />
            <div className="mb-4">
              <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <p className="text-lg font-semibold">Code: {selectedQuizCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SharedModal>
      )} */}

      {isCodeModalOpen && (
        <SharedModal closeModal={() => setIsCodeModalOpen(false)}  onHide={() => setIsCodeModalOpen(false)}>
          <div className="mb-4 text-center">
            <img src={codeImg} width={100} alt="Update Image" className="mx-auto" />
            <p>Quiz was successfully created</p>
            <div className="mb-4">
              <div className="max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">

                      <p className="text-lg font-semibold">{createdQuizCode}</p>
                      <button
                        onClick={handleCopyCode}
                        className="cursor-pointer"
                      >
                        <ClipboardCopyIcon className="h-6 w-6 text-yellow-500 ml-56" />
                      </button>
                    </div>
                    {copySuccess && <p className="text-green-500">Copied!</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SharedModal>
      )}
    </>
  );
};

export default Quizzes;
