import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useFetch } from "../hooks/fetch";
import "../styles/table.css";
import { Audio } from "react-loader-spinner";
import { GrUpdate } from "react-icons/gr";
import { AiOutlineDelete ,AiOutlineCloudDownload } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import { ImCross } from "react-icons/im";


const Table = () => {
  // const {data: timetableData,isError: timetableError,loading: timetableLoading} = useFetch()
  const { data: timetable, isError, loading } = useFetch("/getschedule","GET");
  console.log(timetable);
  const [collect,setCollect] = useState({});
  const dis = useRef()
  const crs = useRef()
  const ins = useRef()
  const crs1 = useRef()
  const [dataset,setDataSet] =useState({
    facName:'Raj Sir',
    subs:'Maths',
    lecDur:60 
  })
  const [dataset1,setDataSet1] =useState({
    facName1:'Raj Sir',
    subs1:'Maths',
    lecDur1:60 ,
    timeSlot1:"8:00",
    lecDay1:"Monday"
  })
  const [idimmediate,setidimmediate] =useState('');

  let times = [],
    days = [],
    teachers = [],subjects =[],dur=[],uniquetimes=[],unique=[];
 
  if (timetable) {
    let durations = [];
    // days = timetable.map(element => element.day);
    // days = days.filter((day, index) => days.indexOf(day) === index);
    days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];


    // -------------------for getting unique teachers from array-----------------------

    teachers = timetable.map(element => element.facultyName);
    // console.log(teachers);
    teachers = teachers.filter((day, index) => teachers.indexOf(day) === index);
    // console.log(teachers);


     // -------------------for getting unique subjects from array-----------------------

    subjects = timetable.map(element => element.subjectName);
    // console.log(subjects);
    subjects = subjects.filter((day, index) => subjects.indexOf(day) === index);
    // console.log(subjects)
    ;


    // -------------------for getting unique durations from array-----------------------

    dur = timetable.map(element => element.lectureDuration);
    // console.log(teachers);
    dur = dur.filter((day, index) => dur.indexOf(day) === index);
    // console.log(subjects);
    timetable.forEach(element => {
      unique.push(element.lectureTime);
      durations.push(element.lectureDuration)
    });
    // console.log(durations);

    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    // console.log(minDuration);

    for (let i = 480; i <= 1200; i += minDuration) {
      times.push(i);
    }

    const filteredArray = times.filter(item => !unique.includes(item));
    uniquetimes = filteredArray;
    
  }

  //min to time formater

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const paddedMins = mins < 10 ? `0${mins}` : mins;
    return `${hours}:${paddedMins}`;
  };

  const load = async(e) => {
    console.log(e.target.id);
    setidimmediate(e.target.id);
    let url  = "/record/"+e.target.id;
    console.log(url);
    fetch(url).then(res=>res.json()).then(res=>setCollect(res.data[0]));
    dis.current.style.display='block'
  //  console.log(dataSection);
  };


  const changes = (e)=>{
    let fieldName = e.target.name
    setDataSet((prevState)=>{
      return{
        ...prevState,
        [fieldName]:e.target.value
      }
    })
  }
  const changes1 = (e)=>{
    let fieldName = e.target.name
    setDataSet1((prevState)=>{
      return{
        ...prevState,
        [fieldName]:e.target.value
      }
    })
  }

  console.log(dataset1);
  const submitChanges =async()=>{
    console.log(idimmediate);
    console.log(dataset);
    if(dataset.lecDur== '' || dataset.subs=='' || dataset.facName==0 ){
      alert('Fields cant be held Empty');
    }else{
    const finalData  = await fetch('/updaterecord',{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
    },
      body:JSON.stringify({
        sub:dataset.subs,
        fac:dataset.facName,
        duration:dataset.lecDur,
        id:idimmediate
      })
    }).then(res=>res.json()).then(res=>res)

    if(finalData.success){
      crossbtn();
    }
    }
  }
  const del =async(e)=>{
    let access = e.target.id;

    console.log("delete");
    // console.log(e.target.id);
    const deleteSchedule = await fetch('/deleterecord',{
      method:'POST',
      body:JSON.stringify({
        id:access
      }),
      headers:{
        "Content-Type":"application/json"
    }
    }).then(res=>res.json()).then(res=>res)
    console.log(deleteSchedule);
    if(deleteSchedule.success){
      alert('User Deleted')
      window.location.reload()
    }
  }

const addingsch = ()=>{
  ins.current.style.display ='block'
}

  const crossbtn = ()=>{
    dis.current.style.display='none'
    setDataSet({
      facName:'',
      subs:'',
      lecDur:0
    })
  }

  const submitChanges1 = async()=>{

    if(dataset1.lecDur1== '' || dataset1.subs1=='' || dataset1.facName1==0 || dataset1.timeSlot1=="" || dataset1.lecDay1==""){
      alert('Fields cant be held Empty');
    }else{
    const finalData1  = await fetch('/setrecord',{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
    },
      body:JSON.stringify({
        sub:dataset1.subs1,
        fac:dataset1.facName1,
        duration:dataset1.lecDur1,
        time:dataset1.timeSlot1,
        day:dataset1.lecDay1
      })
    }).then(res=>res.json()).then(res=>{
      alert('Schedule Added');
      return res;
    })

    // if(finalData1.success){
    //   alert('New Schedule Added');
    //   crossbtn1();
    // }
    }
  }
  const crossbtn1 = ()=>{
    ins.current.style.display='none'
  }

  if(collect){
    console.log(collect);
  }





  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
        />
      </div>
    );
  }

  return (
    <>  
    <table className="styled-table">
      <thead>
        <tr>
          <th
            style={{
              textTransform: "uppercase",
              color: "black",
              fontWeight: 700,
            }}
          >
            {/* {tableForm.event_type} */}
          </th>
          {times.map((time) => (
            <th>{formatTime(time)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {days.length > 0 &&
          days.map((day) => (
            <tr key={day}>
              <td>{day}</td>

              {times.length > 0 &&
                times.map((time) => {
                  const lecture = timetable.find(
                    (l) => l.day===day && l.lectureTime === formatTime(time)
                  );
                  if (lecture) {
                    return (
                      <td>
                        <div className="update">
                          <AiOutlineCloudDownload
                            style={{ fontSize: "15px", color:'white' }}
                            id={lecture._id}
                            onClick={load}
                          />
                        </div>
                        <div className="update deleteit">
                          <AiOutlineDelete
                            style={{ fontSize: "15px" , color:'white'}}
                            id={lecture._id}
                            onClick={del}
                          />
                        </div>
                        <p
                          style={{
                            color: "green",
                            fontSize: "20px",
                            marginBottom: "5px",
                          }}
                        >
                          {lecture.subjectName}
                        </p>
                        <p
                          style={{
                            color: "grey",
                            fontSize: "15px",
                            marginBottom: "5px",
                          }}
                        >
                          {lecture.facultyName}
                        </p>
                        <p style={{ color: "red", fontSize: "10px" }}>
                          {lecture.lectureDuration} min
                        </p>
                      </td>
                    );
                  } else {
                    return <td></td>;
                  }
                })}
            </tr>
          ))}
      </tbody>
        
    </table>
    <div className="addtask">
        <IoIosAddCircleOutline style={{fontSize:'50px',cursor:'pointer',zIndex:'100',color:'white'}} onClick={addingsch}/>
    </div>
    <div className="out" ref={dis}>
    <div className="formcont">
      <form className="control">
        <h3>Update Schedule</h3>

        <label>Subject Name</label>
        <input type="text" value={collect.subjectName} onChange={changes}/>
        {/* <label>Current Time Slot</label>
        <input type="text" value="8:00" /> */}
        <label>Faculty Name</label>
        <input type="text" value={collect.facultyName} onChange={changes}/>

        <h3>Select New Update</h3>

        <label>Faculty Name</label>
        <select onChange={changes} name="facName" value={dataset.facName}>
        {teachers.map((ele)=>(
          <option> {ele} </option>
        ))}
        </select>

        <label>Subject</label>
        <select onChange={changes} name="subs" value={dataset.subs}>
        {subjects.map((ele)=>(
          <option> {ele} </option>
        ))}
        </select>

        <label>Duration</label>
        <select onChange={changes} name="lecDur" value={dataset.lecDur}>
        {dur.map((ele)=>(
          <option> {ele} </option>
        ))}
        </select>

        <button className="submitbtn" onClick={submitChanges}>Submit Changes</button>

        
      </form>
      </div>
      <div className="cross" ref={crs} onClick={crossbtn}>
      <ImCross style={{color:'white'}}/>
      </div>
      </div>

    <div className="inn" ref={ins}>
    <div className="formcont1">
      <form className="control1">
        
        <h3>Add New Schedule</h3>

        <label>Faculty Name</label>
        <select onChange={changes1} name="facName1" value={dataset1.facName1}>
        {teachers.map((ele)=>(
          <option> {ele} </option>
        ))}
        </select>

        <label>Subject</label>
        <select onChange={changes1} name="subs1" value={dataset1.subs1}>
        {subjects.map((ele)=>(
          <option> {ele} </option>
        ))}
        </select>

        <label>Duration</label>
        <select onChange={changes1} name="lecDur1" value={dataset1.lecDur1}>
        {dur.map((ele)=>(
          <option> {ele} </option>
        ))}
        </select>

        <label>Day</label>
        <select onChange={changes1} name="lecDay1" value={dataset1.lecDay1}>
        {days.map((ele)=>(
          <option> {ele} </option>
        ))}
        </select>

        <label>Slot Available</label>
        <select onChange={changes1} name="timeSlot1" value={dataset1.timeSlot1}>
        {times.map((ele)=>{
          const lecs = timetable.find((l) => l.day===dataset1.lecDay1 && l.lectureTime === formatTime(ele));
          if(lecs){
          console.log(lecs.lectureTime)
          }
          else{
          return (<option> {formatTime(ele)}</option>)
          }
          })}
        </select>

        <button className="submitbtn1" onClick={submitChanges1}>Submit Changes</button>

        
      </form>
      </div>
      <div className="cross1" ref={crs1} onClick={crossbtn1}>
      <ImCross style={{color:'white'}}/>
      </div>
      </div>
    </>
  );
};

export default Table;
