import { useEffect, useState } from "react";
import Badge from "../../component/Badge";
import "../../component/css/TimeDisplay.css";
import { FaCog } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import AxiosInstance from "../../auth/AxiosInstance";

const HomePage = () => {
  const token = localStorage.getItem("userToken");
  const [currentTime, setCurrentTime] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [modeManual, setModeManual] = useState(false);
  const [barcodeDisplay, setBarcodeDisplay] = useState("No barcode scanned");
  const [barcodeScan, setBarcodeScan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketData, setTicketData] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const storedModeManual = localStorage.getItem("modeManual");
    if (storedModeManual) {
      setModeManual(JSON.parse(storedModeManual));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("modeManual", JSON.stringify(modeManual));
  }, [modeManual]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  const toggleButtons = () => {
    setShowButtons((prev) => !prev);
  };

  const toggleModeManual = () => {
    setModeManual((prev) => !prev);
    localStorage.setItem("modeManual");
  };

  const handleEdit = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda Mengizinkan?",
      text: "Anda akan melanjutkan tindakan ini.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Izinkan!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const valueData = {
        codeStatus: 4444,
        startTime: new Date(),
      };

      await AxiosInstance.put(`/api/v1/tickets/${id}`, valueData, {
        headers: { token: token },
      });

      window.location.reload();
      Swal.fire({
        title: "Izin Diberikan!",
        text: `${id} telah diizinkan keluar`,
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Dibatalkan",
        text: "Tindakan ini telah dibatalkan.",
        icon: "error",
      });
    }
  };

  const fetchTicket = async () => {
    try {
      const response = await AxiosInstance.get(
        `/api/v1/tickets?codeStatus=2222&codeStatus=3333&codeStatus=4444`
      );
      if (response.data) {
        setTicketData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Jakarta",
      };
      const formatter = new Intl.DateTimeFormat("id-ID", options);
      setCurrentTime(formatter.format(now));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ticketData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && barcodeScan.length > 20) {
        handleScan(barcodeScan);
        setBarcodeScan("");
        return;
      }

      if (e.key === "Shift") return;

      setBarcodeScan((prev) => prev + e.key);
      setTimeout(() => setBarcodeScan(""), 1000);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [barcodeScan]);

  const handleScan = async (barcodeString) => {
    setBarcodeDisplay(barcodeString);

    try {
      // Fetch the ticket data first to check the current codeStatus
      const ticketResponse = await AxiosInstance.get(
        `/api/v1/tickets/${barcodeString}`,
        {
          headers: { token: token },
        }
      );

      console.log(ticketResponse.data.data);

      const { codeStatus, category } = ticketResponse.data.data;

      let valueData = {};

      if (category === 7030) {
        // If category is 7030, set codeStatus to 5555 and expired to true
        valueData = {
          codeStatus: 5555,
          expired: true,
        };
      } else if (codeStatus === 2222) {
        valueData = {
          codeStatus: 3333,
          startTime: new Date(),
        };
      } else if (codeStatus === 4444) {
        valueData = {
          codeStatus: 5555,
          endTime: new Date(),
          expired: true,
        };
      }

      if (Object.keys(valueData).length > 0) {
        const response = await AxiosInstance.put(
          `/api/v1/tickets/${barcodeString}`,
          valueData,
          {
            headers: { token: token },
          }
        );

        if (!response.data) {
          throw new Error(
            `Failed to update ticket for codeStatus ${codeStatus}`
          );
        }
      }

      fetchTicket();

      Swal.fire({
        title: "Success!",
        text: "Ticket updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update ticket. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    setBarcodeScan("");
  };

  return (
    <div className="p-6 mx-auto relative">
      <header className="text-center py-6 mb-6 border-b border-gray-300">
        <h1 className="text-4xl font-bold text-[#014B7C]">SI MIKA</h1>
        <h2 className="text-2xl font-semibold text-[#014B7C] mt-2">
          VERIFIKASI SURAT IZIN KELUAR
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-[#014B7C] mx-auto my-4 rounded-full"></div>
        <h3 className="text-3xl text-red-500 scoreboard-font font-semibold">
          {currentTime}
        </h3>
      </header>
      {barcodeDisplay}
      <table className="min-w-full bg-white text-sm border rounded-lg shadow-md">
        <thead className="bg-blue-200 text-blue-700 border-b">
          <tr>
            <th className="py-3 px-6 text-left font-semibold">No</th>
            <th className="py-3 px-6 text-left font-semibold">NISN</th>
            <th className="py-3 px-6 text-left font-semibold">Kelas</th>
            <th className="py-3 px-6 text-left font-semibold">Nama</th>
            <th className="py-3 px-6 text-left font-semibold">ID User</th>
            <th className="py-3 px-6 text-left font-semibold">ID Tiket</th>
            <th className="py-3 px-6 text-center font-semibold">Jenis</th>
            <th className="py-3 px-6 text-center font-semibold">Status</th>
            <th className="py-3 px-6 text-center font-semibold">Request</th>
            {modeManual && (
              <th className="py-3 px-6 text-center font-semibold">Edit</th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((student, index) => (
            <tr
              key={index}
              className={`transition-transform duration-300 ease-in-out hover:bg-blue-100 ${
                index % 2 === 0 ? "bg-blue-50" : "bg-white"
              }`}
            >
              <td className="py-3 px-6 text-left">
                {indexOfFirstItem + index + 1}
              </td>
              <td className="py-3 px-6 text-left truncate">{student.nisn}</td>
              <td className="py-3 px-6 text-left truncate">
                {student.classGrade}
              </td>
              <td className="py-3 px-6 text-left truncate">
                {student.username}
              </td>
              <td className="py-3 px-6 text-left truncate">{student.idUser}</td>
              <td className="py-3 px-6 text-left truncate">{student._id}</td>
              <td className="py-3 px-6 text-center flex justify-center">
                <Badge data={student.category} />
              </td>
              <td className="py-3 px-6 text-center truncate">
                {student.codeStatus}
              </td>
              <td
                className={`py-3 px-6 text-center font-semibold ${
                  student.expired ? "text-red-600" : "text-green-600"
                }`}
              >
                {student.expired ? "Expired" : "Active"}
              </td>
              {modeManual && (
                <td className="py-3 px-6 text-center truncate">
                  <button
                    onClick={() => handleEdit(student._id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600"
          } text-white font-bold py-2 px-4 rounded-lg`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {Math.ceil(ticketData.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={indexOfLastItem >= ticketData.length}
          className={`${
            indexOfLastItem >= ticketData.length
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600"
          } text-white font-bold py-2 px-4 rounded-lg`}
        >
          Next
        </button>
      </div>

      <div className="fixed top-2 right-4 z-50 flex items-center">
        <button
          className="bg-white text-blue-600 p-2 rounded-full shadow-md"
          onClick={toggleButtons}
        >
          <FaCog size={24} />
        </button>
        {showButtons && (
          <div className="absolute top-12 right-4 w-48 bg-white shadow-md rounded-lg py-2">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              onClick={toggleModeManual}
            >
              {modeManual ? "Disable Manual Mode" : "Enable Manual Mode"}
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              onClick={toggleButtons}
            >
              <IoMdClose size={20} className="inline mr-2" />
              Close Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
