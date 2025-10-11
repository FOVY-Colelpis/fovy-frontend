
'use client'
import { SetStateAction, useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { skillmapAPI } from '@/lib/api'
import SkillTree from "./Component/SkillTree";
import { motion, AnimatePresence } from "framer-motion";
import UploadArea from "./Component/UploadUI";


interface SkillmapScore {
    name: string,
    value: number,
}
interface SkillMapData {
    allPercentage: SkillmapScore[];
}

export default function Dashboard() {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();

    const [allPercentage, setAllPercentage, isReading] = useActionState((prev: SkillmapScore[], data: SkillmapScore[]) => {
        return [{ name: "asd", value: 10 }, { name: "asd", value: 80 }, { name: "asd", value: 10 }]
    }, [{ name: "asd", value: 10 }, { name: "asd", value: 80 }, { name: "asd", value: 10 }])

    const [name, setName, isSetNameComplete] = useActionState((prev: string, _name: string) => {
        return "aaa"
    }, "Undefined")

    const handleSkillMapClick = () => {
        setShowSkillTree(true);
    };
    const [isShowSkillTree, setShowSkillTree] = useState<boolean>(false)
    const [grownPercent, setGrownPercent] = useState<number>(1)

    // Auth guard: 若未登入，導回首頁
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

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
                {/* SkillTree Overlay */}
                {isShowSkillTree && (
                    <PopSkillTreeWindow setShowSkillTree={setShowSkillTree} />
                )}
            </div>
            <div className="flex-1 flex flex-col gap-4 p-2 mx-4">
                <div className="h-[40vh] my-[5px] relative ">
                    <div>
                        <span className=" text-gray-500 text-[40px] ">
                            Hi {name}!!
                        </span><br />
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
                    const color = `${Math.floor(Math.random() * 255) + 1},${Math.floor(Math.random() * 255) + 1},${Math.floor(Math.random() * 255) + 1}`
                    return (
                        <g key={index}>
                            <defs>
                                <radialGradient id={`grad-${index}`} cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor={`rgba(${color},0.6)`} />
                                    <stop offset="100%" stopColor={`rgba(${color},0.1)`} />
                                </radialGradient>
                            </defs>
                            <circle cx={c.x} cy={c.y} r={c.radius} fill={`url(#grad-${index})`} strokeWidth={2} />
                            <text x={c.x} y={c.y} fontSize={14} fill="#000" textAnchor="middle" dominantBaseline="middle">
                                <tspan x={c.x} dy="-0.6em">{c.value}%</tspan>
                                <tspan x={c.x} dy="1.2em">{c.name}</tspan>
                            </text>
                        </g>
                    )
                })}
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

function PopSkillTreeWindow({ setShowSkillTree }: { setShowSkillTree: React.Dispatch<SetStateAction<boolean>> }) {
    const { user } = useAuth();
    const [showUpload, setShowUpload] = useState<boolean>(false)

    const [data] = useState({
        nodes: [
            { id: "1", name: "軟體工程基礎", level: 1, score: 5 },
            { id: "1.1", name: "程式語言基礎", level: 2, score: 4 },
            { id: "1.1.1", name: "Python", level: 3, score: 5 },
            { id: "1.1.2", name: "JavaScript", level: 3, score: 5 },
            { id: "1.1.3", name: "Tailwind", level: 3, score: 3 },
            { id: "2", name: "後端開發", level: 1, score: 4 },
            { id: "2.3", name: "網路與通訊", level: 2, score: 4 },
            { id: "2.3.1", name: "WebSocket", level: 3, score: 4 },
        ],
        links: [
            { source: "1", target: "1.1" },
            { source: "1.1", target: "1.1.1" },
            { source: "1.1", target: "1.1.2" },
            { source: "1.1", target: "1.1.3" },
            { source: "2", target: "2.3" },
            { source: "2.3", target: "2.3.1" },
        ],
    });

    return (
        <div className="fixed inset-x-0 top-[50px] bottom-0 z-50 bg-black/50">
            <motion.div
                className="absolute inset-0 bg-gray-900 shadow-2xl rounded-none overflow-hidden flex flex-col"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformOrigin: "left center" }}
            >

                <div className="absolute top-3 right-3 p-2 rounded-full hover:scale-125 ease-in-out duration-200 transition z-50">
                    <button onClick={() => setShowSkillTree(false)}>X</button>
                </div>

                <div className="flex-1 flex h-full">
                    <div className="flex-1 bg-gray-500 overflow-hidden">
                        <SkillTree data={data} />
                    </div>

                    <div className="w-2/12 bg-gray-200 p-4 flex items-center justify-center">
                        控制面板內容
                    </div>
                </div>

                <div className="w-full bg-gray-800 text-white p-4 flex justify-around items-center">
                    <div className="w-[50%] flex flex-1 justify-center">
                        <div className="bg-gray-600 rounded-full p-5 mx-5">
                            <button className="hover:scale-125 duration-150 ease-in-out" onClick={async () => {
                                const uname = user?.username;
                                if (!uname) { alert('No username'); return; }
                                const ok = window.confirm('確定要刪除目前技能樹嗎？');
                                if (!ok) return;
                                try {
                                    const res = await skillmapAPI.deleteByUsername(uname);
                                    alert(res?.message || 'Deleted');
                                } catch (e: any) {
                                    alert(e?.message || 'Delete failed');
                                }
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                        <div className="bg-gray-600 rounded-full p-5">
                            {showUpload && <UploadArea show={showUpload} setShow={setShowUpload}></UploadArea>}
                            <button className="mx-5 hover:scale-125 duration-150 ease-in-out" onClick={() => setShowUpload((prev) => !prev)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                            <button className="mx-5 hover:scale-125 duration-150 ease-in-out">
                                <img src="/images/fovy_logo.png" alt="icon" className="w-10 h-10" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* Home button at bottom-right */}
            <button
                onClick={() => setShowSkillTree(false)}
                className="fixed bottom-4 right-4 bg-gray-600 rounded-full p-5 hover:bg-gray-500 transition-colors flex items-center justify-center"
                title="返回 Dashboard"
            >
                <svg className="size-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </button>
        </div>
    );
}
