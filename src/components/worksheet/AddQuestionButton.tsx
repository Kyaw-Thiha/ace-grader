const AddQuestionButton = () => {
  const questionTypes = [
    {
      label: "MCQ",
    },
  ];

  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn-ghost btn m-1">
        Add Question
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
      >
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </ul>
    </div>
  );
};

export default AddQuestionButton;
