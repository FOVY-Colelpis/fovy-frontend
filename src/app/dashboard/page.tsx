
'use client'
import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
interface SkillmapScore {
    name: string,
    value: number,
}
interface SkillMapData {
    allPercentage: SkillmapScore[];
}

export default function Dashboard() {
    const router = useRouter();

    const [allPercentage, setAllPercentage, isReading] = useActionState((prev: SkillmapScore[], data: SkillmapScore[]) => {
        return [{ name: "asd", value: 10 }, { name: "asd", value: 80 }, { name: "asd", value: 10 }]
    }, [{ name: "asd", value: 10 }, { name: "asd", value: 80 }, { name: "asd", value: 10 }])

    const [name,setName,isSetNameComplete]=useActionState((prev:string,_name:string)=>{
        return "aaa"
    },"Undefined")

    const [grownPercent,setGrownPercent]=useState<number>(1)

    const handleSkillMapClick = () => {
        router.push('/skillmap');
    };

    return (
        <div className="pt-[50px] min-h-screen flex">
            <div className="flex-1 flex flex-col gap-4 p-2 mx-4">
                <div className="h-[40vh] my-[5px] rounded-2xl relative ">
                    <SkillMapOverview allPercentage={allPercentage} />
                    <button
                        className="absolute bottom-2 right-2 bg-[#0B3886] w-[140px] px-2 py-2 rounded-full hover:bg-blue-600 shadow-md shadow-gray-500 m-3"
                        onClick={handleSkillMapClick}>
                        <span className=" text-white text-[22px]">skillmap</span>
                    </button>
                </div>
                <div className="bg-gray-300 h-[40vh] my-[5px] relative rounded-2xl flex items-center justify-center">
                    <Growth />
                    <button
                        className="absolute bottom-2 right-2 bg-[#CB410F] w-[140px] px-2 py-2 rounded-full hover:bg-blue-600 shadow-md shadow-gray-500 m-3"
                        onClick={() => alert("按鈕被點擊！")}>
                        <span className=" text-white text-[22px]">Growth</span>
                    </button>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-4 p-2 mx-4">
                <div className="h-[40vh] my-[5px] relative ">
                    <div>
                    <span className=" text-gray-500 text-[40px] ">
                        Hi {name}!!
                    </span><br/>
                    <span className=" text-[25px]">
                        Your map has grown {grownPercent}% this week
                    </span>
                    </div>
                    <div className=" bg-gray-300 h-[30vh] rounded-2xl">
                    <WeeklyAdvantage />
                    </div>
                </div>
                <div className="bg-gray-300 h-[40vh] my-[5px] relative rounded-2xl flex items-center justify-center ">
                    <div className="">
                    <Match />
                    </div>
                    <button
                        className="absolute bottom-2 right-2 bg-[#FFBB47] w-[140px] px-2 py-2 rounded-full hover:bg-blue-600 shadow-md shadow-gray-500 m-3"
                        onClick={() => alert("按鈕被點擊！")}>
                        <span className=" text-white text-[22px]">Match</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

function SkillMapOverview({ allPercentage }: { allPercentage: SkillmapScore[] }) {
  return (
    <div className="bg-gray-300 h-[40vh]">
      asd
    </div>
  )
}

function WeeklyAdvantage() {
    return (
        <div className="">
            
        </div>
    )
}

function Growth() {
    return (
        <div className=" text-gray-500 text-3xl">
             Ooopps!This feature isn`t open yet.
        </div>
    )
}

function Match() {
    return (
        <div className=" text-gray-500 text-3xl">
            Ooopps!This feature isn`t open yet.
        </div>
    )
}