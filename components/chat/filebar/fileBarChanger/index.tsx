interface stateType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ToggleTabs = ({ setActiveTab, activeTab }: stateType) => {
  return (
    <div
      className={`relative flex bg-[rgba(10,10,10,0.04)] rounded-sm max-[320px]:max-w-[200px]  mx-auto max-w-[245px] max-[1140px]:max-w-[210px]  -full `}
    >
      <div
        className={`absolute z-0 top-0.5 left-0.5  h-[calc(100%-4px)] max-w-[120px] max-[1140px]:max-w-[90px] w-full  rounded-sm  border border-[rgba(10,10,10,0.16)]  bg-white  transition-all duration-300 max-[320px]:max-w-[110px] ${
          activeTab === "saved" ? "translate-x-full max-[320px]:!max-w-[80px] max-[320px]: max-[1140px]:ml-7 max-[320px]:pr-2" : "translate-x-0 max-[320px]:max-w-[110px] max-[1140px]:!max-w-[110px]  "
        }`}
      />
      <button
        onClick={() => setActiveTab("uploads")}
        className={`flex items-center justify-center flex-1/2 relative px-4 py-1.5 font-medium transition-colors text-[#1d1d1d] text-sm duration-300 rounded-lg text-nowrap ${
          activeTab === "uploads"
            ? "text-[#1d1d1d]"
            : "text-[rgba(10,10,10,0.7)]"
        }`}
      >
        Your uploads
      </button>
      <button
        onClick={() => setActiveTab("saved")}
        className={`relative z-10 px-4 py-1.5 text-sm   flex-1/2 flex items-center w-full justify-center font-medium transition-colors duration-300 rounded-full ${
          activeTab === "saved" ? "text-[#1d1d1d]" : "text-[rgba(10,10,10,0.7)]"
        }`}
      >
        Saved
      </button>
    </div>
  );
};

export default ToggleTabs;
