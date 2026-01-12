// page.tsx
'use client'
import { SetStateAction, useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { skillmapAPI, growthTreeAPI } from '@/lib/api'
import SkillTree from "./Component/SkillTree";
import GrowthTree from "./Component/GrowthTree";
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
    const [isShowGrowth, setShowGrowth] = useState<boolean>(false)
    const [grownPercent, setGrownPercent] = useState<number>(1)


    // Auth guard: 若未登入，導回首頁 (已暫時關閉)
    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         router.push('/');
    //     }
    // }, [isLoggedIn, router]);


    return (
        <div className="pt-[50px] min-h-screen flex">
            <div className="flex-1 flex flex-col gap-4 p-2 mx-4"> {/*Left*/}
                <div className="h-[40vh] my-[5px] rounded-2xl relative ">  {/*右上*/}
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
                        onClick={() => setShowGrowth((prev) => !prev)}>
                        <span className=" text-white text-[22px]">Growth</span>
                    </button>
                </div>
                {/* SkillTree Overlay */}
                {isShowSkillTree && (
                    <PopSkillTreeWindow setShowSkillTree={setShowSkillTree} />
                )}
                {isShowGrowth && (
                    <PopGrowthWindow setShowGrowth={setShowGrowth} />
                )}

            </div>
            <div className="flex-1 flex flex-col gap-4 p-2 mx-4"> {/*Right*/}
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
    // 1. 建立 State 來儲存算好的圓圈資料 (包含位置與顏色)
    const [circles, setCircles] = useState<any[]>([]);

    const svgWidth = 500;
    const svgHeight = 300;

    // 2. 將隨機運算邏輯移入 useEffect
    useEffect(() => {
        const total = allPercentage.reduce((sum, item) => sum + item.value, 0);
        const maxRadius = 80;
        const newCircles: any[] = [];

        // 先計算半徑
        const dataWithRadius = allPercentage.map(item => ({
            ...item,
            radius: (item.value / total) * maxRadius + 20
        }));

        // 執行碰撞偵測與位置計算
        dataWithRadius.forEach(item => {
            let x: number, y: number;
            let attempts = 0;
            do {
                x = Math.random() * (svgWidth - 2 * item.radius) + item.radius;
                y = Math.random() * (svgHeight - 2 * item.radius) + item.radius;
                attempts++;
            } while (
                newCircles.some(
                    c =>
                        Math.hypot(c.x - x, c.y - y) < c.radius + item.radius + 5
                ) &&
                attempts < 100
            );

            // ✨ 關鍵修改：在這裡產生顏色，並存入資料中 ✨
            const r = Math.floor(Math.random() * 255) + 1;
            const g = Math.floor(Math.random() * 255) + 1;
            const b = Math.floor(Math.random() * 255) + 1;
            const colorString = `${r},${g},${b}`;

            newCircles.push({ ...item, x, y, color: colorString });
        });

        // 更新 State，觸發畫面重繪
        setCircles(newCircles);
    }, [allPercentage]); // 當 allPercentage 改變時重新計算

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                {circles.map((c, index) => {
                    return (
                        <g key={index}>
                            <defs>
                                <radialGradient id={`grad-${index}`} cx="50%" cy="50%" r="50%">
                                    {/* 直接使用 State 中存好的顏色 */}
                                    <stop offset="0%" stopColor={`rgba(${c.color},0.6)`} />
                                    <stop offset="100%" stopColor={`rgba(${c.color},0.1)`} />
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

// 添加中心節點 "me" 的輔助函數
function addCenterNode(treeData: any) {
    if (!treeData || !treeData.nodes || !treeData.links) {
        return treeData;
    }

    // 檢查是否已經有中心節點
    const hasCenterNode = treeData.nodes.some((node: any) => node.id === "me");
    if (hasCenterNode) {
        return treeData; // 已經有中心節點，直接返回
    }

    // 找出所有根節點（level 1 的節點）
    const rootNodes = treeData.nodes.filter((node: any) => node.level === 1);

    // 創建新的節點數組，包含中心節點
    const newNodes = [
        { id: "me", name: "Me", level: 0, score: 5 },
        ...treeData.nodes
    ];

    // 創建新的連接數組，將所有根節點連接到中心節點
    const centerLinks = rootNodes.map((node: any) => ({
        source: "me",
        target: node.id
    }));

    const newLinks = [...centerLinks, ...treeData.links];

    return {
        nodes: newNodes,
        links: newLinks
    };
}

function PopGrowthWindow({ setShowGrowth }: { setShowGrowth: React.Dispatch<SetStateAction<boolean>> }) {
    const { user } = useAuth();
    const [showUpload, setShowUpload] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lastUploadTime, setLastUploadTime] = useState<number>(0)
    const [isPolling, setIsPolling] = useState<boolean>(false)
    const [selectedNode, setSelectedNode] = useState<any>(null);

    // 默認假資料
    const defaultData = {
        nodes: [
            { id: "me", name: "Me", level: 0, score: 5 }, // 中心節點
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
            { source: "me", target: "1" }, // 中心節點連接到根節點
            { source: "me", target: "2" }, // 中心節點連接到根節點
            { source: "1", target: "1.1" },
            { source: "1.1", target: "1.1.1" },
            { source: "1.1", target: "1.1.2" },
            { source: "1.1", target: "1.1.3" },
            { source: "2", target: "2.3" },
            { source: "2.3", target: "2.3.1" },
        ],
    };

    const [data, setTreeData] = useState(defaultData);
    const [growthData,setGrowthData]=useState(defaultData)
    const [hasRealData, setHasRealData] = useState<boolean>(false);

    // 從資料庫獲取成長樹資料
    const fetchSkillTree = async () => {
        if (!user?.username) return false; // 返回是否成功獲取資料

        setIsLoading(true);
        try {
            const response = await growthTreeAPI.getSkillTree(user.username);
            if (response?.success && response.skill_tree_json) {
                // 檢查是否為 "Failed" 字串
                if (response.skill_tree_json === "Failed") {
                    alert('Failed to generate skill tree, please try again.');
                    setTreeData(defaultData);
                    setGrowthData(defaultData)
                    setHasRealData(false);
                    return false;
                }

                const treeData = JSON.parse(response.skill_tree_json);
                
                // 添加中心節點 "me" 並連接所有根節點
                const processedData = addCenterNode(treeData);
                
                setTreeData(processedData);
                setGrowthData(processedData)
                setHasRealData(true); // 標記為真實資料
                console.log('技能樹資料已更新:', processedData);
                return true; // 成功獲取資料
            } else {
                // 沒有資料，使用默認資料
                setTreeData(defaultData);
                setHasRealData(false);
            }
        } catch (error) {
            console.error('獲取技能樹失敗:', error);
            // 錯誤時也使用默認資料
            setTreeData(defaultData);
            setHasRealData(false);
        } finally {
            setIsLoading(false);
        }
        return false; // 沒有獲取到資料
    };

    // 組件載入時檢查資料庫
    useEffect(() => {
        if (user?.username) {
            fetchSkillTree();
        }
    }, [user?.username]);

    // 自動輪詢檢查技能樹更新
    useEffect(() => {
        if (lastUploadTime === 0 || hasRealData) return; // 沒有上傳過或已有真實資料就不輪詢

        let intervalId: NodeJS.Timeout;
        let timeoutId: NodeJS.Timeout;

        const startPolling = async () => {
            setIsPolling(true);

            intervalId = setInterval(async () => {
                const success = await fetchSkillTree();
                if (success) {
                    // 成功獲取資料，停止輪詢
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                    setIsPolling(false);
                    console.log('技能樹資料已獲取，停止輪詢');
                }
            }, 5000); // 每5秒檢查一次

            // 30秒後強制停止輪詢
            timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                setIsPolling(false);
                console.log('輪詢超時，停止檢查');
                alert('Polling timeout, please try again.');
            }, 30000);
        };

        startPolling();

        return () => {
            if (intervalId) clearInterval(intervalId);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [lastUploadTime]);
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
                <div className="absolute top-3 right-3 p-2 rounded-full hover:scale-125 ease-in-out duration-200 transition z-50">{/* Close button */}
                    <button onClick={() => setShowGrowth(false)}>XXXX</button>
                </div>

                <div className="flex-1 flex h-full">{/* Main content area */}
                    <div className="flex-1 bg-gray-500 overflow-hidden relative">{/* Skill tree area */}
                        <GrowthTree 
                            data={data} 
                            onNodeSelect={(node) => setSelectedNode(node)} 
                        />
                        {isPolling && (
                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </div>
                        )}
                        {!hasRealData && !isPolling && (
                            <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
                                Displaying sample data
                            </div>
                        )}
                        {hasRealData && (
                            <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                                Personal skill tree
                            </div>
                        )}
                        <AnimatePresence>
                            {selectedNode && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="absolute top-20 right-5 w-80 bg-white rounded-xl shadow-2xl p-6 z-10 border border-gray-200"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {selectedNode.name}
                                        </h2>
                                        <button 
                                            onClick={() => setSelectedNode(null)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                                                Level {selectedNode.level}
                                            </span>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                                                Score: {selectedNode.score}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {/* 這裡之後可以放針對這個 Node 的詳細說明 */}
                                            這是一個關於 <strong>{selectedNode.name}</strong> 的詳細說明區域。
                                            您可以在這裡顯示學習進度、相關課程或是該技能的詳細描述。
                                        </p>

                                        <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="w-2/12 bg-gray-200 p-4 flex items-center justify-center">{/* Control panel area */}
                        Control panel content
                    </div>
                </div>

                <div className="w-full bg-gray-800 text-white p-4 flex justify-around items-center">
                    <div className="w-[50%] flex flex-1 justify-center">
                        <div className="bg-gray-600 rounded-full p-5 mx-5">
                            <button className="hover:scale-125 duration-150 ease-in-out" onClick={async () => {
                                const uname = user?.username;
                                if (!uname) { alert('No username'); return; }
                                const ok = window.confirm('Are you sure you want to delete the current growth tree?');
                                if (!ok) return;
                                try {
                                    const res = await growthTreeAPI.deleteByUsername(uname);
                                    // 刪除成功後恢復默認資料
                                    setTreeData(defaultData);
                                    setHasRealData(false);
                                    alert(res?.message || 'Deleted successfully');
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
                            {showUpload && <UploadArea 
                                show={showUpload} 
                                setShow={setShowUpload} 
                                uploadAPI={growthTreeAPI.uploadPdf}
                                onUploadSuccess={() => {
                                    setLastUploadTime(Date.now());
                                    setHasRealData(false); // 重置為沒有真實資料，開始輪詢
                                }}></UploadArea>}
                            <button className="mx-5 hover:scale-125 duration-150 ease-in-out" onClick={() => setShowUpload((prev) => !prev)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                            <button
                                className="mx-5 hover:scale-125 duration-150 ease-in-out"
                                onClick={fetchSkillTree}
                                disabled={isLoading}
                                title="Refresh growth tree"
                            >
                                {isLoading ? (
                                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* Home button at bottom-right */}
            <button
                onClick={() => setShowGrowth(false)}
                className="fixed bottom-4 right-4 bg-gray-600 rounded-full p-5 hover:bg-gray-500 transition-colors flex items-center justify-center"
                title="Return Dashboard"
            >
                <svg className="size-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </button>
        </div>

    )
}


function PopSkillTreeWindow({ setShowSkillTree }: { setShowSkillTree: React.Dispatch<SetStateAction<boolean>> }) {
    const { user } = useAuth();
    const [showUpload, setShowUpload] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lastUploadTime, setLastUploadTime] = useState<number>(0)
    const [isPolling, setIsPolling] = useState<boolean>(false)

    // 默認假資料
    const defaultData = {
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
    };

    const [data, setTreeData] = useState(defaultData);
    const [hasRealData, setHasRealData] = useState<boolean>(false);

    // 從資料庫獲取技能樹資料
    const fetchSkillTree = async () => {
        if (!user?.username) return false; // 返回是否成功獲取資料

        setIsLoading(true);
        try {
            const response = await skillmapAPI.getSkillTree(user.username);
            if (response?.success && response.skill_tree_json) {
                // 檢查是否為 "Failed" 字串
                if (response.skill_tree_json === "Failed") {
                    alert('Failed to generate skill tree, please try again.');
                    setTreeData(defaultData);
                    setHasRealData(false);
                    return false;
                }

                const treeData = JSON.parse(response.skill_tree_json);
                setTreeData(treeData);
                setHasRealData(true); // 標記為真實資料
                console.log('技能樹資料已更新:', treeData);
                return true; // 成功獲取資料
            } else {
                // 沒有資料，使用默認資料
                setTreeData(defaultData);
                setHasRealData(false);
            }
        } catch (error) {
            console.error('獲取技能樹失敗:', error);
            // 錯誤時也使用默認資料
            setTreeData(defaultData);
            setHasRealData(false);
        } finally {
            setIsLoading(false);
        }
        return false; // 沒有獲取到資料
    };

    // 組件載入時檢查資料庫
    useEffect(() => {
        if (user?.username) {
            fetchSkillTree();
        }
    }, [user?.username]);

    // 自動輪詢檢查技能樹更新
    useEffect(() => {
        if (lastUploadTime === 0 || hasRealData) return; // 沒有上傳過或已有真實資料就不輪詢

        let intervalId: NodeJS.Timeout;
        let timeoutId: NodeJS.Timeout;

        const startPolling = async () => {
            setIsPolling(true);

            intervalId = setInterval(async () => {
                const success = await fetchSkillTree();
                if (success) {
                    // 成功獲取資料，停止輪詢
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                    setIsPolling(false);
                    console.log('技能樹資料已獲取，停止輪詢');
                }
            }, 5000); // 每5秒檢查一次

            // 30秒後強制停止輪詢
            timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                setIsPolling(false);
                console.log('輪詢超時，停止檢查');
                alert('Polling timeout, please try again.');
            }, 30000);
        };

        startPolling();

        return () => {
            if (intervalId) clearInterval(intervalId);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [lastUploadTime]);

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

                <div className="absolute top-3 right-3 p-2 rounded-full hover:scale-125 ease-in-out duration-200 transition z-50">{/* Close button */}
                    <button onClick={() => setShowSkillTree(false)}>X</button>
                </div>

                <div className="flex-1 flex h-full">{/* Main content area */}
                    <div className="flex-1 bg-gray-500 overflow-hidden relative">{/* Skill tree area */}
                        <SkillTree data={data} />
                        {isPolling && (
                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </div>
                        )}
                        {!hasRealData && !isPolling && (
                            <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
                                Displaying sample data
                            </div>
                        )}
                        {hasRealData && (
                            <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                                Personal skill tree
                            </div>
                        )}
                    </div>

                    <div className="w-2/12 bg-gray-200 p-4 flex items-center justify-center">{/* Control panel area */}
                        Control panel content
                    </div>
                </div>

                <div className="w-full bg-gray-800 text-white p-4 flex justify-around items-center">
                    <div className="w-[50%] flex flex-1 justify-center">
                        <div className="bg-gray-600 rounded-full p-5 mx-5">
                            <button className="hover:scale-125 duration-150 ease-in-out" onClick={async () => {
                                const uname = user?.username;
                                if (!uname) { alert('No username'); return; }
                                const ok = window.confirm('Are you sure you want to delete the current skill tree?');
                                if (!ok) return;
                                try {
                                    const res = await skillmapAPI.deleteByUsername(uname);
                                    // 刪除成功後恢復默認資料
                                    setTreeData(defaultData);
                                    setHasRealData(false);
                                    alert(res?.message || 'Deleted successfully');
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
                            {showUpload && <UploadArea show={showUpload} setShow={setShowUpload} onUploadSuccess={() => {
                                setLastUploadTime(Date.now());
                                setHasRealData(false); // 重置為沒有真實資料，開始輪詢
                            }}></UploadArea>}
                            <button className="mx-5 hover:scale-125 duration-150 ease-in-out" onClick={() => setShowUpload((prev) => !prev)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                            <button
                                className="mx-5 hover:scale-125 duration-150 ease-in-out"
                                onClick={fetchSkillTree}
                                disabled={isLoading}
                                title="Refresh skill tree"
                            >
                                {isLoading ? (
                                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* Home button at bottom-right */}
            <button
                onClick={() => setShowSkillTree(false)}
                className="fixed bottom-4 right-4 bg-gray-600 rounded-full p-5 hover:bg-gray-500 transition-colors flex items-center justify-center"
                title="Return Dashboard"
            >
                <svg className="size-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </button>
        </div>
    );
}
