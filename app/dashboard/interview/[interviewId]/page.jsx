
"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from "@/components/ui/button";
import Link from 'next/link';


function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    console.log(params.interviewId)
    GetInterviewDetails();
  }, [params.interviewId])

  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))
    setInterviewData(result[0])

  }
  return (
    <div className=''>
      <h2 className='p-3 font-bold text-2xl text-purple-800'>Let's Get Started!!</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div className='flex flex-col my-5 gap-1'>
          <div className='flex flex-col p-5 rounded-lg border gap-5'>
            {interviewData ? (
              <>
                <h2 className='text-lg'><strong>Job Role:</strong> {interviewData.jobPosition}</h2>
                <h2 className='text-lg'><strong>Description:</strong> {interviewData.jobDesc}</h2>
                <h2 className='text-lg'><strong>Years of Experience</strong> {interviewData.jobExp}</h2>
              </>
            ) : (
              <p>Loading interview details...</p>
            )}
          </div>
          <div className='mt-3 p-5 border rounded-lg border-purple-800 bg-purple-700'>
            <h2 className='flex justify-center gap-2 items-center text-white '><Lightbulb /><strong>Information</strong></h2>
            <h3 className='mt-3 text-purple-200'>Enable Video Web Cam and Microphone to start your AI Generated Mock Interview.It has 5 question and depending on your answers it will generate a score and feedback card</h3>
          </div>


        </div>
        <div>
          {webCamEnabled ? <Webcam onUserMedia={() => setWebCamEnabled(true)} onUserMediaError={() => setWebCamEnabled(false)} mirrored={true} style={{
            height: 300,
            width: 300
          }} /> :
            <>
              <WebcamIcon className='h-60 w-full my-4 p-10 bg-gray-200 rounded-lg border' />
              <Button onClick={() => setWebCamEnabled(true)} className="w-full bg-gray-200 text-purple-900 font-bold  hover:bg-purple-700 hover:text-white my-5" >Enable Web Cam and Microphone</Button>
            </>
          }
        </div>


      </div>

      <div className='flex justify-end items-end'>
        <Link href={"/dashboard/interview/"+params.interviewId+"/start"}>
        <Button className=" bg-gray-200 text-purple-700 font-bold  hover:bg-purple-700 hover:text-white">Start Interview</Button>
        
        </Link>
      </div>


    </div>
  )
}

export default Interview