function SkeletonCard() {
  return (
    <div
      className="CardPoke border border-gray-800 rounded-tl-lg
    relative overflow-hidden shadow before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20
        hover:shadow-lg before:animate-[shimmer_1.5s_infinite]"
    >
      <div className="w-[198px] h-[198px] bg-gray-400 rounded-tl-lg" />

      <h3
        className={`bg-gray-400 text-[12px] text-gray-400 w-[30px] ml-1 mt-1`}
      >
        L
      </h3>
      <span className="m-1 bg-gray-400 text-gray-400 w-fit">Loading...</span>
      <span className="text-[10px] flex gap-2 ">
        <h4
          id="pokeType"
          className={`p-1 m-1 rounded-md text-[16px] bg-gray-400 text-gray-400`}
        >
          Load
        </h4>
      </span>
    </div>
  );
}

export default SkeletonCard;
