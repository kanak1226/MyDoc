import axios from "axios";
import { toast } from "react-toastify";
import { createContext, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

  // ✅ Get all doctors
  const getAllDoctors = async () => {
    if (!aToken) {
      toast.error("Unauthorized. Please log in.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.status} - ${error.response.data.message}`);
      } else {
        toast.error(error.message);
      }
    }
  };

  // ✅ Change doctor availability
  const changeAvailability = async (docId) => {
    try {
      setDoctors((prevDoctors) =>
        prevDoctors.map((doc) =>
          doc._id === docId ? { ...doc, available: !doc.available } : doc
        )
      );

      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        toast.success("Availability Changed ✅");
      } else {
        toast.error(data.message);
        setDoctors((prevDoctors) =>
          prevDoctors.map((doc) =>
            doc._id === docId ? { ...doc, available: !doc.available } : doc
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setDoctors((prevDoctors) =>
        prevDoctors.map((doc) =>
          doc._id === docId ? { ...doc, available: !doc.available } : doc
        )
      );
    }
  };

  // ✅ Get all appointments
  const getAllAppointments = async () => {
    if (!aToken) {
      toast.error("Unauthorized. Please log in.");
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.status} - ${error.response.data.message}`);
      } else {
        toast.error(error.message);
      }
    }
  };

  // ✅ Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    if (!aToken) {
      toast.error("Unauthorized. Please log in.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // ✅ Get dashboard data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ✅ Delete doctor (fixed Authorization header)
  const deleteDoctor = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/delete-doctor`,
        { docId },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    getAllAppointments,
    setAppointments,
    cancelAppointment,
    dashData,
    getDashData,
    deleteDoctor,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
