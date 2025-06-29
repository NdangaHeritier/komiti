import { Icon } from "../components/global/UI/Icon";

export default function Dashboard () {
    return (
        <section className="p-5 bg-gray-50">
            <div className="user-details p-10 rounded-xl">
                <h2 className="pb-10 text-gray-800 font-bold text-4xl">Welcome back, Ndanga</h2>
                <div className="grid grid-cols-4 grid-rows-1 gap-5 rounded-xl h-20">
                    <div className="rounded-lg bg-gray-200 w-full"></div>
                    <div className="rounded-lg bg-gray-100 w-full"></div>
                    <div className="rounded-lg bg-gray-100 w-full"></div>
                    <div className="rounded-lg bg-gray-100 w-full"></div>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div className="flex flex-col gap-10 p-10">
                    {/* create project card */}
                    <div className="h-96 w-full rounded-xl cursor-pointer hover:bg-gray-100 duration-300 border-2 border-dashed border-gray-200 bg-white flex items-center justify-center flex-col gap-5">
                        <Icon name="Plus" size={60} className="text-gray-400" strokeWidth={2} />
                        <div className="font-semibold text-gray-700">Add new project</div>
                    </div>
                    {/* recent activity log bar */}

                    <div className="rounded-xl bg-gray-100 flex-1 w-full shadow-sm">
                        <div className="border-b border-b-gray-300 h-1/3 p-5">
                            <div className="rounded-lg bg-gray-200 h-full w-20"></div>
                        </div>
                    </div>
                </div>
                {/* right side pannels wrapper */}
                <div className="flex items-center justify-start flex-col gap-10 p-10 min-h-screen">
                    <div className="rounded-xl bg-gray-100 h-40 w-full shadow-sm">
                        <div className="border-b border-b-gray-300 h-1/3 p-5">
                            <div className="rounded-lg bg-gray-200 h-full w-20"></div>
                        </div>
                    </div>
                    <div className="flex-1 w-full rounded-xl bg-white border border-gray-200">
                        <div className="border-b border-b-gray-200 h-1/6 p-5">
                            <div className="rounded-lg bg-gray-200 h-full w-20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}