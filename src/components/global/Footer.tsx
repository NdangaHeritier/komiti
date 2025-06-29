// A footer component for the app. it's shared all over the app and its inclusion is done in ../App.tsx
export default function Footer () {
    return (
        <footer className="bg-zinc-900 text-gray-200 font-semibold">
            <div className="company logos">
                <div className="app p-5">
                    KOMITI | your day-to-day contribution tracker.
                </div>
            </div>
        </footer>
    )
}