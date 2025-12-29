import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [profileData, setProfileData] = useState(false);

    console.log('Backend URL:', backendUrl);   // ✅ Check backend URL
    console.log('dToken:', dToken);            // ✅ Check if token is set

    // Get Doctor Appointment Data from Database
    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: {
                    Authorization: `Bearer ${dToken}`  // ✅ Use Bearer format
                }
            });

            console.log('Response:', data);   // ✅ Log response for debugging

            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error(error.message);
        }
    };

    // Get Doctor Profile Data
    const getProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
                headers: {
                    Authorization: `Bearer ${dToken}`
                }
            });

            setProfileData(data.profileData);

        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error(error.message);
        }
    };

    // Cancel Appointment
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancel-appointment`,
                { appointmentId },
                { headers: { Authorization: `Bearer ${dToken}` } }
            );

            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            toast.error(error.message);
        }
    };

    // Complete Appointment
    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/complete-appointment`,
                { appointmentId },
                { headers: { Authorization: `Bearer ${dToken}` } }
            );

            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error completing appointment:', error);
            toast.error(error.message);
        }
    };

    // Get Dashboard Data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
                headers: {
                    Authorization: `Bearer ${dToken}`
                }
            });

            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error(error.message);
        }
    };

    const value = {
        dToken, setDToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
