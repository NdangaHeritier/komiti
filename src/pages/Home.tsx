import { ButtonLink } from "../components/global/UI/LinkBtn";

export default function Home (){
    return (
        <section className="p-15 py-20 bg-gray-100">
            <div className="grid grid-cols-2 mx-auto my-auto gap-5">
                <h3 className="text-8xl font-extrabold text-green-600">
                    Track Your project Contribution smoothly.
                </h3>
                <div className="flex-col inline-flex gap-5 text-center self-center p-8 items-center">
                    <p className="text-2xl font-normal leading-tight text-gray-600">
                        <b>Komiti</b> makes it easier for you to manage your project contributors and let you decide who to keep and who to dumb
                    </p>
                    <p className="italic text-xl text-green-600">Start working samartly from now, be productive for July</p>
                    <div className="py-5 grid grid-cols-2 gap-5 w-1/2">
                        <ButtonLink text="Get started" href="/login" />
                        <ButtonLink text="Contribute" variant="secondary" href="/login" />
                    </div>
                </div>
            </div>
        </section>
    )
}