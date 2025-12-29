import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const navigate = useNavigate()

    const fetchDocInfo = () => {
        const selectedDoc = doctors.find((doc) => doc._id === docId)
        setDocInfo(selectedDoc || null)
    }

    const getAvailableSlots = () => {
        const slots = []
        const today = new Date()

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            const endTime = new Date(currentDate)
            endTime.setHours(21, 0, 0, 0)

            if (i === 0) {
                currentDate.setHours(Math.max(today.getHours() + 1, 10))
                currentDate.setMinutes(today.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10, 0, 0, 0)
            }

            const timeSlots = []
            while (currentDate < endTime) {
                const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                const slotDateKey = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`
                const isBooked = docInfo?.slots_booked?.[slotDateKey]?.includes(formattedTime)

                if (!isBooked) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            slots.push(timeSlots)
        }

        setDocSlots(slots)
    }

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        const date = docSlots[slotIndex]?.[0]?.datetime
        if (!date || !slotTime) {
            return toast.warning('Please select a valid slot and time')
        }

        const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                { docId, slotDate, slotTime },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (doctors.length > 0) fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) getAvailableSlots()
    }, [docInfo])

    return docInfo ? (
        <div>
            {/* Doctor Details */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="verified" />
                    </p>

                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <span className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</span>
                    </div>

                    <div className='mt-3'>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626]'>
                            About <img className='w-3' src={assets.info_icon} alt="info" />
                        </p>
                        <p className='text-sm text-gray-600 max-w-[700px]'>{docInfo.about}</p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* Booking Slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots.map((slots, index) => (
                        <div
                            onClick={() => setSlotIndex(index)}
                            key={index}
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-[#5F6FFF] text-white' : 'border border-[#DDDDDD]'}`}
                        >
                            <p>{daysOfWeek[slots[0]?.datetime.getDay()]}</p>
                            <p>{slots[0]?.datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots[slotIndex]?.map((slot, idx) => (
                        <p
                            key={idx}
                            onClick={() => setSlotTime(slot.time)}
                            className={`text-sm font-light px-5 py-2 rounded-full cursor-pointer flex-shrink-0 ${slot.time === slotTime ? 'bg-[#5F6FFF] text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}
                        >
                            {slot.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button
                    onClick={bookAppointment}
                    className='bg-[#5f6fff] text-white text-sm font-light px-20 py-3 rounded-full my-6'
                >
                    Book an appointment
                </button>
            </div>

            {/* Related Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : null
}

export default Appointment
