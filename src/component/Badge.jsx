import PropTypes from "prop-types";

const Badge = ({ data }) => {
  // Function to determine the badge type based on the 'data' value
  const getBadgeType = () => {
    switch (data) {
      case 7010:
        return (
          <div className="badge bg-[#BEE0FF] rounded-xl h-7 w-20 text-center flex items-center justify-center">
            <p className="text-[#014B7C] font-bold">Dispen</p>
          </div>
        );
      case 7020:
        return (
          <div className="badge bg-[#ffe7c4] rounded-xl h-7 w-20 text-center flex items-center justify-center">
            <p className="text-[#FFA700] font-bold">Izin</p>
          </div>
        );
      case 7030:
        return (
          <div className="badge bg-[#9ec9a7] rounded-xl h-7 w-20 text-center flex items-center justify-center">
            <p className="text-[#1c4d27] font-bold">Pulang</p>
          </div>
        );
      default:
        return (
          <div className="badge bg-gray-200 rounded-xl h-7 w-20 text-center flex items-center justify-center">
            <p className="text-gray-800 font-bold">Unknown</p>
          </div>
        );
    }
  };

  return <>{getBadgeType()}</>;
};

Badge.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Badge;
