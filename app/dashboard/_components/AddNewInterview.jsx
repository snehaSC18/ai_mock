"use client"
import React,{useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
//import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useRouter } from 'next/navigation'
//import { db } from '@/utils/db'

  

function AddNewInterview() {
    const [openDialog,setOpenDialog]=useState(false)
    const [jobPosition,setJobPosition]=useState();
    const [jobDesc,setJobDesc]=useState();
    const [jobExp,setJobExperience]=useState();
    const [loading,setLoading]=useState(false);
    const [jsonResponse,setJsonResponse]=useState([]);
    const {user}=useUser();
    const router=useRouter();
    const onSubmit=async(e)=>{

        e.preventDefault()
        setLoading(true)
        console.log(jobPosition,jobDesc,jobExp)
        const InputPrompt="Job Position: "+jobPosition+" Job Description: "+jobDesc+"  Years of Experience:"+jobExp+", Depending on this information please give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions with answers in JSON format, Give questions and answers in field in JSON"
        const result=await chatSession.sendMessage(InputPrompt);

        const MockJsonResp=(result.response.text()).replace('```json','').replace('```','');
        console.log(JSON.parse(MockJsonResp));
        setJsonResponse(MockJsonResp);

        if(MockJsonResp){
        const resp=await db.insert(MockInterview)
        .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonResp,
            jobPosition:jobPosition,
            jobDesc:jobDesc,
            jobExp:jobExp,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-YYYY')
        }).returning({mockId:MockInterview.mockId});

        console.log("Inserted ID:",resp)
        if(resp){
            setOpenDialog(false);
            router.push('/dashboard/interview/'+resp[0]?.mockId)
        }
        }
        else{
            console.log("Error");
        }

        setLoading(false);

    }


  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setOpenDialog(true)}>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>

        </div>
            <Dialog open={openDialog}>

    <DialogContent className='max-w-2xl'>
        <DialogHeader>
        <DialogTitle className='font-bold text-xl'>Tell us more about about the job you want to give an Interview</DialogTitle>
        <DialogDescription>
            <form onSubmit={onSubmit}>
            <div>

                <h2>Add details about your job position/role,job description and years of experience</h2>
                <div className='pt-17 mt-3 my-4'>
                    <label>Job Role/Position</label>
                    <Input placeholder="Ex-Full Stack Developer" required onChange={(event)=>setJobPosition(event.target.value)}/>
                </div>
                <div className='pt-17 my-4'>
                <label>Job Description/Tech Stack</label>
                <Textarea placeholder="Ex-React,Angular,NodeJS,MySql,etc" required onChange={(event)=>setJobDesc(event.target.value)}/>
                </div>
                <div className='pt-17 my-3'>
                    <label>Years of Experience</label>
                    <Input placeholder="Ex-5" type="number" max="50" required onChange={(event)=>setJobExperience(event.target.value)}/>
                </div>
                
            </div>
            
            <div className='flex gap-5 justify-end pt-5'>
                <Button type="button" variant="contained" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                <Button type="submit"  disabled={loading}>
                    {loading?
                    <>
                    <LoaderCircle className='animate-spin'/>'Generating from AI'
                    </>:'Start Interview'
                    }
                    
                   </Button>
            </div>
            </form>
        </DialogDescription>
        </DialogHeader>
    </DialogContent>
    </Dialog>

    </div>
  )
}

export default AddNewInterview