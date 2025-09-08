'use client'
import { useActionState, useState } from "react"
interface SkillmapScore {
    name: string,
    value: number,
}
interface SkillMapData {
    allPercentage: SkillmapScore[];
}

export default function Dashboard() {

    const [allPercentage, setAllPercentage, isReading] = useActionState((prev: SkillmapScore[], data: SkillmapScore[]) => {
        return [{ name: "asd", value: 10 }, { name: "asd", value: 80 }, { name: "asd", value: 10 }]
    }, [{ name: "asd", value: 10 }, { name: "asd", value: 80 }, { name: "asd", value: 10 }])

    const [name,setName,isSetNameComplete]=useActionState((prev:string,_name:string)=>{
        return "aaa"
    },"Undefined")

    const [grownPercent,setGrownPercent]=useState<number>(1)

    return (
        <div className="pt-[50px] min-h-screen flex">
            <div className="flex-1 flex flex-col gap-4 p-2 mx-4">
                <div className="h-[40vh] my-[5px] rounded-2xl relative ">
                    <SkillMapOverview allPercentage={allPercentage} />
                    <button
                        className="absolute bottom-2 right-2 bg-[#0B3886] w-[140px] px-2 py-2 rounded-full hover:bg-blue-600 shadow-md shadow-gray-500 m-3"
                        onClick={() => alert("按鈕被點擊！")}>
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

function SkillMapOverview({ allPercentage }: SkillMapData) {
    const total = allPercentage.reduce((sum, item) => sum + item.value, 0);
    const maxRadius = 80;
    const svgWidth = 500;
    const svgHeight = 300;

    const circles: { name: string; value: number; radius: number; x: number; y: number }[] = [];

    allPercentage.map(item => ({ ...item, radius: (item.value / total) * maxRadius + 20 }))
        .forEach(item => {
            let x: number, y: number;
            let attempts = 0;
            do {
                x = Math.random() * (svgWidth - 2 * item.radius) + item.radius;
                y = Math.random() * (svgHeight - 2 * item.radius) + item.radius;
                attempts++;
            } while (
                circles.some(
                    c =>
                        Math.hypot(c.x - x, c.y - y) < c.radius + item.radius + 5
                ) &&
                attempts < 100
            );
            circles.push({ ...item, x, y });
        });

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                {circles.map((c, index) => {
                const color=`${Math.floor(Math.random() * 255)+1},${Math.floor(Math.random() * 255)+1},${Math.floor(Math.random() * 255)+1}`
                return (
                    <g key={index}>
                        <defs>
                            <radialGradient id={`grad-${index}`} cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor={`rgba(${color},0.6)`} />
                                <stop offset="100%" stopColor={`rgba(${color},0.1)`} />
                            </radialGradient>
                        </defs>
                        <circle cx={c.x} cy={c.y} r={c.radius} fill={`url(#grad-${index})`} strokeWidth={2}/>
                        <text x={c.x} y={c.y} fontSize={14} fill="#000" textAnchor="middle" dominantBaseline="middle">
                            <tspan x={c.x} dy="-0.6em">{c.value}%</tspan>
                            <tspan x={c.x} dy="1.2em">{c.name}</tspan>
                        </text>
                    </g>
                )})}
            </svg>
        </div>
    );
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