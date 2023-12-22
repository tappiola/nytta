const Loader = () => {
  return (
    <div className="w-14 fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-120">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 100"
        className="fill-gray-400"
      >
        {[6, 26, 46].map((cx, i) => (
          <circle key={i} stroke="none" cx={cx} cy="50" r="5">
            <animate
              attributeName="opacity"
              dur="1s"
              values="0;1;0"
              repeatCount="indefinite"
              begin={`0.${i + 1}`}
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default Loader;
